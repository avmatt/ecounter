type CounterValueProps = {
  value: number;
  goal: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const CounterValue = ({ value, goal }: CounterValueProps) => {
  const clampedValue = clamp(value, 0, goal);
  const progressPercentage = goal > 0 ? (clampedValue / goal) * 100 : 0;

  return (
    <section
      className="rounded-2xl border border-slate-200/20 bg-slate-900/55 p-4"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="m-0 text-center text-[0.8rem] uppercase tracking-[0.05em] text-sky-200">
        Ejaculations logged
      </p>
      <p className="my-[0.35rem] text-center text-[clamp(2rem,7vw,3.1rem)] leading-none font-bold [font-family:'Space_Grotesk',sans-serif]">
        {value}
      </p>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sky-300/70 to-cyan-200/70 transition-[width] duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <p className="mt-2 text-center text-[0.82rem] text-slate-300">
        {clampedValue} of {goal} toward clearance goal
      </p>
      <p className="m-0 text-center text-[0.78rem] text-slate-400">
        Progress is stored locally on this device.
      </p>
    </section>
  );
};
