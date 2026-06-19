import { useEffect, useRef, useState } from "react";

const BGM_TRACKS = {
  lobby:   "/bgm/lobby.mp3",
  general: "/bgm/draw-n-guess.mp3",
  kids:    "/bgm/kids-quiz.mp3",
  couples: "/bgm/couples.mp3",
};

export default function BackgroundMusic({ category }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const src = BGM_TRACKS[category];

  useEffect(() => {
    if (!src || !audioRef.current) return;
    audioRef.current.volume = 0.25;
    audioRef.current.play().catch(() => {
      // Autoplay may be blocked until user interacts — fine.
    });
  }, [src]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(p => !p);
  };

  if (!src) return null; // no music for music-quiz mode

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button 
  onClick={toggle} 
  className="btn-bounce fixed top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-lg"
  style={{ 
    background: "var(--pastel-purple)", 
    border: "2px solid #c8a8ff", 
    color: "var(--ink)", 
    boxShadow: "var(--shadow-soft)",
    zIndex: 100 // <-- This forces the button to sit on top of the Navbar
  }}
  title={playing ? "Pause music" : "Play music"}
>
  {playing ? "🔊" : "🔇"}
</button>
    </>
  );
}