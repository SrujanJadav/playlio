import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import LiquidGlassTabs from "../components/LiquidGlassTabs";
import PixelButton from "../components/PixelButton";
import BounceCards from "../components/BounceCards";
import Counter from "../components/Counter";
import PixelSnow from "../components/PixelSnow";
import PixelEmoji from "../components/PixelEmoji";
import PixelPanel from "../components/PixelPanel";
import Particles from "../components/Particles";

const CATEGORIES = [
  { id: "general", emoji: "🎨", label: "Draw n Guess", desc: "Classic drawing game", bg: "#0a0612", border: "#6dd5a8", video: "/videos/draw-n-guess.mp4" },
  { id: "kids", emoji: "🐾", label: "Animal Quiz", desc: "Guess the animal pic", bg: "#0a0612", border: "#84c8ff", video: "/videos/animal-quiz.mp4" },
  { id: "couples", emoji: "💕", label: "Couples", desc: "Cute & romantic picks", bg: "#0a0612", border: "#ff99cc" },
  { id: "music", emoji: "🎵", label: "Music", desc: "Guess the song lyric", bg: "#0a0612", border: "#c8a8ff", video: "/videos/music.mp4" },
];

const Stepper = ({ label, value, onChange, min, max, disabled }) => {
  const handleDecrement = () => {
    if (!disabled && value > min) onChange(value - 1);
  };
  const handleIncrement = () => {
    if (!disabled && value < max) onChange(value + 1);
  };
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
      <div className="flex flex-col pr-2">
        <span className="font-body text-base text-white/80">{label}</span>
        <span className="font-body text-xs text-white/40">Min: {min} · Max: {max} {disabled && "(Locked)"}</span>
      </div>
      <div className={`flex items-center gap-3 bg-black/30 px-3 py-1.5 rounded-full border border-white/10 ${disabled ? 'opacity-40' : ''}`}>
        <button
          type="button"
          disabled={disabled || value <= min}
          onClick={handleDecrement}
          className="w-8 h-8 rounded-full flex items-center justify-center font-display text-lg select-none transition-all hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          style={{ color: "#c8a8ff" }}
        >
          -
        </button>
        <Counter
          value={value}
          fontSize={18}
          textColor={disabled ? "rgba(255,255,255,0.4)" : "#f0e0ff"}
          fontWeight="bold"
          gradientHeight={4}
          gradientFrom="transparent"
          gradientTo="transparent"
        />
        <button
          type="button"
          disabled={disabled || value >= max}
          onClick={handleIncrement}
          className="w-8 h-8 rounded-full flex items-center justify-center font-display text-lg select-none transition-all hover:bg-white/10 active:scale-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          style={{ color: "#c8a8ff" }}
        >
          +
        </button>
      </div>
    </div>
  );
};

const Toggle = ({ label, description, checked, onChange, disabled }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-b-0">
      <div className="flex flex-col pr-4">
        <span className="font-body text-base text-white/80">{label}</span>
        <span className="font-body text-xs text-white/40 leading-relaxed">{description}</span>
      </div>
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`w-12 h-7 rounded-full relative transition-all duration-300 flex-shrink-0 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          background: checked ? "#c878ff" : "rgba(255,255,255,0.08)",
          border: checked ? "1px solid #c878ff" : "1px solid rgba(255,255,255,0.15)",
          boxShadow: checked ? "0 0 10px rgba(200,120,255,0.3)" : "none"
        }}
      >
        <div
          className="absolute top-[2px] w-5 h-5 bg-white rounded-full shadow transition-all duration-300"
          style={{
            left: checked ? "calc(100% - 22px)" : "2px"
          }}
        />
      </div>
    </div>
  );
};

export default function LobbyPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("create");
  const [category, setCategory] = useState("general");
  const [rounds, setRounds] = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowKick, setAllowKick] = useState(true);
  const [allowLateJoin, setAllowLateJoin] = useState(true);
  const [autoStartWhenFull, setAutoStartWhenFull] = useState(false);
  const [autoDissolve, setAutoDissolve] = useState(true);
  const [autoDissolveEmpty, setAutoDissolveEmpty] = useState(true);
  const [roundDuration, setRoundDuration] = useState(80);
  const [wordDifficulty, setWordDifficulty] = useState("mixed");
  const [enableHints, setEnableHints] = useState(true);
  const [quizAnswerTime, setQuizAnswerTime] = useState(20);
  const [quizDifficulty, setQuizDifficulty] = useState("mixed");
  const [couplesIntensity, setCouplesIntensity] = useState("mixed");
  const [musicAnswerTime, setMusicAnswerTime] = useState(15);
  const [musicGenre, setMusicGenre] = useState("mixed");
  const [joinCode, setJoinCode] = useState("");
  const [publicRooms, setPublicRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refreshUser();
    fetchPublicRooms();
  }, []);

  const fetchPublicRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/public");
      setPublicRooms(data.rooms);
    } catch { }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const isCouples = category === "couples";
      const isDraw = category === "general";
      const isKids = category === "kids";
      const { data } = await axios.post("/api/room/create", {
        category,
        maxPlayers: isCouples ? 2 : maxPlayers,
        isPrivate,
        allowKick,
        allowLateJoin,
        autoStartWhenFull: isCouples ? false : autoStartWhenFull,
        autoDissolve,
        autoDissolveEmpty,
        totalRounds: isCouples ? 10 : rounds,
        roundDuration: isDraw ? roundDuration : 80,
        wordDifficulty: isDraw ? wordDifficulty : "mixed",
        enableHints: isDraw ? enableHints : true,
        quizAnswerTime: isKids ? quizAnswerTime : 20,
        quizDifficulty: isKids ? quizDifficulty : "mixed",
        couplesIntensity: isCouples ? couplesIntensity : "mixed",
        musicAnswerTime,
        musicGenre,
      });
      toast.success(`Room ${data.code} created! 🎉`);
      navigate(`/game/${data.code}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      toast.error("Room codes are 6 characters!");
      return;
    }
    try {
      await axios.get(`/api/room/${code}`);
      navigate(`/game/${code}`);
    } catch {
      toast.error("Room not found or no longer open.");
    }
  };

  return (
    <div className="relative z-10 page-container pb-16 flex flex-col items-center" style={{ paddingTop: "20px" }}>

      {/* 1. WELCOME CARD */}
      <PixelPanel
        className="w-full p-8 mb-10 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.01]"
        style={{
          boxShadow: "0 8px 40px rgba(200,168,255,0.15), 0 4px 40px rgba(0, 0, 0, 0.5)",
        }}
      >
        <p className="font-display text-3xl mb-3 text-glow-soft tracking-wider" style={{ color: "#f0e0ff" }}>
          Hey, {user?.username}! <PixelEmoji>👋</PixelEmoji>
        </p>
        <div className="flex items-center justify-center gap-5 font-body text-lg" style={{ color: "rgba(240,224,255,0.8)" }}>
          <span className="flex items-center gap-2">
            <span className="text-[#f0c840] drop-shadow-[0_0_8px_rgba(240,200,64,0.6)]"><PixelEmoji>⭐</PixelEmoji></span>
            {user?.totalPoints || 0} Points
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-2">
            <span className="text-[#6dd5a8] drop-shadow-[0_0_8px_rgba(109,213,168,0.6)]"><PixelEmoji>🎮</PixelEmoji></span>
            {user?.gamesPlayed || 0} Games Played
          </span>
        </div>

        {user?.badges?.length > 0 && (
          <div className="flex gap-3 mt-5 pt-5 border-t border-white/10 w-[60%] justify-center">
            {user.badges.map(b => (
              <span key={b} className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" title={b}>
                <PixelEmoji>{{ first_win: "🏆", streak_3: "🔥", points_500: "⭐", points_1000: "💎", social_butterfly: "🦋" }[b]}</PixelEmoji>
              </span>
            ))}
          </div>
        )}
      </PixelPanel>

      {/* 2. TAB CONTROLS */}
      <div className="flex justify-center mb-10 w-full">
        <LiquidGlassTabs
          activeTab={tab}
          onChange={setTab}
          tabs={[
            { id: "create", label: <span><PixelEmoji>✨</PixelEmoji> Create</span> },
            { id: "join", label: <span><PixelEmoji>🔗</PixelEmoji> Join</span> },
            { id: "public", label: <span><PixelEmoji>🌐</PixelEmoji> Browse</span> },
          ]}
        />
      </div>

      {/* 3. DYNAMIC TAB CONTENT */}
      <div className="w-full">

        {/* ── CREATE TAB ── */}
        {tab === "create" && (
          <div className="slide-up grid lg:grid-cols-2 gap-10 items-stretch w-full">

            {/* Left Column: Categories */}
            <div className="flex flex-col w-full">
              <h2 className="font-display text-base mb-5 text-center tracking-[3px]" style={{ color: "#c8a8ff", lineHeight: 1.6 }}>
                ▸ PICK A CATEGORY
              </h2>
              <div className="grid grid-cols-2 gap-4 flex-1">
                {CATEGORIES.map(c => (
                  <PixelButton
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    background={c.bg}
                    borderColor={category === c.id ? c.border : "rgba(255,255,255,0.12)"}
                    textColor="white"
                    className="flex-col items-center justify-center text-center w-full h-full"
                    style={{
                      padding: "22px 18px",
                      boxShadow: category === c.id ? `0 0 24px ${c.border}55, 0 8px 32px rgba(0,0,0,0.3)` : "0 4px 16px rgba(0,0,0,0.2)",
                      outline: category === c.id ? `2px solid ${c.border}` : "none",
                      outlineOffset: "3px",
                      minHeight: "120px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Looping video background for non-couples buttons */}
                    {c.video && (
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                        <video
                          key={c.id}
                          src={c.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            opacity: 0.45,
                            transform: "translate3d(0,0,0)",
                            backfaceVisibility: "hidden",
                            willChange: "transform",
                          }}
                        />
                      </div>
                    )}
                    {/* Pixelated pink heart snowfall background for Couples button */}
                    {c.id === "couples" && (
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                        <PixelSnow
                          color="#ff99cc"
                          flakeSize={0.11}
                          minFlakeSize={2.0}
                          pixelResolution={120}
                          speed={0.8}
                          density={0.2}
                          direction={125}
                          brightness={2.5}
                          depthFade={10.0}
                          variant="heart"
                          style={{ width: "100%", height: "100%" }}
                        />
                      </div>
                    )}
                    <div className="font-display text-lg mb-2 text-center" style={{ color: c.border, lineHeight: 1.6, position: "relative", zIndex: 1 }}>
                      <PixelEmoji>{c.emoji}</PixelEmoji> {c.label}
                    </div>
                    <div className="font-body text-sm text-center" style={{ color: "rgba(255,255,255,0.6)", position: "relative", zIndex: 1 }}>
                      {c.desc}
                    </div>
                  </PixelButton>
                ))}
              </div>
            </div>

            {/* Right Column: Room Settings Redesign */}
            <div className="flex flex-col w-full h-full">
              <h2 className="font-display text-xs mb-5 text-center tracking-[3px]" style={{ color: "#c8a8ff", lineHeight: 1.6 }}>
                ▸ ROOM SETTINGS
              </h2>
              <PixelPanel className="p-8 flex flex-col flex-1 justify-between">
                <div>
                  {/* SECTION 1: GLOBAL ROOM CONFIG */}
                  <div className="mb-6">
                    <div className="font-display text-xs tracking-wider mb-3 pb-1 border-b border-white/10" style={{ color: "rgba(200,168,255,0.7)" }}>
                      GLOBAL SETTINGS
                    </div>

                    <Stepper
                      label="Rounds"
                      value={category === "couples" ? 10 : rounds}
                      onChange={setRounds}
                      min={3}
                      max={15}
                      disabled={category === "couples"}
                    />

                    <Stepper
                      label="Max Players"
                      value={category === "couples" ? 2 : maxPlayers}
                      onChange={setMaxPlayers}
                      min={2}
                      max={12}
                      disabled={category === "couples"}
                    />

                    <Toggle
                      label="Private Room"
                      description="Only players with room code can join"
                      checked={isPrivate}
                      onChange={setIsPrivate}
                    />

                    <Toggle
                      label="Auto Start When Full"
                      description="Automatically start the game when maximum players join"
                      checked={category === "couples" ? false : autoStartWhenFull}
                      onChange={setAutoStartWhenFull}
                      disabled={category === "couples"}
                    />

                    <Toggle
                      label="Auto-Dissolve Game (5m)"
                      description="Close room automatically if game is not completed under 5 minutes"
                      checked={autoDissolve}
                      onChange={setAutoDissolve}
                    />

                    <Toggle
                      label="Empty Room Timeout (30m)"
                      description="Close room automatically 30 minutes after last player leaves (allows reconnect)"
                      checked={autoDissolveEmpty}
                      onChange={setAutoDissolveEmpty}
                    />

                    {/* Dedicated Host Privileges Area */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">👑</span>
                        <span className="font-display text-xs tracking-wider font-bold" style={{ color: "#ffd700" }}>
                          HOST PRIVILEGES
                        </span>
                      </div>

                      <Toggle
                        label="Kick Players"
                        description="Allow host to remove players from waiting room"
                        checked={allowKick}
                        onChange={setAllowKick}
                      />

                      <Toggle
                        label="Allow Late Join"
                        description="Players joining after game start become spectators until next round"
                        checked={allowLateJoin}
                        onChange={setAllowLateJoin}
                      />
                    </div>
                  </div>

                  {/* SECTION 1.5: DRAW N GUESS CONFIG (only when general mode is selected) */}
                  {category === "general" && (
                    <div className="mb-6">
                      <div className="font-display text-xs tracking-wider mb-3 pb-1 border-b border-white/10" style={{ color: "rgba(109,213,168,0.8)" }}>
                        DRAW N GUESS OPTIONS
                      </div>

                      {/* Round Duration */}
                      <div className="flex flex-col py-3 border-b border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Round Duration</span>
                          <span className="font-display text-xs" style={{ color: "#6dd5a8" }}>{roundDuration}s</span>
                        </div>
                        <div className="flex gap-2">
                          {[60, 80, 100, 120].map(d => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setRoundDuration(d)}
                              className="flex-1 py-2 rounded-lg font-body text-sm border transition-all duration-200 cursor-pointer"
                              style={{
                                background: roundDuration === d ? "rgba(109,213,168,0.12)" : "rgba(255,255,255,0.03)",
                                borderColor: roundDuration === d ? "#6dd5a8" : "rgba(255,255,255,0.12)",
                                color: roundDuration === d ? "#6dd5a8" : "rgba(255,255,255,0.6)",
                                boxShadow: roundDuration === d ? "0 0 16px rgba(109,213,168,0.3)" : "none",
                                fontWeight: roundDuration === d ? "bold" : "normal"
                              }}
                            >
                              {d}s
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Word Difficulty */}
                      <div className="flex flex-col py-3 border-b border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Word Difficulty</span>
                          <span className="font-display text-xs capitalize" style={{ color: "#6dd5a8" }}>{wordDifficulty}</span>
                        </div>
                        <div className="flex rounded-lg overflow-hidden bg-black/30 border border-white/10 p-0.5 w-full font-body text-xs">
                          {["easy", "medium", "hard", "mixed"].map(diff => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setWordDifficulty(diff)}
                              className="flex-1 py-2 text-center rounded transition-all duration-200 cursor-pointer capitalize"
                              style={{
                                background: wordDifficulty === diff ? "rgba(109,213,168,0.15)" : "transparent",
                                color: wordDifficulty === diff ? "#6dd5a8" : "rgba(255,255,255,0.6)",
                                fontWeight: wordDifficulty === diff ? "bold" : "normal"
                              }}
                            >
                              {diff}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Hint Reveals */}
                      <Toggle
                        label="Hint Reveals"
                        description="When enabled, 1-2 letters are revealed as time runs low"
                        checked={enableHints}
                        onChange={setEnableHints}
                      />
                    </div>
                  )}

                  {/* SECTION 1.6: ANIMAL QUIZ CONFIG (only when kids mode is selected) */}
                  {category === "kids" && (
                    <div className="mb-6">
                      <div className="font-display text-xs tracking-wider mb-3 pb-1 border-b border-white/10" style={{ color: "rgba(132,200,255,0.8)" }}>
                        ANIMAL QUIZ OPTIONS
                      </div>

                      {/* Answer Time */}
                      <div className="flex flex-col py-3 border-b border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Answer Time</span>
                          <span className="font-display text-xs" style={{ color: "#84c8ff" }}>{quizAnswerTime}s</span>
                        </div>
                        <div className="flex gap-2">
                          {[10, 15, 20, 30].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setQuizAnswerTime(t)}
                              className="flex-1 py-2 rounded-lg font-body text-sm border transition-all duration-200 cursor-pointer"
                              style={{
                                background: quizAnswerTime === t ? "rgba(132,200,255,0.12)" : "rgba(255,255,255,0.03)",
                                borderColor: quizAnswerTime === t ? "#84c8ff" : "rgba(255,255,255,0.12)",
                                color: quizAnswerTime === t ? "#84c8ff" : "rgba(255,255,255,0.6)",
                                boxShadow: quizAnswerTime === t ? "0 0 16px rgba(132,200,255,0.3)" : "none",
                                fontWeight: quizAnswerTime === t ? "bold" : "normal"
                              }}
                            >
                              {t}s
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Difficulty */}
                      <div className="flex flex-col py-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Difficulty</span>
                          <span className="font-display text-xs capitalize" style={{ color: "#84c8ff" }}>
                            {quizDifficulty === "common" ? "Common" : quizDifficulty === "expert" ? "Expert" : "Mixed"}
                          </span>
                        </div>
                        <div className="flex rounded-lg overflow-hidden bg-black/30 border border-white/10 p-0.5 w-full font-body text-xs mb-2">
                          {["common", "mixed", "expert"].map(diff => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() => setQuizDifficulty(diff)}
                              className="flex-1 py-2 text-center rounded transition-all duration-200 cursor-pointer capitalize"
                              style={{
                                background: quizDifficulty === diff ? "rgba(132,200,255,0.15)" : "transparent",
                                color: quizDifficulty === diff ? "#84c8ff" : "rgba(255,255,255,0.6)",
                                fontWeight: quizDifficulty === diff ? "bold" : "normal"
                              }}
                            >
                              {diff === "common" ? "Common" : diff === "expert" ? "Expert" : "Mixed"}
                            </button>
                          ))}
                        </div>

                        {/* Segment Description */}
                        <div className="font-body text-xs text-white/40 leading-relaxed bg-black/10 p-2.5 rounded border border-white/5">
                          {quizDifficulty === "common" && <><PixelEmoji>🐾</PixelEmoji> Common: Dog, Cat, Horse, Lion, Cow, Chicken...</>}
                          {quizDifficulty === "mixed" && <><PixelEmoji>🦁</PixelEmoji> Mixed: Common + uncommon animals</>}
                          {quizDifficulty === "expert" && <><PixelEmoji>🦄</PixelEmoji> Expert: Look-alikes and rare species</>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 1.7: COUPLES MODE CONFIG (only when couples mode is selected) */}
                  {category === "couples" && (
                    <div className="mb-6">
                      <div className="font-display text-xs tracking-wider mb-3 pb-1 border-b border-white/10" style={{ color: "rgba(255,153,204,0.8)" }}>
                        COUPLES OPTIONS
                      </div>

                      {/* Locked Settings Info */}
                      <div className="grid grid-cols-2 gap-3 mb-4 font-body">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-white/40">Rounds</span>
                            <span className="font-display text-sm text-[#ff99cc]">10 Rounds</span>
                          </div>
                          <span className="text-white/30 text-xs"><PixelEmoji>🔒</PixelEmoji> Locked</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-white/40">Players</span>
                            <span className="font-display text-sm text-[#ff99cc]">2 Players</span>
                          </div>
                          <span className="text-white/30 text-xs"><PixelEmoji>🔒</PixelEmoji> Locked</span>
                        </div>
                      </div>

                      {/* Question Intensity */}
                      <div className="flex flex-col py-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Question Intensity</span>
                          <span className="font-display text-xs capitalize" style={{ color: "#ff99cc" }}>
                            {couplesIntensity}
                          </span>
                        </div>
                        <div className="flex rounded-lg overflow-hidden bg-black/30 border border-white/10 p-0.5 w-full font-body text-xs mb-2">
                          {["sweet", "mixed", "spicy"].map(intensity => (
                            <button
                              key={intensity}
                              type="button"
                              onClick={() => setCouplesIntensity(intensity)}
                              className="flex-1 py-2 text-center rounded transition-all duration-200 cursor-pointer capitalize"
                              style={{
                                background: couplesIntensity === intensity ? "rgba(255,153,204,0.15)" : "transparent",
                                color: couplesIntensity === intensity ? "#ff99cc" : "rgba(255,255,255,0.6)",
                                fontWeight: couplesIntensity === intensity ? "bold" : "normal"
                              }}
                            >
                              {intensity}
                            </button>
                          ))}
                        </div>

                        {/* Intensity Description */}
                        <div className="font-body text-xs text-white/40 leading-relaxed bg-black/10 p-2.5 rounded border border-white/5">
                          {couplesIntensity === "sweet" && <><PixelEmoji>💛</PixelEmoji> Sweet: Cute and wholesome questions.</>}
                          {couplesIntensity === "mixed" && <><PixelEmoji>💕</PixelEmoji> Mixed: Balanced fun.</>}
                          {couplesIntensity === "spicy" && <><PixelEmoji>🌶️</PixelEmoji> Spicy: Includes deeper and more challenging questions.</>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 1.8: MUSIC QUIZ CONFIG (only when music mode is selected) */}
                  {category === "music" && (
                    <div className="mb-6">
                      <div className="font-display text-xs tracking-wider mb-3 pb-1 border-b border-white/10" style={{ color: "rgba(200,168,255,0.8)" }}>
                        MUSIC QUIZ OPTIONS
                      </div>

                      {/* Answer Time */}
                      <div className="flex flex-col py-3 border-b border-white/5">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Answer Time</span>
                          <span className="font-display text-xs" style={{ color: "#c8a8ff" }}>{musicAnswerTime}s</span>
                        </div>
                        <div className="flex gap-2">
                          {[10, 15, 20].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setMusicAnswerTime(t)}
                              className="flex-1 py-2 rounded-lg font-body text-sm border transition-all duration-200 cursor-pointer"
                              style={{
                                background: musicAnswerTime === t ? "rgba(200,168,255,0.12)" : "rgba(255,255,255,0.03)",
                                borderColor: musicAnswerTime === t ? "#c8a8ff" : "rgba(255,255,255,0.12)",
                                color: musicAnswerTime === t ? "#c8a8ff" : "rgba(255,255,255,0.6)",
                                boxShadow: musicAnswerTime === t ? "0 0 16px rgba(200,168,255,0.3)" : "none",
                                fontWeight: musicAnswerTime === t ? "bold" : "normal"
                              }}
                            >
                              {t}s
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Genre */}
                      <div className="flex flex-col py-3">
                        <div className="flex justify-between mb-2">
                          <span className="font-body text-base text-white/80">Genre</span>
                          <span className="font-display text-xs capitalize" style={{ color: "#c8a8ff" }}>
                            {musicGenre === "mixed" ? "Mixed" : musicGenre}
                          </span>
                        </div>
                        <div className="flex rounded-lg overflow-hidden bg-black/30 border border-white/10 p-0.5 w-full font-body text-xs mb-2">
                          {["pop", "bollywood", "rock", "mixed"].map(g => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => setMusicGenre(g)}
                              className="flex-1 py-2 text-center rounded transition-all duration-200 cursor-pointer capitalize"
                              style={{
                                background: musicGenre === g ? "rgba(200,168,255,0.15)" : "transparent",
                                color: musicGenre === g ? "#c8a8ff" : "rgba(255,255,255,0.6)",
                                fontWeight: musicGenre === g ? "bold" : "normal"
                              }}
                            >
                              {g}
                            </button>
                          ))}
                        </div>

                        {/* Genre Description */}
                        <div className="font-body text-xs text-white/40 leading-relaxed bg-black/10 p-2.5 rounded border border-white/5">
                          {musicGenre === "pop" && <><PixelEmoji>🎤</PixelEmoji> Pop: Modern pop hits, Sade, Joji, etc.</>}
                          {musicGenre === "bollywood" && <><PixelEmoji>🎬</PixelEmoji> Bollywood: Classic & modern Hindi film songs.</>}
                          {musicGenre === "rock" && <><PixelEmoji>🎸</PixelEmoji> Rock: Led Zeppelin, Guns N' Roses, Pink Floyd, etc.</>}
                          {musicGenre === "mixed" && <><PixelEmoji>🎵</PixelEmoji> Mixed: Shuffled tracks from all genres.</>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION 2: DYNAMIC CATEGORY-SPECIFIC DETAILS */}
                  <div className="mt-4 rounded-2xl p-5 border" style={{
                    background: category === "general" ? "rgba(109,213,168,0.04)" :
                      category === "kids" ? "rgba(132,200,255,0.04)" :
                        category === "couples" ? "rgba(255,153,204,0.04)" :
                          "rgba(200,168,255,0.04)",
                    borderColor: category === "general" ? "rgba(109,213,168,0.15)" :
                      category === "kids" ? "rgba(132,200,255,0.15)" :
                        category === "couples" ? "rgba(255,153,204,0.15)" :
                          "rgba(200,168,255,0.15)"
                  }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">
                        <PixelEmoji>
                          {category === "general" ? "🎨" :
                            category === "kids" ? "🐾" :
                              category === "couples" ? "💕" :
                                "🎵"}
                        </PixelEmoji>
                      </span>
                      <span className="font-display text-xs" style={{
                        color: category === "general" ? "#6dd5a8" :
                          category === "kids" ? "#84c8ff" :
                            category === "couples" ? "#ff99cc" :
                              "#c8a8ff",
                        lineHeight: 1.6
                      }}>
                        {category === "general" ? "DRAW N GUESS MODE" :
                          category === "kids" ? "ANIMAL QUIZ MODE" :
                            category === "couples" ? "COUPLES MODE" :
                              "MUSIC QUIZ MODE"}
                      </span>
                    </div>

                    <ul className="font-body text-sm text-white/50 space-y-1.5 list-none pr-1">
                      {category === "general" && (
                        <>
                          <li>• <span className="text-white/70">{roundDuration} seconds</span> per round to sketch your word.</li>
                          <li>• Guessing words from the <span className="text-[#6dd5a8] capitalize">{wordDifficulty}</span> library.</li>
                          <li>• Hint reveals are <span className="text-white/70">{enableHints ? "enabled" : "disabled"}</span>.</li>
                        </>
                      )}
                      {category === "kids" && (
                        <>
                          <li>• <span className="text-white/70">{quizAnswerTime} seconds</span> per animal to identify the image.</li>
                          <li>• Difficulty set to <span className="text-[#84c8ff] capitalize">{quizDifficulty}</span> animals.</li>
                          <li>• Images start zoomed/pixelated and reveal slowly.</li>
                        </>
                      )}
                      {category === "music" && (
                        <>
                          <li>• <span className="text-white/70">25 seconds</span> to choose the correct song from lyric snippets.</li>
                          <li>• Shuffled multiple-choice options.</li>
                          <li>• <span className="text-white/70">10 seconds</span> audio and cover display.</li>
                        </>
                      )}
                      {category === "couples" && (
                        <>
                          <li>• Cooperative game designed for <span className="text-white/70">exactly 2 players</span>.</li>
                          <li>• One partner answers secretly; the other partner guesses.</li>
                          <li>• 10 questions with <span className="text-[#ff99cc] capitalize">{couplesIntensity}</span> intensity.</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <PixelButton
                    onClick={handleCreateRoom}
                    disabled={loading}
                    background={loading ? "linear-gradient(135deg, #2b2b2d, #1c1c1e)" : "linear-gradient(135deg, #444446, #0f0f11)"}
                    borderColor={loading ? "rgba(255, 255, 255, 0.1)" : "#555557"}
                    textColor="white"
                    className="w-full text-base"
                    style={{ padding: "18px" }}
                  >
                    {loading ? <>Creating… <PixelEmoji>✨</PixelEmoji></> : <>Create Room <PixelEmoji>🚀</PixelEmoji></>}
                  </PixelButton>
                </div>
              </PixelPanel>
            </div>

          </div>
        )}

        {/* ── JOIN TAB ── */}
        {tab === "join" && (
          <div className="slide-up flex flex-col items-center w-full">
            <h2 className="font-display text-xs mb-5 text-center tracking-[3px]" style={{ color: "#c8a8ff", lineHeight: 1.6 }}>
              ▸ JOIN A ROOM
            </h2>
            <PixelPanel className="w-full max-w-lg p-10">
              <p className="font-body text-base mb-8 text-center" style={{ color: "rgba(200,168,255,0.45)" }}>
                Got a code from a friend? Enter it below.
              </p>
              <input
                type="text"
                placeholder="ENTER CODE"
                maxLength={6}
                value={joinCode}
                onChange={e => setJoinCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && handleJoinRoom()}
                autoComplete="off"
                className="w-full px-4 py-8 font-display text-2xl text-center mb-8 cursor-target"
                style={{
                  background: "rgba(200,168,255,0.05)",
                  border: "1px solid rgba(200,168,255,0.2)",
                  color: "#f0e0ff",
                  outline: "none",
                  letterSpacing: "0.6em",
                }} />
              <PixelButton
                onClick={handleJoinRoom}
                background="linear-gradient(135deg,#84c8ff,#4d80ff)"
                borderColor="#0a0612"
                textColor="white"
                className="w-full text-base"
                style={{ padding: "18px" }}
              >
                Let's Go! <PixelEmoji>🎮</PixelEmoji>
              </PixelButton>
            </PixelPanel>
          </div>
        )}

        {/* ── PUBLIC ROOMS TAB ── */}
        {tab === "public" && (
          <div className="slide-up w-full">
            <div className="flex items-center justify-between mb-5 w-full px-2">
              <h2 className="font-display text-xs tracking-[3px]" style={{ color: "#c8a8ff", lineHeight: 1.6 }}>
                ▸ OPEN ROOMS
              </h2>
              <PixelButton
                onClick={fetchPublicRooms}
                background="linear-gradient(135deg,#2a1a4d,#4d2a7a)"
                borderColor="#c8a8ff"
                textColor="#f0e0ff"
                className="px-5 py-2 text-xs"
              >
                <PixelEmoji>🔄</PixelEmoji> Refresh
              </PixelButton>
            </div>

            {publicRooms.length === 0 ? (
              <PixelPanel className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4 float"><PixelEmoji>🎪</PixelEmoji></div>
                <p className="font-display text-xs" style={{ color: "#f0e0ff", lineHeight: 1.6 }}>
                  No rooms yet!
                </p>
                <p className="font-body text-base mt-2" style={{ color: "rgba(200,168,255,0.35)" }}>
                  Be the first — create a room above.
                </p>
              </PixelPanel>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
                {publicRooms.map(room => {
                  const catColors = {
                    general: { bg: "rgba(26,77,26,0.5)", border: "#6dd5a8" },
                    kids: { bg: "rgba(26,58,77,0.5)", border: "#84c8ff" },
                    couples: { bg: "rgba(77,26,51,0.5)", border: "#ff99cc" },
                    music: { bg: "rgba(42,26,77,0.5)", border: "#c8a8ff" },
                  };
                  const cc = catColors[room.category] || catColors.general;
                  return (
                    <PixelPanel key={room._id}
                      borderColor={`${cc.border}55`}
                      background="#000000"
                      className="p-4 flex flex-col justify-between min-h-[155px] relative overflow-hidden"
                      style={{
                        backdropFilter: "blur(12px)",
                      }}>
                      {/* Background Particles as per Category */}
                      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                        <Particles
                          particleColors={{
                            general: ["#6dd5a8", "#39ff88"],
                            kids: ["#84c8ff", "#00F0FF"],
                            couples: ["#ff99cc", "#FF007F"],
                            music: ["#c8a8ff", "#BD00FF"],
                          }[room.category] || ["#ffffff"]}
                          particleCount={25}
                          particleSpread={5}
                          speed={0.1}
                          particleBaseSize={35}
                          moveParticlesOnHover={false}
                          alphaParticles={true}
                          disableRotation={false}
                        />
                      </div>
                      <div className="relative" style={{ zIndex: 1 }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-display text-xs px-2 py-1 rounded" style={{ background: `${cc.border}22`, color: cc.border, lineHeight: 1.6 }}>
                            {room.code}
                          </span>
                          <span className="font-body text-sm px-2 py-0.5 rounded-full" style={{ background: `${cc.border}12`, color: cc.border }}>
                            <PixelEmoji>{{ general: "🎨", kids: "🐾", couples: "💕", music: "🎵" }[room.category]}</PixelEmoji>{" "}
                            {room.category === "general" ? "draw n guess" : room.category === "kids" ? "animal quiz" : room.category}
                          </span>
                        </div>
                        <p className="font-body text-sm" style={{ color: "rgba(240,224,255,0.4)" }}>
                          <PixelEmoji>👤</PixelEmoji> {room.host?.username} · <PixelEmoji>🧑‍🤝‍🧑</PixelEmoji> {room.players.length}/{room.maxPlayers}
                        </p>
                      </div>
                      <PixelButton
                        onClick={() => navigate(`/game/${room.code}`)}
                        background={`linear-gradient(135deg,${cc.border}18,${cc.border}35)`}
                        borderColor={cc.border}
                        textColor={cc.border}
                        className="w-full text-xs mt-2"
                        style={{ padding: "8px" }}
                      >
                        <span className="flex items-center gap-1.5 justify-center">
                          Join Room <PixelEmoji>🎮</PixelEmoji>
                        </span>
                      </PixelButton>
                    </PixelPanel>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── ABOUT / NEWS / HOW TO PLAY ── */}
      {tab === "create" && (
        <div className="w-full mt-20 mb-4">
          {/* Section header divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(200,168,255,0.25))" }} />
            <span className="font-display text-xs tracking-[4px]" style={{ color: "rgba(200,168,255,0.4)", lineHeight: 1.6 }}>
              ✦ DISCOVER PLAXLIO ✦
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(200,168,255,0.25))" }} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 w-full">

            {/* ── ABOUT ── */}
            <PixelPanel
              borderColor="rgba(132,200,255,0.3)"
              background="rgba(10,6,18,0.7)"
              className="p-8 flex flex-col gap-5 transition-transform hover:scale-[1.02]"
              style={{
                boxShadow: "0 8px 40px rgba(132,200,255,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl"><PixelEmoji>❓</PixelEmoji></span>
                <h2 className="font-display text-sm" style={{ color: "#84c8ff", lineHeight: 1.6 }}>About</h2>
              </div>
              <p className="font-body text-base leading-relaxed" style={{ color: "rgba(240,224,255,0.65)" }}>
                <span style={{ color: "#c8a8ff", fontWeight: 600 }}>Plaxlio</span> is a free online multiplayer party game platform where friends compete in fast-paced mini-games.
              </p>
              <p className="font-body text-base leading-relaxed" style={{ color: "rgba(240,224,255,0.55)" }}>
                Each round tests a different skill — drawing, guessing, music knowledge, or animal instincts. The player with the most points at the end wins!
              </p>
              <p className="font-body text-base leading-relaxed" style={{ color: "rgba(240,224,255,0.55)" }}>
                Invite your friends, pick a game mode, and let the fun begin. <PixelEmoji>🎉</PixelEmoji>
              </p>
              {/* Game mode chips */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {[
                  { emoji: "🎨", label: "Draw n Guess", color: "#6dd5a8" },
                  { emoji: "🐾", label: "Animal Quiz", color: "#84c8ff" },
                  { emoji: "💕", label: "Couples", color: "#ff99cc" },
                  { emoji: "🎵", label: "Music Quiz", color: "#c8a8ff" },
                ].map(m => (
                  <span
                    key={m.label}
                    className="font-body text-sm px-3 py-1 rounded-full"
                    style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}30` }}
                  >
                    <PixelEmoji>{m.emoji}</PixelEmoji> {m.label}
                  </span>
                ))}
              </div>
            </PixelPanel>

            {/* ── NEWS ── */}
            <PixelPanel
              borderColor="rgba(109,213,168,0.3)"
              background="rgba(10,6,18,0.7)"
              className="p-8 flex flex-col gap-4 transition-transform hover:scale-[1.02]"
              style={{
                boxShadow: "0 8px 40px rgba(109,213,168,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl"><PixelEmoji>📰</PixelEmoji></span>
                <h2 className="font-display text-sm" style={{ color: "#6dd5a8", lineHeight: 1.6 }}>News</h2>
              </div>

              {/* News items */}
              {[
                {
                  date: "June 2025",
                  title: "Plaxlio is Live!",
                  emoji: "🎉",
                  body: "We've launched with 4 amazing game modes — Draw n Guess, Animal Quiz, Couples, and Music Quiz. Invite your friends and start playing!",
                  accent: "#6dd5a8",
                },
                {
                  date: "Coming soon",
                  title: "More Games",
                  emoji: "🎮",
                  body: "New game modes are being crafted. Stay tuned for exciting additions to the Plaxlio universe!",
                  accent: "#c8a8ff",
                },
                {
                  date: "Coming soon",
                  title: "Mobile Support",
                  emoji: "📱",
                  body: "A fully responsive mobile experience is on the roadmap. Play on any device, anywhere.",
                  accent: "#84c8ff",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-4 flex flex-col gap-1"
                  style={{ background: `${item.accent}08`, border: `1px solid ${item.accent}20` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-display text-xs" style={{ color: item.accent, lineHeight: 1.6 }}><PixelEmoji>{item.emoji}</PixelEmoji> {item.title}</span>
                    <span className="font-body text-sm" style={{ color: "rgba(240,224,255,0.3)" }}>{item.date}</span>
                  </div>
                  <p className="font-body text-sm" style={{ color: "rgba(240,224,255,0.5)", lineHeight: 1.6 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </PixelPanel>

            {/* ── BEFORE YOU START (BounceCards component) ── */}
            <PixelPanel
              borderColor="rgba(200,168,255,0.3)"
              background="rgba(10,6,18,0.7)"
              className="p-8 flex flex-col justify-between transition-transform hover:scale-[1.02] relative overflow-hidden min-h-[460px]"
              style={{
                boxShadow: "0 8px 40px rgba(200,168,255,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl"><PixelEmoji>🏁</PixelEmoji></span>
                <h2 className="font-display text-sm" style={{ color: "#c8a8ff", lineHeight: 1.6 }}>Before You Start</h2>
              </div>

              {/* BounceCards Component */}
              <div className="flex-1 flex items-center justify-center my-6">
                <BounceCards
                  images={[
                    "/images/card1.png",
                    "/images/card2.png",
                    "/images/card4.png",
                    "/images/card3.png"
                  ]}
                  captions={[
                    "1. Draw & Guess",
                    "2. Animal Quiz",
                    "3. Music Quiz",
                    "4. Couples Mode"
                  ]}
                  containerWidth={360}
                  containerHeight={280}
                  animationDelay={0.4}
                  animationStagger={0.08}
                  easeType="elastic.out(1, 0.75)"
                  transformStyles={[
                    "rotate(-8deg) translate(-100px, -6px)",
                    "rotate(-3deg) translate(-33px, 4px)",
                    "rotate(3deg) translate(33px, 4px)",
                    "rotate(8deg) translate(100px, -6px)"
                  ]}
                  enableHover={true}
                />
              </div>

              <div className="text-center w-full mt-2">
                <p className="font-body text-base" style={{ color: "rgba(200,168,255,0.45)" }}>
                  Hover over the cards to explore the steps!
                </p>
              </div>
            </PixelPanel>

          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-center gap-6 mt-12 mb-4">
        <span className="font-body text-sm" style={{ color: "rgba(200,168,255,0.25)" }}>
          © 2025 Plaxlio · Made with <PixelEmoji>💜</PixelEmoji> for gamers everywhere
        </span>
      </div>

    </div>
  );
}