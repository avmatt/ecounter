type CounterValueProps = {
  value: number;
};

export const CounterValue = ({ value }: CounterValueProps) => {
  return (
    <section
      className="rounded-2xl border border-slate-200/20 bg-slate-900/55 p-4 text-center"
      aria-live="polite"
      aria-atomic="true"
    >
      <p className="m-0 text-[0.8rem] uppercase tracking-[0.05em] text-sky-200">Current count</p>
      <p className="my-[0.35rem] text-[clamp(2rem,7vw,3.1rem)] leading-none font-bold [font-family:'Space_Grotesk',sans-serif]">
        {value}
      </p>
      <p className="m-0 text-[0.86rem] text-slate-300">Saved in your browser automatically</p>
    </section>
  );
};
