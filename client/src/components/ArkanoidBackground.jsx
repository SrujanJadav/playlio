import { useEffect, useRef } from "react";

// Retro brick row colors (top to bottom, Arkanoid-style)
const ROW_COLORS = [
  "#FF6B6B", // red
  "#FF9F1C", // orange
  "#FFD93D", // yellow
  "#C8F56B", // yellow-green
  "#8BE39F", // green
];

const BRICK_ROWS = 5;
const BRICK_COLS = 14;
const BRICK_HEIGHT = 18;
const BRICK_GAP = 4;
const BRICK_TOP_OFFSET = 40;

const PADDLE_WIDTH = 90;
const PADDLE_HEIGHT = 14;
const PADDLE_Y_OFFSET = 36; // distance from bottom

const BALL_RADIUS = 7;

export default function ArkanoidBackground({ opacity = 1}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width, height, brickWidth;
    let bricks = [];
    let paddleX = 0;
    let ball = { x: 0, y: 0, vx: 0, vy: 0 };
    let rafId;

    function layoutBricks() {
      brickWidth = (width - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;
      bricks = [];
      for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
          bricks.push({
            x: BRICK_GAP + col * (brickWidth + BRICK_GAP),
            y: BRICK_TOP_OFFSET + row * (BRICK_HEIGHT + BRICK_GAP),
            w: brickWidth,
            h: BRICK_HEIGHT,
            color: ROW_COLORS[row % ROW_COLORS.length],
            alive: true,
          });
        }
      }
    }

    function resetBall() {
      ball.x = width / 2;
      ball.y = height / 2;
      const speed = Math.max(3, width * 0.0035);
      const angle = (Math.random() * 0.6 + 0.2) * Math.PI; // downward-ish angle
      ball.vx = speed * Math.cos(angle) * (Math.random() < 0.5 ? 1 : -1);
      ball.vy = speed * 0.6 + Math.random() * speed * 0.4;
    }

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      paddleX = width / 2 - PADDLE_WIDTH / 2;
      layoutBricks();
      resetBall();
    }

    function update() {
      // AI paddle: smoothly track the ball's x position
      const paddleCenter = paddleX + PADDLE_WIDTH / 2;
      const targetX = ball.x;
      const diff = targetX - paddleCenter;
      paddleX += diff * 0.08;
      paddleX = Math.max(0, Math.min(width - PADDLE_WIDTH, paddleX));

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Wall collisions
      if (ball.x - BALL_RADIUS <= 0 || ball.x + BALL_RADIUS >= width) {
        ball.vx *= -1;
        ball.x = Math.max(BALL_RADIUS, Math.min(width - BALL_RADIUS, ball.x));
      }
      if (ball.y - BALL_RADIUS <= 0) {
        ball.vy *= -1;
        ball.y = BALL_RADIUS;
      }

      // Paddle collision
      const paddleY = height - PADDLE_Y_OFFSET;
      if (
        ball.vy > 0 &&
        ball.y + BALL_RADIUS >= paddleY &&
        ball.y + BALL_RADIUS <= paddleY + PADDLE_HEIGHT + 6 &&
        ball.x >= paddleX - BALL_RADIUS &&
        ball.x <= paddleX + PADDLE_WIDTH + BALL_RADIUS
      ) {
        ball.vy *= -1;
        // Add slight angle variation based on hit position
        const hitPos = (ball.x - (paddleX + PADDLE_WIDTH / 2)) / (PADDLE_WIDTH / 2);
        ball.vx += hitPos * 1.2;
        ball.y = paddleY - BALL_RADIUS;
      }

      // Brick collisions
      for (const brick of bricks) {
        if (!brick.alive) continue;
        if (
          ball.x + BALL_RADIUS > brick.x &&
          ball.x - BALL_RADIUS < brick.x + brick.w &&
          ball.y + BALL_RADIUS > brick.y &&
          ball.y - BALL_RADIUS < brick.y + brick.h
        ) {
          brick.alive = false;
          ball.vy *= -1;
          break;
        }
      }

      // Ball fell below screen → respawn + regenerate bricks if cleared
      if (ball.y - BALL_RADIUS > height) {
        resetBall();
      }

      // Regenerate bricks once all destroyed
      if (bricks.every(b => !b.alive)) {
        layoutBricks();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Bricks
      for (const brick of bricks) {
        if (!brick.alive) continue;
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
      }

      // Paddle
      ctx.fillStyle = "#84C8FF";
      ctx.fillRect(paddleX, height - PADDLE_Y_OFFSET, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    const FRAME_INTERVAL = 1000 / 30; // throttle to ~30 fps
    let lastFrameTime = 0;

    function loop(timestamp) {
      rafId = requestAnimationFrame(loop);
      if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = timestamp;
      update();
      draw();
    }

    resize();
    rafId = requestAnimationFrame(loop);

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        opacity,
        imageRendering: "pixelated",
        willChange: "opacity",
        pointerEvents: "none",
      }}
    />
  );
}