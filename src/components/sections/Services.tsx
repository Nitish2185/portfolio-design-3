"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { services } from "@/content/site";
import { SectionHead } from "@/components/ui/SectionHead";
import { Stretch } from "@/components/ui/Stretch";

const EASE = [0.85, 0, 0.15, 1] as const;

/** Looping equalizer bars (Motion) shown inside an open service. */
function Equalizer() {
  return (
    <div aria-hidden className="flex h-24 items-end gap-1.5">
      {Array.from({ length: 9 }, (_, i) => (
        <motion.span
          key={i}
          className={`block w-3 ${i % 4 === 0 ? "bg-signal" : "bg-current"}`}
          animate={{ height: ["20%", `${40 + ((i * 37) % 60)}%`, "35%", "100%", "20%"] }}
          transition={{ repeat: Infinity, duration: 1.6 + (i % 3) * 0.3, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

/** Accordion of services: rows sweep blue on hover and expand with Motion. */
export function Services() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  useGSAP(
    () => {
      gsap.from(".sv-row", {
        xPercent: 12,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: ".sv-list", start: "top 80%" },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="services" data-section="Services" className="relative bg-snow py-24 text-ink md:py-36">
      <SectionHead label="Services" note={`What I do — ${services.length} disciplines`} className="container-x mb-12 md:mb-20" />

      <ul className="sv-list border-t-2 border-ink">
        {services.map((service, i) => {
          const isOpen = open === i;
          return (
            <motion.li key={service.title} layout className="sv-row border-b-2 border-ink">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="group/stretch relative block w-full overflow-hidden text-left"
              >
                <span
                  aria-hidden
                  className={`absolute inset-0 origin-left bg-blue transition-transform duration-500 ease-snap ${
                    isOpen ? "scale-x-100" : "scale-x-0 group-hover/stretch:scale-x-100"
                  }`}
                />
                <span
                  className={`container-x relative flex items-center justify-between gap-6 py-5 transition-colors duration-500 md:py-6 ${
                    isOpen ? "text-snow" : "group-hover/stretch:text-snow"
                  }`}
                >
                  <span className="font-display text-[9vw] leading-none font-black uppercase [--from:85%] [--to:140%] md:text-[5vw]">
                    <Stretch text={service.title} />
                  </span>
                  <motion.span
                    aria-hidden
                    className="relative flex size-12 shrink-0 items-center justify-center border-2 border-current md:size-16"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  >
                    <span className="absolute h-0.5 w-1/2 bg-current" />
                    <span className="absolute h-1/2 w-0.5 bg-current" />
                  </motion.span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                    className="overflow-hidden bg-blue text-snow"
                  >
                    <motion.div
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
                      className="container-x grid gap-8 pt-2 pb-10 md:grid-cols-12"
                    >
                      <p className="text-lg leading-relaxed md:col-span-5">{service.text}</p>
                      <ul className="grid grid-cols-2 gap-x-6 gap-y-2 md:col-span-4 md:col-start-7">
                        {service.points.map((point) => (
                          <li key={point} className="tag flex items-center gap-2">
                            <span className="inline-block size-2 bg-signal" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      <div className="md:col-span-2 md:col-start-11 md:justify-self-end">
                        <Equalizer />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
