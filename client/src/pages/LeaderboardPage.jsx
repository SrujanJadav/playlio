import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LiquidGlassTabs from "../components/LiquidGlassTabs";
import PixelEmoji from "../components/PixelEmoji";

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("global");
  const [global, setGlobal] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [g, f] = await Promise.all([
          axios.get("/api/user/leaderboard"),
          axios.get("/api/user/friends-leaderboard"),
        ]);
        setGlobal(g.data.leaderboard);
        setFriends(f.data.leaderboard);
      } catch { }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const data = tab === "global" ? global : friends;

  return (
    <div className="relative z-10 page-container pb-10 flex flex-col items-center" style={{ paddingTop: "20px" }}>


      {/* ── CONSTRAINED CONTENT WRAPPER (1000px Max-Width) ── */}
      <div className="w-full max-w-[1000px] flex flex-col gap-8">

        <div className="text-center mb-4 flex flex-col items-center">
          <div className="text-6xl float mb-3" style={{ filter: "drop-shadow(0 0 10px rgba(240,200,64,0.4))" }}><PixelEmoji>🏆</PixelEmoji></div>
          <h1 className="font-display text-3xl text-glow-soft" style={{ color: "#f0e0ff", lineHeight: 1.6 }}>Leaderboard</h1>
          <p className="font-body text-base mt-2" style={{ color: "rgba(240,224,255,0.6)" }}>
            Who's drawing their way to the top?
          </p>
        </div>

        {/* Liquid Glass Tabs centered */}
        <div className="flex justify-center w-full">
          <LiquidGlassTabs
            activeTab={tab}
            onChange={setTab}
            tabs={[
              { id: "global", label: <span><PixelEmoji>🌍</PixelEmoji> Global</span> },
              { id: "friends", label: <span><PixelEmoji>👯</PixelEmoji> Friends</span> },
            ]}
          />
        </div>

        {loading ? (
          <div className="text-center py-20 font-display text-xl animate-pulse" style={{ color: "rgba(240,224,255,0.6)" }}>
            <span className="float inline-block"><PixelEmoji>🎨</PixelEmoji></span> Loading Leaderboard…
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 rounded-3xl glass-panel w-full"
            style={{ borderStyle: "dashed" }}>
            <div className="text-6xl mb-4 float"><PixelEmoji>🏜️</PixelEmoji></div>
            <p className="font-display text-xl" style={{ color: "#f0e0ff" }}>
              {tab === "friends" ? "No friends yet!" : "No players yet!"}
            </p>
            <p className="font-body text-sm mt-2" style={{ color: "rgba(200,168,255,0.4)" }}>
              {tab === "friends" ? "Add friends on your profile page." : "Play some games first!"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            {data.map((player, i) => {
              const isMe = player._id?.toString() === user?._id || player.isMe;
              const medals = ["🥇", "🥈", "🥉"];

              // Custom neon cyberpunk styling per rank
              let rowBorderColor = "rgba(200,168,255,0.15)";
              let rowGlow = "rgba(0, 0, 0, 0.3)";
              let titleColor = "#f0e0ff";

              if (i === 0) {
                rowBorderColor = "#f0c840"; // Gold
                rowGlow = "rgba(240,200,64,0.15)";
                titleColor = "#f0c840";
              } else if (i === 1) {
                rowBorderColor = "#c878ff"; // Neon Purple
                rowGlow = "rgba(200,120,255,0.15)";
                titleColor = "#c878ff";
              } else if (i === 2) {
                rowBorderColor = "#39ff88"; // Neon Mint
                rowGlow = "rgba(57,255,136,0.15)";
                titleColor = "#39ff88";
              } else if (isMe) {
                rowBorderColor = "#84c8ff"; // Neon Blue for self
                rowGlow = "rgba(132,200,255,0.15)";
                titleColor = "#84c8ff";
              }

              return (
                <div key={player._id || i}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl slide-up transition-transform hover:scale-[1.01]"
                  style={{
                    background: "rgba(10,6,18,0.75)",
                    border: `2.5px solid ${rowBorderColor}`,
                    boxShadow: `0 4px 20px ${rowGlow}, inset 0 1px 0 rgba(255,255,255,0.05)`,
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    animationDelay: `${i * 0.04}s`,
                  }}>

                  <span className="font-display text-2xl w-8 text-center flex-shrink-0" style={{ color: titleColor }}>
                    {medals[i] ? <PixelEmoji>{medals[i]}</PixelEmoji> : i + 1}
                  </span>

                  <img
                    src={player.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${player.username}`}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{ border: `2px solid ${rowBorderColor}` }} />

                  <div className="flex-1 min-w-0">
                    <p className="font-body font-bold text-sm truncate" style={{ color: "#f0e0ff" }}>
                      {player.username} {isMe && <span className="font-semibold text-glow-soft" style={{ color: "#84c8ff" }}>(You)</span>}
                    </p>
                    <p className="font-body text-xs" style={{ color: "rgba(240,224,255,0.45)" }}>
                      <PixelEmoji>🎮</PixelEmoji> {player.gamesPlayed} games played
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-1.5 flex-shrink-0">
                    {player.badges?.slice(0, 3).map(b => (
                      <span key={b} className="text-lg" title={b}>
                        <PixelEmoji>
                          {{ first_win: "🏆", streak_3: "🔥", points_500: "⭐", points_1000: "💎", social_butterfly: "🦋" }[b]}
                        </PixelEmoji>
                      </span>
                    ))}
                  </div>

                  <div className="font-display text-xl flex-shrink-0 pl-2 text-glow-soft" style={{ color: titleColor }}>
                    {player.totalPoints?.toLocaleString()} pts
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}