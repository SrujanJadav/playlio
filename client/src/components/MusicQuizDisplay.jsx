import { useState, useEffect, useRef } from "react";

const OPTION_COLORS = [
  { bg: "rgba(255, 153, 204, 0.05)", border: "rgba(255, 153, 204, 0.4)", color: "#ff99cc" },
  { bg: "rgba(132, 200, 255, 0.05)", border: "rgba(132, 200, 255, 0.4)", color: "#84c8ff" },
  { bg: "rgba(109, 213, 168, 0.05)", border: "rgba(109, 213, 168, 0.4)", color: "#6dd5a8" },
  { bg: "rgba(240, 200, 64, 0.05)", border: "rgba(240, 200, 64, 0.4)", color: "#f0c840" },
];

export default function MusicQuizDisplay({
  clue,
  options,
  seconds,
  socket,
  roomCode,
  userId,
  username,
  revealAnswer,   // set once round ends — the correct answer string
  audio,
  isSpectator,
}) {
  const [selected, setSelected] = useState(null);
  const [wrongFlag, setWrongFlag] = useState(false);

  const timerColor = seconds <= 5 ? "#E63946" : seconds <= 10 ? "#FF9F1C" : "#06D6A0";

  const [isPlayingHint, setIsPlayingHint] = useState(false);
  const audioRef = useRef(null);

  // Stop current playing hint audio if the round ends or audio changes
  useEffect(() => {
    if (audioRef.current) {
      if (audioRef.current.stopTimer) {
        clearTimeout(audioRef.current.stopTimer);
      }
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlayingHint(false);
  }, [audio, revealAnswer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        if (audioRef.current.stopTimer) {
          clearTimeout(audioRef.current.stopTimer);
        }
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayHint = () => {
    if (isPlayingHint || !audio || revealAnswer) return;

    setIsPlayingHint(true);
    const audioObj = new Audio(audio);
    audioObj.volume = 0.5;
    audioRef.current = audioObj;

    let playPromise = audioObj.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        setIsPlayingHint(false);
      });
    }

    const stopTimer = setTimeout(() => {
      setIsPlayingHint(false);
      if (playPromise !== undefined) {
        playPromise.then(() => {
          audioObj.pause();
          audioObj.currentTime = 0;
        }).catch(() => {});
      } else {
        audioObj.pause();
        audioObj.currentTime = 0;
      }
    }, 3000);

    audioObj.stopTimer = stopTimer;
  };

  // Reset selection state when a new round starts (clue changes)
  useEffect(() => {
    setSelected(null);
    setWrongFlag(false);
  }, [clue]);

  // Listen for wrong-answer feedback (private event)
  useEffect(() => {
    if (!socket) return;
    const onWrong = ({ selected: sel }) => {
      setWrongFlag(true);
    };
    socket.on("music_wrong_answer", onWrong);
    return () => socket.off("music_wrong_answer", onWrong);
  }, [socket]);

  const handlePick = (option) => {
    if (selected || revealAnswer || isSpectator) return; // already answered, round over, or spectator
    setSelected(option);
    socket?.emit("music_answer", { roomCode, userId, username, selected: option });
  };

  const getButtonStyle = (option, idx) => {
    const colors = OPTION_COLORS[idx % OPTION_COLORS.length];

    // After reveal: highlight correct in green, wrong selection in red
    if (revealAnswer) {
      if (option === revealAnswer) {
        return { bg: "rgba(109, 213, 168, 0.15)", border: "#6dd5a8", color: "#6dd5a8", opacity: 1 };
      }
      if (option === selected && option !== revealAnswer) {
        return { bg: "rgba(255, 99, 99, 0.15)", border: "#ff8080", color: "#ff8080", opacity: 1 };
      }
      return { bg: "transparent", border: colors.border, color: colors.color, opacity: 0.4 };
    }

    // During round: highlight the player's own pick
    if (selected === option) {
      return { bg: "rgba(255, 255, 255, 0.08)", border: "rgba(255, 255, 255, 0.8)", color: "#ffffff", opacity: 1 };
    }
    if (selected) {
      return { bg: "transparent", border: colors.border, color: colors.color, opacity: 0.5 };
    }
    if (isSpectator) {
      return { bg: "transparent", border: colors.border, color: colors.color, opacity: 0.4 };
    }
    return { bg: "transparent", border: colors.border, color: colors.color, opacity: 1 };
  };

  return (
    <div className="relative flex-1 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-6 p-6"
      style={{
        border: "1.5px solid rgba(255, 255, 255, 0.35)",
        background: "transparent",
        minHeight: "320px",
      }}>

      {/* Timer */}
      <div className="absolute top-3 right-3 z-10 w-12 h-12 rounded-full flex items-center justify-center font-display text-xl"
        style={{
          background: timerColor + "33",
          border: `3px solid ${timerColor}`,
          color: timerColor,
          transition: "border-color 0.5s, color 0.5s",
        }}>
        {seconds}
      </div>

      {/* Label */}
      <div className="px-3 py-1 rounded-xl font-display text-sm"
        style={{ background:"rgba(255, 255, 255, 0.05)", border: "1.5px solid rgba(255, 255, 255, 0.2)", color:"#f0e0ff" }}>
        🎵 Name that song!
      </div>

      {/* Clue / lyric snippet + Play Hint Button */}
      <div className="flex items-center gap-4 text-left w-full max-w-lg px-4 pop-in">
        <div className="flex-1">
          <p className="font-display text-xl md:text-2xl leading-relaxed" style={{ color:"#ffffff" }}>
            {clue || "Loading lyric…"}
          </p>
        </div>
        {audio && !revealAnswer && (
          <button
            onClick={handlePlayHint}
            disabled={isPlayingHint}
            className="btn-bounce flex items-center justify-center w-12 h-12 rounded-full border cursor-pointer transition-all duration-200"
            style={{
              background: isPlayingHint ? "rgba(200,168,255,0.15)" : "rgba(255,255,255,0.05)",
              borderColor: isPlayingHint ? "#c8a8ff" : "rgba(255,255,255,0.2)",
              color: isPlayingHint ? "#c8a8ff" : "#ffffff",
              boxShadow: isPlayingHint ? "0 0 16px rgba(200,168,255,0.3)" : "none",
            }}
            title="Listen to 3s audio hint"
          >
            {isPlayingHint ? (
              <span className="text-base animate-pulse">🔊</span>
            ) : (
              <span className="text-base">▶️</span>
            )}
          </button>
        )}
      </div>

      {/* Options grid */}
      {options?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          {options.map((option, idx) => {
            const style = getButtonStyle(option, idx);
            return (
              <button
                key={option}
                onClick={() => handlePick(option)}
                disabled={!!selected || !!revealAnswer || isSpectator}
                className="btn-bounce px-4 py-3 rounded-2xl font-body font-700 text-sm text-center"
                style={{
                  background: style.bg,
                  border: `2.5px solid ${style.border}`,
                  color: style.color || "rgba(255, 255, 255, 0.9)",
                  opacity: style.opacity,
                  cursor: (selected || revealAnswer || isSpectator) ? "default" : "pointer",
                }}>
                {option}
                {revealAnswer && option === revealAnswer && " ✅"}
                {revealAnswer && option === selected && option !== revealAnswer && " ❌"}
              </button>
            );
          })}
        </div>
      )}

      {/* Status messages */}
      {selected && !revealAnswer && (
        <p className="font-body text-sm" style={{ color:"#d8c8f0" }}>
          {wrongFlag ? "Not quite — wait for the reveal! 👀" : "Answer locked in! Waiting for others… ⏳"}
        </p>
      )}

      {isSpectator && !revealAnswer && (
        <p className="font-body text-sm text-[#ffd700] bg-[#ffd700]/10 px-4 py-1.5 rounded-full border border-[#ffd700]/20 animate-pulse">
          👁️ Spectating — You will join next round!
        </p>
      )}
    </div>
  );
}