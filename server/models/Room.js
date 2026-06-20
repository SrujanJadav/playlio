const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    players: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String,
        avatar: String,
        points: { type: Number, default: 0 },
        isReady: { type: Boolean, default: false },
        socketId: String,
      },
    ],
    category: {
      type: String,
      enum: ["kids", "couples", "music", "general"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
    maxPlayers: {
      type: Number,
      default: 8,
      max: 12,
    },
    currentRound: {
      type: Number,
      default: 0,
    },
    totalRounds: {
      type: Number,
      default: 5,
    },
    currentWord: {
      type: String,
      default: "",
    },
    currentDrawer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    roundEndTime: {
      type: Date,
      default: null,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    autoStartWhenFull: {
      type: Boolean,
      default: false,
    },
    roundDuration: {
      type: Number,
      default: 80,
    },
    wordDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard", "mixed"],
      default: "mixed",
    },
    enableHints: {
      type: Boolean,
      default: true,
    },
    quizAnswerTime: {
      type: Number,
      default: 20,
    },
    quizDifficulty: {
      type: String,
      enum: ["common", "mixed", "expert"],
      default: "mixed",
    },
    couplesIntensity: {
      type: String,
      enum: ["sweet", "mixed", "spicy"],
      default: "mixed",
    },
  },
  { timestamps: true }
);

// Generate a random 6-char room code
roomSchema.statics.generateCode = function () {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

module.exports = mongoose.model("Room", roomSchema);
