const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Helper: generate a signed JWT for a user
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Helper: set JWT as http-only cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

const User = require("../models/User");

// ─── DEV LOGIN BYPASS ──────────────────────────────────────────
router.get("/dev-login", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).send("Forbidden in production");
  }
  try {
    let user = await User.findOne({ email: "dev@playlio.local" });
    if (!user) {
      user = await User.create({
        username: "Developer",
        email: "dev@playlio.local",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Developer",
        totalPoints: 1250,
        gamesPlayed: 14,
        badges: ["first_win", "streak_3", "points_500", "points_1000"],
      });
    }
    const token = generateToken(user._id);
    setTokenCookie(res, token);
    
    // Dynamically redirect based on where the request came from
    let redirectUrl = process.env.CLIENT_URL || "http://localhost:5173";
    if (req.headers.referer) {
      try {
        redirectUrl = new URL(req.headers.referer).origin;
      } catch {}
    }
    res.redirect(`${redirectUrl}/lobby`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── GOOGLE OAUTH ────────────────────────────────────────────────

// Step 1: Redirect user to Google login page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Step 2: Google redirects back here after login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
    session: true,
  }),
  (req, res) => {
    // Google auth succeeded — generate JWT and set cookie
    const token = generateToken(req.user._id);
    setTokenCookie(res, token);

    // Redirect to the lobby (frontend will read the cookie)
    res.redirect(`${process.env.CLIENT_URL}/lobby`);
  }
);

// ─── CURRENT USER ────────────────────────────────────────────────

// GET /api/auth/me — returns logged-in user info
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
});

// ─── LOGOUT ──────────────────────────────────────────────────────

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  req.logout?.(() => {});
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
