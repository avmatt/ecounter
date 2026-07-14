import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type Swimmer = {
  x: number;
  y: number;
  speed: number;
  size: number;
  rotate: number;
  opacity: number;
  wiggleFrequency: number;
  wiggleOffset: number;
};

export type SwimmerBackgroundHandle = {
  spawnFromCount: (count: number) => void;
};

const EFFECTIVE_TARGET = 20;
const MAX_SPAWN_AT_ZERO = 500;
const MAX_ACTIVE_SWIMMERS = 500;
const MAX_SPAWN_PER_FRAME = 12;

const X_START_MIN = -26;
const X_START_RANGE = 18;
const Y_MAX = 100;
const SPEED_MIN = 6;
const SPEED_RANGE = 18;
const SIZE_MIN = 10;
const SIZE_RANGE = 14;
const ROTATE_MIN = -25;
const ROTATE_RANGE = 50;
const OPACITY_MIN = 0.2;
const OPACITY_RANGE = 0.6;
const WIGGLE_DURATION_MIN = 0.4;
const WIGGLE_DURATION_RANGE = 0.6;
const WIGGLE_OFFSET_MAX = 1.2;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const createSwimmer = (): Swimmer => {
  const wiggleDuration =
    WIGGLE_DURATION_MIN + Math.random() * WIGGLE_DURATION_RANGE;

  return {
    x: X_START_MIN + Math.random() * X_START_RANGE,
    y: Math.random() * Y_MAX,
    speed: SPEED_MIN + Math.random() * SPEED_RANGE,
    size: SIZE_MIN + Math.random() * SIZE_RANGE,
    rotate: ROTATE_MIN + Math.random() * ROTATE_RANGE,
    opacity: OPACITY_MIN + Math.random() * OPACITY_RANGE,
    wiggleFrequency: (Math.PI * 2) / wiggleDuration,
    wiggleOffset: -(Math.random() * WIGGLE_OFFSET_MAX),
  };
};

const drawSwimmer = (
  context: CanvasRenderingContext2D,
  swimmer: Swimmer,
  width: number,
  height: number,
  timeSeconds: number,
) => {
  const x = (swimmer.x / 100) * width;
  const y = (swimmer.y / 100) * height;
  const wag =
    Math.sin(timeSeconds * swimmer.wiggleFrequency + swimmer.wiggleOffset) *
    swimmer.size *
    0.22;

  context.save();
  context.translate(x, y);
  context.rotate((swimmer.rotate * Math.PI) / 180);
  context.globalAlpha = swimmer.opacity;

  context.fillStyle = "white";
  context.beginPath();
  context.ellipse(
    0,
    0,
    swimmer.size * 0.7,
    swimmer.size * 0.42,
    0,
    0,
    Math.PI * 2,
  );
  context.fill();

  context.beginPath();
  context.moveTo(-swimmer.size * 0.65, 0);
  context.lineTo(-swimmer.size * 1.15, -swimmer.size * 0.38 + wag);
  context.lineTo(-swimmer.size * 1.15, swimmer.size * 0.38 + wag);
  context.closePath();
  context.fill();

  context.restore();
};

export const SwimmerBackground = forwardRef<SwimmerBackgroundHandle>(
  (_, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const swimmersRef = useRef<Swimmer[]>([]);
    const targetCountRef = useRef(0);

    useEffect(() => {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      let frameId = 0;
      let lastTime = performance.now();

      const resizeCanvas = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.floor(canvas.clientWidth));
        const height = Math.max(1, Math.floor(canvas.clientHeight));

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
      };

      const step = (time: number) => {
        const dt = Math.min((time - lastTime) / 1000, 0.05);
        lastTime = time;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const targetCount = targetCountRef.current;

        let swimmers = swimmersRef.current
          .map((swimmer) => ({ ...swimmer, x: swimmer.x + swimmer.speed * dt }))
          .filter((swimmer) => swimmer.x < 110);

        if (swimmers.length < targetCount) {
          const toSpawn = Math.min(
            targetCount - swimmers.length,
            MAX_SPAWN_PER_FRAME,
          );

          for (let index = 0; index < toSpawn; index += 1) {
            swimmers.push(createSwimmer());
          }
        }

        if (swimmers.length > targetCount) {
          swimmers = swimmers.slice(swimmers.length - targetCount);
        }

        swimmersRef.current = swimmers;

        context.clearRect(0, 0, width, height);
        const timeSeconds = time / 1000;

        for (const swimmer of swimmers) {
          drawSwimmer(context, swimmer, width, height, timeSeconds);
        }

        frameId = window.requestAnimationFrame(step);
      };

      resizeCanvas();
      frameId = window.requestAnimationFrame(step);
      window.addEventListener("resize", resizeCanvas);

      return () => {
        window.removeEventListener("resize", resizeCanvas);
        window.cancelAnimationFrame(frameId);
      };
    }, []);

    const spawnFromCount = useCallback((currentCount: number) => {
      const clampedCount = clamp(currentCount, 0, EFFECTIVE_TARGET);
      const ratio = (EFFECTIVE_TARGET - clampedCount) / EFFECTIVE_TARGET;
      const desiredCount = Math.round(ratio * MAX_SPAWN_AT_ZERO);

      targetCountRef.current = clamp(desiredCount, 0, MAX_ACTIVE_SWIMMERS);
    }, []);

    useImperativeHandle(ref, () => ({ spawnFromCount }), [spawnFromCount]);

    return (
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      />
    );
  },
);

SwimmerBackground.displayName = "SwimmerBackground";
