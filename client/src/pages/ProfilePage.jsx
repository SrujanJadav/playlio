import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BADGE_META = {
  first_win:        { icon:"🏆", label:"First Win",         desc:"Won your first game!" },
  streak_3:         { icon:"🔥", label:"On Fire",           desc:"3 correct guesses in a row!" },
  points_500:       { icon:"⭐", label:"Rising Star",       desc:"Earned 500 points total" },
  points_1000:      { icon:"💎", label:"Diamond Player",    desc:"Earned 1000 points total" },
  social_butterfly: { icon:"🦋", label:"Social Butterfly",  desc:"Made 5 or more friends" },
};

const ALL_BADGES = Object.keys(BADGE_META);

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [search,  setSearch]  = useState("");
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    refreshUser();
    // Load incoming friend requests
    if (user?.friendRequests) {
      setRequests(user.friendRequests.filter(r => r.status === "pending"));
    }
  }, []);

  const handleSearch = async () => {
    if (search.trim().length < 2) return;
    try {
      const { data } = await axios.get(`/api/user/search?q=${search}`);
      setResults(data.users);
    } catch { toast.error("Search failed"); }
  };

  const sendFriendRequest = async (id) => {
    try {
      await axios.post(`/api/user/friend-request/${id}`);
      toast.success("Friend request sent! 🦋");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed");
    }
  };

  const acceptFriendRequest = async (fromId) => {
    try {
      await axios.post(`/api/user/friend-request/${fromId}/accept`);
      toast.success("Friend added! 🎉");
      refreshUser();
    } catch { toast.error("Failed to accept"); }
  };

  return (
      <div className="relative z-10 page-container py-10 flex flex-col items-center">
        
        {/* ── CONSTRAINED CONTENT WRAPPER (1100px Max-Width) ── */}
        <div className="w-full max-w-[1100px] flex flex-col gap-8">
          
          {/* PROFILE HEADER CARD */}
          <div className="w-full glass-panel rounded-3xl p-8 text-center transition-transform hover:scale-[1.005] flex flex-col items-center">
            <div className="relative inline-block mb-4">
              <div
                style={{
                  position: "absolute",
                  inset: "-3px",
                  borderRadius: "50%",
                  boxShadow: "0 0 15px 3px rgba(200,168,255,0.4)",
                  pointerEvents: "none",
                }}
              />
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                className="w-24 h-24 rounded-full float relative z-10"
                style={{ border:"3px solid #c8a8ff" }} />
              <div className="absolute bottom-1 right-1 text-xl z-20">🎨</div>
            </div>
            <h1 className="font-display text-3xl text-glow-soft" style={{ color: "#f0e0ff" }}>
              {user?.username}
            </h1>
            <p className="font-body text-sm mt-1" style={{ color: "rgba(240,224,255,0.6)" }}>
              {user?.email}
            </p>
          </div>

          {/* STANDALONE STATS ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              { label:"Total Points", value: user?.totalPoints?.toLocaleString() ?? 0, border:"#f0c840", icon:"⭐", glow:"rgba(240,200,64,0.2)" },
              { label:"Games Played", value: user?.gamesPlayed ?? 0, border:"#84c8ff", icon:"🎮", glow:"rgba(132,200,255,0.2)" },
              { label:"Games Won",    value: user?.gamesWon ?? 0, border:"#6dd5a8", icon:"🏆", glow:"rgba(109,213,168,0.2)" },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center justify-center p-6 rounded-3xl transition-transform hover:scale-[1.02]"
                style={{
                  background: "rgba(10, 6, 18, 0.75)",
                  border:`2px solid ${s.border}`,
                  boxShadow: `0 4px 20px ${s.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  minHeight: "130px"
                }}>
                <div className="text-3xl mb-2" style={{ filter: `drop-shadow(0 0 8px ${s.border})` }}>{s.icon}</div>
                <div className="font-display text-2xl text-glow-soft" style={{ color: "#f0e0ff" }}>{s.value}</div>
                <div className="font-body text-sm font-semibold tracking-wide" style={{ color: "rgba(240,224,255,0.5)" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* BADGES SECTION */}
          <div className="p-8 rounded-3xl glass-panel w-full">
            <h2 className="font-display text-xl mb-6 flex items-center gap-2" style={{ color:"#c8a8ff" }}>
              <span>🏅</span> Badges
            </h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
              {ALL_BADGES.map(b => {
                const meta    = BADGE_META[b];
                const earned  = user?.badges?.includes(b);
                return (
                  <div key={b}
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl text-center transition-all hover:scale-[1.03]"
                    style={{
                      background: earned ? "rgba(240,200,64,0.12)" : "rgba(255,255,255,0.02)",
                      border: `2px solid ${earned ? "#f0c840" : "rgba(200,168,255,0.15)"}`,
                      boxShadow: earned ? "0 0 15px rgba(240,200,64,0.2)" : "none",
                      opacity: earned ? 1 : 0.35,
                      filter: earned ? "none" : "grayscale(0.8)",
                    }}
                    title={meta.desc}>
                    <span className="text-4xl" style={{ filter: earned ? "drop-shadow(0 0 6px rgba(240,200,64,0.5))" : "none" }}>
                      {meta.icon}
                    </span>
                    <span className="font-display text-xs" style={{ color: earned ? "#f0c840" : "rgba(240,224,255,0.6)" }}>
                      {meta.label}
                    </span>
                    <span className="font-body text-[10px]" style={{ color: "rgba(240,224,255,0.4)", lineHeight: 1.2 }}>
                      {meta.desc}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FRIEND REQUESTS SECTION */}
          {user?.friendRequests?.filter(r => r.status === "pending").length > 0 && (
            <div className="p-8 rounded-3xl glass-panel w-full"
              style={{ borderColor: "rgba(109,213,168,0.4)", boxShadow: "0 0 20px rgba(109,213,168,0.1)" }}>
              <h2 className="font-display text-xl mb-6 flex items-center gap-2" style={{ color:"#6dd5a8" }}>
                <span>🔔</span> Friend Requests
              </h2>
              <div className="space-y-3">
                {user.friendRequests.filter(r => r.status === "pending").map(r => (
                  <div key={r.from} className="flex items-center justify-between gap-4 px-6 py-4 rounded-2xl"
                    style={{ background:"rgba(109,213,168,0.06)", border:"1px solid rgba(109,213,168,0.2)" }}>
                    <span className="font-body text-sm text-[#f0e0ff] flex-1">
                      <strong className="text-[#6dd5a8]">{r.from?.username || "Someone"}</strong> wants to be friends!
                    </span>
                    <button onClick={() => acceptFriendRequest(r.from._id || r.from)}
                      className="btn-bounce px-4 py-2 rounded-xl font-body text-xs font-bold cursor-target"
                      style={{ background:"#6dd5a8", color:"#0a0612", border:"none", cursor:"pointer" }}>
                      Accept ✓
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FIND PLAYERS (SEARCH) SECTION */}
          <div className="p-8 rounded-3xl glass-panel w-full" style={{ borderColor: "rgba(132,200,255,0.3)" }}>
            <h2 className="font-display text-xl mb-6 flex items-center gap-2" style={{ color:"#84c8ff" }}>
              <span>🔍</span> Find Players
            </h2>
            <div className="flex gap-3 mb-6">
              <input type="text" placeholder="Search by username…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="flex-1 px-4 py-3 rounded-2xl font-body text-sm cursor-target"
                style={{
                  border: "2px solid rgba(132,200,255,0.3)",
                  outline: "none",
                  background: "rgba(200,168,255,0.05)",
                  color: "#f0e0ff"
                }} />
              <button onClick={handleSearch}
                className="btn-bounce px-6 py-3 rounded-2xl font-body font-bold text-sm cursor-target"
                style={{ background:"#84c8ff", color:"#0a0612", border:"none", cursor:"pointer" }}>
                Search
              </button>
            </div>
            <div className="space-y-3">
              {results.map(u => (
                <div key={u._id} className="flex items-center gap-4 px-6 py-4 rounded-2xl animate-fade-in"
                  style={{ background:"rgba(255,255,255,0.02)", border:"1.5px solid rgba(132,200,255,0.2)" }}>
                  <img src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.username}`}
                    className="w-10 h-10 rounded-full" style={{ border:"2px solid #84c8ff" }} />
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold text-sm text-[#f0e0ff] truncate">{u.username}</p>
                    <p className="font-body text-xs text-[rgba(240,224,255,0.5)]">⭐ {u.totalPoints} pts</p>
                  </div>
                  <button onClick={() => sendFriendRequest(u._id)}
                    className="btn-bounce px-4 py-2 rounded-xl font-body text-xs font-bold cursor-target"
                    style={{ background:"rgba(200,168,255,0.15)", color:"#c8a8ff", border:"1.5px solid #c8a8ff", cursor:"pointer" }}>
                    + Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
  );
}