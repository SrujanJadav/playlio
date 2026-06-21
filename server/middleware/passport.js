const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/api/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // Update avatar in case they changed their Google photo
          user.avatar = profile.photos[0]?.value || user.avatar;
          user.lastActive = Date.now();
          await user.save();
          return done(null, user);
        }

        // Check if email already exists (user signed up another way)
        const existingEmail = await User.findOne({
          email: profile.emails[0].value,
        });

        if (existingEmail) {
          // Link Google account to existing user
          existingEmail.googleId = profile.id;
          existingEmail.avatar = profile.photos[0]?.value || "";
          await existingEmail.save();
          return done(null, existingEmail);
        }

        // Create brand new user
        const newUser = await User.create({
          googleId: profile.id,
          username: profile.displayName || profile.emails[0].value.split("@")[0],
          email: profile.emails[0].value,
          avatar: profile.photos[0]?.value || "",
        });

        return done(null, newUser);
      } catch (err) {
        console.error("Passport Google error:", err);
        return done(err, null);
      }
    }
  )
);

// Store user ID in session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Retrieve full user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
