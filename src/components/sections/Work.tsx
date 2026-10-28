"use client";

import { useRef } from "react";
import { gsap, scramble, useGSAP } from "@/lib/gsap";
import { projects } from "@/content/site";
import { Poster } from "@/components/ui/Poster";
import { SectionHead } from "@/components/ui/SectionHead";
import { TransitionLink } from "@/components/ui/TransitionLink";

const COUNT = projects.length;
const STEP = 360 / COUNT;

/**
 * Projects ride a 3D ring (CSS 3D transforms). The section pins and the
 * scroll turns the ring; the card facing you lights up and its title decodes.
 */
export function Work() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const ring = q(".wk-ring")[0] as HTMLElement;
      const cards = q(".wk-card");
      const titleEl = q(".wk-title")[0];
      const kindEl = q(".wk-kind")[0];
      const ticks = q(".wk-tick");
      let active = -1;

      // Place cards around the ring; the radius depends on the card width
      const layout = () => {
        const width = cards[0]?.offsetWidth ?? 300;
        const radius = (width / (2 * Math.tan(Math.PI / COUNT))) * 1.25;
        // Rotate first, then push outwards (GSAP always translates before rotating, so set this by hand)
        cards.forEach((card, i) => {
          card.style.transform = `translate(-50%, -50%) rotateY(${i * STEP}deg) translateZ(${radius}px)`;
        });
        gsap.set(ring, { z: -radius });
      };
      layout();
      window.addEventListener("resize", layout);

      const update = (rotation: number) => {
        // Brightness follows how directly each card faces the viewer
        cards.forEach((card, i) => {
          const angle = ((i * STEP + rotation) * Math.PI) / 180;
          const facing = Math.cos(angle);
          gsap.set(card, { opacity: 0.18 + 0.82 * Math.max(0, facing), filter: `grayscale(${facing > 0.95 ? 0 : 1})` });
        });
        const index = ((Math.round(-rotation / STEP) % COUNT) + COUNT) % COUNT;
        if (index !== active) {
          active = index;
          const project = projects[index];
          scramble(titleEl, project.title.toUpperCase(), 0.6);
          scramble(kindEl, `${project.kind} — ${project.year}`.toUpperCase(), 0.6);
          ticks.forEach((t, i) => {
            t.style.backgroundColor = i === index ? "var(--color-signal)" : "";
          });
        }
      };

      const state = { rotation: 0 };
      update(0);
      gsap.to(state, {
        rotation: -(COUNT - 1) * STEP,
        ease: "none",
        scrollTrigger: {
          trigger: q(".wk-pin")[0],
          start: "top top",
          end: () => `+=${COUNT * 55}%`,
          pin: true,
          scrub: 1,
          snap: { snapTo: 1 / (COUNT - 1), duration: 0.4, ease: "power2.inOut" },
        },
        onUpdate: () => {
          gsap.set(ring, { rotateY: state.rotation });
          update(state.rotation);
        },
      });

      return () => window.removeEventListener("resize", layout);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="work" data-section="Work" data-tone="dark" className="relative bg-ink text-snow">
      <div className="wk-pin relative flex h-svh min-h-[620px] flex-col overflow-hidden pt-24 pb-6">
        <SectionHead label="Selected work" note={`${COUNT} projects — scroll to rotate`} className="container-x" />

        {/* 3D stage */}
        <div className="relative flex-1 [perspective:1400px]">
          <div className="wk-ring absolute top-1/2 left-1/2 [transform-style:preserve-3d]">
            {projects.map((project) => (
              <TransitionLink
                key={project.slug}
                href={`/work/${project.slug}`}
                label={project.title}
                data-cursor="Open"
                className="wk-card absolute top-0 left-0 block w-[52vw] max-w-[340px] [backface-visibility:hidden] md:w-[22vw]"
              >
                <Poster project={project} className="aspect-[3/4] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]" />
              </TransitionLink>
            ))}
          </div>
        </div>

        <div className="container-x flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="wk-kind tag mb-2 opacity-60">&nbsp;</p>
            <p className="wk-title font-display text-[13vw] leading-[0.85] font-black stretch-wide md:text-[7vw]">&nbsp;</p>
          </div>
          <div className="flex gap-1.5 md:mb-3" aria-hidden>
            {projects.map((p) => (
              <span key={p.slug} className="wk-tick block h-2 w-8 bg-snow/25 transition-colors duration-300" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
