import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

const AudioContext = createContext(null);

const BGM_TRACKS = {
  lobby:   "/bgm/lobby.mp3",
  general: "/bgm/draw-n-guess.mp3",
  kids:    "/bgm/kids-quiz.mp3",
  couples: "/bgm/couples.mp3",
};

export function AudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem("bgm_muted") === "true";
  });
  const [category, setCategoryState] = useState(null);
  const audioRef = useRef(null);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = 0.25;
    audio.muted = isMuted;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Update muted state and play/pause if needed
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
    localStorage.setItem("bgm_muted", isMuted ? "true" : "false");

    if (!isMuted && category && audioRef.current.paused) {
      audioRef.current.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("Autoplay blocked, waiting for user interaction:", err);
        }
      });
    }
  }, [isMuted, category]);

  // Set category and change audio source dynamically
  const setCategory = useCallback((cat) => {
    setCategoryState(cat);
    if (!audioRef.current) return;

    if (!cat) {
      audioRef.current.pause();
      audioRef.current.src = "";
      return;
    }

    const src = BGM_TRACKS[cat];
    if (src) {
      // Only change source if it's different to prevent restarting track
      const currentSrcPath = new URL(audioRef.current.src, window.location.origin).pathname;
      if (currentSrcPath !== src) {
        audioRef.current.src = src;
        if (!isMuted) {
          audioRef.current.play().catch((err) => {
            if (err.name !== "AbortError") {
              console.warn("Audio play blocked by browser:", err);
            }
          });
        }
      }
    } else {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, setCategory, category }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
