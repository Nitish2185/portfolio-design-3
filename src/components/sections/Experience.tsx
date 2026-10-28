"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, SCRAMBLE_CHARS, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { experience } from "@/content/site";
import { SectionHead } from "@/components/ui/SectionHead";

const COLUMNS = [
  { key: "period", label: "Period", width: 9, offset: 0 },
  { key: "role", label: "Role", width: 13, offset: 9 },
  { key: "company", label: "Company", width: 12, offset: 22 },
  { key: "status", label: "Status", width: 6, offset: 34 },
] as const;

/** A row of split-flap tiles for one value. */
function Flaps({ text, width, offset, accent = false }: { text: string; width: number; offset: number; accent?: boolean }) {
  const chars = Array.from(text.padEnd(width, " ").slice(0, width));
  return (
    <span aria-label={text} className="flex gap-[0.12em]">
      {chars.map((c, i) => (
        <span
          key={i}
          aria-hidden
          data-char={c}
          data-col={offset + i}
          className={`fl-tile relative flex h-[1.55em] w-[1.05em] items-center justify-center overflow-hidden rounded-[2px] bg-[#1a1a22] [perspective:200px] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-black/30 ${
            accent ? "text-signal" : "text-snow"
          }`}
        >
          <span className="fl-char inline-block origin-center font-display font-bold">{c === " " ? " " : c}</span>
        </span>
      ))}
    </span>
  );
}

/** Flips each tile through random characters before landing on its own. */
function flipTiles(tiles: HTMLElement[]) {
  tiles.forEach((tile) => {
    const final = tile.dataset.char ?? " ";
    const ch = tile.querySelector<HTMLElement>(".fl-char");
    if (!ch || final === " ") return;
    const col = Number(tile.dataset.col ?? 0);
    const tl = gsap.timeline({ delay: col * 0.025 + Math.random() * 0.15 });
    const flips = 3 + Math.floor(Math.random() * 6);
    for (let k = 0; k < flips; k++) {
      tl.call(() => {
        ch.textContent = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).fromTo(ch, { rotateX: -90 }, { rotateX: 0, duration: 0.07, ease: "none" });
    }
    tl.call(() => {
      ch.textContent = final;
    }).fromTo(ch, { rotateX: -90 }, { rotateX: 0, duration: 0.16, ease: "back.out(3)" });
  });
}

/**
 * Career history as a departures board: every character flips through
 * random letters before settling. Hovering a row flips it again.
 */
export function Experience() {
  const root = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tiles = gsap.utils.toArray<HTMLElement>(".fl-tile", root.current);
      tiles.forEach((tile) => {
        const ch = tile.querySelector<HTMLElement>(".fl-char");
        if (ch && tile.dataset.char !== " ") ch.textContent = " ";
      });
      ScrollTrigger.create({
        trigger: root.current?.querySelector(".fl-board"),
        start: "top 75%",
        once: true,
        onEnter: () => flipTiles(tiles),
      });
    },
    { scope: root },
  );

  const flipRow = contextSafe((row: HTMLElement) => {
    if (prefersReducedMotion()) return;
    flipTiles(gsap.utils.toArray<HTMLElement>(".fl-tile", row));
  });

  return (
    <section ref={root} id="experience" data-section="Experience" className="relative bg-ink py-24 text-snow md:py-36">
      <SectionHead label="Experience" note="Departures — career log" className="container-x mb-12 md:mb-16" />

      <div className="container-x">
        <div className="fl-board overflow-hidden border-2 border-snow/15 bg-black p-3 text-[4.2vw] md:p-6 md:text-[1.2vw]">
          {/* Header row */}
          <div className="tag mb-4 hidden grid-cols-[9fr_13fr_12fr_6fr] gap-[1.2em] text-snow/50 md:grid">
            {COLUMNS.map((c) => (
              <span key={c.key}>{c.label}</span>
            ))}
          </div>

          <ul className="flex flex-col gap-5 md:gap-3">
            {experience.map((job) => (
              <li
                key={job.role}
                onPointerEnter={(e) => flipRow(e.currentTarget)}
                className="group -mx-2 flex flex-col gap-[0.35em] rounded-sm p-2 transition-colors duration-300 hover:bg-blue/40 md:grid md:grid-cols-[9fr_13fr_12fr_6fr] md:gap-[1.2em]"
              >
                {COLUMNS.map((c) => (
                  <span key={c.key} className="flex items-center gap-2">
                    <Flaps text={job[c.key]} width={c.width} offset={c.offset} accent={c.key === "status" && job.status === "ACTIVE"} />
                    {c.key === "status" && job.status === "ACTIVE" && (
                      <span aria-hidden className="inline-block size-[0.5em] animate-blink bg-signal" />
                    )}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        </div>
        <p className="tag mt-4 flex justify-between text-snow/50">
          <span>All times local — lorem ipsum</span>
          <span>Hover a row to refresh</span>
        </p>
      </div>
    </section>
  );
}
