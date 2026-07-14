import { useMemo, useState } from "react";

import { CounterActionButton } from "./CounterActionButton";
import { CounterValue } from "./CounterValue";

const STORAGE_KEY = "ecounter:count";
const CLEARANCE_GOAL = 20;

const getInitialCount = () => {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  const parsed = Number(saved);

  return Number.isFinite(parsed) ? parsed : 0;
};

type PersistentCounterProps = {
  onCountAction?: (count: number) => void;
};

export const PersistentCounter = ({ onCountAction }: PersistentCounterProps) => {
  const [count, setCount] = useState(() => getInitialCount());

  const actions = useMemo(
    () => ({
      increment: () => {
        setCount((previous) => {
          const next = previous + 1;
          window.localStorage.setItem(STORAGE_KEY, String(next));
          onCountAction?.(next);
          return next;
        });
      },
      decrement: () => {
        setCount((previous) => {
          const next = previous - 1;
          window.localStorage.setItem(STORAGE_KEY, String(next));
          onCountAction?.(next);
          return next;
        });
      },
      reset: () => {
        setCount(0);
        window.localStorage.setItem(STORAGE_KEY, "0");
      },
    }),
    [onCountAction],
  );

  return (
    <section className="grid gap-4">
      <CounterValue value={count} goal={CLEARANCE_GOAL} />
      <div className="grid grid-cols-2 gap-3">
        <CounterActionButton onClick={actions.decrement} aria-label="Decrease count">
          -1
        </CounterActionButton>
        <CounterActionButton onClick={actions.increment} aria-label="Increase count">
          +1
        </CounterActionButton>
      </div>
      <CounterActionButton
        variant="ghost"
        onClick={actions.reset}
        aria-label="Reset count to zero"
      >
        Reset
      </CounterActionButton>
    </section>
  );
};
