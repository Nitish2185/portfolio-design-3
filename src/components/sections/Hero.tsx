"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { site } from "@/content/site";
import { ParticleName } from "@/components/three/ParticleName";

const NAME_LINES = [site.firstName.toUpperCase(), site.lastName.toUpperCase()];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const morph = useRef(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduce = prefersReducedMotion();

      // UI fades in after the intro
      gsap.set(q(".hero-in"), { autoAlpha: 0, y: 24 });
      const unsubscribe = onIntroDone(() =>
        gsap.to(q(".hero-in"), { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: "power3.out", delay: reduce ? 0 : 1.4 }),
      );

      // Pin the hero while the name folds into a sphere
      const proxy = { value: 0 };
      gsap
        .timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=110%", pin: true, scrub: 0.8 },
        })
        .to(proxy, { value: 1, ease: "none", onUpdate: () => (morph.current = proxy.value) }, 0)
        .to(q(".hero-fade-out"), { autoAlpha: 0, y: -40, ease: "power1.in", duration: 0.4 }, 0)
        .fromTo(q(".hero-sphere-label"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.6);

      // Each letter of the role widens as the cursor gets close
      const letters = q(".hero-letter");
      const setters = letters.map((el) => gsap.quickTo(el, "--w", { duration: 0.5, ease: "power3" }));
      const onMove = (e: PointerEvent) => {
        letters.forEach((el, i) => {
          const r = el.getBoundingClientRect();
          const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          setters[i](60 + 90 * Math.max(0, 1 - dist / 260));
        });
      };
      if (!reduce) window.addEventListener("pointermove", onMove, { passive: true });

      return () => {
        unsubscribe();
        window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" data-section="Index" className="relative h-svh min-h-[600px] overflow-hidden bg-blue text-snow">
      <h1 className="sr-only">
        {site.name} — {site.role}
      </h1>

      <ParticleName lines={NAME_LINES} morph={morph} className="absolute inset-0" />
      {/* Shown only if WebGL is unavailable */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[12vw] font-black uppercase opacity-0 stretch-wide [.no-webgl~&]:opacity-100"
      >
        {site.name}
      </p>

      <div className="pointer-events-none relative flex h-full flex-col justify-between pt-24 pb-6">
        <div className="hero-fade-out container-x flex items-start justify-between gap-6">
          <p className="hero-in tag">
            Index — Portfolio {site.year}
            <br />
            <span className="opacity-60">{site.coordinates}</span>
          </p>
          <p className="hero-in tag flex items-center gap-2 text-right">
            <span className="inline-block size-2 animate-blink bg-signal" />
            Move · Click to scatter
          </p>
        </div>

        <p className="hero-sphere-label tag invisible self-center opacity-0">Keep scrolling ↓</p>

        <div className="hero-fade-out container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p
            aria-label={site.role}
            className="hero-in font-display text-[8.5vw] leading-[0.85] font-black uppercase md:max-w-[70%] md:text-[5.2vw]"
          >
            {site.role.split(" ").map((word, w) => (
              <span key={w} className="inline-block whitespace-nowrap">
                {Array.from(word).map((c, i) => (
                  <span key={i} aria-hidden className="hero-letter inline-block [font-stretch:calc(var(--w,60)*1%)]">
                    {c}
                  </span>
                ))}
                <span aria-hidden>&nbsp;</span>
              </span>
            ))}
          </p>
          <div className="hero-in flex max-w-xs flex-col gap-2 text-sm md:text-right">
            <p className="opacity-80">{site.tagline}</p>
            <p className="tag flex items-center gap-2 md:justify-end">
              <span className="inline-block size-2 bg-snow" /> {site.status}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
