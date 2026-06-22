import { useState, useEffect } from "react";

const GENRE_META = {
  sweet: { label: "💛 Sweet",       bg: "var(--pastel-pink)",   border: "#ff99cc" },
  spicy: { label: "🌶️ Spicy",      bg: "var(--pastel-coral)",  border: "#ff9999" },
  harsh: { label: "💬 Real Talk",   bg: "var(--pastel-blue)",   border: "#84c8ff" },
  fun:   { label: "😄 Just for Fun", bg: "var(--pastel-yellow)", border: "#f0c840" },
};

export default function CouplesQuizDisplay({
  socket,
  roomCode,
  userId,
  question,       // { genre, question, options }
  phase,          // "answering" | "guessing" | "reveal"
  answererId,
  answererName,
  guesserId,
  guesserName,
  seconds,
  revealData,     // { answererSelections, guesserSelections, pointsEarned, guesserId } or null
  isSpectator,
}) {
  const [selections, setSelections] = useState([]);
  const [submitted,  setSubmitted]  = useState(false);

  const isAnswerer = userId === answererId;
  const isGuesser  = userId === guesserId;
  const genre = GENRE_META[question?.genre] || GENRE_META.fun;

  // Reset local state whenever a new round/phase starts
  useEffect(() => {
    setSelections([]);
    setSubmitted(false);
  }, [question, phase]);
  if (!question) {
    return (
      <div className="relative flex-1 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 p-6"
        style={{
          border: "none",
          background: "transparent",
          minHeight: "320px"
        }}>
        <div className="text-5xl float">💕</div>
        <p className="font-display text-xl" style={{ color: "#ffffff" }}>
          Getting your question ready…
        </p>
      </div>
    );
  }

  const toggleOption = (option) => {
    if (submitted || phase === "reveal") return;
    setSelections(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    socket?.emit("couples_submit", { roomCode, userId, selections });
  };

  const timerColor = seconds <= 5 ? "#E63946" : seconds <= 10 ? "#FF9F1C" : "#06D6A0";

  // ── REVEAL PHASE ──────────────────────────────────────────────
  if (phase === "reveal" && revealData) {
    const { answererSelections, guesserSelections, pointsEarned } = revealData;
    const wasGuesser = userId === revealData.guesserId;

    return (
      <div className="relative flex-1 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-5 p-6 pop-in"
        style={{
          border: "none",
          background: "transparent",
          minHeight: "320px"
        }}>

        <div className="px-3 py-1 rounded-xl font-display text-sm"
          style={{ background: "rgba(255, 255, 255, 0.05)", border: `1.5px solid ${genre.border}88`, color: "#ffffff" }}>
          {genre.label} — Round Results
        </div>

        <p className="font-display text-lg text-center max-w-md" style={{ color: "#ffffff" }}>
          {question.question}
        </p>

        <div className="w-full max-w-md space-y-2">
          {question.options.map(option => {
            const wasTrue   = answererSelections.includes(option);
            const wasGuess  = guesserSelections.includes(option);
            let bg = "transparent", border = "rgba(255, 255, 255, 0.15)", color = "rgba(255, 255, 255, 0.5)", icon = "";

            if (wasTrue && wasGuess) { bg = "rgba(109, 213, 168, 0.15)"; border = "#6dd5a8"; color = "#6dd5a8"; icon = "✅ Match!"; }
            else if (wasTrue && !wasGuess) { bg = "rgba(240, 200, 64, 0.15)"; border = "#f0c840"; color = "#f0c840"; icon = "💔 Missed"; }
            else if (!wasTrue && wasGuess) { bg = "rgba(255, 153, 204, 0.15)"; border = "#ff99cc"; color = "#ff99cc"; icon = "❌ Wrong guess"; }

            return (
              <div key={option} className="flex items-center justify-between px-4 py-2 rounded-xl font-body text-sm"
                style={{ background: bg, border: `2px solid ${border}`, color: color }}>
                <span>{option}</span>
                {icon && <span className="text-xs font-700">{icon}</span>}
              </div>
            );
          })}
        </div>

        <div className="text-center pop-in">
          <p className="font-display text-2xl" style={{ color: "#c878ff" }}>
            {wasGuesser ? "You" : guesserName} earned +{pointsEarned} pts!
          </p>
          <p className="font-body text-xs mt-1" style={{ color: "rgba(240, 224, 255, 0.6)" }}>
            Next round coming up…
          </p>
        </div>
      </div>
    );
  }

  // ── ANSWERING / GUESSING PHASES ──────────────────────────────
  const activePlayerId = phase === "answering" ? answererId : guesserId;
  const isMyTurn = userId === activePlayerId && !isSpectator;

  return (
    <div className="relative flex-1 rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-5 p-6"
      style={{
        border: "none",
        background: "transparent",
        minHeight: "320px"
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

      {/* Genre badge */}
      <div className="px-3 py-1 rounded-xl font-display text-sm"
        style={{ background: "rgba(255, 255, 255, 0.05)", border: `1.5px solid ${genre.border}88`, color: "#ffffff" }}>
        {genre.label}
      </div>

      {/* Phase indicator */}
      {phase === "answering" ? (
        <p className="font-body text-sm text-center" style={{ color: "rgba(240, 224, 255, 0.7)" }}>
          {isMyTurn
            ? "🤫 Pick YOUR true answers — your partner can't see this!"
            : `💭 ${answererName} is picking their answers…`}
        </p>
      ) : (
        <p className="font-body text-sm text-center" style={{ color: "rgba(240, 224, 255, 0.7)" }}>
          {isMyTurn
            ? `🔮 Guess what ${answererName} picked!`
            : `🔮 ${guesserName} is guessing your answers…`}
        </p>
      )}

      {/* Question */}
      <p className="font-display text-lg md:text-xl text-center max-w-md pop-in" style={{ color: "#ffffff" }}>
        {question.question}
      </p>

      {/* Options */}
      {isMyTurn ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          {question.options.map((option, idx) => {
            const picked = selections.includes(option);
            return (
              <button
                key={option}
                onClick={() => toggleOption(option)}
                disabled={submitted}
                className="btn-bounce px-4 py-3 rounded-2xl font-body font-700 text-sm text-left"
                style={{
                  background: picked ? "rgba(255, 153, 204, 0.15)" : "transparent",
                  border: `2.5px solid ${picked ? "#ff99cc" : "rgba(255, 255, 255, 0.2)"}`,
                  color: picked ? "#ff99cc" : "#ffffff",
                  opacity: submitted ? 0.6 : 1,
                  cursor: submitted ? "default" : "pointer",
                }}>
                {picked ? "✓ " : ""}{option}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
          {question.options.map(option => (
            <div key={option}
              className="px-4 py-3 rounded-2xl font-body font-700 text-sm text-left"
              style={{
                background: "transparent",
                border: "2.5px solid rgba(255, 255, 255, 0.1)",
                color: "rgba(255, 255, 255, 0.4)",
                opacity: 0.5
              }}>
              {option}
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      {isMyTurn && !submitted && (
        <button onClick={handleSubmit}
          className="btn-bounce px-6 py-2.5 rounded-2xl font-display text-base"
          style={{ background: "linear-gradient(135deg,#ff99cc,#c878ff)", color: "white", border: "none" }}>
          {phase === "answering" ? "Lock In My Answers 💕" : "Lock In My Guess 🔮"}
        </button>
      )}

      {isMyTurn && submitted && (
        <p className="font-body text-sm" style={{ color: "rgba(240, 224, 255, 0.7)" }}>
          Locked in! Waiting… ⏳
        </p>
      )}

      {isSpectator && (
        <p className="font-body text-sm text-[#ffd700] bg-[#ffd700]/10 px-4 py-1.5 rounded-full border border-[#ffd700]/20 animate-pulse">
          👁️ Spectating — You will join next round!
        </p>
      )}
    </div>
  );
}