const express = require("express");
const Room = require("../models/Room");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// POST /api/room/create — create a new room
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { category, maxPlayers, isPrivate, totalRounds, autoStartWhenFull, autoDissolve, autoDissolveEmpty, roundDuration, wordDifficulty, enableHints, quizAnswerTime, quizDifficulty, couplesIntensity } = req.body;

    // Generate unique room code
    let code;
    let exists = true;
    while (exists) {
      code = Room.generateCode();
      exists = await Room.findOne({ code });
    }

    const room = await Room.create({
      code,
      host: req.user._id,
      category: category || "general",
      maxPlayers: maxPlayers || 8,
      isPrivate: isPrivate || false,
      autoStartWhenFull: autoStartWhenFull || false,
      autoDissolve: autoDissolve !== undefined ? autoDissolve : true,
      autoDissolveEmpty: autoDissolveEmpty !== undefined ? autoDissolveEmpty : true,
      roundDuration: roundDuration !== undefined ? roundDuration : 80,
      wordDifficulty: wordDifficulty || "mixed",
      enableHints: enableHints !== undefined ? enableHints : true,
      quizAnswerTime: quizAnswerTime !== undefined ? quizAnswerTime : 20,
      quizDifficulty: quizDifficulty || "mixed",
      couplesIntensity: couplesIntensity || "mixed",
      totalRounds: totalRounds || 5,
      players: [
        {
          userId: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
          points: 0,
          socketId: "",
        },
      ],
    });

    res.status(201).json({ room, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// GET /api/room/public — list open public rooms
router.get("/public", authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({
      status: "waiting",
      isPrivate: false,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("host", "username avatar");

    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

// GET /api/room/:code — get room by code
router.get("/:code", authMiddleware, async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code.toUpperCase() }).populate(
      "host",
      "username avatar"
    );

    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch room" });
  }
});

module.exports = router;
