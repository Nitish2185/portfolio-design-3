"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary, label';
const SIZE = 12;

/** Corner brackets drawn with gradients, so the box can be any size. */
const brackets = [
  "linear-gradient(currentColor,currentColor) top left / 12px 2px",
  "linear-gradient(currentColor,currentColor) top left / 2px 12px",
  "linear-gradient(currentColor,currentColor) top right / 12px 2px",
  "linear-gradient(currentColor,currentColor) top right / 2px 12px",
  "linear-gradient(currentColor,currentColor) bottom left / 12px 2px",
  "linear-gradient(currentColor,currentColor) bottom left / 2px 12px",
  "linear-gradient(currentColor,currentColor) bottom right / 12px 2px",
  "linear-gradient(currentColor,currentColor) bottom right / 2px 12px",
]
  .map((b) => `${b} no-repeat`)
  .join(",");

/**
 * Crosshair cursor: full-screen hairlines with live coordinates.
 * Over links and buttons the centre square snaps around the element
 * like a target lock; elements with data-cursor="Text" show a label tag.
 */
export function Crosshair() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineX = useRef<HTMLDivElement>(null);
  const lineY = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const coords = useRef<HTMLSpanElement>(null);
  const tag = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const h = lineX.current;
    const v = lineY.current;
    const b = box.current;
    const c = coords.current;
    const t = tag.current;
    const root = rootRef.current;
    if (!h || !v || !b || !c || !t || !root) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set([h, v, b, c, t], { autoAlpha: 0 });

    const hY = gsap.quickTo(h, "y", { duration: 0.35, ease: "power3" });
    const vX = gsap.quickTo(v, "x", { duration: 0.35, ease: "power3" });
    const cX = gsap.quickTo(c, "x", { duration: 0.2, ease: "power3" });
    const cY = gsap.quickTo(c, "y", { duration: 0.2, ease: "power3" });
    const tX = gsap.quickTo(t, "x", { duration: 0.3, ease: "power3" });
    const tY = gsap.quickTo(t, "y", { duration: 0.3, ease: "power3" });

    let mouseX = 0;
    let mouseY = 0;
    let target: HTMLElement | null = null;
    let shown = false;
    let moved = false;

    const bX = gsap.quickTo(b, "x", { duration: 0.22, ease: "power3" });
    const bY = gsap.quickTo(b, "y", { duration: 0.22, ease: "power3" });
    const bW = gsap.quickTo(b, "width", { duration: 0.3, ease: "power3" });
    const bH = gsap.quickTo(b, "height", { duration: 0.3, ease: "power3" });

    // Each frame: follow the mouse, or wrap the locked element
    const follow = () => {
      if (!shown) return;
      // Black or white, depending on the section under the pointer
      if (moved) {
        moved = false;
        const under = document.elementFromPoint(mouseX, mouseY)?.closest<HTMLElement>("[data-tone]");
        root.dataset.tone = under?.dataset.tone ?? "dark";
      }
      if (target && document.contains(target)) {
        const r = target.getBoundingClientRect();
        const pad = 8;
        bX(r.left - pad);
        bY(r.top - pad);
        bW(r.width + pad * 2);
        bH(r.height + pad * 2);
      } else {
        bX(mouseX - SIZE / 2);
        bY(mouseY - SIZE / 2);
        bW(SIZE);
        bH(SIZE);
      }
    };
    gsap.ticker.add(follow);

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      moved = true;
      if (!shown) {
        shown = true;
        gsap.set(b, { x: mouseX - SIZE / 2, y: mouseY - SIZE / 2 });
        gsap.to([h, v, b, c], { autoAlpha: 1, duration: 0.3 });
      }
      hY(mouseY);
      vX(mouseX);
      cX(mouseX + 14);
      cY(mouseY + 14);
      tX(mouseX + 18);
      tY(mouseY - 34);
      c.textContent = `X ${String(Math.round(mouseX)).padStart(4, "0")}  Y ${String(Math.round(mouseY)).padStart(4, "0")}`;
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const labelled = el?.closest<HTMLElement>("[data-cursor]");
      if (labelled) {
        target = null;
        t.textContent = labelled.dataset.cursor ?? "";
        gsap.to(t, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)" });
        gsap.to([h, v], { autoAlpha: 1, duration: 0.2 });
        gsap.to(b, { rotate: 45, duration: 0.3 });
        return;
      }
      gsap.to(t, { autoAlpha: 0, scale: 0.6, duration: 0.2 });
      gsap.to(b, { rotate: 0, duration: 0.3 });
      const interactive = el?.closest<HTMLElement>(INTERACTIVE) ?? null;
      target = interactive;
      gsap.to([h, v], { autoAlpha: interactive ? 0.25 : 1, duration: 0.25 });
      gsap.to(c, { autoAlpha: interactive ? 0 : 1, duration: 0.2 });
    };

    const onLeave = () => {
      shown = false;
      gsap.to([h, v, b, c, t], { autoAlpha: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(b, { scale: 0.85, duration: 0.15 });
    const onUp = () => gsap.to(b, { scale: 1, duration: 0.3, ease: "back.out(3)" });

    // Scrolling changes what's under a still pointer, so re-check the tone then too
    const onScroll = () => {
      moved = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      gsap.ticker.remove(follow);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden
      data-tone="dark"
      className="pointer-events-none fixed inset-0 z-[300] hidden transition-colors duration-200 data-[tone=dark]:text-snow data-[tone=light]:text-ink [.has-cursor_&]:block"
    >
      <div ref={lineX} className="fixed top-0 left-0 h-px w-full bg-current/40" />
      <div ref={lineY} className="fixed top-0 left-0 h-full w-px bg-current/40" />
      <div ref={box} className="fixed top-0 left-0 origin-center" style={{ background: brackets, width: SIZE, height: SIZE }} />
      <span ref={coords} className="fixed top-0 left-0 text-[10px] font-semibold tracking-wider whitespace-pre tabular-nums" />
      <span
        ref={tag}
        className="fixed top-0 left-0 bg-signal px-2 py-1 text-[11px] font-bold tracking-widest text-ink uppercase"
      />
    </div>
  );
}
