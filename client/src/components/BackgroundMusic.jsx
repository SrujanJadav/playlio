import { useEffect } from "react";
import { useAudio } from "../context/AudioContext";

export function useBgm(category) {
  const { isMuted, toggleMute, setCategory } = useAudio();

  useEffect(() => {
    if (category) {
      setCategory(category);
    }
    return () => {
      setCategory(null);
    };
  }, [category, setCategory]);

  return {
    playing: !isMuted,
    toggle: toggleMute,
    AudioElement: null, // Global audio element, no inline rendering needed
  };
}

export default function BackgroundMusic({ category }) {
  useBgm(category);
  return null;
}