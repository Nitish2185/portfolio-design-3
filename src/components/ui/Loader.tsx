"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, SCRAMBLE_CHARS, useGSAP } from "@/lib/gsap";
import { finishIntro } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { site } from "@/content/site";

const COLS = 10;
const ROWS = 6;
const SEEN_KEY = "intro-seen";

/**
 * Intro: a wall of black tiles. The name decodes from random characters
 * while its letters stretch from narrow to wide and a percentage counts up.
 * Then the tiles collapse outward from the centre to reveal the site.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      lockScroll();

      const done = () => {
        unlockScroll();
        gsap.set(el, { display: "none" });
        try {
          sessionStorage.setItem(SEEN_KEY, "1");
        } catch {}
      };

      if (prefersReducedMotion()) {
        finishIntro();
        done();
        return;
      }

      let seen = false;
      try {
        seen = sessionStorage.getItem(SEEN_KEY) === "1";
      } catch {}

      const q = gsap.utils.selector(el);
      const duration = seen ? 1 : 2.4;
      const percent = { value: 0 };
      const percentEl = q(".ld-percent")[0];

      const tl = gsap.timeline({ onComplete: done });
      tl.fromTo(q(".ld-tile"), { scale: 0 }, { scale: 1, duration: 0.5, ease: "power2.out", stagger: { grid: [ROWS, COLS], from: "random", amount: 0.4 } }, 0)
        .to(q(".ld-name"), { duration, scrambleText: { text: site.name, chars: SCRAMBLE_CHARS, speed: 0.5, revealDelay: duration * 0.5 } }, 0.2)
        .fromTo(q(".ld-name"), { fontStretch: "50%" }, { fontStretch: "150%", duration, ease: "power2.inOut" }, 0.2)
        .fromTo(q(".ld-bar"), { scaleY: 0 }, { scaleY: 1, duration, ease: "power2.inOut" }, 0.2)
        .to(
          percent,
          {
            value: 100,
            duration,
            ease: "power2.inOut",
            onUpdate: () => {
              percentEl.textContent = `${String(Math.round(percent.value)).padStart(3, "0")}%`;
            },
          },
          0.2,
        )
        .to(q(".ld-ui"), { autoAlpha: 0, y: -20, duration: 0.4, ease: "power2.in" }, ">0.15")
        .to(q(".ld-name"), { scale: 1.6, autoAlpha: 0, duration: 0.6, ease: "power3.in" }, "<")
        .to(
          q(".ld-tile"),
          { scale: 0, duration: 0.6, ease: "power3.inOut", stagger: { grid: [ROWS, COLS], from: "center", amount: 0.6 } },
          "<0.2",
        )
        .call(finishIntro, [], "<0.5");
    },
    { scope: root },
  );

  return (
    <div ref={root} role="status" aria-label="Loading" className="loader fixed inset-0 z-[400] select-none">
      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <div key={i} className="ld-tile -m-px bg-ink" />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center px-4 text-snow">
        <p className="ld-name font-display text-[11vw] leading-none font-black whitespace-nowrap uppercase md:text-[8vw]">
          {site.name}
        </p>
      </div>

      <div className="ld-ui container-x absolute inset-x-0 bottom-0 flex items-end justify-between pb-6 text-snow">
        <span className="tag">
          {site.name}
          <br />
          Portfolio {site.year}
        </span>
        <span className="ld-percent font-display text-5xl font-black tabular-nums md:text-7xl">000%</span>
      </div>

      <div className="ld-ui absolute top-0 bottom-0 left-0 w-1.5 bg-white/10">
        <div className="ld-bar h-full w-full origin-top bg-signal" style={{ transform: "scaleY(0)" }} />
      </div>
    </div>
  );
}
