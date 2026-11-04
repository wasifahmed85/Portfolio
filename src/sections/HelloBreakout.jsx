import React from 'react';
import { useReducedMotion } from 'framer-motion';

/** 5×7 dot-matrix glyphs, just the letters the sign needs. */
const FONT = {
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
};
const LINES = ['HELLO', 'WORLD'];
const COLS = LINES[0].length * 6 - 1;
const ROWS = LINES.length * 9 - 2;
const FIELD_ROWS = ROWS + 16; // empty play space under the sign

function buildBricks() {
  const bricks = [];
  LINES.forEach((word, line) => {
    word.split('').forEach((letter, slot) => {
      FONT[letter].forEach((bits, row) => {
        bits.split('').forEach((bit, col) => {
          if (bit === '1') bricks.push({ c: slot * 6 + col, r: line * 9 + row, alive: true, fade: 1 });
        });
      });
    });
  });
  return bricks;
}

/**
 * The sign-off: "HELLO WORLD" in dots that double as breakout bricks.
 * An autopilot keeps the rally going until a visitor takes the paddle with mouse, touch or arrow keys.
 */
export default function HelloBreakout() {
  const canvasRef = React.useRef(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    let bricks = buildBricks();
    let cell = 10;
    let width = 0;
    let height = 0;
    let originX = 0;
    let originY = 0;
    let paddle = { x: 0, w: 0, target: 0 };
    let ball = { x: 0, y: 0, vx: 0, vy: 0, r: 0 };
    let manualUntil = 0;
    let frame = 0;
    let last = 0;
    let running = false;

    const serve = () => {
      ball.x = paddle.x;
      ball.y = height - cell * 3;
      const angle = (-Math.PI / 2) + (Math.random() - 0.5) * 0.9;
      const speed = cell * 26;
      ball.vx = Math.cos(angle) * speed;
      ball.vy = Math.sin(angle) * speed;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      cell = Math.max(5, Math.min(18, Math.floor((width * 0.7) / COLS)));
      height = cell * FIELD_ROWS;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      originX = Math.round((width - COLS * cell) / 2);
      originY = cell * 2;
      paddle.w = cell * 7;
      paddle.x = paddle.target = width / 2;
      ball.r = Math.max(3, cell * 0.38);
      serve();
      draw();
    };

    const brickAt = (x, y) => {
      const c = Math.floor((x - originX) / cell);
      const r = Math.floor((y - originY) / cell);
      return bricks.find((brick) => brick.alive && brick.c === c && brick.r === r);
    };

    const step = (dt) => {
      // Autopilot follows the ball, slightly late, so the rally looks human.
      if (performance.now() > manualUntil) paddle.target = ball.x + Math.sin(performance.now() / 700) * paddle.w * 0.25;
      paddle.x += (paddle.target - paddle.x) * Math.min(1, dt * 9);
      paddle.x = Math.max(paddle.w / 2, Math.min(width - paddle.w / 2, paddle.x));

      const nx = ball.x + ball.vx * dt;
      const ny = ball.y + ball.vy * dt;

      const hitX = brickAt(nx + Math.sign(ball.vx) * ball.r, ball.y);
      const hitY = brickAt(ball.x, ny + Math.sign(ball.vy) * ball.r);
      if (hitX) {
        hitX.alive = false;
        ball.vx *= -1;
      }
      if (hitY) {
        hitY.alive = false;
        ball.vy *= -1;
      }
      if (!hitX && !hitY) {
        ball.x = nx;
        ball.y = ny;
      }

      if (ball.x < ball.r || ball.x > width - ball.r) {
        ball.vx *= -1;
        ball.x = Math.max(ball.r, Math.min(width - ball.r, ball.x));
      }
      if (ball.y < ball.r) {
        ball.vy = Math.abs(ball.vy);
      }

      const paddleY = height - cell * 1.6;
      if (ball.vy > 0 && ball.y + ball.r >= paddleY && ball.y < paddleY + cell && Math.abs(ball.x - paddle.x) <= paddle.w / 2 + ball.r) {
        const offset = (ball.x - paddle.x) / (paddle.w / 2);
        const speed = Math.hypot(ball.vx, ball.vy);
        const angle = -Math.PI / 2 + offset * 1.05;
        ball.vx = Math.cos(angle) * speed;
        ball.vy = Math.sin(angle) * speed;
        ball.y = paddleY - ball.r;
      }
      if (ball.y > height + ball.r * 4) serve();

      bricks.forEach((brick) => {
        if (!brick.alive && brick.fade > 0) brick.fade = Math.max(0, brick.fade - dt * 3);
      });
      if (bricks.every((brick) => !brick.alive && brick.fade === 0)) bricks = buildBricks();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const inset = Math.max(1, cell * 0.14);
      bricks.forEach((brick) => {
        const alpha = brick.alive ? 1 : brick.fade;
        if (alpha <= 0) return;
        const x = originX + brick.c * cell + inset;
        const y = originY + brick.r * cell + inset;
        const size = cell - inset * 2;
        ctx.fillStyle = `rgba(245, 245, 244, ${0.92 * alpha})`;
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = `rgba(5, 5, 5, ${alpha})`;
        const hole = size * 0.42;
        ctx.fillRect(x + (size - hole) / 2, y + (size - hole) / 2, hole, hole);
      });

      const paddleY = height - cell * 1.6;
      ctx.fillStyle = '#f5f5f4';
      ctx.beginPath();
      ctx.roundRect(paddle.x - paddle.w / 2, paddleY, paddle.w, Math.max(4, cell * 0.45), 99);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const loop = (now) => {
      const dt = Math.min(0.033, (now - last) / 1000 || 0);
      last = now;
      step(dt);
      draw();
      frame = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const takeOver = (clientX) => {
      const rect = canvas.getBoundingClientRect();
      paddle.target = clientX - rect.left;
      manualUntil = performance.now() + 2500;
    };
    const onPointer = (event) => takeOver(event.clientX);
    const onKey = (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      paddle.target = paddle.x + (event.key === 'ArrowLeft' ? -1 : 1) * cell * 5;
      manualUntil = performance.now() + 2500;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);
    canvas.addEventListener('pointermove', onPointer);
    canvas.addEventListener('pointerdown', onPointer);
    canvas.addEventListener('keydown', onKey);

    return () => {
      stop();
      observer.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerdown', onPointer);
      canvas.removeEventListener('keydown', onKey);
    };
  }, [reduce]);

  return (
    <div className="hello">
      <p className="hello-hint">{reduce ? 'Hello, world.' : 'Break it if you can. It still ships.'}</p>
      <canvas
        ref={canvasRef}
        className="hello-canvas"
        tabIndex={0}
        role="img"
        aria-label="HELLO WORLD written in dots; a small breakout game you can play with the mouse or arrow keys"
      />
    </div>
  );
}
