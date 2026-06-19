import { useState, useEffect } from "react";
import { motion } from "motion/react";

const MESSAGES = [
  "Draw something! 🎨",
  "Guess the animal! 🐾",
  "Name that song! 🎵",
  "Pick your answer... 💕",
];

const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_BEFORE_DELETE = 2000;

export default function TypingMessages() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = MESSAGES[messageIndex];

    if (!isDeleting && displayText === current) {
      const pause = setTimeout(() => setIsDeleting(true), PAUSE_BEFORE_DELETE);
      return () => clearTimeout(pause);
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting ? prev.slice(0, -1) : current.slice(0, prev.length + 1)
      );
    }, isDeleting ? DELETING_SPEED : TYPING_SPEED);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, messageIndex]);

  return (
    <div className="flex items-center justify-start text-left min-h-[1.5em]">
      <span className="font-body" style={{ color: "#a8f0c8", fontSize: "16px" }}>
        {displayText}
      </span>
      <motion.span
        className="inline-block w-2 h-4 ml-1 align-middle"
        style={{ background: "#a8f0c8" }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}