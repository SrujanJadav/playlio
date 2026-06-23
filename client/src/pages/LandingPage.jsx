import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import ArkanoidBackground from "../components/ArkanoidBackground";
import FaultyTerminal from "../components/FaultyTerminal";
import TypingMessages from "../components/TypingMessages";
import PixelButton from "../components/PixelButton";
import PixelPanel from "../components/PixelPanel";
import PixelEmoji from "../components/PixelEmoji";
import TargetCursor from "../components/TargetCursor";

const TITLE_LETTERS = [
  { ch: "P", color: "#ff99cc" },
  { ch: "l", color: "#c878ff" },
  { ch: "a", color: "#84c8ff" },
  { ch: "x", color: "#39ff88" },
  { ch: "l", color: "#f0c840" },
  { ch: "i", color: "#ff9999" },
  { ch: "o", color: "#c8a8ff" },
];

const MODE_CARDS = [
  {
    icon: "🎨",
    title: "Draw n Guess",
    desc: "Classic real-time drawing. Sketch the word, others race to guess it before time runs out.",
    bg: "#1a4d33",
    border: "#6dd5a8",
  },
  {
    icon: "🐾",
    title: "Animal Quiz",
    desc: "A zoomed-in pic flashes on screen — first to type the right animal scores big.",
    bg: "#1a3a4d",
    border: "#84c8ff",
  },
  {
    icon: "🎵",
    title: "Music Quiz",
    desc: "A lyric snippet drops. Pick the right song before the timer hits zero, then the album art spins in.",
    bg: "#3a1a4d",
    border: "#c8a8ff",
  },
  {
    icon: "💕",
    title: "Couples Mode",
    desc: "One partner answers honestly, the other guesses. Built for two — sweet, spicy, and real questions.",
    bg: "#4d1a33",
    border: "#ff99cc",
  },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Already logged in → skip to lobby
  useEffect(() => {
    if (!loading && user) navigate("/lobby");
  }, [user, loading, navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: "#0a0612" }}>
      <TargetCursor />

      {/* ── Animated background: Arkanoid + CRT glitch overlay ── */}
      <ArkanoidBackground opacity={0.8} />
      <div className="fixed inset-0" style={{ zIndex: 1, pointerEvents: "none" }}>
        <FaultyTerminal
          scale={1.8}
          gridMul={[2, 1]}
          digitSize={1.2}
          timeScale={0.4}
          scanlineIntensity={0.4}
          glitchAmount={1}
          flickerAmount={0.6}
          noiseAmp={0.6}
          chromaticAberration={0}
          dither={0.3}
          curvature={0.15}
          tint="#39ff88"
          mouseReact={true}
          mouseStrength={0.3}
          pageLoadAnimation={true}
          brightness={0.5}
          style={{ width: "100%", height: "100%", opacity: 0.7 }}
        />
      </div>

      {/* ── Hero ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 pt-12 md:pt-16 pb-12">

        {/* ── BIG DANCING GAME TITLE ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-end justify-center gap-0 cursor-default select-none mb-12 relative z-10"
        >
          {TITLE_LETTERS.map((l, i) => (
            <span
              key={i}
              className="font-display"
              style={{
                color: l.color,
                fontSize: i === 0 ? "min(16vw, 150px)" : "min(13vw, 120px)",
                lineHeight: 1,
                textShadow: `0 0 30px ${l.color}cc, 0 0 60px ${l.color}55`,
                display: "inline-block",
                animation: `float ${2.5 + (i % 3) * 0.4}s ease-in-out infinite`,
                animationDelay: `${i * 0.09}s`,
              }}
            >
              {l.ch}
            </span>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-lg sm:text-2xl md:text-3xl lg:text-4xl mb-14 tracking-wider"
            style={{ color: "#f0e0ff", lineHeight: 1.4 }}>
            DRAW IT. GUESS IT. PRESS START.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-xl mx-auto"
        >
          <p className="font-body text-lg md:text-xl leading-relaxed mb-6" style={{ color: "#d8c8f0" }}>
            A real-time multiplayer arcade with four game modes — drawing battles, animal quizzes,
            music trivia, and a couples mode built just for two.
          </p>
          <p className="font-body text-base" style={{ color: "#a890c8" }}>
            Sign in, pick a mode, and start playing in seconds.
          </p>
        </motion.div>

        {/* ── Pixel terminal with typing messages ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm rounded-lg px-5 py-4"
          style={{
            background: "rgba(10,20,15,0.7)",
            border: "2px solid #2d5a42",
            backdropFilter: "blur(8px)",
            marginTop: "12px",
          }}
        >
          <div className="flex items-center gap-6 mb-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff9999" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#f0c840" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#6dd5a8" }} />
            <span className="font-body text-xs ml-2" style={{ color: "#6a8a76" }}>game.exe</span>
          </div>
          <TypingMessages />
        </motion.div>

        {/* ── Sign in button ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
          style={{ marginTop: "16px", marginBottom: "10px" }}
        >
          <PixelButton
            onClick={handleGoogleLogin}
            background="linear-gradient(135deg,#39ff88,#7c4dff)"
            borderColor="#0a0612"
            className="flex items-center gap-4 px-12 py-5 text-base font-bold sm:px-16 sm:py-6 sm:text-lg"
            style={{ fontFamily: "'VT323', monospace", fontSize: "1.5rem" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </PixelButton>

          <p className="mt-4 font-body text-xs" style={{ color: "#a890c8", opacity: 0.8 }}>
            No password needed · Free forever · Join in 5 seconds
          </p>
        </motion.div>

        {/* ── Game mode cards ── */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full"
          style={{ marginTop: "10px" }}
        >
          {MODE_CARDS.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <PixelPanel
                borderColor={mode.border}
                background={mode.bg}
                className="p-6 text-left h-full flex flex-col justify-start relative"
                style={{
                  boxShadow: `0 8px 40px ${mode.border}22, 0 4px 40px rgba(0, 0, 0, 0.5)`
                }}
              >
                <div className="text-4xl mb-3">
                  <PixelEmoji>{mode.icon}</PixelEmoji>
                </div>
                <h3 className="font-display text-sm mb-3" style={{ color: mode.border, lineHeight: 1.6 }}>
                  {mode.title}
                </h3>
                <p className="font-body text-base" style={{ color: "#e0d8ec" }}>
                  {mode.desc}
                </p>
              </PixelPanel>
            </motion.div>
          ))}
        </div>

        {/* ── How it works ── */}
        <div className="mt-32 max-w-2xl w-full">
          <h2 className="font-display text-lg mb-10" style={{ color: "#f0e0ff", lineHeight: 1.6 }}>
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { icon: "🔑", step: "1", label: "Sign in with Google" },
              { icon: "🎮", step: "2", label: "Pick a game mode" },
              { icon: "🖊️", step: "3", label: "Draw, guess, or answer" },
              { icon: "🏆", step: "4", label: "Earn points & badges" },
            ].map(({ icon, step, label }) => (
              <div key={step} className="flex flex-col items-center gap-2 p-4 rounded-lg"
                style={{ background: "rgba(200,165,255,0.08)", border: "2px solid #c8a8ff" }}>
                <div className="text-3xl">
                  <PixelEmoji>{icon}</PixelEmoji>
                </div>
                <div className="font-display text-xs px-2 py-1 rounded-full"
                  style={{ background: "#c8a8ff", color: "#2a1a3a" }}>
                  Step {step}
                </div>
                <p className="font-body text-sm text-center" style={{ color: "#d8c8f0" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <footer className="relative z-10 text-center pt-24 pb-16 font-body text-xs"
        style={{ color: "#a890c8", opacity: 0.6 }}>
        Made with <PixelEmoji>💜</PixelEmoji> and a lot of bad drawings
      </footer>
    </div>
  );
}