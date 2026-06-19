const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      maxLength: 24,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    // Points & stats
    totalPoints: {
      type: Number,
      default: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
    },
    gamesWon: {
      type: Number,
      default: 0,
    },
    correctGuesses: {
      type: Number,
      default: 0,
    },
    // Friends system
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Badges unlocked
    badges: [
      {
        type: String,
        enum: ["first_win", "streak_3", "points_500", "points_1000", "social_butterfly"],
      },
    ],
    // Streak tracking
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Helper: add points and check for badge unlocks
userSchema.methods.addPoints = async function (points) {
  this.totalPoints += points;
  this.lastActive = Date.now();

  // Badge checks
  if (this.totalPoints >= 500 && !this.badges.includes("points_500")) {
    this.badges.push("points_500");
  }
  if (this.totalPoints >= 1000 && !this.badges.includes("points_1000")) {
    this.badges.push("points_1000");
  }

  await this.save();
  return this;
};

// Helper: get public profile (no sensitive data)
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    avatar: this.avatar,
    totalPoints: this.totalPoints,
    gamesPlayed: this.gamesPlayed,
    gamesWon: this.gamesWon,
    badges: this.badges,
    friends: this.friends,
    friendRequests: this.friendRequests,
  };
};

module.exports = mongoose.model("User", userSchema);
