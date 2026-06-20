import React from "react";

export default function PixelPanel({
  children,
  borderColor = "rgba(255, 255, 255, 0.35)",
  background = "rgba(10, 6, 18, 0.75)",
  className = "",
  style = {},
}) {
  return (
    <div
      className={`relative rounded-none border-none ${className}`}
      style={{
        background,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        boxShadow: "0 8px 40px rgba(255, 255, 255, 0.15), 0 4px 40px rgba(0, 0, 0, 0.5)",
        ...style,
      }}
    >
      {children}

      {/* Pixelated border — top edge */}
      <span className="absolute -top-1.5 left-1.5 w-1/2 h-1.5 pointer-events-none" style={{ background: borderColor }} />
      <span className="absolute -top-1.5 right-1.5 w-1/2 h-1.5 pointer-events-none" style={{ background: borderColor }} />

      {/* Pixelated border — bottom edge */}
      <span className="absolute -bottom-1.5 left-1.5 w-1/2 h-1.5 pointer-events-none" style={{ background: borderColor }} />
      <span className="absolute -bottom-1.5 right-1.5 w-1/2 h-1.5 pointer-events-none" style={{ background: borderColor }} />

      {/* Corner pixels */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 pointer-events-none" style={{ background: borderColor }} />
      <span className="absolute top-0 right-0 w-1.5 h-1.5 pointer-events-none" style={{ background: borderColor }} />
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 pointer-events-none" style={{ background: borderColor }} />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 pointer-events-none" style={{ background: borderColor }} />

      {/* Side pixels */}
      <span className="absolute top-1.5 -left-1.5 w-1.5 h-[calc(100%-12px)] pointer-events-none" style={{ background: borderColor }} />
      <span className="absolute top-1.5 -right-1.5 w-1.5 h-[calc(100%-12px)] pointer-events-none" style={{ background: borderColor }} />

      {/* Soft inner shadow strips for depth */}
      <span className="absolute top-0 left-0 w-full h-1.5 pointer-events-none" style={{ background: "rgba(0,0,0,0.15)" }} />
      <span className="absolute top-1.5 left-0 w-3 h-1.5 pointer-events-none" style={{ background: "rgba(0,0,0,0.15)" }} />
      <span className="absolute bottom-0 left-0 w-full h-1.5 pointer-events-none" style={{ background: "rgba(0,0,0,0.15)" }} />
      <span className="absolute bottom-1.5 right-0 w-3 h-1.5 pointer-events-none" style={{ background: "rgba(0,0,0,0.15)" }} />
    </div>
  );
}
