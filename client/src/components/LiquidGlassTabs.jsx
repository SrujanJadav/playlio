import { useState, useEffect, useRef } from "react";

function GlassFilter() {
  return (
    <svg className="hidden" aria-hidden="true">
      <defs>
        <filter
          id="liquid-glass-filter"
          x="0%" y="0%"
          width="100%" height="100%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04 0.04"
            numOctaves="1"
            seed="2"
            result="turbulence"
          />
          <feGaussianBlur in="turbulence" stdDeviation="1.5" result="blurredNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurredNoise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="B"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="2.5" result="finalBlur" />
          <feComposite in="finalBlur" in2="finalBlur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}

export default function LiquidGlassTabs({ tabs, activeTab, onChange }) {
  const [isTouch,    setIsTouch]    = useState(false);
  const [hovered,    setHovered]    = useState(null);
  const [pressed,    setPressed]    = useState(null);

  // Slider pill tracking
  const containerRef  = useRef(null);
  const buttonRefs    = useRef({});
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [targetId,    setTargetId]    = useState(activeTab); // what the slider is sliding TO

  useEffect(() => {
    setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Move slider to hovered tab (or back to active if no hover)
  const moveSliderTo = (id) => {
    const btn = buttonRefs.current[id];
    const container = containerRef.current;
    if (!btn || !container) return;
    const cr  = container.getBoundingClientRect();
    const br  = btn.getBoundingClientRect();
    setSliderStyle({
      left:    br.left - cr.left,
      width:   br.width,
      opacity: 1,
    });
    setTargetId(id);
  };

  // On mount and when activeTab changes, place slider on active tab
  useEffect(() => {
    // slight delay so refs are measured after render
    const t = setTimeout(() => moveSliderTo(activeTab), 20);
    return () => clearTimeout(t);
  }, [activeTab]);

  const handleMouseEnter = (id) => {
    if (isTouch) return;
    setHovered(id);
    moveSliderTo(id);
  };

  const handleMouseLeave = () => {
    setHovered(null);
    setPressed(null);
    moveSliderTo(activeTab); // slide back to active
  };

  return (
    <>
      <GlassFilter />

      {/* Outer pill container */}
      <div
        ref={containerRef}
        className="relative flex gap-0 mb-8 w-fit"
        style={{
          padding: "5px",
          borderRadius: "999px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(6px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Sliding glass pill ── */}
        <div
          aria-hidden="true"
          style={{
            position:   "absolute",
            top:        "5px",
            height:     "calc(100% - 10px)",
            left:       sliderStyle.left,
            width:      sliderStyle.width,
            opacity:    sliderStyle.opacity,
            borderRadius: "999px",
            pointerEvents: "none",
            transition: "left 280ms cubic-bezier(0.34,1.2,0.64,1), width 280ms cubic-bezier(0.34,1.2,0.64,1), opacity 180ms ease",
            background: targetId === activeTab
              ? "rgba(200,120,255,0.12)"
              : "rgba(255,255,255,0.06)",
            backdropFilter: 'url("#liquid-glass-filter") blur(2px)',
            boxShadow: targetId === activeTab
              ? "inset 0 0 0 1px rgba(200,120,255,0.25), inset 0 1px 0 rgba(255,255,255,0.18), 0 0 16px rgba(200,120,255,0.15)"
              : "inset 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        />

        {/* ── Tabs ── */}
        {tabs.map(t => {
          const isActive  = activeTab === t.id;
          const isHovered = hovered === t.id;
          const isPressed = pressed === t.id;

          return (
            <button
              key={t.id}
              ref={el => { buttonRefs.current[t.id] = el; }}
              onClick={() => onChange(t.id)}
              onMouseEnter={() => handleMouseEnter(t.id)}
              onMouseDown={() => setPressed(t.id)}
              onMouseUp={() => setPressed(null)}
              onTouchStart={() => { setPressed(t.id); onChange(t.id); }}
              onTouchEnd={() => setPressed(null)}
              className="font-body relative z-10 cursor-target"
              style={{
                padding: "9px 24px",
                borderRadius: "999px",
                border: "none",
                background: "transparent",
                color: isActive
                  ? "rgba(240,224,255,0.95)"
                  : isHovered
                  ? "rgba(240,224,255,0.7)"
                  : "rgba(240,224,255,0.35)",
                fontSize: "15px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "color 200ms ease, transform 150ms ease",
                transform: isPressed ? "scale(0.95)" : "scale(1)",
                textShadow: isActive
                  ? "0 0 14px rgba(200,120,255,0.7)"
                  : "none",
                whiteSpace: "nowrap",
                letterSpacing: "0.3px",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </>
  );
}