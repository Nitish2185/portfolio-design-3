"use client";

import { useRef } from "react";
import { gsap, scramble, useGSAP } from "@/lib/gsap";

type Props = { label: string; note?: string; className?: string };

/** Section opener: a rule that draws across, and a label that decodes into place. */
export function SectionHead({ label, note, className = "" }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".sh-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "expo.inOut",
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            onEnter: () => scramble(labelRef.current, label.toUpperCase(), 0.8),
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <div ref={root} className={`relative pt-3 ${className}`}>
      <div className="sh-rule absolute inset-x-0 top-0 h-0.5 origin-left bg-current" />
      <div className="flex items-start justify-between gap-6">
        <span className="tag flex items-center gap-2">
          {/* Yellow on red/black sections, red on white ones */}
          <span className="inline-block size-2.5 bg-signal [[data-tone=light]_&]:bg-primary" />
          <span ref={labelRef}>{label.toUpperCase()}</span>
        </span>
        {note && <span className="tag text-right opacity-60">{note}</span>}
      </div>
    </div>
  );
}
