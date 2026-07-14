import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Swimmer = {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  rotate: number;
  opacity: number;
  wiggleDuration: number;
  wiggleOffset: number;
};

export type SwimmerBackgroundHandle = {
  spawnFromCount: (count: number) => void;
};

const EFFECTIVE_TARGET = 20;
const MAX_SPAWN_AT_ZERO = 500;
const MAX_ACTIVE_SWIMMERS = 500;

const X_START_MIN = -26;
const X_START_RANGE = 18;
const Y_MAX = 100;
const SPEED_MIN = 0.2;
const SPEED_RANGE = 1;
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

const createSwimmer = (id: number): Swimmer => ({
  id,
  x: X_START_MIN + Math.random() * X_START_RANGE,
  y: Math.random() * Y_MAX,
  speed: SPEED_MIN + Math.random() * SPEED_RANGE,
  size: SIZE_MIN + Math.random() * SIZE_RANGE,
  rotate: ROTATE_MIN + Math.random() * ROTATE_RANGE,
  opacity: OPACITY_MIN + Math.random() * OPACITY_RANGE,
  wiggleDuration: WIGGLE_DURATION_MIN + Math.random() * WIGGLE_DURATION_RANGE,
  wiggleOffset: -(Math.random() * WIGGLE_OFFSET_MAX),
});

export const SwimmerBackground = forwardRef<SwimmerBackgroundHandle>((_, ref) => {
  const [swimmers, setSwimmers] = useState<Swimmer[]>([]);
  const idRef = useRef(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSwimmers((previous) =>
        previous
          .map((swimmer) => ({ ...swimmer, x: swimmer.x + swimmer.speed }))
          .filter((swimmer) => swimmer.x < 110),
      );
    }, 40);

    return () => window.clearInterval(timer);
  }, []);

  const spawnFromCount = useCallback((currentCount: number) => {
    const clampedCount = clamp(currentCount, 0, EFFECTIVE_TARGET);
    const ratio = (EFFECTIVE_TARGET - clampedCount) / EFFECTIVE_TARGET;
    const spawnCount = Math.round(ratio * MAX_SPAWN_AT_ZERO);

    if (spawnCount <= 0) {
      return;
    }

    setSwimmers((previous) => {
      const nextBatch: Swimmer[] = Array.from({ length: spawnCount }, () =>
        createSwimmer(idRef.current++),
      );

      return [...previous, ...nextBatch].slice(-MAX_ACTIVE_SWIMMERS);
    });
  }, []);

  useImperativeHandle(ref, () => ({ spawnFromCount }), [spawnFromCount]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      {swimmers.map((swimmer) => (
        <div
          key={swimmer.id}
          className="absolute will-change-transform"
          style={{
            left: `${swimmer.x}%`,
            top: `${swimmer.y}%`,
            transform: `rotate(${swimmer.rotate}deg)`,
            opacity: swimmer.opacity,
          }}
        >
          <svg
            width={swimmer.size * 1.8}
            height={swimmer.size}
            viewBox="0 0 54 30"
            fill="none"
          >
            <ellipse cx="44" cy="15" rx="8" ry="6" fill="white" />
            <path
              d="M4 15C14 6 22 24 30 15C35 10 39 11 44 15"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate
                attributeName="d"
                dur={`${swimmer.wiggleDuration}s`}
                repeatCount="indefinite"
                begin={`${swimmer.wiggleOffset}s`}
                values="M4 15C14 6 22 24 30 15C35 10 39 11 44 15;M4 15C14 23 22 6 30 15C35 20 39 19 44 15;M4 15C14 6 22 24 30 15C35 10 39 11 44 15"
              />
            </path>
          </svg>
        </div>
      ))}
    </div>
  );
});

SwimmerBackground.displayName = "SwimmerBackground";