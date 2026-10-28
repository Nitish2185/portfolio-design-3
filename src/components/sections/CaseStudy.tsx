"use client";

import { useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { gsap, scramble, SplitText, useGSAP } from "@/lib/gsap";
import type { Project } from "@/content/site";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { BoxButton } from "@/components/ui/BoxButton";
import { Poster } from "@/components/ui/Poster";
import { SectionHead } from "@/components/ui/SectionHead";
import { TransitionLink } from "@/components/ui/TransitionLink";

const variants: Project["poster"][] = ["circle", "bars", "triangle", "dots", "split"];

const results = [
  { value: "+184%", label: "Lorem ipsum" },
  { value: "2.4M", label: "Dolor sit amet" },
  { value: "9", label: "Consectetur" },
];

/** Press and hold to open the next project (Motion progress ring). */
function HoldToNext({ next }: { next: Project }) {
  const navigate = usePageTransition();
  const progress = useMotionValue(0);
  const ring = useTransform(progress, [0, 1], [0, 1]);
  const stretch = useTransform(progress, [0, 1], ["60%", "150%"]);
  const fill = useTransform(progress, (p) => `${p * 100}%`);
  const holding = useRef<ReturnType<typeof animate> | null>(null);
  const href = `/work/${next.slug}`;

  const start = () => {
    holding.current?.stop();
    holding.current = animate(progress, 1, {
      duration: 1.2 * (1 - progress.get()),
      ease: "linear",
      onComplete: () => navigate(href, next.title),
    });
  };
  const cancel = () => {
    if (progress.get() >= 1) return;
    holding.current?.stop();
    holding.current = animate(progress, 0, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  };

  return (
    <section data-section="Next project" className="relative overflow-hidden bg-ink py-24 text-snow md:py-32">
      <motion.div aria-hidden className="absolute inset-y-0 left-0 bg-blue" style={{ width: fill }} />
      <div className="container-x relative flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="tag mb-4 opacity-60">Next project — {next.kind}</p>
          <motion.p className="font-display text-[16vw] leading-[0.8] font-black uppercase md:text-[10vw]" style={{ fontStretch: stretch }}>
            {next.title}
          </motion.p>
        </div>
        <button
          type="button"
          onPointerDown={start}
          onPointerUp={cancel}
          onPointerLeave={cancel}
          onKeyDown={(e) => e.key === "Enter" && navigate(href, next.title)}
          data-cursor="Hold"
          aria-label={`Open next project: ${next.title} (press and hold, or press Enter)`}
          className="relative flex size-36 shrink-0 touch-none items-center justify-center select-none"
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
            <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
            <motion.circle cx="50" cy="50" r="46" fill="none" stroke="var(--color-signal)" strokeWidth="5" style={{ pathLength: ring }} />
          </svg>
          <span className="tag text-center">
            Hold
            <br />
            to open
          </span>
        </button>
      </div>
    </section>
  );
}

/** Case-study page: blue title block, sticky info panel and scrolling poster stack. */
export function CaseStudy({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gallery = [project.poster, ...variants.filter((v) => v !== project.poster)].slice(0, 4);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.delayedCall(0.6, () => scramble(titleRef.current, project.title.toUpperCase(), 1));
      gsap.fromTo(q(".cs-title"), { fontStretch: "50%" }, { fontStretch: "150%", duration: 1.8, ease: "expo.out", delay: 0.6 });
      gsap.from(q(".cs-meta > div"), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 1, ease: "expo.out", delay: 0.9 });

      q(".cs-shot").forEach((shot) => {
        gsap.fromTo(
          shot,
          { clipPath: "inset(15% 15% 15% 15%)", scale: 0.92 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: shot, start: "top bottom", end: "top 35%", scrub: true },
          },
        );
      });

      const splits = q(".cs-text").map((el) =>
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, { yPercent: 110, stagger: 0.07, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%" } }),
        }),
      );

      q(".cs-result").forEach((el) => {
        gsap.fromTo(el, { fontStretch: "50%" }, { fontStretch: "150%", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 50%", scrub: true } });
      });

      return () => splits.forEach((s) => s.revert());
    },
    { scope: root, dependencies: [project.slug] },
  );

  return (
    <article ref={root} data-section="Case study" className="relative">
      <header className="bg-blue pt-28 pb-12 text-snow md:pt-36">
        <SectionHead label="Case study" note={`${project.kind} — ${project.year}`} className="container-x mb-10" />
        <h1
          ref={titleRef}
          aria-label={project.title}
          className="cs-title container-x font-display text-[17vw] leading-[0.85] font-black uppercase md:text-[12vw]"
        >
          {project.title.toUpperCase()}
        </h1>
        <dl className="cs-meta container-x mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["Client", project.client],
            ["Role", project.role],
            ["Year", project.year],
            ["Type", project.kind],
          ].map(([term, value]) => (
            <div key={term} className="border-t-2 border-snow pt-2">
              <dt className="tag opacity-60">{term}</dt>
              <dd className="mt-1 text-lg font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="container-x grid gap-12 bg-snow py-16 text-ink md:grid-cols-12 md:gap-6 md:py-24">
        <aside className="md:col-span-4">
          <div className="flex flex-col gap-8 md:sticky md:top-28">
            <p className="font-display text-2xl leading-tight font-bold md:text-3xl">{project.summary}</p>
            <ul className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li key={tag} className="tag border-2 border-ink px-3 py-1.5">
                  {tag}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-6">
              <BoxButton href="#">Visit live site</BoxButton>
              <TransitionLink href="/#work" label="Work" className="tag underline underline-offset-4">
                ← All work
              </TransitionLink>
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-16 md:col-span-7 md:col-start-6">
          <Poster project={project} variant={gallery[0]} className="cs-shot aspect-[4/3]" />
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="tag mb-3 text-blue">The challenge</p>
              <p className="cs-text text-lg leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
            <div>
              <p className="tag mb-3 text-blue">The approach</p>
              <p className="cs-text text-lg leading-relaxed">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Poster project={project} variant={gallery[1]} bare className="cs-shot aspect-[3/4]" />
            <Poster project={project} variant={gallery[2]} bare className="cs-shot aspect-[3/4] md:mt-24" />
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t-2 border-ink pt-6">
            {results.map((r) => (
              <div key={r.label}>
                <dd className="cs-result font-display text-3xl font-black text-blue md:text-5xl">{r.value}</dd>
                <dt className="tag mt-2 opacity-60">{r.label}</dt>
              </div>
            ))}
          </dl>
          <Poster project={project} variant={gallery[3]} bare className="cs-shot aspect-[16/9]" />
        </div>
      </div>

      <HoldToNext next={next} />
    </article>
  );
}
