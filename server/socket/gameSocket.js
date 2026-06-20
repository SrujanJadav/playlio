const Room = require("../models/Room");
const User = require("../models/User");

// Image + answer pairs for Kids mode (visual recognition quiz)
const KIDS_QUIZ_BANK = {
  common: [
    { image: "/kids-quiz/Cat-head.jpg", answer: "cat" },
    { image: "/kids-quiz/Dog-head.jpg", answer: "dog" },
    { image: "/kids-quiz/horse-head.jpg", answer: "horse" },
    { image: "/kids-quiz/cow-head.jpg", answer: "cow" },
    { image: "/kids-quiz/Chicken-head.jpg", answer: "chicken" },
    { image: "/kids-quiz/donkey-head.jpg", answer: "donkey" },
    { image: "/kids-quiz/giraffe-head.jpg", answer: "giraffe" },
  ],
  mixed: [
    { image: "/kids-quiz/Cat-head.jpg", answer: "cat" },
    { image: "/kids-quiz/Dog-head.jpg", answer: "dog" },
    { image: "/kids-quiz/horse-head.jpg", answer: "horse" },
    { image: "/kids-quiz/cow-head.jpg", answer: "cow" },
    { image: "/kids-quiz/Chicken-head.jpg", answer: "chicken" },
    { image: "/kids-quiz/donkey-head.jpg", answer: "donkey" },
    { image: "/kids-quiz/giraffe-head.jpg", answer: "giraffe" },
    { image: "/kids-quiz/Lamma-head.jpg", answer: "llama" },
    { image: "/kids-quiz/Ostrich-head.jpg", answer: "ostrich" },
    { image: "/kids-quiz/peacock-head.jpg", answer: "peacock" },
    { image: "/kids-quiz/racoon-head.jpg", answer: "raccoon" },
    { image: "/kids-quiz/snake-head.jpg", answer: "snake" },
    { image: "/kids-quiz/turtle-head.jpg", answer: "turtle" },
    { image: "/kids-quiz/Koala.jpg", answer: "koala" },
    { image: "/kids-quiz/kangaroo.jpg", answer: "kangaroo" },
    { image: "/kids-quiz/panda.jpg", answer: "panda" },
    { image: "/kids-quiz/penguin.jpg", answer: "penguin" },
    { image: "/kids-quiz/seal.jpg", answer: "seal" },
  ],
  expert: [
    { image: "/kids-quiz/crocodile-legs.jpg", answer: "crocodile" },
    { image: "/kids-quiz/zebra-legs.jpg", answer: "zebra" },
    { image: "/kids-quiz/giraffe-legs.jpg", answer: "giraffe" },
    { image: "/kids-quiz/Clownfish.jpg", answer: "clownfish" },
    { image: "/kids-quiz/axolotl.jpg", answer: "axolotl" },
    { image: "/kids-quiz/chameleon.jpg", answer: "chameleon" },
    { image: "/kids-quiz/cheetah.jpg", answer: "cheetah" },
    { image: "/kids-quiz/meerkat.jpg", answer: "meerkat" },
    { image: "/kids-quiz/okapi.jpg", answer: "okapi" },
    { image: "/kids-quiz/platypus.jpg", answer: "platypus" },
    { image: "/kids-quiz/porcupine.jpg", answer: "porcupine" },
    { image: "/kids-quiz/red-panda.jpg", answer: "red panda" },
  ]
};

// Lyric-snippet + multiple-choice pairs for Music Quiz mode
const MUSIC_BANK = [
  {
    clue: "\"I'm going back to ___, if it's a seven hour flight or a forty-five minute drive...\"",
    answer: "505",
    fakeOptions: ["From the Start", "Glimpse of Us", "Be More"],
    audio: "/music-quiz/audio/505.mp3",
    cover: "/music-quiz/covers/505.jpg",
  },
  {
    clue: "\"...meri jaan keh rahi, gaata hoon main yahaan, tu sun rahi...\"",
    answer: "Aaoge Tum Kabhi",
    fakeOptions: ["Keep On Loving You", "Sweater Weather", "Escapism"],
    audio: "/music-quiz/audio/aaoge-tum-kabhi.mp3",
    cover: "/music-quiz/covers/aaoge-tum-kabi.jpg",
  },
  {
    clue: "\"I could __ ____, I could __ ____, more than what you bargained for...\"",
    answer: "Be More",
    fakeOptions: ["505", "No Surprises", "From the Start"],
    audio: "/music-quiz/audio/be-more.mp3",
    cover: "/music-quiz/covers/be-more.jpg",
  },
  {
    clue: "\"I said, ooh, I'm _______ by the lights, no, I can't sleep until I feel your touch...\"",
    answer: "Blinding Lights",
    fakeOptions: ["Sweater Weather", "Escapism", "Glimpse of Us"],
    audio: "/music-quiz/audio/blinding-lights.mp3",
    cover: "/music-quiz/covers/blinding-lights.jpg",
  },
  {
    clue: "\"I don't wanna feel how my heart is rippin', in fact, I don't wanna feel, so I stick to sippin'...\"",
    answer: "Escapism",
    fakeOptions: ["Be More", "Aaoge Tum Kabhi", "Keep On Loving You"],
    audio: "/music-quiz/audio/escapism.mp3",
    cover: "/music-quiz/covers/escapism.jpg",
  },
  {
    clue: "\"But when you look at me, the only memory, is us holding hands, in the movie theater...\"",
    answer: "From the Start",
    fakeOptions: ["Glimpse of Us", "505", "No Surprises"],
    audio: "/music-quiz/audio/from-the-start.mp3",
    cover: "/music-quiz/covers/from-the-start.jpg",
  },
  {
    clue: "\"'Cause sometimes I look in her eyes, and that's where I find a _______ __ __...\"",
    answer: "Glimpse of Us",
    fakeOptions: ["From the Start", "Blinding Lights", "Be More"],
    audio: "/music-quiz/audio/glimpse-of-us.mp3",
    cover: "/music-quiz/covers/glimpse-of-us.jpg",
  },
  {
    clue: "\"I don't wanna sleep, I just wanna ____ __ ______ ___. And I meant every word I said...\"",
    answer: "Keep On Loving You",
    fakeOptions: ["Aaoge Tum Kabhi", "Sweater Weather", "505"],
    audio: "/music-quiz/audio/keep-on-loving-you.mp3",
    cover: "/music-quiz/covers/keep-on-loving-you.jpg",
  },
  {
    clue: "\"A heart that's full up like a landfill, a job that slowly kills you, bruises that won't heal...\"",
    answer: "No Surprises",
    fakeOptions: ["Escapism", "Be More", "Glimpse of Us"],
    audio: "/music-quiz/audio/no-surprises.mp3",
    cover: "/music-quiz/covers/no-suprises.jpg",
  },
  {
    clue: "\"'Cause it's too cold for you here and now, so let me hold both your hands in the holes of my _______...\"",
    answer: "Sweater Weather",
    fakeOptions: ["Blinding Lights", "Keep On Loving You", "Aaoge Tum Kabhi"],
    audio: "/music-quiz/audio/sweater-weather.mp3",
    cover: "/music-quiz/covers/sweater-weather.jpg",
  },
];

// Questions for Couples mode — "Guess My Answer" (multi-select with partial credit)
const COUPLES_BANK = [
  // 💛 Sweet / Emotional
  {
    genre: "sweet",
    question: "Which of these make you feel most loved? (pick all that apply)",
    options: ["Good morning texts", "Random hugs", "Cooking for you", "Listening when you vent"],
  },
  {
    genre: "sweet",
    question: "Which of these make you feel closest to me? (pick all that apply)",
    options: ["Late night talks", "Holding hands", "Doing nothing together", "Surprise gifts"],
  },
  {
    genre: "sweet",
    question: "Which of these would make your whole day better? (pick all that apply)",
    options: ["A handwritten note", "A long hug", "Your favorite snack waiting for you", "Just hearing 'I'm proud of you'"],
  },
  {
    genre: "sweet",
    question: "Which of these comfort you most when you're upset? (pick all that apply)",
    options: ["Being hugged in silence", "Talking it out", "Being distracted with something fun", "Being left alone for a bit"],
  },
  {
    genre: "sweet",
    question: "Which of these do you wish happened more often? (pick all that apply)",
    options: ["Date nights", "Compliments", "Physical affection", "Deep conversations"],
  },

  // 🌶️ Spicy / Romantic
  {
    genre: "spicy",
    question: "Which of these would you want right now? (pick all that apply)",
    options: ["A slow dance", "A surprise kiss", "Cuddling on the couch", "A late night drive together"],
  },
  {
    genre: "spicy",
    question: "Which of these do you find most attractive? (pick all that apply)",
    options: ["Confidence", "A good sense of humor", "Physical touch", "How they look at you"],
  },
  {
    genre: "spicy",
    question: "Which of these would be your ideal romantic evening? (pick all that apply)",
    options: ["Candlelit dinner at home", "A spontaneous adventure", "A cozy movie night", "Dressing up and going out"],
  },
  {
    genre: "spicy",
    question: "Which of these gives you butterflies? (pick all that apply)",
    options: ["Forehead kisses", "Being called a cute nickname", "A lingering hug", "Being told you're missed"],
  },
  {
    genre: "spicy",
    question: "Which of these would you want to try together someday? (pick all that apply)",
    options: ["A couples dance class", "A weekend getaway", "Cooking a fancy meal together", "A photoshoot together"],
  },

  // 💬 Harsh-but-real
  {
    genre: "harsh",
    question: "Which of these honestly annoy you sometimes? (pick all that apply)",
    options: ["How I handle stress", "My texting habits", "My time management", "How I argue"],
  },
  {
    genre: "harsh",
    question: "Which of these do you wish I did less? (pick all that apply)",
    options: ["Cancelling plans", "Being on my phone", "Overthinking things", "Avoiding tough conversations"],
  },
  {
    genre: "harsh",
    question: "Which of these have caused arguments between us before? (pick all that apply)",
    options: ["Miscommunication", "Not enough quality time", "Different love languages", "Stress from outside life"],
  },
  {
    genre: "harsh",
    question: "Which of these do you think I could improve on? (pick all that apply)",
    options: ["Listening without interrupting", "Showing appreciation more", "Being more patient", "Following through on plans"],
  },
  {
    genre: "harsh",
    question: "Which of these worry you sometimes about us? (pick all that apply)",
    options: ["Distance", "Busy schedules", "Not enough communication", "Taking each other for granted"],
  },

  // 😄 Fun / Random
  {
    genre: "fun",
    question: "If we got stranded on an island, which of these would you complain about? (pick all that apply)",
    options: ["No wifi", "No food", "Bugs", "Being bored"],
  },
  {
    genre: "fun",
    question: "Which of these would you want at our dream wedding? (pick all that apply)",
    options: ["A live band", "A destination location", "A huge cake", "A small intimate gathering"],
  },
  {
    genre: "fun",
    question: "Which of these pets would you actually want? (pick all that apply)",
    options: ["A dog", "A cat", "A bird", "Something exotic (reptile, etc.)"],
  },
  {
    genre: "fun",
    question: "Which of these would you pick for a lazy Sunday? (pick all that apply)",
    options: ["Sleeping in late", "Ordering food", "Watching a series together", "Going for a walk"],
  },
  {
    genre: "fun",
    question: "Which of these superpowers would you want? (pick all that apply)",
    options: ["Reading minds", "Teleportation", "Flying", "Time travel"],
  },
];

// Word banks for drawing-based categories (general)
const WORD_BANKS = {
  general: {
    easy: [
      "cat", "dog", "apple", "sun", "tree", "house", "car", "ball", "book", "fish", "hat", "cup", 
      "door", "star", "moon", "milk", "cake", "shoe", "boat", "duck", "frog", "bird", "rain", 
      "snow", "chair", "table", "key", "bell", "ring", "nose", "hand", "foot", "baby", "farm"
    ],
    medium: [
      "mountain", "ocean", "city", "forest", "desert", "volcano", "island", "bridge", "castle", 
      "lighthouse", "submarine", "spaceship", "robot", "scientist", "chef", "astronaut", "pirate", 
      "ninja", "superhero", "guitar", "bicycle", "octopus", "dinosaur", "sandwich", "spider", 
      "umbrella", "balloon", "butterfly", "computer", "keyboard", "microscope", "telescope"
    ],
    hard: [
      "whisper", "gravity", "labyrinth", "nostalgia", "aurora", "hologram", "evolution", "symphony",
      "electricity", "magnetism", "reflection", "silhouette", "illusion", "paradox", "constellation",
      "architecture", "chemistry", "archeology", "kaleidoscope", "metamorphosis", "dimension",
      "centaur", "phoenix", "gargoyle", "pyramid", "colosseum", "gladiator", "cryptid"
    ]
  }
};

// Active game state (in-memory, reset per room)
const activeGames = {};

const ROUND_DURATION = 80; // seconds per drawing round
const QUIZ_ROUND_DURATION = 25; // seconds per kids quiz image (current 20 + 5)
const MUSIC_ROUND_DURATION = 25; // seconds to pick an answer (current 15 + 10)
const MUSIC_REVEAL_DURATION = 10; // seconds for album art + audio reveal
const COUPLES_ANSWER_DURATION = 20; // seconds for the "answerer" to pick
const COUPLES_GUESS_DURATION = 20; // seconds for the "guesser" to pick
const COUPLES_REVEAL_DURATION = 6; // seconds to show the comparison


module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ─── JOIN ROOM ───────────────────────────────────────────────
    socket.on("join_room", async ({ roomCode, userId, username, avatar }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        if (room.status === "playing") {
          socket.emit("error", { message: "Game already in progress" });
          return;
        }

        if (room.players.length >= room.maxPlayers) {
          socket.emit("error", { message: "Room is full" });
          return;
        }

        // Join the socket room
        socket.join(roomCode);
        socket.data.roomCode = roomCode;
        socket.data.userId = userId;
        socket.data.username = username;

        // Check if player already in room (reconnect case)
        const existingIndex = room.players.findIndex(
          (p) => p.userId?.toString() === userId
        );

        if (existingIndex !== -1) {
          room.players[existingIndex].socketId = socket.id;
        } else {
          room.players.push({ userId, username, avatar, points: 0, socketId: socket.id });
        }

        await room.save();

        // Send current room state to the joining player
        socket.emit("room_joined", { room });

        // Tell everyone else someone new joined
        socket.to(roomCode).emit("player_joined", {
          player: { userId, username, avatar, points: 0 },
          players: room.players,
        });

        // Broadcast updated player list to ALL in room
        io.to(roomCode).emit("players_updated", { players: room.players });

        // Auto start when full check
        if (room.autoStartWhenFull && room.players.length >= room.maxPlayers) {
          setTimeout(async () => {
            // Re-fetch room to ensure players are still here
            const r = await Room.findOne({ code: roomCode });
            if (r && r.status === "waiting" && r.players.length >= r.maxPlayers) {
              await startGameHelper(io, roomCode);
            }
          }, 1500);
        }
      } catch (err) {
        console.error("join_room error:", err);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Helper: start game logic
    async function startGameHelper(io, roomCode) {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return { error: "Room not found" };

        if (room.category === "couples") {
          if (room.players.length !== 2) {
            return { error: "Couples mode needs exactly 2 players! 💕" };
          }
        } else if (room.players.length < 2) {
          return { error: "Need at least 2 players to start!" };
        }

        room.status = "playing";
        room.currentRound = 1;
        await room.save();

        // Initialize in-memory game state
        activeGames[roomCode] = {
          playerOrder: room.players.map((p) => p.userId?.toString()),
          currentDrawerIndex: 0,
          currentDrawerId: null,
          round: 1,
          totalRounds: room.totalRounds,
          roundDuration: room.roundDuration || 80,
          wordDifficulty: room.wordDifficulty || "mixed",
          enableHints: room.enableHints !== undefined ? room.enableHints : true,
          quizAnswerTime: room.quizAnswerTime || 20,
          quizDifficulty: room.quizDifficulty || "mixed",
          scores: {},
          guessedThisRound: new Set(),
          category: room.category,
          timer: null,
        };

        // Give everyone in room their initial 0 points
        room.players.forEach((p) => {
          activeGames[roomCode].scores[p.userId?.toString()] = 0;
        });

        io.to(roomCode).emit("game_started", {
          players: room.players,
          totalRounds: room.totalRounds,
          category: room.category,
        });

        // Start first round after a short delay
        if (room.category === "kids") {
          setTimeout(() => startQuizRound(io, roomCode), 2000);
        } else if (room.category === "music") {
          setTimeout(() => startMusicRound(io, roomCode), 2000);
        } else if (room.category === "couples") {
          setTimeout(() => startCouplesGame(io, roomCode), 2000);
        } else {
          setTimeout(() => startNewRound(io, roomCode), 2000);
        }
        return { success: true };
      } catch (err) {
        console.error("startGameHelper error:", err);
        return { error: "Internal server error" };
      }
    }

    // ─── START GAME ──────────────────────────────────────────────
    socket.on("start_game", async ({ roomCode }) => {
      const res = await startGameHelper(io, roomCode);
      if (res && res.error) {
        socket.emit("error", { message: res.error });
      }
    });

    // ─── DRAWING EVENTS ──────────────────────────────────────────
    socket.on("draw", ({ roomCode, drawData }) => {
      // Broadcast drawing to everyone EXCEPT the sender
      socket.to(roomCode).emit("draw_update", { drawData });
    });

    socket.on("clear_canvas", ({ roomCode }) => {
      socket.to(roomCode).emit("canvas_cleared");
    });

    // ─── CHAT / GUESSING ─────────────────────────────────────────
    socket.on("send_chat", async ({ roomCode, userId, username, message }) => {
      const game = activeGames[roomCode];

      if (!game) {
        // Not in a game, just a lobby chat
        io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
        return;
      }

      // ── KIDS QUIZ MODE: everyone can guess, no drawer ──
      if (game.category === "kids") {
        handleQuizGuess(io, roomCode, game, { userId, username, message });
        return;
      }

      const currentDrawerId = game.currentDrawerId;
      const isDrawer = userId === currentDrawerId;

      // Drawer can't guess
      if (isDrawer) return;

      // Check if it's a correct guess
      const guess = message.trim().toLowerCase();
      const correctWord = game.currentWord?.toLowerCase();

      if (
        correctWord &&
        guess === correctWord &&
        !game.guessedThisRound.has(userId)
      ) {
        game.guessedThisRound.add(userId);

        // Points: more points for guessing faster
        const timeLeft = game.roundEndTime
          ? Math.max(0, Math.floor((game.roundEndTime - Date.now()) / 1000))
          : 0;
        const pointsEarned = 100 + timeLeft * 2;

        game.scores[userId] = (game.scores[userId] || 0) + pointsEarned;

        // Drawer gets points too when someone guesses correctly
        game.scores[currentDrawerId] = (game.scores[currentDrawerId] || 0) + 30;

        io.to(roomCode).emit("correct_guess", {
          userId,
          username,
          pointsEarned,
          scores: game.scores,
        });

        // If everyone guessed, end round early
        const nonDrawers = game.playerOrder.filter((id) => id !== currentDrawerId);
        if (game.guessedThisRound.size >= nonDrawers.length) {
          clearTimeout(game.timer);
          if (game.hintTimer1) clearTimeout(game.hintTimer1);
          if (game.hintTimer2) clearTimeout(game.hintTimer2);
          setTimeout(() => endRound(io, roomCode), 1500);
        }

        return;
      }

      // Check for close guess (within 1 char edit distance)
      if (correctWord && levenshtein(guess, correctWord) <= 1) {
        socket.emit("chat_message", {
          username: "🎯 Hint",
          message: "So close! Almost got it!",
          type: "hint",
        });
      }

      // Broadcast as regular chat (don't reveal the word)
      io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
    });

    // ─── MUSIC QUIZ: multiple-choice answer click ─────────────────
    socket.on("music_answer", ({ roomCode, userId, username, selected }) => {
      const game = activeGames[roomCode];
      if (!game || game.category !== "music") return;

      handleMusicGuess(io, roomCode, game, { userId, username, selected });
    });

    // ─── COUPLES MODE: answerer or guesser submits selections ─────
    socket.on("couples_submit", ({ roomCode, userId, selections }) => {
      const game = activeGames[roomCode];
      if (!game || game.category !== "couples") return;

      handleCouplesSubmit(io, roomCode, game, { userId, selections });
    });

    // ─── DISCONNECT ──────────────────────────────────────────────
    socket.on("disconnect", async () => {
      const { roomCode, userId, username } = socket.data;
      if (!roomCode) return;

      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        room.players = room.players.filter(
          (p) => p.socketId !== socket.id
        );
        await room.save();

        io.to(roomCode).emit("player_left", { userId, username, players: room.players });
        io.to(roomCode).emit("players_updated", { players: room.players });

        console.log(`🔌 ${username} left room ${roomCode}`);
      } catch (err) {
        console.error("disconnect error:", err);
      }
    });
  });

  // ─── ROUND LOGIC ─────────────────────────────────────────────────

  async function startNewRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    // Clear any previous hint timers
    if (game.hintTimer1) clearTimeout(game.hintTimer1);
    if (game.hintTimer2) clearTimeout(game.hintTimer2);

    // Reset guesses for new round
    game.guessedThisRound = new Set();

    // Pick the drawer
    const drawerId = game.playerOrder[game.currentDrawerIndex];
    game.currentDrawerId = drawerId; // store explicitly for chat/guess checks
    game.currentDrawerIndex = (game.currentDrawerIndex + 1) % game.playerOrder.length;

    // Pick a random word from category based on difficulty settings
    let bank = [];
    if (game.category === "general") {
      const difficulty = game.wordDifficulty || "mixed";
      const gBank = WORD_BANKS.general;
      if (difficulty === "easy") {
        bank = gBank.easy;
      } else if (difficulty === "medium") {
        bank = gBank.medium;
      } else if (difficulty === "hard") {
        bank = gBank.hard;
      } else {
        bank = [...gBank.easy, ...gBank.medium, ...gBank.hard];
      }
    } else {
      bank = WORD_BANKS[game.category] || WORD_BANKS.general.easy;
    }

    const word = bank[Math.floor(Math.random() * bank.length)];
    game.currentWord = word;

    const duration = game.roundDuration || 80;
    game.roundEndTime = Date.now() + duration * 1000;

    // Update room in DB
    room.currentDrawer = drawerId;
    room.currentWord = word;
    room.currentRound = game.round;
    await room.save();

    // Send word ONLY to the drawer
    const drawerSocket = findSocketByUserId(io, drawerId, roomCode);
    if (drawerSocket) {
      drawerSocket.emit("your_turn_to_draw", {
        word,
        round: game.round,
        totalRounds: game.totalRounds,
        duration: duration,
      });
    }

    // Send masked word (blanks) to everyone else
    const maskedWord = word.replace(/[a-zA-Z]/g, "_");
    io.to(roomCode).emit("round_started", {
      drawerId,
      drawerName: room.players.find((p) => p.userId?.toString() === drawerId)?.username,
      round: game.round,
      totalRounds: game.totalRounds,
      wordLength: word.length,
      maskedWord,
      duration: duration,
    });

    // Set round timer
    game.timer = setTimeout(() => endRound(io, roomCode), duration * 1000);

    // Schedule Hint Reveals if enabled
    if (game.enableHints) {
      // Find all alphabetic letter indexes in the word
      const letterIndexes = [];
      for (let i = 0; i < word.length; i++) {
        if (/[a-zA-Z]/.test(word[i])) {
          letterIndexes.push(i);
        }
      }

      // Pick up to 2 distinct indices to reveal
      let revealIndex1 = -1;
      let revealIndex2 = -1;
      if (letterIndexes.length > 2) {
        const idx1 = Math.floor(Math.random() * letterIndexes.length);
        revealIndex1 = letterIndexes[idx1];
        letterIndexes.splice(idx1, 1);
        const idx2 = Math.floor(Math.random() * letterIndexes.length);
        revealIndex2 = letterIndexes[idx2];
      } else if (letterIndexes.length > 0) {
        revealIndex1 = letterIndexes[Math.floor(Math.random() * letterIndexes.length)];
      }

      // Schedule first reveal at 50% time elapsed
      if (revealIndex1 !== -1) {
        game.hintTimer1 = setTimeout(() => {
          const maskedArray = [...word].map((ch, idx) => {
            if (idx === revealIndex1) return ch;
            return /[a-zA-Z]/.test(ch) ? "_" : ch;
          });
          io.to(roomCode).emit("hint_reveal", { maskedWord: maskedArray.join("") });
        }, (duration * 0.5) * 1000);
      }

      // Schedule second reveal at 75% time elapsed
      if (revealIndex2 !== -1) {
        game.hintTimer2 = setTimeout(() => {
          const maskedArray = [...word].map((ch, idx) => {
            if (idx === revealIndex1 || idx === revealIndex2) return ch;
            return /[a-zA-Z]/.test(ch) ? "_" : ch;
          });
          io.to(roomCode).emit("hint_reveal", { maskedWord: maskedArray.join("") });
        }, (duration * 0.75) * 1000);
      }
    }
  }

  async function endRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    // Clear any active hint timers
    if (game.hintTimer1) clearTimeout(game.hintTimer1);
    if (game.hintTimer2) clearTimeout(game.hintTimer2);

    const word = game.currentWord;

    io.to(roomCode).emit("round_ended", {
      word,
      scores: game.scores,
      round: game.round,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      // Game over
      setTimeout(() => endGame(io, roomCode, game), 3000);
    } else {
      // Start next round after a pause
      setTimeout(() => startNewRound(io, roomCode), 4000);
    }
  }

  // ─── KIDS QUIZ MODE LOGIC ──────────────────────────────────────────

  async function startQuizRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    // Reset guesses for new round
    game.guessedThisRound = new Set();

    // Select correct animal bank depending on difficulty setting
    const difficulty = game.quizDifficulty || "mixed";
    const bank = KIDS_QUIZ_BANK[difficulty] || KIDS_QUIZ_BANK.mixed;

    const duration = game.quizAnswerTime || 20;

    // Pick a random image+answer, avoid repeating the same item back-to-back
    let item;
    do {
      item = bank[Math.floor(Math.random() * bank.length)];
    } while (bank.length > 1 && item.answer === game.currentWord);

    game.currentWord = item.answer;
    game.currentImage = item.image;
    game.roundEndTime = Date.now() + duration * 1000;
    game.guessRank = 0; // tracks how many players have guessed correctly this round (for tiered points)

    // Update room in DB
    room.currentWord = item.answer;
    room.currentRound = game.round;
    await room.save();

    // Send the image to everyone — no "drawer" in quiz mode
    io.to(roomCode).emit("quiz_round_started", {
      image: item.image,
      round: game.round,
      totalRounds: game.totalRounds,
      duration: duration,
    });

    // Set round timer
    game.timer = setTimeout(() => endQuizRound(io, roomCode), duration * 1000);
  }

  function handleQuizGuess(io, roomCode, game, { userId, username, message }) {
    const guess = message.trim().toLowerCase();
    const correctAnswer = game.currentWord?.toLowerCase();

    if (
      correctAnswer &&
      guess === correctAnswer &&
      !game.guessedThisRound.has(userId)
    ) {
      game.guessedThisRound.add(userId);

      // Tiered points: 1st correct = 100, 2nd = 70, 3rd = 50, then 30 for the rest
      const tierPoints = [100, 70, 50];
      const basePoints = tierPoints[game.guessRank] ?? 30;

      // Small speed bonus on top
      const timeLeft = game.roundEndTime
        ? Math.max(0, Math.floor((game.roundEndTime - Date.now()) / 1000))
        : 0;
      const pointsEarned = basePoints + timeLeft;

      game.guessRank++;
      game.scores[userId] = (game.scores[userId] || 0) + pointsEarned;

      io.to(roomCode).emit("correct_guess", {
        userId,
        username,
        pointsEarned,
        scores: game.scores,
      });

      // If everyone guessed correctly, end round early
      if (game.guessedThisRound.size >= game.playerOrder.length) {
        clearTimeout(game.timer);
        setTimeout(() => endQuizRound(io, roomCode), 1500);
      }
      return;
    }

    // Wrong or repeated guess — just broadcast as chat (don't reveal answer)
    io.to(roomCode).emit("chat_message", { username, message, type: "chat" });
  }

  async function endQuizRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    const answer = game.currentWord;

    io.to(roomCode).emit("quiz_round_ended", {
      answer,
      scores: game.scores,
      round: game.round,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      setTimeout(() => endGame(io, roomCode, game), 3000);
    } else {
      setTimeout(() => startQuizRound(io, roomCode), 4000);
    }
  }

  // ─── MUSIC QUIZ MODE LOGIC ─────────────────────────────────────────

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  async function startMusicRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    game.guessedThisRound = new Set();

    // Pick a random song, avoid repeating the same one back-to-back
    let song;
    do {
      song = MUSIC_BANK[Math.floor(Math.random() * MUSIC_BANK.length)];
    } while (MUSIC_BANK.length > 1 && song.answer === game.currentWord);

    game.currentWord = song.answer;
    game.currentSong = song;
    game.roundEndTime = Date.now() + MUSIC_ROUND_DURATION * 1000;
    game.guessRank = 0;

    // Build shuffled options (correct answer + 3 fakes)
    const options = shuffle([song.answer, ...song.fakeOptions]);

    room.currentWord = song.answer;
    room.currentRound = game.round;
    await room.save();

    io.to(roomCode).emit("music_round_started", {
      clue: song.clue,
      options,
      round: game.round,
      totalRounds: game.totalRounds,
      duration: MUSIC_ROUND_DURATION,
    });

    // Set round timer — if it runs out, reveal anyway
    game.timer = setTimeout(() => revealMusicAnswer(io, roomCode), MUSIC_ROUND_DURATION * 1000);
  }

  function handleMusicGuess(io, roomCode, game, { userId, username, selected }) {
    if (game.guessedThisRound.has(userId)) return; // already answered this round
    game.guessedThisRound.add(userId);

    const isCorrect = selected === game.currentSong?.answer;

    if (isCorrect) {
      // Tiered points: 1st correct = 100, 2nd = 70, 3rd = 50, then 30 for the rest
      const tierPoints = [100, 70, 50];
      const basePoints = tierPoints[game.guessRank] ?? 30;

      const timeLeft = game.roundEndTime
        ? Math.max(0, Math.floor((game.roundEndTime - Date.now()) / 1000))
        : 0;
      const pointsEarned = basePoints + timeLeft;

      game.guessRank++;
      game.scores[userId] = (game.scores[userId] || 0) + pointsEarned;

      io.to(roomCode).emit("correct_guess", {
        userId,
        username,
        pointsEarned,
        scores: game.scores,
      });
    } else {
      // Wrong guess — let them know privately, no points
      const sock = findSocketByUserId(io, userId, roomCode);
      sock?.emit("music_wrong_answer", { selected });
    }

    // If everyone has answered, reveal early
    if (game.guessedThisRound.size >= game.playerOrder.length) {
      clearTimeout(game.timer);
      setTimeout(() => revealMusicAnswer(io, roomCode), 1000);
    }
  }

  // Reveal album art + play audio clip for everyone, then move to next round
  async function revealMusicAnswer(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    const song = game.currentSong;

    io.to(roomCode).emit("music_reveal", {
      answer: song.answer,
      artist: song.artist,
      cover: song.cover,
      audio: song.audio,
      scores: game.scores,
      round: game.round,
      duration: MUSIC_REVEAL_DURATION,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      setTimeout(() => endGame(io, roomCode, game), MUSIC_REVEAL_DURATION * 1000);
    } else {
      setTimeout(() => startMusicRound(io, roomCode), MUSIC_REVEAL_DURATION * 1000);
    }
  }

  // ─── COUPLES MODE LOGIC ─────────────────────────────────────────────
  //
  // 10 rounds total. Rounds 1-5: questions about playerOrder[0] ("him").
  // Rounds 6-10: questions about playerOrder[1] ("her").
  // The "answerer" privately picks their true answers (multi-select).
  // The "guesser" tries to predict those answers (multi-select).
  // Points go to the GUESSER based on overlap accuracy.

  function shuffleAndPick(arr, count) {
    return shuffle(arr).slice(0, count);
  }

  async function startCouplesGame(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    // Force exactly 10 rounds for couples mode regardless of room setting
    game.totalRounds = 10;

    // Pick 10 unique questions from the bank (5 for "him", 5 for "her")
    game.couplesQuestions = shuffleAndPick(COUPLES_BANK, 10);

    await startCouplesRound(io, roomCode);
  }

  async function startCouplesRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    const room = await Room.findOne({ code: roomCode });
    if (!room) return;

    const roundIndex = game.round - 1; // 0-based
    const question = game.couplesQuestions[roundIndex % game.couplesQuestions.length];

    // Rounds 1-5 → answerer is playerOrder[0] ("him")
    // Rounds 6-10 → answerer is playerOrder[1] ("her")
    const answererId = game.round <= 5 ? game.playerOrder[0] : game.playerOrder[1];
    const guesserId  = game.round <= 5 ? game.playerOrder[1] : game.playerOrder[0];

    game.currentQuestion = question;
    game.answererId = answererId;
    game.guesserId  = guesserId;
    game.answererSelections = null;
    game.guesserSelections  = null;
    game.couplesPhase = "answering"; // "answering" | "guessing" | "reveal"

    const answererName = room.players.find(p => p.userId?.toString() === answererId)?.username;
    const guesserName  = room.players.find(p => p.userId?.toString() === guesserId)?.username;

    room.currentRound = game.round;
    await room.save();

    // Tell everyone the round started — who's answering, who's guessing
    io.to(roomCode).emit("couples_round_started", {
      round: game.round,
      totalRounds: game.totalRounds,
      genre: question.genre,
      question: question.question,
      options: question.options,
      answererId,
      answererName,
      guesserId,
      guesserName,
      phase: "answering",
      duration: COUPLES_ANSWER_DURATION,
    });

    // Timer for the answering phase
    game.timer = setTimeout(() => {
      // If answerer didn't submit in time, default to empty selection
      if (!game.answererSelections) {
        game.answererSelections = [];
      }
      moveToGuessingPhase(io, roomCode);
    }, COUPLES_ANSWER_DURATION * 1000);
  }

  function moveToGuessingPhase(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    game.couplesPhase = "guessing";

    io.to(roomCode).emit("couples_phase_guessing", {
      duration: COUPLES_GUESS_DURATION,
    });

    game.timer = setTimeout(() => {
      if (!game.guesserSelections) {
        game.guesserSelections = [];
      }
      revealCouplesRound(io, roomCode);
    }, COUPLES_GUESS_DURATION * 1000);
  }

  function handleCouplesSubmit(io, roomCode, game, { userId, selections }) {
    if (game.couplesPhase === "answering" && userId === game.answererId) {
      if (game.answererSelections) return; // already submitted
      game.answererSelections = selections;

      // Let the guesser know the answerer has locked in (without revealing what)
      const guesserSocket = findSocketByUserId(io, game.guesserId, roomCode);
      guesserSocket?.emit("couples_answerer_ready");

      // Move on immediately if guesser already submitted (edge case) — otherwise wait for timer
      clearTimeout(game.timer);
      moveToGuessingPhase(io, roomCode);
      return;
    }

    if (game.couplesPhase === "guessing" && userId === game.guesserId) {
      if (game.guesserSelections) return; // already submitted
      game.guesserSelections = selections;

      clearTimeout(game.timer);
      revealCouplesRound(io, roomCode);
      return;
    }
  }

  // Compare answerer vs guesser selections, award points, reveal to both
  async function revealCouplesRound(io, roomCode) {
    const game = activeGames[roomCode];
    if (!game) return;

    game.couplesPhase = "reveal";

    const trueSet  = new Set(game.answererSelections || []);
    const guessSet = new Set(game.guesserSelections  || []);

    const correctMatches = [...guessSet].filter(g => trueSet.has(g)).length;
    const wrongSelections = [...guessSet].filter(g => !trueSet.has(g)).length;
    const totalTrue = trueSet.size;

    let points = 0;
    if (totalTrue > 0) {
      points = Math.round((correctMatches / totalTrue) * 100) - (wrongSelections * 10);
    } else if (guessSet.size === 0) {
      // Answerer picked nothing AND guesser guessed nothing — perfect read!
      points = 100;
    }
    points = Math.max(0, points);

    // Points go to the GUESSER
    game.scores[game.guesserId] = (game.scores[game.guesserId] || 0) + points;

    io.to(roomCode).emit("couples_round_revealed", {
      round: game.round,
      question: game.currentQuestion.question,
      options: game.currentQuestion.options,
      answererSelections: [...trueSet],
      guesserSelections: [...guessSet],
      pointsEarned: points,
      guesserId: game.guesserId,
      scores: game.scores,
    });

    game.round++;

    if (game.round > game.totalRounds) {
      setTimeout(() => endGame(io, roomCode, game), COUPLES_REVEAL_DURATION * 1000);
    } else {
      setTimeout(() => startCouplesRound(io, roomCode), COUPLES_REVEAL_DURATION * 1000);
    }
  }

  async function endGame(io, roomCode, game) {
    try {
      const room = await Room.findOne({ code: roomCode });
      if (!room) return;

      room.status = "finished";
      await room.save();

      // Sort players by score
      const finalScores = Object.entries(game.scores)
        .sort(([, a], [, b]) => b - a)
        .map(([userId, points], index) => ({
          userId,
          points,
          rank: index + 1,
          username: room.players.find((p) => p.userId?.toString() === userId)?.username,
          avatar: room.players.find((p) => p.userId?.toString() === userId)?.avatar,
        }));

      // Save points to user accounts in DB
      for (const { userId, points } of finalScores) {
        await User.findByIdAndUpdate(userId, {
          $inc: {
            totalPoints: points,
            gamesPlayed: 1,
          },
        });
      }

      // Award win to top player
      if (finalScores[0]) {
        const winner = await User.findById(finalScores[0].userId);
        if (winner) {
          winner.gamesWon += 1;
          if (!winner.badges.includes("first_win")) winner.badges.push("first_win");
          await winner.save();
        }
      }

      io.to(roomCode).emit("game_over", { finalScores });

      // Clean up in-memory state
      delete activeGames[roomCode];
    } catch (err) {
      console.error("endGame error:", err);
    }
  }

  // Helper: find a socket by userId inside a room
  function findSocketByUserId(io, userId, roomCode) {
    const room = io.sockets.adapter.rooms.get(roomCode);
    if (!room) return null;
    for (const socketId of room) {
      const s = io.sockets.sockets.get(socketId);
      if (s?.data?.userId === userId) return s;
    }
    return null;
  }

  // Simple Levenshtein distance for "close guess" detection
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    const dp = Array.from({ length: m + 1 }, (_, i) =>
      Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }
};