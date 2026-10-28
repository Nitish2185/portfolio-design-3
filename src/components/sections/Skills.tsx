"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { skills } from "@/content/site";
import { SectionHead } from "@/components/ui/SectionHead";

/** Evenly spread points on a unit sphere (Fibonacci lattice). */
function spherePoints(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const t = i * 2.399963;
    return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
  });
}

/**
 * Skills orbit as a 3D sphere of words. It drifts toward the mouse,
 * can be dragged and flung (with inertia), and words light up on hover.
 */
export function Skills() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = stage.current;
      if (!el) return;
      const words = gsap.utils.toArray<HTMLElement>(".sk-word", el);
      const points = spherePoints(words.length);
      const reduce = prefersReducedMotion();

      let rotX = 0.25;
      let rotY = 0;
      let velX = 0;
      let velY = reduce ? 0 : 0.004;
      let hover = { x: 0, y: 0, active: false };
      let drag: { x: number; y: number } | null = null;

      const render = () => {
        const radius = el.clientWidth * 0.42;
        if (!drag) {
          // Drift toward the pointer, or keep a slow idle spin
          const targetX = hover.active ? hover.y * 0.02 : 0;
          const targetY = hover.active ? hover.x * 0.02 : reduce ? 0 : 0.004;
          velX += (targetX - velX) * 0.04;
          velY += (targetY - velY) * 0.04;
        }
        rotX += velX;
        rotY += velY;
        const cx = Math.cos(rotX);
        const sx = Math.sin(rotX);
        const cy = Math.cos(rotY);
        const sy = Math.sin(rotY);

        words.forEach((word, i) => {
          const p = points[i];
          // rotate around Y then X
          const x1 = p.x * cy + p.z * sy;
          const z1 = -p.x * sy + p.z * cy;
          const y2 = p.y * cx - z1 * sx;
          const z2 = p.y * sx + z1 * cx;
          const depth = (z2 + 1) / 2; // 0 back, 1 front
          word.style.transform = `translate(-50%, -50%) translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${0.55 + depth * 0.75})`;
          word.style.opacity = String(0.2 + depth * 0.8);
          word.style.zIndex = String(Math.round(depth * 100));
          word.style.fontStretch = `${60 + depth * 90}%`;
        });
      };
      gsap.ticker.add(render);

      const onMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        if (drag) {
          velY = (e.clientX - drag.x) * 0.004;
          velX = -(e.clientY - drag.y) * 0.004;
          drag = { x: e.clientX, y: e.clientY };
        }
        hover = { x, y: -y, active: true };
      };
      const onLeave = () => {
        hover.active = false;
      };
      const onDown = (e: PointerEvent) => {
        drag = { x: e.clientX, y: e.clientY };
        el.setPointerCapture(e.pointerId);
      };
      const onUp = () => {
        drag = null; // velocity carries on and eases out: inertia
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointercancel", onUp);

      gsap.from(el, {
        scale: 0.4,
        autoAlpha: 0,
        rotate: -30,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      });

      return () => {
        gsap.ticker.remove(render);
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointercancel", onUp);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" data-section="Skills" className="relative overflow-hidden bg-blue py-24 text-snow md:py-36">
      <SectionHead label="Skills" note="Toolkit — drag the sphere" className="container-x mb-12 md:mb-0" />

      <div className="container-x grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="mb-6 font-display text-[12vw] leading-[0.85] font-black uppercase stretch-narrow md:text-[6vw]">
            Lorem
            <br />
            toolkit
          </h2>
          <p className="max-w-sm text-lg opacity-80">
            Ut enim ad minim veniam, quis nostrud exercitation. Grab the sphere and give it a spin.
          </p>
          <ul aria-label="Skills list" className="tag mt-8 grid grid-cols-3 gap-x-4 gap-y-1 opacity-70">
            {skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div
          ref={stage}
          data-cursor="Drag"
          className="relative mx-auto aspect-square w-full max-w-[640px] touch-none select-none md:col-span-8"
          aria-hidden
        >
          <div className="pointer-events-none absolute inset-[8%] rounded-full border border-snow/15" />
          <div className="pointer-events-none absolute inset-[30%] rounded-full border border-dashed border-snow/15" />
          {skills.map((skill) => (
            <span
              key={skill}
              className="sk-word absolute top-1/2 left-1/2 cursor-default font-display text-[clamp(0.9rem,2.2vw,1.8rem)] font-black whitespace-nowrap uppercase transition-colors duration-200 hover:text-signal"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
