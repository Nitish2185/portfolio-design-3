"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { about, manifesto, site } from "@/content/site";
import { BoxButton } from "@/components/ui/BoxButton";
import { SectionHead } from "@/components/ui/SectionHead";

const chipColors = { blue: "bg-blue", signal: "bg-signal", ink: "bg-ink" };

/**
 * About section. Giant manifesto lines slide in from alternating sides
 * and widen as they arrive, then a Swiss-grid block with portrait, bio and stats.
 */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);

      // Each line ends at the width (font-stretch) that makes it fill the column exactly
      const fitStretch = (line: HTMLElement) => {
        const text = line.querySelector<HTMLElement>(".mf-text");
        if (!text) return 100;
        const chip = line.querySelector<HTMLElement>(".mf-chip");
        const style = getComputedStyle(line);
        const available =
          line.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - (chip ? chip.offsetWidth * 1.6 : 0);
        const previous = line.style.fontStretch;
        line.style.fontStretch = "100%";
        const w100 = text.offsetWidth;
        line.style.fontStretch = "150%";
        const w150 = text.offsetWidth;
        line.style.fontStretch = previous;
        const stretch = 100 + (50 * (available - w100)) / Math.max(w150 - w100, 1);
        return gsap.utils.clamp(50, 150, stretch);
      };

      q(".mf-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          { xPercent: i % 2 ? 45 : -45, fontStretch: "50%" },
          {
            xPercent: 0,
            fontStretch: () => `${fitStretch(line)}%`,
            ease: "none",
            scrollTrigger: { trigger: line, start: "top bottom", end: "top 45%", scrub: true, invalidateOnRefresh: true },
          },
        );
      });

      // Halftone portrait: dots swell as it scrolls through
      gsap.fromTo(
        q(".mf-halftone"),
        { backgroundSize: "6px 6px" },
        {
          backgroundSize: "18px 18px",
          ease: "none",
          scrollTrigger: { trigger: q(".mf-portrait")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.from(q(".mf-portrait"), {
        clipPath: "inset(0% 100% 0% 0%)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: q(".mf-portrait")[0], start: "top 80%" },
      });

      const split = SplitText.create(q(".mf-intro"), {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
            scrollTrigger: { trigger: q(".mf-intro")[0], start: "top 85%" },
          }),
      });

      // Stats count up
      q(".mf-fact").forEach((fact) => {
        const num = fact.querySelector<HTMLElement>(".mf-num");
        if (!num) return;
        const target = Number(num.dataset.value);
        const counter = { value: 0 };
        num.textContent = "0";
        gsap.to(counter, {
          value: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: fact, start: "top 90%" },
          onUpdate: () => {
            num.textContent = String(Math.round(counter.value));
          },
        });
      });

      return () => split.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="manifesto" data-section="Manifesto" className="relative overflow-hidden bg-snow py-24 text-ink md:py-36">
      <SectionHead label="Manifesto" note="About — who / why" className="container-x mb-16 md:mb-24" />

      <h2 className="mb-24 flex flex-col font-display text-[12vw] leading-[0.88] font-black uppercase md:mb-36 md:text-[9vw]">
        {manifesto.map((line, i) => (
          <span key={line.text} className={`mf-line container-x flex items-center gap-[2vw] ${i % 2 ? "justify-end" : ""}`}>
            {line.chip && i % 2 === 1 && <Chip color={line.chip} index={i} />}
            <span className="mf-text whitespace-nowrap">{line.text}</span>
            {line.chip && i % 2 === 0 && <Chip color={line.chip} index={i} />}
          </span>
        ))}
      </h2>

      <div className="container-x grid gap-12 md:grid-cols-12 md:gap-6">
        <figure className="md:col-span-4">
          <div className="mf-portrait relative aspect-[3/4] overflow-hidden bg-blue">
            <div
              className="mf-halftone absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at center, var(--color-snow) 0 35%, transparent 36%)",
                backgroundSize: "6px 6px",
                maskImage: "radial-gradient(ellipse 60% 70% at 50% 45%, black 30%, transparent 75%)",
              }}
            />
            <span className="absolute top-4 left-4 tag text-snow">Portrait placeholder</span>
            <span className="absolute right-4 bottom-4 font-display text-6xl font-black text-signal">{site.initials}</span>
          </div>
          <figcaption className="tag mt-3 flex justify-between opacity-60">
            <span>{site.name}</span>
            <span>{site.location}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col gap-8 md:col-span-5 md:col-start-6">
          <p className="mf-intro font-display text-2xl leading-tight font-bold md:text-3xl">{about.intro}</p>
          <p className="max-w-md text-lg leading-relaxed text-steel">{about.more}</p>
          <div>
            <BoxButton href={site.resume} download>
              Download résumé
            </BoxButton>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 self-end md:col-span-3 md:col-start-10 md:grid-cols-1">
          {about.facts.map((fact) => (
            <div key={fact.label} className="mf-fact border-t-2 border-ink pt-2">
              <dt className="tag opacity-60">{fact.label}</dt>
              <dd className="font-display text-6xl font-black stretch-wide">
                <span className="mf-num" data-value={fact.value}>
                  {fact.value}
                </span>
                <span className="text-blue">{fact.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Chip({ color, index }: { color: keyof typeof chipColors; index: number }) {
  const shape = index % 3 === 0 ? "rounded-full" : index % 3 === 1 ? "" : "rotate-45";
  return (
    <span
      aria-hidden
      className={`mf-chip inline-block size-[0.7em] shrink-0 animate-[spin_6s_linear_infinite] ${chipColors[color]} ${shape}`}
    />
  );
}
