import { useEffect, useRef } from "react";

export default function AlbumRevealOverlay({ answer, artist, cover, audio, seconds }) {
  const audioRef = useRef(null);

  // Auto-play the clip when the overlay appears
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Autoplay might be blocked until user interacts — that's fine, ignore.
      });
    }
    return () => {
      audioRef.current?.pause();
    };
  }, [audio]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overlay-fade-in"
      style={{
        background: "rgba(45,36,56,0.55)",
        backdropFilter: "blur(12px)",
      }}>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={audio} />

      {/* Spinning vinyl-style album cover */}
      <div className="relative pop-in" style={{ width: 220, height: 220 }}>
        <img
          src={cover}
          alt={answer}
          className="vinyl-spin w-full h-full object-cover rounded-full"
          style={{
            border: "8px solid white",
            boxShadow: "0 12px 48px rgba(0,0,0,0.35)",
          }}
        />
        {/* Center hole */}
        <div className="absolute rounded-full"
          style={{
            top: "50%", left: "50%",
            width: 22, height: 22,
            background: "var(--surface)",
            border: "3px solid white",
            transform: "translate(-50%, -50%)",
          }} />
      </div>

      {/* Song title + artist */}
      <div className="text-center mt-6 slide-up">
        <h2 className="font-display text-3xl" style={{ color: "white" }}>
          {answer}
        </h2>
        {artist && (
          <p className="font-body text-base mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
            by {artist}
          </p>
        )}
      </div>

      {/* Countdown to next round */}
      <div className="mt-8 px-4 py-1.5 rounded-full font-body text-sm"
        style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
        Next round in {seconds}s…
      </div>
    </div>
  );
}