import { useState, useEffect, useRef } from "react";
import PixelInput from "./PixelInput";

const TYPE_STYLES_LIGHT = {
  chat:    { bg:"transparent",          color:"var(--ink)" },
  correct: { bg:"var(--pastel-mint)",   color:"#1a6641", border:"1.5px solid #6dd5a8" },
  hint:    { bg:"var(--pastel-yellow)", color:"#8B6914", border:"1.5px solid #f0c840" },
  system:  { bg:"var(--pastel-purple)", color:"#6030a0", border:"1.5px solid #c8a8ff" },
};

const TYPE_STYLES_DARK = {
  chat:    { bg:"transparent",          color:"#f0e0ff" },
  correct: { bg:"rgba(57, 255, 136, 0.15)",   color:"#39ff88", border: "1.5px solid #39ff88" },
  hint:    { bg:"rgba(240, 200, 64, 0.15)", color:"#f0c840", border: "1.5px solid #f0c840" },
  system:  { bg:"rgba(200, 168, 255, 0.15)", color:"#c8a8ff", border: "1.5px solid #c8a8ff" },
};

export default function ChatBox({ socket, roomCode, userId, username, isDrawer, gameState, theme = "light" }) {
  const [messages, setMessages] = useState([]);
  const [input,    setInput]    = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const onMsg = (msg) => {
      setMessages(prev => [...prev.slice(-80), { ...msg, id: Date.now() }]);
    };
    const onCorrect = ({ username: guesser, pointsEarned }) => {
      setMessages(prev => [...prev.slice(-80), {
        id: Date.now(),
        type: "correct",
        username: "✅",
        message: `${guesser} guessed it! +${pointsEarned} pts`,
      }]);
    };

    socket.on("chat_message", onMsg);
    socket.on("correct_guess", onCorrect);
    return () => {
      socket.off("chat_message", onMsg);
      socket.off("correct_guess", onCorrect);
    };
  }, [socket]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  const sendMessage = () => {
    const msg = input.trim();
    if (!msg || !socket) return;
    socket.emit("send_chat", { roomCode, userId, username, message: msg });
    setInput("");
  };

  const typeStyles = theme === "dark" ? TYPE_STYLES_DARK : TYPE_STYLES_LIGHT;

  return (
   <div className="flex flex-col h-full rounded-2xl overflow-hidden glass-panel"
  style={{
    border: theme === "dark" ? "1.5px solid rgba(255, 255, 255, 0.35)" : "2.5px solid var(--pastel-purple)",
    background: theme === "dark" ? "rgba(10, 6, 18, 0.35)" : "white",
    backdropFilter: theme === "dark" ? "blur(8px)" : "none",
  }}>
      
      {/* Header */}
      <div className="px-4 py-3 font-display text-base"
  style={{
    background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "var(--pastel-purple)",
    color: theme === "dark" ? "#f0e0ff" : "var(--ink)",
    borderBottom: theme === "dark" ? "1.5px solid rgba(255, 255, 255, 0.2)" : "2px solid #c8a8ff",
  }}>
        💬 {isDrawer ? "You're drawing!" : "Guess the word!"}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1" style={{ minHeight:0 }}>
        {messages.length === 0 && (
          <div className="text-center py-8 font-body text-sm" style={{ color: theme === "dark" ? "rgba(240, 224, 255, 0.4)" : "var(--ink-soft)", opacity:0.6 }}>
            Type to guess… 👀
          </div>
        )}
        {messages.map(msg => {
          const style = typeStyles[msg.type] || typeStyles.chat;
          return (
            <div key={msg.id}
              className={`px-2 py-1 rounded-xl text-sm font-body ${msg.type === "correct" ? "correct-flash" : ""}`}
              style={{
                background: style.bg,
                color:      style.color,
                border:     style.border || "none",
              }}>
              <span className="font-700">{msg.username}: </span>
              {msg.message}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 flex gap-2"
        style={{ borderTop: theme === "dark" ? "1.5px solid rgba(255, 255, 255, 0.2)" : "1.5px solid var(--pastel-purple)" }}>
       <PixelInput
          value={input}
          placeholder={isDrawer ? "Chat with players…" : "Type your guess…"}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="flex-1"
          theme={theme}
        />
        <button onClick={sendMessage}
          className="btn-bounce px-3 py-2 rounded-xl font-body font-700 text-sm"
          style={{
            background: theme === "dark" ? "rgba(255, 255, 255, 0.05)" : "var(--pastel-purple)",
            color: theme === "dark" ? "#f0e0ff" : "var(--ink)",
            border: theme === "dark" ? "1.5px solid rgba(255, 255, 255, 0.35)" : "2px solid #c8a8ff"
          }}>
          Send
        </button>
      </div>
    </div>
  );
}