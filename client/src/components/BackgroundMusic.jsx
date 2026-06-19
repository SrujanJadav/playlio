import { useEffect, useRef, useState } from "react";

const BGM_TRACKS = {
  lobby:   "/bgm/lobby.mp3",
  general: "/bgm/draw-n-guess.mp3",
  kids:    "/bgm/kids-quiz.mp3",
  couples: "/bgm/couples.mp3",
};

// BackgroundMusic renders the hidden audio element only.
// Pass onToggle + playing as props to render the control button inline wherever you need.
export function useBgm(category) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const src = BGM_TRACKS[category];

  useEffect(() => {
    if (!src || !audioRef.current) return;
    audioRef.current.volume = 0.25;
    audioRef.current.play().catch(() => {});
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

  const AudioElement = src ? <audio ref={audioRef} src={src} loop /> : null;

  return { playing, toggle, AudioElement };
}

// Legacy default export — keeps lobby / other pages working unchanged
export default function BackgroundMusic({ category }) {
  const { playing, toggle, AudioElement } = useBgm(category);
  if (!AudioElement) return null;
  return (
    <>
      {AudioElement}
      <button
        onClick={toggle}
        className="btn-bounce fixed top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center text-lg"
        style={{
          background: "var(--pastel-purple)",
          border: "2px solid #c8a8ff",
          color: "var(--ink)",
          boxShadow: "var(--shadow-soft)",
          zIndex: 100,
        }}
        title={playing ? "Pause music" : "Play music"}
      >
        {playing ? "🔊" : "🔇"}
      </button>
    </>
  );
}