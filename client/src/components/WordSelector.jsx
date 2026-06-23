import React from "react";
import PixelButton from "./PixelButton";
import PixelPanel from "./PixelPanel";
import PixelEmoji from "./PixelEmoji";

export default function WordSelector({
  options = [],
  isSelector = false,
  drawerName = "Drawer",
  seconds = 5,
  onSelect,
  catBorder = "#39ff88",
}) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
      style={{
        background: "rgba(10, 6, 20, 0.8)",
        borderRadius: "16px",
        minHeight: "450px",
      }}
    >
      <PixelPanel
        borderColor={catBorder}
        background="rgba(15, 10, 30, 0.75)"
        className="max-w-md w-full p-8 relative flex flex-col items-center justify-center gap-6"
        style={{
          boxShadow: `0 0 30px ${catBorder}22, inset 0 0 20px rgba(0, 0, 0, 0.8)`,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Floating Scanlines/CRT effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
            backgroundSize: "100% 4px, 6px 100%",
            opacity: 0.85,
          }}
        />

        {/* Header Section */}
        {isSelector ? (
          <>
            <div className="text-4xl animate-bounce mb-2">
              <PixelEmoji>✏️</PixelEmoji>
            </div>
            <h2
              className="font-display text-xl sm:text-2xl text-glow-soft uppercase tracking-wider"
              style={{ color: catBorder }}
            >
              Choose a Word
            </h2>
            <p className="font-body text-sm" style={{ color: "#d8c8f0" }}>
              Quickly select one of the following words to start drawing!
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl animate-pulse mb-2">
              <PixelEmoji>⏳</PixelEmoji>
            </div>
            <h2
              className="font-display text-xl sm:text-2xl text-glow-soft uppercase tracking-wider"
              style={{ color: catBorder }}
            >
              Drawer is Choosing
            </h2>
            <p className="font-body text-sm" style={{ color: "#d8c8f0" }}>
              Please wait while <span className="font-bold text-[#f0e0ff]">{drawerName}</span> picks a word...
            </p>
          </>
        )}

        {/* Timer Readout */}
        <div
          className="font-display text-5xl sm:text-6xl my-4 text-glow-soft"
          style={{
            color: seconds <= 2 ? "#ff5555" : catBorder,
            textShadow: seconds <= 2 ? "0 0 20px #ff5555aa" : `0 0 20px ${catBorder}aa`,
            animation: seconds <= 2 ? "pulse 0.5s infinite alternate" : "none",
          }}
        >
          {seconds}s
        </div>

        {/* Options List */}
        {isSelector && options.length > 0 && (
          <div className="flex flex-col gap-4 w-full mt-2 relative z-10">
            {options.map((word, idx) => (
              <PixelButton
                key={word}
                onClick={() => onSelect(word)}
                background={`linear-gradient(135deg, ${catBorder}22, rgba(200, 168, 255, 0.08))`}
                borderColor={catBorder}
                className="w-full py-4 text-base sm:text-lg font-bold font-display tracking-wider text-glow-soft capitalize hover:scale-105 active:scale-95 transition-transform"
                textColor="#f0e0ff"
              >
                {word}
              </PixelButton>
            ))}
          </div>
        )}

        {!isSelector && (
          <div className="flex gap-2 justify-center items-center mt-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c8a8ff] animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#84c8ff] animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2.5 h-2.5 rounded-full bg-[#6dd5a8] animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        )}
      </PixelPanel>
    </div>
  );
}
