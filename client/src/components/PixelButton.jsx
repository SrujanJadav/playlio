export default function PixelButton({
  children,
  onClick,
  type = "button",
  disabled = false,
  background = "linear-gradient(135deg, #6a6a6a, #393939)",
  borderColor = "var(--ink)",
  textColor = "white",
  className = "",
  style = {},
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-1.5 rounded-none border-none font-display transition-all active:translate-y-1 hover:-translate-y-2 cursor-target ${className}`}
      style={{
        background,
        color: textColor,
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? "default" : "pointer",
        ...style,
      }}
    >
      {children}

      {/* Pixelated border — top edge (split in two with corner notches) */}
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
    </button>
  );
}