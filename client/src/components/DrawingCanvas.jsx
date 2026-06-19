import { useRef, useEffect, useState, useCallback } from "react";

const COLORS = [
  "#2D2438","#E63946","#FF9F1C","#FFBF69","#06D6A0",
  "#118AB2","#8338EC","#FF006E","#FFFFFF","#A8DADC",
];

export default function DrawingCanvas({ socket, roomCode, isDrawer }) {
  const canvasRef = useRef(null);
  const ctxRef    = useRef(null);
  const drawing   = useRef(false);
  const lastPos   = useRef({ x:0, y:0 });

  const [tool,      setTool]      = useState("pen");
  const [color,     setColor]     = useState("#2D2438");
  const [lineWidth, setLineWidth] = useState(6);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap  = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  // Listen for remote draw events
  useEffect(() => {
    if (!socket) return;

    const onDraw = ({ drawData }) => {
      const ctx = ctxRef.current;
      if (!ctx) return;
      ctx.strokeStyle = drawData.color;
      ctx.lineWidth   = drawData.lineWidth;
      ctx.globalCompositeOperation = drawData.tool === "eraser"
        ? "destination-out" : "source-over";
      ctx.beginPath();
      ctx.moveTo(drawData.x0, drawData.y0);
      ctx.lineTo(drawData.x1, drawData.y1);
      ctx.stroke();
    };

    const onClear = () => {
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    socket.on("draw_update",  onDraw);
    socket.on("canvas_cleared", onClear);
    return () => {
      socket.off("draw_update",  onDraw);
      socket.off("canvas_cleared", onClear);
    };
  }, [socket]);

  // Get canvas-relative coords
  const getPos = useCallback((e) => {
    const canvas = canvasRef.current;
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top)  * scaleY,
    };
  }, []);

  const drawLine = useCallback((x0, y0, x1, y1, emit = true) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth   = lineWidth;
    ctx.globalCompositeOperation = tool === "eraser"
      ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();

    if (emit && socket) {
      socket.emit("draw", {
        roomCode,
        drawData: { x0, y0, x1, y1, color, lineWidth, tool },
      });
    }
  }, [color, lineWidth, tool, socket, roomCode]);

  const startDraw = useCallback((e) => {
    if (!isDrawer) return;
    drawing.current = true;
    const pos = getPos(e);
    lastPos.current = pos;
  }, [isDrawer, getPos]);

  const draw = useCallback((e) => {
    if (!drawing.current || !isDrawer) return;
    e.preventDefault();
    const pos = getPos(e);
    drawLine(lastPos.current.x, lastPos.current.y, pos.x, pos.y);
    lastPos.current = pos;
  }, [isDrawer, getPos, drawLine]);

  const stopDraw = useCallback(() => {
    drawing.current = false;
  }, []);

  const clearCanvas = () => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket?.emit("clear_canvas", { roomCode });
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Tools bar — only shown to drawer */}
      {isDrawer && (
        <div className="flex items-center gap-3 flex-wrap p-3 rounded-2xl"
          style={{ background:"rgba(10, 6, 18, 0.8)", border:"1.5px solid rgba(255, 255, 255, 0.35)", backdropFilter: "blur(12px)" }}>
          
          {/* Pen / Eraser */}
          {[{id:"pen",label:"✏️ Pen"},{id:"eraser",label:"🧹 Eraser"}].map(t => (
            <button key={t.id} onClick={() => setTool(t.id)}
              className="btn-bounce px-3 py-1.5 rounded-xl font-body text-sm font-700 cursor-pointer"
              style={{
                background: tool === t.id ? "rgba(255, 255, 255, 0.15)" : "transparent",
                color: "#f0e0ff",
                border: tool === t.id ? "1.5px solid rgba(255, 255, 255, 0.5)" : "1.5px solid transparent",
              }}>
              {t.label}
            </button>
          ))}

          <div className="w-px h-6" style={{ background:"rgba(255,255,255,0.2)" }} />

          {/* Colors */}
          <div className="flex gap-1.5 flex-wrap">
            {COLORS.map(c => (
              <button key={c} onClick={() => { setColor(c); setTool("pen"); }}
                className="btn-bounce w-7 h-7 rounded-full cursor-pointer"
                style={{
                  background: c,
                  border: color === c && tool === "pen"
                    ? "3px solid #f0e0ff"
                    : "2px solid rgba(0,0,0,0.3)",
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                  boxShadow: color === c ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                }} />
            ))}
          </div>

          <div className="w-px h-6" style={{ background:"rgba(255,255,255,0.2)" }} />

          {/* Brush size */}
          <div className="flex items-center gap-2">
            <span className="font-body text-xs" style={{ color:"#d8c8f0" }}>Size</span>
            <input type="range" min={2} max={40} value={lineWidth}
              onChange={e => setLineWidth(+e.target.value)}
              className="w-20" style={{ accentColor:"#c8a8ff" }} />
            <div className="rounded-full bg-white/20 flex-shrink-0"
              style={{ width: Math.min(lineWidth, 24), height: Math.min(lineWidth, 24) }} />
          </div>

          <div className="ml-auto">
            <button onClick={clearCanvas}
              className="btn-bounce px-3 py-1.5 rounded-xl font-body text-sm font-700 cursor-pointer"
              style={{ background:"rgba(255, 99, 99, 0.2)", color:"#ff8888", border:"1.5px solid rgba(255, 99, 99, 0.5)" }}>
              🗑️ Clear
            </button>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="relative flex-1 rounded-2xl overflow-hidden"
        style={{
          border: isDrawer
            ? "3.5px solid rgba(255, 255, 255, 0.95)"
            : "2.5px solid rgba(255, 255, 255, 0.35)",
          background:"white",
          minHeight: "320px",
        }}>
        
        {!isDrawer && (
          <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-xl font-body text-sm font-700"
            style={{ background:"var(--pastel-purple)", color:"#6030a0" }}>
            👀 Watching…
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className={`w-full h-full ${isDrawer ? "canvas-draw" : ""}`}
          style={{ touchAction: "none", display:"block" }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
      </div>
    </div>
  );
}
