import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import DrawingCanvas from "../components/DrawingCanvas";
import QuizDisplay from "../components/QuizDisplay";
import MusicQuizDisplay from "../components/MusicQuizDisplay";
import AlbumRevealOverlay from "../components/AlbumRevealOverlay";
import CouplesQuizDisplay from "../components/CouplesQuizDisplay";
import ChatBox from "../components/ChatBox";
import PlayersSidebar from "../components/PlayersSidebar";
import BackgroundMusic from "../components/BackgroundMusic";
import Silk from "../components/Silk";
import Particles from "../components/Particles";
import GridScan from "../components/GridScan";
import PixelSnow from "../components/PixelSnow";
import safariBg from "./assets/safari-bg.png";

// Round timer hook
function useTimer(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const intervalRef = useRef(null);

  const start = useCallback((s) => {
    setSeconds(s);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return { seconds, start, stop };
}

const CATEGORY_META = {
  general: { label:"🎨 Draw n Guess", bg:"rgba(57,255,136,0.15)", border:"#39ff88", particleColors:["#39ff88", "#6dd5a8", "#06D6A0"] },
  kids:    { label:"🐾 Animal Quiz",  bg:"rgba(132,200,255,0.15)", border:"#84c8ff", particleColors:["#84c8ff", "#4d80ff", "#00F0FF"] },
  couples: { label:"💕 Couples",      bg:"rgba(255,153,204,0.15)", border:"#ff99cc", particleColors:["#ff99cc", "#ff3399", "#FF007F"] },
  music:   { label:"🎵 Music",        bg:"rgba(200,168,255,0.15)", border:"#c8a8ff", particleColors:["#c8a8ff", "#7c4dff", "#BD00FF"] },
};

export default function GamePage() {
  const { code }      = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { socket }    = useSocket();

  const [room,          setRoom]          = useState(null);
  const [players,       setPlayers]       = useState([]);
  const [gamePhase,     setGamePhase]     = useState("waiting"); // waiting | playing | finished
  const [currentDrawer, setCurrentDrawer] = useState(null);
  const [currentWord,   setCurrentWord]   = useState("");      // only drawer sees this
  const [maskedWord,    setMaskedWord]    = useState("");      // guessers see blanks
  const [scores,        setScores]        = useState({});
  const [round,         setRound]         = useState(0);
  const [totalRounds,   setTotalRounds]   = useState(5);
  const [finalScores,   setFinalScores]   = useState(null);
  const [roundWord,     setRoundWord]     = useState("");      // shown after round ends
  const [loading,       setLoading]       = useState(true);

  // Kids quiz mode state
  const [quizImage,     setQuizImage]     = useState("");
  const [quizAnswer,    setQuizAnswer]    = useState("");      // shown after round ends

  // Music quiz mode state
  const [musicClue,     setMusicClue]     = useState("");
  const [musicOptions,  setMusicOptions]  = useState([]);
  const [musicReveal,   setMusicReveal]   = useState(null);     // { answer, artist, cover, audio } or null
  const [revealSeconds, setRevealSeconds] = useState(0);

  // Couples mode state
  const [couplesQuestion,  setCouplesQuestion]  = useState(null); // { genre, question, options }
  const [couplesPhase,     setCouplesPhase]     = useState("answering"); // answering | guessing | reveal
  const [couplesAnswerer,  setCouplesAnswerer]  = useState({ id: null, name: "" });
  const [couplesGuesser,   setCouplesGuesser]   = useState({ id: null, name: "" });
  const [couplesReveal,    setCouplesReveal]    = useState(null);

  const { seconds, start: startTimer, stop: stopTimer } = useTimer(80);

  const isDrawer = currentDrawer === user?._id;
  const isKidsMode = room?.category === "kids";
  const isMusicMode = room?.category === "music";
  const isCouplesMode = room?.category === "couples";

  // ── 1. Load room from API ──────────────────────────────────────
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(`/api/room/${code}`);
        setRoom(data.room);
        setPlayers(data.room.players);
        setTotalRounds(data.room.totalRounds);
      } catch {
        toast.error("Room not found!");
        navigate("/lobby");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [code, navigate]);

  // ── 2. Join socket room once loaded ───────────────────────────
  useEffect(() => {
    if (!socket || !user || !room) return;
    socket.emit("join_room", {
      roomCode: code,
      userId:   user._id,
      username: user.username,
      avatar:   user.avatar,
    });
  }, [socket, user, room, code]);

  // ── 3. Socket event listeners ─────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.on("players_updated", ({ players }) => setPlayers(players));

    socket.on("player_joined", ({ username }) => {
      toast(`${username} joined! 👋`, { icon:"🟢" });
    });

    socket.on("player_left", ({ username }) => {
      toast(`${username} left`, { icon:"🔴" });
    });

    socket.on("game_started", ({ players, totalRounds, category }) => {
      setGamePhase("playing");
      setTotalRounds(totalRounds);
      setPlayers(players);
      toast.success(`Game started! Category: ${CATEGORY_META[category]?.label || category} 🎮`);
    });

    socket.on("round_started", ({ drawerId, drawerName, round, maskedWord, duration }) => {
      setCurrentDrawer(drawerId);
      setRound(round);
      setMaskedWord(maskedWord);
      setCurrentWord("");
      setRoundWord("");
      startTimer(duration);
      toast(`Round ${round} — ${drawerName} is drawing! ✏️`);
    });

    socket.on("your_turn_to_draw", ({ word, round, duration }) => {
      setCurrentWord(word);
      setRound(round);
      startTimer(duration);
      toast.success(`Your word: "${word}" — go draw! 🎨`, { duration: 5000 });
    });

    socket.on("correct_guess", ({ scores }) => {
      setScores({ ...scores });
    });

    socket.on("round_ended", ({ word, scores, round }) => {
      stopTimer();
      setRoundWord(word);
      setScores({ ...scores });
      toast(`Round ${round} over! The word was: "${word}" 💡`);
    });

    // ── Kids quiz mode events ──
    socket.on("quiz_round_started", ({ image, round, duration }) => {
      setQuizImage(image);
      setQuizAnswer("");
      setRound(round);
      startTimer(duration);
    });

    socket.on("quiz_round_ended", ({ answer, scores, round }) => {
      stopTimer();
      setQuizAnswer(answer);
      setScores({ ...scores });
      toast(`Round ${round} over! It was a ${answer}! 🐾`);
    });

    // ── Music quiz mode events ──
    socket.on("music_round_started", ({ clue, options, round, duration }) => {
      setMusicClue(clue);
      setMusicOptions(options);
      setMusicReveal(null);
      setRound(round);
      startTimer(duration);
    });

    socket.on("music_reveal", ({ answer, artist, cover, audio, scores, round, duration }) => {
      stopTimer();
      setScores({ ...scores });
      setMusicReveal({ answer, artist, cover, audio });
      setRevealSeconds(duration);
    });

    // ── Couples mode events ──
    socket.on("couples_round_started", ({
      round, totalRounds, genre, question, options,
      answererId, answererName, guesserId, guesserName, duration,
    }) => {
      setRound(round);
      setTotalRounds(totalRounds);
      setCouplesQuestion({ genre, question, options });
      setCouplesAnswerer({ id: answererId, name: answererName });
      setCouplesGuesser({ id: guesserId, name: guesserName });
      setCouplesPhase("answering");
      setCouplesReveal(null);
      startTimer(duration);
    });

    socket.on("couples_phase_guessing", ({ duration }) => {
      setCouplesPhase("guessing");
      startTimer(duration);
    });

    socket.on("couples_answerer_ready", () => {
      toast("Your partner locked in their answer! Your turn soon… 💭", { duration: 3000 });
    });

    socket.on("couples_round_revealed", ({
      round, question, options, answererSelections, guesserSelections,
      pointsEarned, guesserId, scores,
    }) => {
      stopTimer();
      setScores({ ...scores });
      setCouplesPhase("reveal");
      setCouplesReveal({
        answererSelections, guesserSelections, pointsEarned, guesserId,
      });
    });

    socket.on("game_over", ({ finalScores }) => {
      stopTimer();
      setGamePhase("finished");
      setFinalScores(finalScores);
    });

    socket.on("error", ({ message }) => {
      toast.error(message);
    });

    return () => {
      socket.off("players_updated");
      socket.off("player_joined");
      socket.off("player_left");
      socket.off("game_started");
      socket.off("round_started");
      socket.off("your_turn_to_draw");
      socket.off("correct_guess");
      socket.off("round_ended");
      socket.off("quiz_round_started");
      socket.off("quiz_round_ended");
      socket.off("music_round_started");
      socket.off("music_reveal");
      socket.off("couples_round_started");
      socket.off("couples_phase_guessing");
      socket.off("couples_answerer_ready");
      socket.off("couples_round_revealed");
      socket.off("game_over");
      socket.off("error");
    };
  }, [socket, startTimer, stopTimer]);

  const startGame = () => {
    if (!socket) return;
    socket.emit("start_game", { roomCode: code });
  };

  // ── Reveal overlay countdown (music quiz) ──────────────────────
  useEffect(() => {
    if (!musicReveal || revealSeconds <= 0) return;
    const interval = setInterval(() => {
      setRevealSeconds(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [musicReveal, revealSeconds]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#0a0612" }}>
        <div className="text-center">
          <div className="text-6xl float mb-4">🎨</div>
          <p className="font-display text-2xl" style={{ color:"#f0e0ff" }}>Loading room…</p>
        </div>
      </div>
    );
  }

  // ── FINISHED STATE ─────────────────────────────────────────────
  if (gamePhase === "finished" && finalScores) {
    const cat = CATEGORY_META[room?.category] || CATEGORY_META.general;
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{ background:"#0a0612" }}>
        
        {/* Background Particles */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <Particles
            particleColors={cat.particleColors}
            particleCount={600}
            particleSpread={12}
            speed={0.15}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <div className="p-10 rounded-3xl text-center glass-panel"
            style={{ borderColor: "rgba(255, 255, 255, 0.35)", boxShadow: "0 8px 40px rgba(255, 255, 255, 0.15)" }}>
            
            <div className="text-6xl mb-2 float" style={{ filter: `drop-shadow(0 0 8px ${cat.border})` }}>🏆</div>
            <h1 className="font-display text-4xl mb-1" style={{ color:"#f0e0ff" }}>Game Over!</h1>
            <p className="font-body text-sm mb-8" style={{ color:"rgba(240,224,255,0.5)" }}>
              Points saved to your account ✅
            </p>

            {finalScores.map((p, i) => {
              const borderColors = ["#f0c840", "#c8a8ff", "#6dd5a8", "#84c8ff"];
              const itemBorder = borderColors[i] || "rgba(200,168,255,0.15)";
              return (
                <div key={p.userId}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-2"
                  style={{
                    background: "rgba(10,6,18,0.75)",
                    border: `2.5px solid ${itemBorder}`,
                    boxShadow: `0 0 10px ${itemBorder}22`,
                  }}>
                  <span className="text-2xl">{["🥇","🥈","🥉","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣"][i]}</span>
                  <img
                    src={p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`}
                    className="w-8 h-8 rounded-full" style={{ border: `2px solid ${itemBorder}` }} />
                  <span className="flex-1 font-body font-bold text-sm text-left" style={{ color:"#f0e0ff" }}>
                    {p.username} {p.userId === user?._id ? "(You)" : ""}
                  </span>
                  <span className="font-display text-lg" style={{ color: itemBorder }}>
                    {p.points} pts
                  </span>
                </div>
              );
            })}

            <button onClick={() => navigate("/lobby")}
              className="btn-bounce mt-6 w-full py-3 rounded-2xl font-display text-lg cursor-pointer"
              style={{ background:`linear-gradient(135deg, ${cat.border}, #7c4dff)`, color:"#0a0612", border:"none", fontWeight: "bold" }}>
              Back to Lobby 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── WAITING LOBBY ─────────────────────────────────────────────
  if (gamePhase === "waiting") {
    const isHost = room?.host?._id === user?._id || room?.host === user?._id;
    const cat = CATEGORY_META[room?.category] || CATEGORY_META.general;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
        style={{ background: "#0a0612" }}>
        
        {/* Background Particles corresponding to Category */}
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <Particles
            particleColors={cat.particleColors}
            particleCount={600}
            particleSpread={12}
            speed={0.15}
            particleBaseSize={80}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
          />
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          <div className="p-10 rounded-3xl text-center glass-panel"
            style={{ borderColor: "rgba(255, 255, 255, 0.35)", boxShadow: "0 8px 40px rgba(255, 255, 255, 0.15)" }}>
            
            <div className="text-5xl float mb-3" style={{ filter: `drop-shadow(0 0 8px ${cat.border})` }}>🎪</div>
            <h1 className="font-display text-3xl mb-1" style={{ color: "#f0e0ff" }}>Waiting Room</h1>
            
            {/* Room code */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl mt-2 mb-6"
              style={{ background: "rgba(255,255,255,0.03)", border: `1.5px solid ${cat.border}33` }}>
              <span className="font-body text-sm" style={{ color: "rgba(240,224,255,0.6)" }}>Room code:</span>
              <span className="font-display text-2xl tracking-widest text-glow-soft" style={{ color: cat.border }}>
                {code}
              </span>
              <button onClick={() => { navigator.clipboard.writeText(code); toast.success("Copied!"); }}
                className="btn-bounce text-xs px-2 py-0.5 rounded-lg font-body"
                style={{ background: "rgba(200,168,255,0.1)", color: "#f0e0ff", border: `1px solid ${cat.border}33`, cursor: "pointer" }}>
                Copy
              </button>
            </div>

            <div className="mb-4 text-sm font-body" style={{ color: "rgba(240,224,255,0.5)" }}>
              Category: <span className="font-semibold text-glow-soft" style={{ color: cat.border }}>{cat.label}</span> · {room?.totalRounds} rounds
            </div>

            {/* Players */}
            <div className="space-y-2 mb-8">
              {players.map(p => (
                <div key={p.userId} className="flex items-center gap-3 px-4 py-2 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${cat.border}22` }}>
                  <img src={p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`}
                    className="w-8 h-8 rounded-full" style={{ border: `2px solid ${cat.border}` }} />
                  <span className="font-body font-bold text-sm flex-1 text-left" style={{ color: "#f0e0ff" }}>
                    {p.username}
                  </span>
                  {(room?.host?._id === p.userId || room?.host === p.userId) && (
                    <span className="font-body text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: `${cat.border}22`, color: cat.border, border: `1px solid ${cat.border}44` }}>
                      👑 Host
                    </span>
                  )}
                </div>
              ))}
            </div>

            {players.length < 2 && (
              <p className="font-body text-sm mb-4" style={{ color: "rgba(240,224,255,0.4)" }}>
                Waiting for at least 2 players…
              </p>
            )}

            {isHost ? (
              <button onClick={startGame} disabled={players.length < 2}
                className="btn-bounce w-full py-3 rounded-2xl font-display text-xl cursor-pointer"
                style={{
                  background: players.length >= 2
                    ? `linear-gradient(135deg, ${cat.border}, #7c4dff)`
                    : "rgba(255,255,255,0.05)",
                  color: players.length >= 2 ? "#0a0612" : "rgba(240,224,255,0.3)",
                  border: `2px solid ${players.length >= 2 ? cat.border : "rgba(255,255,255,0.1)"}`,
                  opacity: players.length < 2 ? 0.5 : 1,
                  fontWeight: "bold",
                }}>
                {players.length >= 2 ? "Start Game! 🚀" : "Need more players…"}
              </button>
            ) : (
              <div className="font-display text-lg" style={{ color: "rgba(240,224,255,0.5)" }}>
                Waiting for host to start… 🕐
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── ACTIVE GAME ───────────────────────────────────────────────
  const cat = CATEGORY_META[room?.category] || CATEGORY_META.general;
  const timerColor = seconds <= 10 ? "#E63946" : seconds <= 20 ? "#FF9F1C" : "#06D6A0";

  return (
    <div className="h-screen flex flex-col overflow-hidden relative"
      style={{ background: "#0a0612" }}>
      <BackgroundMusic category={room?.category} />

      {/* Background corresponding to Category */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {room?.category === "general" ? (
          <Silk />
        ) : room?.category === "music" ? (
          <GridScan
            sensitivity={0.4}
            lineThickness={1}
            linesColor="rgba(255, 255, 255, 0.08)"
            gridScale={0.15}
            scanColor="#ffffff"
            scanOpacity={0.3}
            enablePost={true}
            bloomIntensity={0.5}
            chromaticAberration={0.001}
            noiseIntensity={0.01}
          />
        ) : room?.category === "couples" ? (
          <PixelSnow
            color="#ff99cc"
            flakeSize={0.02}
            minFlakeSize={1.5}
            pixelResolution={180}
            speed={1.5}
            density={0.25}
            direction={125}
            brightness={2.0}
            depthFade={12.0}
            variant="heart"
          />
        ) : room?.category === "kids" ? (
          <div className="absolute inset-0 z-0 opacity-25"
            style={{
              backgroundImage: `url(${safariBg})`,
              backgroundRepeat: "repeat",
              backgroundSize: "240px 240px",
            }}
          />
        ) : (
          <Particles
            particleColors={cat.particleColors}
            particleCount={600}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={70}
            moveParticlesOnHover={true}
            alphaParticles={true}
            disableRotation={false}
          />
        )}
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 flex-shrink-0"
          style={{
            background: "rgba(10, 6, 18, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderBottom: "1.5px solid rgba(255, 255, 255, 0.35)"
          }}>
          
          <div className="flex items-center gap-3">
            <span className="font-display text-xl text-glow-soft" style={{ color: "#f0e0ff" }}>🎨 Playlio</span>
            <span className="font-body text-xs px-3 py-0.5 rounded-full font-bold"
              style={{ background: `${cat.border}22`, color: cat.border, border: `1.5px solid ${cat.border}44` }}>
              {cat.label}
            </span>
          </div>

          {/* Word / blanks / quiz prompt */}
          <div className="text-center">
            {isCouplesMode ? (
              <div className="font-display text-lg text-glow-soft" style={{ color: cat.border }}>
                💕 Guess My Answer
              </div>
            ) : isMusicMode ? (
              <div className="font-display text-lg text-glow-soft" style={{ color: cat.border }}>
                🎵 Name that song!
              </div>
            ) : isKidsMode ? (
              <div className="font-display text-lg text-glow-soft" style={{ color: cat.border }}>
                🐾 Guess the animal!
              </div>
            ) : isDrawer ? (
              <div className="font-display text-2xl text-glow-soft" style={{ color: cat.border }}>
                {currentWord}
              </div>
            ) : (
              <div className="flex gap-1.5 items-center justify-center">
                {maskedWord.split("").map((ch, i) => (
                  <span key={i} className={`font-display text-xl ${ch === "_" ? "border-b-2" : ""}`}
                    style={{ borderColor: "#f0e0ff", minWidth:"12px", textAlign:"center", color: "#f0e0ff" }}>
                    {ch === "_" ? "\u00A0" : ch}
                  </span>
                ))}
              </div>
            )}
            {isKidsMode && quizAnswer && (
              <div className="font-body text-xs mt-0.5" style={{ color: "rgba(240,224,255,0.6)" }}>
                It was a: <strong style={{ color: cat.border }}>{quizAnswer}</strong>
              </div>
            )}
            {!isKidsMode && !isMusicMode && !isCouplesMode && roundWord && (
              <div className="font-body text-xs mt-0.5" style={{ color: "rgba(240,224,255,0.6)" }}>
                Word was: <strong style={{ color: cat.border }}>{roundWord}</strong>
              </div>
            )}
          </div>

          {/* Round + timer */}
          <div className="flex items-center gap-4">
            <span className="font-body text-sm" style={{ color: "rgba(240,224,255,0.6)" }}>
              Round {round}/{totalRounds}
            </span>
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-display text-xl"
              style={{
                background: timerColor + "22",
                border: `3px solid ${timerColor}`,
                color: timerColor,
                boxShadow: `0 0 10px ${timerColor}33`,
                transition: "border-color 0.5s, color 0.5s",
              }}>
              {seconds}
            </div>
          </div>
        </div>

        {/* Main game area */}
        <div className="flex flex-1 gap-3 p-3 min-h-0">
          
          {/* Left: players — hidden for couples mode (only 2 players, shown differently) */}
          {!isCouplesMode && (
            <div className="w-44 flex-shrink-0 overflow-y-auto">
              <PlayersSidebar
                players={players}
                currentDrawerId={currentDrawer}
                scores={scores}
              />
            </div>
          )}

          {/* Center: canvas, animal quiz, music quiz, or couples quiz */}
          <div className="flex-1 flex flex-col min-w-0">
            {isCouplesMode ? (
              <CouplesQuizDisplay
                socket={socket}
                roomCode={code}
                userId={user?._id}
                question={couplesQuestion}
                phase={couplesPhase}
                answererId={couplesAnswerer.id}
                answererName={couplesAnswerer.name}
                guesserId={couplesGuesser.id}
                guesserName={couplesGuesser.name}
                seconds={seconds}
                revealData={couplesReveal}
              />
            ) : isMusicMode ? (
              <MusicQuizDisplay
                clue={musicClue}
                options={musicOptions}
                seconds={seconds}
                socket={socket}
                roomCode={code}
                userId={user?._id}
                username={user?.username}
                revealAnswer={musicReveal?.answer || null}
              />
            ) : isKidsMode ? (
              <QuizDisplay imageUrl={quizImage} seconds={seconds} />
            ) : (
              <DrawingCanvas
                socket={socket}
                roomCode={code}
                isDrawer={isDrawer}
              />
            )}
          </div>

          {/* Right: chat — hidden for music quiz and couples mode (no typing needed) */}
          {!isMusicMode && !isCouplesMode && (
            <div className="w-56 flex-shrink-0 flex flex-col">
              <ChatBox
                 socket={socket}
                 roomCode={code}
                 userId={user?._id}
                 username={user?.username}
                 isDrawer={isKidsMode ? false : isDrawer}
                 theme="dark"
                  />               
            </div>
          )}

          {/* Right: live scores for couples mode */}
          {isCouplesMode && (
            <div className="w-48 flex-shrink-0 space-y-2">
              {players.map(p => (
                <div key={p.userId}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl"
                  style={{
                    background: "transparent",
                    border: `2px solid ${cat.border}44`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                  }}>
                  <img
                    src={p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`}
                    className="w-8 h-8 rounded-full flex-shrink-0"
                    style={{ border: `1.5px solid ${cat.border}` }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold text-sm truncate" style={{ color: "#f0e0ff" }}>
                      {p.username}
                    </p>
                    <p className="font-display text-base" style={{ color: cat.border }}>
                      {scores[p.userId] ?? 0} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen album reveal overlay (music quiz) */}
      {isMusicMode && musicReveal && (
        <AlbumRevealOverlay
          answer={musicReveal.answer}
          artist={musicReveal.artist}
          cover={musicReveal.cover}
          audio={musicReveal.audio}
          seconds={revealSeconds}
        />
      )}

    </div>
  );
}