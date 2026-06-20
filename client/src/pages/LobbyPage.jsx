import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import LiquidGlassTabs from "../components/LiquidGlassTabs";
import PixelButton from "../components/PixelButton";

const CATEGORIES = [
  { id:"general", label:"🎨 Draw n Guess", desc:"Classic drawing game",   bg:"linear-gradient(135deg,#1a4d1a,#2d7a2d)", border:"#6dd5a8" },
  { id:"kids",    label:"🐾 Animal Quiz",  desc:"Guess the animal pic",   bg:"linear-gradient(135deg,#1a3a4d,#1a5a7a)", border:"#84c8ff" },
  { id:"couples", label:"💕 Couples",      desc:"Cute & romantic picks",  bg:"linear-gradient(135deg,#4d1a33,#7a2050)", border:"#ff99cc" },
  { id:"music",   label:"🎵 Music",        desc:"Guess the song lyric",   bg:"linear-gradient(135deg,#2a1a4d,#4d2a7a)", border:"#c8a8ff" },
];

export default function LobbyPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]           = useState("create"); 
  const [category, setCategory] = useState("general");
  const [rounds, setRounds]     = useState(5);
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [isPrivate, setIsPrivate]   = useState(false);
  const [joinCode, setJoinCode]     = useState("");
  const [publicRooms, setPublicRooms] = useState([]);
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    refreshUser();
    fetchPublicRooms();
  }, []);

  const fetchPublicRooms = async () => {
    try {
      const { data } = await axios.get("/api/room/public");
      setPublicRooms(data.rooms);
    } catch {}
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const isCouples = category === "couples";
      const { data } = await axios.post("/api/room/create", {
        category,
        maxPlayers: isCouples ? 2 : maxPlayers,
        isPrivate,
        totalRounds: isCouples ? 10 : rounds,
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
      <div className="relative z-10 page-container pb-16 pt-8 flex flex-col items-center">

        {/* 1. WELCOME CARD */}
        <div className="w-full glass-panel rounded-3xl p-8 mb-10 flex flex-col items-center justify-center text-center transition-transform hover:scale-[1.01] hover:shadow-[0_8px_40px_rgba(200,168,255,0.15)]">
          <p className="font-display text-3xl mb-3 text-glow-soft tracking-wider" style={{ color: "#f0e0ff" }}>
            Hey, {user?.username}! 👋
          </p>
          <div className="flex items-center justify-center gap-5 font-body text-lg" style={{ color: "rgba(240,224,255,0.8)" }}>
            <span className="flex items-center gap-2">
              <span className="text-[#f0c840] drop-shadow-[0_0_8px_rgba(240,200,64,0.6)]">⭐</span>
              {user?.totalPoints || 0} Points
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-2">
              <span className="text-[#6dd5a8] drop-shadow-[0_0_8px_rgba(109,213,168,0.6)]">🎮</span>
              {user?.gamesPlayed || 0} Games Played
            </span>
          </div>
          
          {user?.badges?.length > 0 && (
            <div className="flex gap-3 mt-5 pt-5 border-t border-white/10 w-[60%] justify-center">
              {user.badges.map(b => (
                <span key={b} className="text-2xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" title={b}>
                  {{ first_win:"🏆", streak_3:"🔥", points_500:"⭐", points_1000:"💎", social_butterfly:"🦋" }[b]}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex justify-center mb-10 w-full">
          <LiquidGlassTabs
            activeTab={tab}
            onChange={setTab}
            tabs={[
              { id: "create", label: "✨ Create" },
              { id: "join",   label: "🔗 Join" },
              { id: "public", label: "🌐 Browse" },
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
                <h2 className="font-display text-xs mb-5 text-center tracking-[3px]" style={{ color:"#c8a8ff", lineHeight: 1.6 }}>
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
                      className="flex-col items-start w-full h-full"
                      style={{
                        padding: "22px 18px",
                        boxShadow: category === c.id ? `0 0 24px ${c.border}55, 0 8px 32px rgba(0,0,0,0.3)` : "0 4px 16px rgba(0,0,0,0.2)",
                        outline: category === c.id ? `2px solid ${c.border}` : "none",
                        outlineOffset: "3px",
                        minHeight: "120px",
                      }}
                    >
                      <div className="font-display text-xs mb-2" style={{ color: c.border, lineHeight: 1.6 }}>
                        {c.label}
                      </div>
                      <div className="font-body text-base" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {c.desc}
                      </div>
                    </PixelButton>
                  ))}
                </div>
              </div>

              {/* Right Column: Room Settings */}
              <div className="flex flex-col w-full h-full">
                <h2 className="font-display text-xs mb-5 text-center tracking-[3px]" style={{ color:"#c8a8ff", lineHeight: 1.6 }}>
                  ▸ ROOM SETTINGS
                </h2>
                <div className="rounded-3xl p-8 flex flex-col flex-1 justify-between glass-panel">
                  <div>
                    {category === "couples" ? (
                      <div className="mb-8 p-6 rounded-xl text-center" style={{ background:"rgba(255,99,153,0.08)", border:"1px solid #ff99cc33" }}>
                        <div className="text-4xl mb-3">💕</div>
                        <p className="font-display text-xs mb-2" style={{ color:"#ff99cc", lineHeight: 1.6 }}>Couples Mode</p>
                        <p className="font-body text-base" style={{ color:"rgba(255,255,255,0.5)" }}>2 players · 10 rounds · 5 questions each</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-8">
                          <div className="flex justify-between mb-3">
                            <label className="font-body text-base" style={{ color:"rgba(255,255,255,0.45)" }}>Rounds</label>
                            <span className="font-display text-sm" style={{ color:"#c878ff", lineHeight: 1.6 }}>{rounds}</span>
                          </div>
                          <input type="range" min={3} max={10} value={rounds} onChange={e => setRounds(+e.target.value)} className="w-full" style={{ accentColor:"#c878ff" }} />
                          <div className="flex justify-between mt-1">
                            <span className="font-body text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>3</span>
                            <span className="font-body text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>10</span>
                          </div>
                        </div>

                        <div className="mb-8">
                          <div className="flex justify-between mb-3">
                            <label className="font-body text-base" style={{ color:"rgba(255,255,255,0.45)" }}>Max players</label>
                            <span className="font-display text-sm" style={{ color:"#c878ff", lineHeight: 1.6 }}>{maxPlayers}</span>
                          </div>
                          <input type="range" min={2} max={12} value={maxPlayers} onChange={e => setMaxPlayers(+e.target.value)} className="w-full" style={{ accentColor:"#c878ff" }} />
                          <div className="flex justify-between mt-1">
                            <span className="font-body text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>2</span>
                            <span className="font-body text-xs" style={{ color:"rgba(255,255,255,0.2)" }}>12</span>
                          </div>
                        </div>
                      </>
                    )}

                    <label className="flex items-center justify-between cursor-pointer mb-8 px-1 cursor-target">
                      <span className="font-body text-base" style={{ color:"rgba(255,255,255,0.55)" }}>Private room</span>
                      <div onClick={() => setIsPrivate(p => !p)} className="w-12 h-7 rounded-full relative transition-all cursor-pointer" style={{ background: isPrivate ? "#c878ff" : "rgba(255,255,255,0.12)" }}>
                        <div className="absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: isPrivate ? "calc(100% - 24px)" : "4px" }} />
                      </div>
                    </label>
                  </div>

                  <PixelButton
                    onClick={handleCreateRoom}
                    disabled={loading}
                    background={loading ? "linear-gradient(135deg,#3a2050,#2a1540)" : "linear-gradient(135deg,#c878ff,#7c4dff)"}
                    borderColor={loading ? "rgba(200,168,255,0.2)" : "#0a0612"}
                    textColor="white"
                    className="w-full text-xs"
                    style={{ padding: "18px" }}
                  >
                    {loading ? "Creating… ✨" : "Create Room 🚀"}
                  </PixelButton>
                </div>
              </div>

            </div>
          )}

          {/* ── JOIN TAB ── */}
          {tab === "join" && (
            <div className="slide-up flex flex-col items-center w-full">
              <h2 className="font-display text-xs mb-5 text-center tracking-[3px]" style={{ color:"#c8a8ff", lineHeight: 1.6 }}>
                ▸ JOIN A ROOM
              </h2>
              <div className="w-full max-w-lg p-10 rounded-3xl glass-panel">
                <p className="font-body text-base mb-8 text-center" style={{ color:"rgba(200,168,255,0.45)" }}>
                  Got a code from a friend? Enter it below.
                </p>
                <input
                  type="text"
                  placeholder="ENTER CODE"
                  maxLength={6}
                  value={joinCode}
                  onChange={e => setJoinCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && handleJoinRoom()}
                  className="w-full px-4 py-5 font-display text-2xl text-center mb-8 cursor-target"
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
                  className="w-full text-xs"
                  style={{ padding: "18px" }}
                >
                  Let's Go! 🎮
                </PixelButton>
              </div>
            </div>
          )}

          {/* ── PUBLIC ROOMS TAB ── */}
          {tab === "public" && (
            <div className="slide-up w-full">
              <div className="flex items-center justify-between mb-5 w-full px-2">
                <h2 className="font-display text-xs tracking-[3px]" style={{ color:"#c8a8ff", lineHeight: 1.6 }}>
                  ▸ OPEN ROOMS
                </h2>
                <PixelButton
                  onClick={fetchPublicRooms}
                  background="linear-gradient(135deg,#2a1a4d,#4d2a7a)"
                  borderColor="#c8a8ff"
                  textColor="#f0e0ff"
                  className="px-5 py-2 text-xs"
                >
                  🔄 Refresh
                </PixelButton>
              </div>

              {publicRooms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 rounded-3xl glass-panel text-center">
                  <div className="text-6xl mb-4 float">🎪</div>
                  <p className="font-display text-xs" style={{ color:"#f0e0ff", lineHeight: 1.6 }}>
                    No rooms yet!
                  </p>
                  <p className="font-body text-base mt-2" style={{ color:"rgba(200,168,255,0.35)" }}>
                    Be the first — create a room above.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
                  {publicRooms.map(room => {
                    const catColors = {
                      general: { bg:"rgba(26,77,26,0.5)",  border:"#6dd5a8" },
                      kids:    { bg:"rgba(26,58,77,0.5)",  border:"#84c8ff" },
                      couples: { bg:"rgba(77,26,51,0.5)",  border:"#ff99cc" },
                      music:   { bg:"rgba(42,26,77,0.5)",  border:"#c8a8ff" },
                    };
                    const cc = catColors[room.category] || catColors.general;
                    return (
                      <div key={room._id} className="rounded-2xl p-5 flex flex-col justify-between min-h-[185px]"
                        style={{
                          background: cc.bg,
                          border: `1px solid ${cc.border}33`,
                          backdropFilter: "blur(12px)",
                        }}>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-display text-xs px-2 py-1 rounded" style={{ background:`${cc.border}22`, color: cc.border, lineHeight: 1.6 }}>
                              {room.code}
                            </span>
                            <span className="font-body text-sm px-2 py-0.5 rounded-full" style={{ background:`${cc.border}12`, color: cc.border }}>
                              {{general:"🎨",kids:"🐾",couples:"💕",music:"🎵"}[room.category]}{" "}
                              {room.category === "general" ? "draw n guess" : room.category === "kids" ? "animal quiz" : room.category}
                            </span>
                          </div>
                          <p className="font-body text-sm" style={{ color:"rgba(240,224,255,0.4)" }}>
                            👤 {room.host?.username} · 🧑‍🤝‍🧑 {room.players.length}/{room.maxPlayers}
                          </p>
                        </div>
                        <PixelButton
                          onClick={() => navigate(`/game/${room.code}`)}
                          background={`linear-gradient(135deg,${cc.border}18,${cc.border}35)`}
                          borderColor={cc.border}
                          textColor={cc.border}
                          className="w-full text-xs mt-3"
                          style={{ padding: "10px" }}
                        >
                          Join Room 🎮
                        </PixelButton>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── ABOUT / NEWS / HOW TO PLAY ── */}
        <div className="w-full mt-20 mb-4">
          {/* Section header divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(200,168,255,0.25))" }} />
            <span className="font-display text-xs tracking-[4px]" style={{ color: "rgba(200,168,255,0.4)", lineHeight: 1.6 }}>
              ✦ DISCOVER PLAYLIO ✦
            </span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(200,168,255,0.25))" }} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6 w-full">

            {/* ── ABOUT ── */}
            <div
              className="rounded-3xl p-8 flex flex-col gap-5 transition-transform hover:scale-[1.02]"
              style={{
                background: "rgba(10,6,18,0.7)",
                border: "1.5px solid rgba(132,200,255,0.2)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(132,200,255,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">❓</span>
                <h2 className="font-display text-sm" style={{ color: "#84c8ff", lineHeight: 1.6 }}>About</h2>
              </div>
              <p className="font-body text-base leading-relaxed" style={{ color: "rgba(240,224,255,0.65)" }}>
                <span style={{ color: "#c8a8ff", fontWeight: 600 }}>Playlio</span> is a free online multiplayer party game platform where friends compete in fast-paced mini-games.
              </p>
              <p className="font-body text-base leading-relaxed" style={{ color: "rgba(240,224,255,0.55)" }}>
                Each round tests a different skill — drawing, guessing, music knowledge, or animal instincts. The player with the most points at the end wins!
              </p>
              <p className="font-body text-base leading-relaxed" style={{ color: "rgba(240,224,255,0.55)" }}>
                Invite your friends, pick a game mode, and let the fun begin. 🎉
              </p>
              {/* Game mode chips */}
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {[
                  { label: "🎨 Draw n Guess", color: "#6dd5a8" },
                  { label: "🐾 Animal Quiz", color: "#84c8ff" },
                  { label: "💕 Couples",      color: "#ff99cc" },
                  { label: "🎵 Music Quiz",   color: "#c8a8ff" },
                ].map(m => (
                  <span
                    key={m.label}
                    className="font-body text-sm px-3 py-1 rounded-full"
                    style={{ background: `${m.color}15`, color: m.color, border: `1px solid ${m.color}30` }}
                  >
                    {m.label}
                  </span>
                ))}
              </div>
            </div>

            {/* ── NEWS ── */}
            <div
              className="rounded-3xl p-8 flex flex-col gap-4 transition-transform hover:scale-[1.02]"
              style={{
                background: "rgba(10,6,18,0.7)",
                border: "1.5px solid rgba(109,213,168,0.2)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(109,213,168,0.06)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">📰</span>
                <h2 className="font-display text-sm" style={{ color: "#6dd5a8", lineHeight: 1.6 }}>News</h2>
              </div>

              {/* News items */}
              {[
                {
                  date: "June 2025",
                  title: "🎉 Playlio is Live!",
                  body: "We've launched with 4 amazing game modes — Draw n Guess, Animal Quiz, Couples, and Music Quiz. Invite your friends and start playing!",
                  accent: "#6dd5a8",
                },
                {
                  date: "Coming soon",
                  title: "🎮 More Games",
                  body: "New game modes are being crafted. Stay tuned for exciting additions to the Playlio universe!",
                  accent: "#c8a8ff",
                },
                {
                  date: "Coming soon",
                  title: "📱 Mobile Support",
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
                    <span className="font-display text-xs" style={{ color: item.accent, lineHeight: 1.6 }}>{item.title}</span>
                    <span className="font-body text-sm" style={{ color: "rgba(240,224,255,0.3)" }}>{item.date}</span>
                  </div>
                  <p className="font-body text-sm" style={{ color: "rgba(240,224,255,0.5)", lineHeight: 1.6 }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {/* ── HOW TO PLAY (placeholder) ── */}
            <div
              className="rounded-3xl p-8 flex flex-col gap-5 transition-transform hover:scale-[1.02] relative overflow-hidden"
              style={{
                background: "rgba(10,6,18,0.7)",
                border: "1.5px solid rgba(200,168,255,0.2)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 8px 40px rgba(200,168,255,0.06)",
              }}
            >
              {/* Coming soon badge */}
              <div
                className="absolute top-4 right-4 font-display text-xs px-3 py-1 rounded-full"
                style={{
                  background: "rgba(200,168,255,0.12)",
                  color: "#c8a8ff",
                  border: "1px solid rgba(200,168,255,0.3)",
                  lineHeight: 1.6,
                  fontSize: "9px",
                  letterSpacing: "2px",
                }}
              >
                COMING SOON
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl">🎓</span>
                <h2 className="font-display text-sm" style={{ color: "#c8a8ff", lineHeight: 1.6 }}>How to Play</h2>
              </div>

              {/* Placeholder steps */}
              <div className="flex flex-col gap-3 mt-2">
                {[
                  { step: "01", label: "Pick a Game Mode", icon: "🎮" },
                  { step: "02", label: "Create or Join a Room", icon: "🚪" },
                  { step: "03", label: "Invite Your Friends", icon: "👥" },
                  { step: "04", label: "Compete & Win Points", icon: "🏆" },
                ].map(s => (
                  <div
                    key={s.step}
                    className="flex items-center gap-4 rounded-xl px-4 py-3"
                    style={{ background: "rgba(200,168,255,0.05)", border: "1px solid rgba(200,168,255,0.12)" }}
                  >
                    <span className="font-display text-xs" style={{ color: "rgba(200,168,255,0.35)", lineHeight: 1.6, minWidth: "20px" }}>{s.step}</span>
                    <span className="text-xl">{s.icon}</span>
                    <span className="font-body text-base" style={{ color: "rgba(240,224,255,0.4)" }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Blurred overlay to show "coming soon" feel */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 flex items-end justify-center pb-6"
                style={{ background: "linear-gradient(to bottom, transparent, rgba(10,6,18,0.85))" }}
              >
                <p className="font-display text-xs" style={{ color: "rgba(200,168,255,0.4)", lineHeight: 1.6, letterSpacing: "2px" }}>
                  Full guide dropping soon ✨
                </p>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-center gap-6 mt-12 mb-4">
            <span className="font-body text-sm" style={{ color: "rgba(200,168,255,0.25)" }}>
              © 2025 Playlio · Made with 💜 for gamers everywhere
            </span>
          </div>
        </div>

      </div>
  );
}