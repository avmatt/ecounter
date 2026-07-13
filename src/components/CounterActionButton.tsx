import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

type CounterActionButtonProps = PropsWithChildren<
  {
    variant?: "solid" | "ghost";
  } & ButtonHTMLAttributes<HTMLButtonElement>
>;

export const CounterActionButton = ({
  children,
  className = "",
  variant = "solid",
  ...buttonProps
}: CounterActionButtonProps) => {
  const variantClassName =
    variant === "solid"
      ? "bg-white/90 text-slate-900 hover:bg-white"
      : "bg-white/10 text-slate-100 hover:bg-white/20";

  return (
    <button
      className={`h-[2.9rem] cursor-pointer rounded-[0.85rem] border-0 font-bold transition duration-150 ease-out hover:-translate-y-px hover:saturate-110 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200 max-[32rem]:h-[2.7rem] ${variantClassName} ${className}`.trim()}
      {...buttonProps}
    >
      {children}
    </button>
  );
};
