"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { scramble } from "@/lib/gsap";
import { getLenis } from "@/lib/scroll";
import { site } from "@/content/site";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { Menu } from "./Menu";

/**
 * HUD-style header: initials block, the current section name (decodes when
 * it changes), live scroll percentage, and a menu toggle.
 */
export function Nav() {
  const [open, setOpen] = useState(false);
  const sectionRef = useRef<HTMLSpanElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const current = useRef("");
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (percentRef.current) percentRef.current.textContent = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
  });

  // Which section sits in the middle of the screen?
  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      let name = "Index";
      document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => {
        if (el.offsetParent === null) return; // hidden page
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) name = el.dataset.section ?? name;
      });
      if (name !== current.current) {
        current.current = name;
        scramble(sectionRef.current, name.toUpperCase(), 0.5);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="container-x fixed inset-x-0 top-0 z-[200] grid grid-cols-2 items-start gap-4 py-4 text-white mix-blend-difference md:grid-cols-12">
        <TransitionLink href="/#top" className="flex items-center gap-3 md:col-span-3" aria-label={`${site.name} — home`}>
          <span className="flex size-10 items-center justify-center bg-white font-display text-sm font-black text-black">
            {site.initials}
          </span>
          <span className="hidden text-sm leading-tight font-semibold sm:block">
            {site.name}
            <br />
            <span className="opacity-60">{site.role}</span>
          </span>
        </TransitionLink>

        <div className="hidden text-sm leading-tight font-semibold md:col-span-3 md:col-start-6 md:block">
          <span className="opacity-60">Now viewing</span>
          <br />
          <span ref={sectionRef} className="tracking-wide">INDEX</span>
        </div>

        <div className="hidden text-sm leading-tight font-semibold md:col-span-2 md:block">
          <span className="opacity-60">Scrolled</span>
          <br />
          <span ref={percentRef} className="tabular-nums">000%</span>
        </div>

        <div className="flex justify-end md:col-span-2 md:col-start-11">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="group flex items-center gap-3 text-sm font-semibold"
          >
            <span className="relative h-5 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={open ? "close" : "menu"}
                  className="block"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.35, ease: [0.85, 0, 0.15, 1] }}
                >
                  {open ? "CLOSE" : "MENU"}
                </motion.span>
              </AnimatePresence>
            </span>
            <motion.span
              className="relative block size-10 bg-white"
              animate={{ rotate: open ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
            >
              <span className="absolute top-1/2 left-1/2 h-0.5 w-5 -translate-1/2 bg-black" />
              <span className="absolute top-1/2 left-1/2 h-5 w-0.5 -translate-1/2 bg-black" />
            </motion.span>
          </button>
        </div>
      </header>

      <AnimatePresence>{open && <Menu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
