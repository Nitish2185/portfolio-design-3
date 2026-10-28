import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  download?: boolean;
  /** "ink" for light backgrounds, "snow" for red/dark ones */
  tone?: "ink" | "snow";
};

/** Square button: colour sweeps in from the left and the arrow slides through. */
export function BoxButton({ href, children, className = "", download, tone = "ink" }: Props) {
  const toneClass =
    tone === "ink" ? "border-ink text-ink hover:text-snow [--fill:var(--color-primary)]" : "border-snow text-snow hover:text-ink [--fill:var(--color-snow)]";
  return (
    <a
      href={href}
      download={download}
      className={`group/box relative inline-flex items-center gap-6 overflow-hidden border-2 px-5 py-4 font-display text-sm font-black uppercase transition-colors duration-500 ease-snap ${toneClass} ${className}`}
    >
      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-[var(--fill)] transition-transform duration-500 ease-snap group-hover/box:scale-x-100" />
      <span className="relative">{children}</span>
      <span aria-hidden className="relative h-4 w-5 overflow-hidden">
        <span className="absolute inset-0 transition-transform duration-500 ease-snap group-hover/box:translate-x-full">→</span>
        <span className="absolute inset-0 -translate-x-full transition-transform duration-500 ease-snap group-hover/box:translate-x-0">→</span>
      </span>
    </a>
  );
}
