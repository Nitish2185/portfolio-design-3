"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

type Props = {
  text: string;
  className?: string;
  /** Font width (%) far from / right under the cursor */
  min?: number;
  max?: number;
  /** Distance in px over which the effect fades out */
  radius?: number;
};

/** Each letter widens as the cursor gets close (variable font width axis). */
export function ProximityText({ text, className = "", min = 60, max = 150, radius = 260 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const letters = gsap.utils.toArray<HTMLElement>(".px-letter", ref.current);
      const setters = letters.map((el) => gsap.quickTo(el, "--w", { duration: 0.5, ease: "power3" }));
      const onMove = (e: PointerEvent) => {
        letters.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          setters[i](min + (max - min) * Math.max(0, 1 - dist / radius));
        });
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: ref },
  );

  return (
    <span ref={ref} aria-label={text} className={className}>
      {text.split(" ").map((word, w) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {Array.from(word).map((c, i) => (
            <span
              key={i}
              aria-hidden
              className="px-letter inline-block [font-stretch:calc(var(--w)*1%)]"
              style={{ ["--w" as string]: min }}
            >
              {c}
            </span>
          ))}
          <span aria-hidden>&nbsp;</span>
        </span>
      ))}
    </span>
  );
}
