import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GooeyNav from "./GooeyNav";
import toast from "react-hot-toast";
import PixelEmoji from "./PixelEmoji";

const TITLE_LETTERS = [
  { ch: "P", color: "#ff99cc" },
  { ch: "l", color: "#c878ff" },
  { ch: "a", color: "#84c8ff" },
  { ch: "y", color: "#39ff88" },
  { ch: "l", color: "#f0c840" },
  { ch: "i", color: "#ff9999" },
  { ch: "o", color: "#c8a8ff" },
];

const ROUTE_TO_INDEX = {
  "/lobby":       0,
  "/leaderboard": 1,
  "/profile":     2,
};

const BADGE_ICONS = {
  first_win:        "🏆",
  streak_3:         "🔥",
  points_500:       "⭐",
  points_1000:      "💎",
  social_butterfly: "🦋",
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("See you next time! 👋");
    navigate("/");
  };

  const currentIndex = ROUTE_TO_INDEX[location.pathname] ?? 0;

  const navItems = [
    { label: <span><PixelEmoji>🏠</PixelEmoji> Lobby</span>,   onClick: () => navigate("/lobby") },
    { label: <span><PixelEmoji>🏆</PixelEmoji> Ranks</span>,   onClick: () => navigate("/leaderboard") },
    { label: <span><PixelEmoji>👤</PixelEmoji> Profile</span>, onClick: () => navigate("/profile") },
  ];

  return (
    <div className="w-full flex flex-col items-center page-container">
      {/* ── BIG GAME TITLE ── */}
      <div
        className="w-full flex justify-center items-center pt-8 pb-6 relative z-10"
        style={{ background: "transparent" }}
      >
        <div
          className="flex items-end gap-0 cursor-pointer select-none cursor-target"
          onClick={() => navigate("/lobby")}
        >
          {TITLE_LETTERS.map((l, i) => (
            <span
              key={i}
              className="font-display"
              style={{
                color: l.color,
                fontSize: i === 0 ? "72px" : "58px",
                lineHeight: 1,
                textShadow: `0 0 20px ${l.color}cc, 0 0 40px ${l.color}55`,
                display: "inline-block",
                animation: `float ${2.5 + (i % 3) * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.09}s`,
              }}
            >
              {l.ch}
            </span>
          ))}
        </div>
      </div>

      {/* ── GLASS NAVBAR (Centered) ── */}
      <nav
        className="sticky top-4 z-50 w-full rounded-full"
        style={{
          background: "rgba(10,6,18,0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(200,168,255,0.15)",
          boxShadow: "0 4px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,168,255,0.05)",
        }}
      >
        <div className="w-full px-6 h-16 flex items-center justify-between">
          
          {/* LEFT — Profile & Coins Cluster */}
          <div className="flex items-center">
            <div
              className="flex items-center gap-3 px-3 py-1.5 rounded-full font-body text-sm"
              style={{
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(200, 168, 255, 0.15)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.05)",
              }}
            >
              {/* Points */}
              <div className="flex items-center gap-1.5 text-[#f0c840]">
                ⭐ {user?.totalPoints?.toLocaleString() ?? 0}
              </div>

              {/* Vertical divider */}
              <div className="h-4 w-px bg-white/20 hidden sm:block" />

              {/* Profile details */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <div
                    style={{
                      position: "absolute",
                      inset: "-1px",
                      borderRadius: "50%",
                      boxShadow: "0 0 8px 1px rgba(57,255,136,0.3)",
                      pointerEvents: "none",
                    }}
                  />
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.username}`}
                    alt={user?.username}
                    className="w-7 h-7 rounded-full object-cover relative z-10"
                    style={{ border: "1.5px solid #39ff88" }}
                  />
                </div>
                <span className="font-body text-sm" style={{ color: "rgba(240,224,255,0.95)" }}>
                  {user?.username}
                </span>
              </div>
            </div>

            {/* Logout button for mobile */}
            <button
              onClick={handleLogout}
              className="sm:hidden ml-3 font-body text-xs px-2.5 py-1.5 rounded-full"
              style={{
                background: "rgba(255, 99, 99, 0.12)",
                color: "#ff9999",
                border: "1px solid rgba(255, 99, 99, 0.3)",
              }}
            >
              <PixelEmoji>👋</PixelEmoji> Out
            </button>
          </div>

          {/* RIGHT — GooeyNav */}
          <div className="flex items-center relative pr-2">
            <GooeyNav
              items={navItems}
              initialActiveIndex={currentIndex}
              particleCount={12}
              particleDistances={[70, 8]}
              particleR={80}
              animationTime={500}
              timeVariance={250}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
          
        </div>
      </nav>
    </div>
  );
}