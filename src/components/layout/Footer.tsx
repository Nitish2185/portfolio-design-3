"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { scrollToTarget } from "@/lib/scroll";
import { navLinks, site, socials } from "@/content/site";
import { Stretch } from "@/components/ui/Stretch";
import { TransitionLink } from "@/components/ui/TransitionLink";

function Clock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: site.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);
  return <span className="tabular-nums">{time}</span>;
}

/** The page's visible <main> (hidden routes stay in the DOM with display:none). */
function visibleMains() {
  const all = Array.from(document.querySelectorAll<HTMLElement>("main"));
  return { shown: all.filter((m) => m.offsetParent !== null), hidden: all.filter((m) => m.offsetParent === null) };
}

/**
 * Black footer. As it rises, the page above shrinks back with rounded
 * corners ("page lift"); a giant marquee of the email runs across it.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "top 20%",
          scrub: true,
          onUpdate: (self) => {
            const { shown, hidden } = visibleMains();
            const p = self.progress;
            gsap.set(shown, { scale: 1 - p * 0.08, borderRadius: p * 40, transformOrigin: "50% 100%", overflow: "hidden" });
            gsap.set(hidden, { clearProps: "transform,borderRadius,overflow" });
          },
          onLeaveBack: () => gsap.set(visibleMains().shown, { clearProps: "transform,borderRadius,overflow" }),
        },
      });

      gsap.from(".ft-col", {
        y: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ft-grid", start: "top 90%" },
      });
    },
    { scope: root },
  );

  const marquee = `Let's make something — ${site.email} — `;

  return (
    <footer ref={root} data-section="Outro" className="relative overflow-hidden bg-ink pt-16 pb-6 text-snow">
      {/* Giant marquee */}
      <div aria-hidden className="mb-16 overflow-hidden border-y-2 border-snow/15 py-4 md:mb-24">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <span key={k} className="pr-8 font-display text-[12vw] leading-none font-black whitespace-nowrap uppercase stretch-wide md:text-[8vw]">
              {marquee}
              {marquee}
            </span>
          ))}
        </div>
      </div>

      <div className="ft-grid container-x grid grid-cols-2 gap-10 md:grid-cols-12 md:gap-6">
        <div className="ft-col md:col-span-3">
          <p className="tag mb-4 opacity-50">Sitemap</p>
          <ul className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href} className="group/stretch font-display text-lg font-bold uppercase [--from:90%] [--to:140%]">
                  <Stretch text={l.label} />
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="ft-col md:col-span-3">
          <p className="tag mb-4 opacity-50">Elsewhere</p>
          <ul className="flex flex-col gap-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} className="group/stretch font-display text-lg font-bold uppercase [--from:90%] [--to:140%]">
                  <Stretch text={s.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="ft-col col-span-2 flex flex-col gap-6 md:col-span-4 md:col-start-9">
          <div>
            <p className="tag mb-2 opacity-50">Local time — {site.location}</p>
            <p className="font-display text-5xl font-black stretch-wide">
              <Clock />
            </p>
          </div>
          <p className="tag opacity-50">{site.coordinates}</p>
        </div>
      </div>

      <div className="container-x mt-20 flex flex-wrap items-end justify-between gap-6 border-t-2 border-snow/15 pt-6">
        <p className="font-display text-[15vw] leading-[0.8] font-black uppercase stretch-narrow md:text-[9vw]">{site.name}</p>
        <div className="flex items-center gap-6">
          <p className="tag hidden opacity-50 md:block">
            © {site.year} — Next.js · GSAP · Motion · Lenis · Three.js
          </p>
          <button
            type="button"
            onClick={() => scrollToTarget(0, { duration: 2 })}
            aria-label="Back to top"
            className="group flex size-16 items-center justify-center bg-snow text-ink transition-colors duration-300 hover:bg-signal hover:text-snow"
          >
            <span className="text-2xl transition-transform duration-500 ease-snap group-hover:-translate-y-1 group-hover:rotate-[360deg]">↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
