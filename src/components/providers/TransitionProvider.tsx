"use client";

import { createContext, Suspense, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAnimate } from "motion/react";
import { ScrollTrigger, scramble } from "@/lib/gsap";
import { getLenis, scrollToTarget } from "@/lib/scroll";

type Navigate = (href: string, label?: string) => void;
const TransitionContext = createContext<Navigate>(() => {});

/** navigate(href, label): tiles cover the screen, the page changes, tiles clear. */
export function usePageTransition() {
  return useContext(TransitionContext);
}

const COLS = 12;
const ROWS = 7;
const TILES = COLS * ROWS;
/** Diagonal wave: tiles nearer the top-left move first. */
const diagonal = (i: number) => ((i % COLS) + Math.floor(i / COLS)) * 0.022;
const reverseDiagonal = (i: number) => (COLS - 1 - (i % COLS) + (ROWS - 1 - Math.floor(i / COLS))) * 0.022;

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function RouteListener({ onChange }: { onChange: () => void }) {
  const pathname = usePathname();
  useEffect(() => {
    onChange();
  }, [pathname, onChange]);
  return null;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const waiting = useRef<(() => void) | null>(null);
  const first = useRef(true);

  const onRouteChange = useCallback(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (waiting.current) {
      waiting.current();
      waiting.current = null;
      return;
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const navigate = useCallback<Navigate>(
    async (href, label) => {
      const url = new URL(href, window.location.href);
      if (url.pathname === window.location.pathname) {
        scrollToTarget(url.hash || 0);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      getLenis()?.stop();

      // 1. Tiles flood the screen in a diagonal wave
      await animate(".pt-tile", { scale: [0, 1] }, { duration: 0.35, ease: [0.65, 0, 0.35, 1], delay: diagonal });
      await animate(".pt-label", { opacity: 1 }, { duration: 0.1 });
      scramble(labelRef.current, (label ?? url.pathname.split("/").pop() ?? "Index").toUpperCase(), 0.6);

      // 2. Change page and wait for it to render
      const changed = new Promise<void>((resolve) => {
        waiting.current = resolve;
        window.setTimeout(resolve, 4000);
      });
      router.push(url.pathname + url.search, { scroll: false });
      await changed;
      await nextFrame();
      await nextFrame();
      await new Promise((r) => window.setTimeout(r, 250));

      scrollToTarget(url.hash || 0, { immediate: true });
      ScrollTrigger.refresh();
      getLenis()?.start();

      // 3. Tiles clear towards the bottom-right
      await animate(".pt-label", { opacity: 0 }, { duration: 0.2 });
      await animate(".pt-tile", { scale: [1, 0] }, { duration: 0.35, ease: [0.65, 0, 0.35, 1], delay: reverseDiagonal });
      busy.current = false;
    },
    [animate, router],
  );

  return (
    <TransitionContext.Provider value={navigate}>
      <Suspense fallback={null}>
        <RouteListener onChange={onRouteChange} />
      </Suspense>
      {children}

      <div ref={scope} aria-hidden className="pointer-events-none fixed inset-0 z-[350]">
        <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
          {Array.from({ length: TILES }, (_, i) => (
            <div key={i} className="pt-tile -m-px bg-ink" style={{ transform: "scale(0)" }} />
          ))}
        </div>
        <div className="pt-label absolute inset-0 flex items-center justify-center opacity-0">
          <span ref={labelRef} className="font-display text-[10vw] font-black text-snow uppercase stretch-wide md:text-[6vw]" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
