export default function PixelInput({
  placeholder = "",
  value,
  onChange,
  onKeyDown,
  type = "text",
  maxLength,
  disabled = false,
  className = "",
  style = {},
  autoFocus = false,
  theme = "light",
}) {
  const isDark = theme === "dark";
  const borderColor = isDark ? "rgba(255, 255, 255, 0.35)" : "var(--ink)";
  const textColor = isDark ? "#ffffff" : "var(--ink)";

  return (
    <div
      className={`relative flex items-center ${className}`}
      style={{ padding: 0, ...style }}
    >
      {/* Top + bottom thick pixel border */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        autoFocus={autoFocus}
        autoComplete="off"
        className={`font-body w-full bg-transparent outline-none px-3 py-4 ${isDark ? "placeholder-white/40" : ""}`}
        style={{
          borderTop: `4px solid ${borderColor}`,
          borderBottom: `4px solid ${borderColor}`,
          borderLeft: "none",
          borderRight: "none",
          borderRadius: 0,
          color: textColor,
          fontSize: "18px",
        }}
      />

      {/* Left + right thick pixel side borders (extends 6px outside) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          borderLeft: `4px solid ${borderColor}`,
          borderRight: `4px solid ${borderColor}`,
          marginLeft: "-6px",
          marginRight: "-6px",
        }}
      />
    </div>
  );
}