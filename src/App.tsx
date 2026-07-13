import { PersistentCounter } from "./components/PersistentCounter";

export const App = () => {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 bg-[radial-gradient(60rem_40rem_at_20%_20%,rgba(59,130,246,0.28),transparent_60%),radial-gradient(60rem_40rem_at_85%_80%,rgba(14,165,233,0.22),transparent_60%),linear-gradient(160deg,#0f172a,#1d4ed8)] p-5 text-slate-200 [font-family:'Outfit',sans-serif]">
      <div
        className="pointer-events-none absolute left-[-6rem] top-[10%] h-88 w-88 rounded-full bg-sky-400/45 blur-3xl animate-pulse [animation-duration:8s]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[8%] right-[-5rem] h-88 w-88 rounded-full bg-blue-400/45 blur-3xl animate-pulse [animation-delay:350ms] [animation-duration:8s]"
        aria-hidden="true"
      />
      <section className="relative z-10 w-full max-w-[30rem] rounded-3xl border border-slate-300/25 bg-gradient-to-br from-slate-900/85 to-slate-900/60 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.4)] backdrop-blur-sm max-[32rem]:rounded-[1.2rem] max-[32rem]:p-[1.1rem]">
        <p className="m-0 text-xs font-bold uppercase tracking-[0.12em] text-sky-300">ecounter</p>
        <h1 className="mt-[0.3rem] text-[clamp(1.6rem,4.5vw,2.2rem)] leading-[1.1] [font-family:'Space_Grotesk',sans-serif]">
          Count with confidence
        </h1>
        <p className="mb-5 mt-[0.65rem] leading-6 text-slate-300">
          A minimal counter with persistent state, so your value is remembered between visits.
        </p>
        <PersistentCounter />
      </section>
    </main>
  );
};
