export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ background: "#0a0612" }}>
      
      {/* Animated blobs */}
      <div className="blob float"
        style={{ width:220, height:220, background:"var(--pastel-purple)", top:"10%", left:"5%", animationDelay:"0s" }} />
      <div className="blob float-slow"
        style={{ width:160, height:160, background:"var(--pastel-pink)", bottom:"15%", right:"8%", animationDelay:"1s" }} />
      <div className="blob float-fast"
        style={{ width:130, height:130, background:"var(--pastel-mint)", top:"55%", left:"70%", animationDelay:"0.5s" }} />

      <div className="relative z-10 text-center">
        {/* Bouncing pencil emoji */}
        <div className="text-7xl float mb-4">🎨</div>
        
        <h1 className="font-display text-4xl mb-2" style={{ color:"#f0e0ff" }}>
          Playlio
        </h1>
        
        {/* Dot loader */}
        <div className="flex gap-2 justify-center mt-6">
          {[0,1,2].map(i => (
            <div key={i}
              className="w-3 h-3 rounded-full"
              style={{
                background: ["var(--pastel-purple)","var(--pastel-pink)","var(--pastel-mint)"][i],
                border: "2px solid",
                borderColor: ["#c8a8ff","#ff99cc","#66d4a8"][i],
                animation: `float 1s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        
        <p className="mt-4 font-body text-sm" style={{ color:"rgba(240,224,255,0.5)" }}>
          Loading the fun…
        </p>
      </div>
    </div>
  );
}
