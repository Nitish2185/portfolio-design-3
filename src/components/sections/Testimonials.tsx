"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { testimonials } from "@/content/site";
import { SectionHead } from "@/components/ui/SectionHead";

const themes = [
  { card: "bg-primary text-snow", mark: "text-primary" },
  { card: "bg-ink text-snow", mark: "text-ink" },
  { card: "bg-signal text-ink", mark: "text-signal" },
  { card: "bg-snow text-ink border-2 border-ink", mark: "text-snow" },
];

type CardProps = {
  index: number;
  depth: number;
  /** Increments when the "Next" button asks the top card to fly away */
  flingSignal: number;
  onDismiss: () => void;
};

function Card({ index, depth, flingSignal, onDismiss }: CardProps) {
  const t = testimonials[index];
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-18, 0, 18]);
  const hint = useTransform(x, [-140, -40, 0, 40, 140], [1, 0, 0, 0, 1]);
  const isTop = depth === 0;

  const fling = (direction: number) => {
    animate(x, direction * 900, { duration: 0.45, ease: [0.65, 0, 0.35, 1] }).then(() => {
      onDismiss();
      x.set(0);
    });
  };

  // Button-triggered fling: every card hears the signal, only the top one reacts
  const onFlingSignal = useEffectEvent(() => {
    if (isTop) fling(1);
  });
  useEffect(() => {
    if (flingSignal > 0) onFlingSignal();
  }, [flingSignal]);

  return (
    <motion.figure
      className={`absolute inset-0 flex flex-col justify-between p-6 shadow-[0_30px_60px_-30px_rgba(12,12,16,0.5)] md:p-10 ${themes[index % themes.length].card} ${
        isTop ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      style={{ x, rotate, zIndex: testimonials.length - depth }}
      animate={{ scale: 1 - depth * 0.06, y: depth * 22, rotateZ: depth === 0 ? 0 : depth % 2 ? 3 : -3 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      drag={isTop ? "x" : false}
      dragSnapToOrigin
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 120 || Math.abs(info.velocity.x) > 600) fling(Math.sign(info.offset.x || 1));
      }}
      data-cursor={isTop ? "Swipe" : undefined}
    >
      <div className="flex items-start justify-between">
        <span aria-hidden className="flex size-14 items-center justify-center bg-current">
          <span className={`font-display text-4xl leading-none font-black ${themes[index % themes.length].mark}`}>“</span>
        </span>
        <motion.span style={{ opacity: hint }} className="tag">
          Next →
        </motion.span>
      </div>
      <blockquote className="font-display text-2xl leading-tight font-bold md:text-4xl">{t.quote}</blockquote>
      <figcaption className="flex items-end justify-between gap-4 border-t-2 border-current pt-4">
        <span>
          <span className="block font-display text-lg font-black uppercase">{t.name}</span>
          <span className="text-sm opacity-70">{t.title}</span>
        </span>
        <span className="tag opacity-60">
          {index + 1}/{testimonials.length}
        </span>
      </figcaption>
    </motion.figure>
  );
}

/** Deck of testimonials: drag the top card away (Motion drag) and it goes to the back. */
export function Testimonials() {
  const [order, setOrder] = useState(() => testimonials.map((_, i) => i));
  const [flingSignal, setFlingSignal] = useState(0);

  const dismiss = () => setOrder((o) => [...o.slice(1), o[0]]);

  return (
    <section id="testimonials" data-section="Testimonials" data-tone="light" className="relative overflow-hidden bg-snow py-24 text-ink md:py-36">
      <SectionHead label="Testimonials" note="Kind words — swipe the deck" className="container-x mb-12 md:mb-20" />

      <div className="container-x grid items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <h2 className="font-display text-[14vw] leading-[0.82] font-black uppercase stretch-narrow md:text-[8vw]">
            Kind
            <br />
            <span className="text-primary">words</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg text-steel">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Drag the card sideways to see the next one.
          </p>
          <button
            type="button"
            onClick={() => setFlingSignal((s) => s + 1)}
            className="group/box relative mt-8 inline-flex items-center gap-6 overflow-hidden border-2 border-ink px-5 py-4 font-display text-sm font-black uppercase transition-colors duration-500 ease-snap hover:text-snow"
          >
            <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-snap group-hover/box:scale-x-100" />
            <span className="relative">Next testimonial</span>
            <span aria-hidden className="relative">→</span>
          </button>
        </div>

        <div aria-live="polite" className="relative mx-auto aspect-[4/5] w-full max-w-[460px] md:col-span-6 md:col-start-7 md:aspect-[5/4] md:max-w-none">
          {order.map((index, depth) => (
            <Card key={index} index={index} depth={depth} flingSignal={flingSignal} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </section>
  );
}
