import { Outlet } from "react-router-dom";
import ArkanoidBackground from "../components/ArkanoidBackground";
import FaultyTerminal from "../components/FaultyTerminal";
import BackgroundMusic from "../components/BackgroundMusic";
import Navbar from "../components/Navbar";
import TargetCursor from "../components/TargetCursor";

/**
 * Shared layout for Lobby / Leaderboard / Profile pages.
 * Keeps heavy WebGL backgrounds mounted across navigations so they
 * never restart or flash white.
 */
export default function LobbyLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ background: "#0a0612" }}>
      <TargetCursor />
      <BackgroundMusic category="lobby" />

      {/* ── Persistent Background Animations ── */}
      <ArkanoidBackground opacity={0.35} />
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
          style={{ width: "100%", height: "100%", opacity: 0.45 }}
        />
      </div>

      {/* ── Persistent Navbar ── */}
      <div className="relative w-full z-50">
        <Navbar />
      </div>

      {/* ── Page Content (swapped by React Router) ── */}
      <Outlet />
    </div>
  );
}


