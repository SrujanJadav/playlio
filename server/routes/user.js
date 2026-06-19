const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/user/leaderboard — top 20 by points (global)
router.get("/leaderboard", authMiddleware, async (req, res) => {
  try {
    const users = await User.find()
      .sort({ totalPoints: -1 })
      .limit(20)
      .select("username avatar totalPoints gamesPlayed gamesWon badges");

    res.json({ leaderboard: users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// GET /api/user/friends-leaderboard — leaderboard among your friends only
router.get("/friends-leaderboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "username avatar totalPoints gamesPlayed badges"
    );

    // Include yourself in the ranking
    const allPlayers = [
      {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        totalPoints: user.totalPoints,
        gamesPlayed: user.gamesPlayed,
        badges: user.badges,
        isMe: true,
      },
      ...user.friends.map((f) => ({ ...f.toObject(), isMe: false })),
    ];

    allPlayers.sort((a, b) => b.totalPoints - a.totalPoints);

    res.json({ leaderboard: allPlayers });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch friends leaderboard" });
  }
});

// GET /api/user/profile/:id — public profile
router.get("/profile/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username avatar totalPoints gamesPlayed gamesWon badges createdAt")
      .populate("friends", "username avatar totalPoints");

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// POST /api/user/friend-request/:id — send a friend request
router.post("/friend-request/:id", authMiddleware, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const alreadyFriends = targetUser.friends.includes(req.user._id);
    if (alreadyFriends) return res.status(400).json({ error: "Already friends" });

    const alreadyRequested = targetUser.friendRequests.some(
      (r) => r.from.toString() === req.user._id.toString()
    );
    if (alreadyRequested) return res.status(400).json({ error: "Request already sent" });

    targetUser.friendRequests.push({ from: req.user._id });
    await targetUser.save();

    res.json({ message: "Friend request sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send friend request" });
  }
});

// POST /api/user/friend-request/:id/accept — accept a friend request
router.post("/friend-request/:id/accept", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const requestIndex = currentUser.friendRequests.findIndex(
      (r) => r.from.toString() === req.params.id
    );

    if (requestIndex === -1) return res.status(404).json({ error: "No such request" });

    // Add each other as friends
    currentUser.friends.push(req.params.id);
    currentUser.friendRequests[requestIndex].status = "accepted";
    await currentUser.save();

    const otherUser = await User.findById(req.params.id);
    otherUser.friends.push(req.user._id);
    await otherUser.save();

    // Check social butterfly badge
    if (currentUser.friends.length >= 5 && !currentUser.badges.includes("social_butterfly")) {
      currentUser.badges.push("social_butterfly");
      await currentUser.save();
    }

    res.json({ message: "Friend added!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept request" });
  }
});

// GET /api/user/search?q=username — search for players
router.get("/search", authMiddleware, async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json({ users: [] });

    const users = await User.find({
      username: { $regex: q, $options: "i" },
      _id: { $ne: req.user._id },
    })
      .limit(10)
      .select("username avatar totalPoints badges");

    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Search failed" });
  }
});

module.exports = router;
