export default function PlayersSidebar({ players, currentDrawerId, scores }) {
  const sorted = [...players].sort((a, b) => {
    const sa = scores?.[a.userId] ?? a.points ?? 0;
    const sb = scores?.[b.userId] ?? b.points ?? 0;
    return sb - sa;
  });

  return (
    <div className="rounded-2xl overflow-hidden glass-panel h-full flex flex-col"
      style={{
        border:"1.5px solid rgba(255, 255, 255, 0.35)",
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}>
      
      <div className="px-4 py-3 font-display text-base"
        style={{ background:"rgba(255, 255, 255, 0.05)", color:"#f0e0ff", borderBottom:"1.5px solid rgba(255, 255, 255, 0.2)" }}>
        🧑‍🤝‍🧑 Players ({players.length})
      </div>

      <div className="p-2 space-y-1.5 overflow-y-auto flex-1">
        {sorted.map((p, i) => {
          const pts = scores?.[p.userId] ?? p.points ?? 0;
          const isDrawer = p.userId === currentDrawerId;
          const medals = ["🥇","🥈","🥉"];

          return (
            <div key={p.userId || p.socketId}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: isDrawer 
                  ? "rgba(240, 200, 64, 0.22)" 
                  : i === 0 
                    ? "rgba(57, 255, 136, 0.22)" 
                    : "rgba(255, 255, 255, 0.08)",
                border: isDrawer 
                  ? "1.5px solid #f0c840" 
                  : i === 0 
                    ? "1.5px solid #39ff88" 
                    : "1.5px solid rgba(255, 255, 255, 0.15)",
              }}>
              
              <span className="text-base w-5 text-center">
                {isDrawer ? "✏️" : (medals[i] ?? "👤")}
              </span>
              
              <img
                src={p.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${p.username}`}
                alt={p.username}
                className="w-7 h-7 rounded-full flex-shrink-0"
                style={{ border: isDrawer ? "1.5px solid #f0c840" : i === 0 ? "1.5px solid #39ff88" : "1.5px solid rgba(255, 255, 255, 0.2)" }} />
              
              <span className="flex-1 font-body text-sm font-bold truncate"
                style={{ color:"#f0e0ff", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                {p.username}
              </span>
              
              <span className="font-display text-sm font-bold text-glow-soft"
                style={{ color: isDrawer ? "#f0c840" : i === 0 ? "#39ff88" : "#f0e0ff" }}>
                {pts} pts
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
