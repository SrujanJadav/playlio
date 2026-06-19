import wildBorder from "../pages/assets/wild-border.png";

export default function QuizDisplay({ imageUrl, seconds }) {
  const timerColor = seconds <= 5 ? "#E63946" : seconds <= 10 ? "#FF9F1C" : "rgb(6, 214, 160)";

  return (
    <div className="relative flex-1 rounded-[24px] overflow-hidden flex items-center justify-center p-6"
      style={{
        border: "3.5px solid #6dd5a8",
        background: "rgba(255, 255, 255, 0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        minHeight: "420px",
      }}>

      {/* 1. Jungle Decorations Frame Overlay (Inside card boundaries, behind the animal image) */}
      <div className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url(${wildBorder})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* 2. Animal Image (Layered in front of the jungle frame, padded to prevent overlay clipping) */}
      <div className="relative z-10 w-full h-full flex items-center justify-center" style={{ maxHeight: "380px" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Guess the animal"
            className="max-w-[95%] max-h-[95%] object-contain pop-in"
            style={{
              filter: "drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.45))",
            }}
          />
        ) : (
          <div className="text-center bg-white/90 p-6 rounded-2xl shadow-sm">
            <div className="text-6xl mb-4 float">🦒</div>
            <p className="font-display text-xl" style={{ color:"var(--ink)" }}>
              Loading next animal…
            </p>
          </div>
        )}
      </div>

      {/* 3. Question UI (Overlayed at the very top) */}
      <div className="absolute top-3 left-3 z-20 px-3 py-1 rounded-xl font-display text-sm shadow-sm"
        style={{ background: "#6dd5a8", color: "#0a0612" }}>
        🐾 What animal is this?
      </div>

      <div className="absolute top-3 right-3 z-20 w-12 h-12 rounded-full flex items-center justify-center font-display text-xl shadow-sm"
        style={{
          background: "#ffffff",
          border: `3px solid ${timerColor}`,
          color: timerColor,
          transition: "border-color 0.5s, color 0.5s",
        }}>
        {seconds}
      </div>
    </div>
  );
}