"use client";

import { motion } from "motion/react";
import { navLinks, site, socials } from "@/content/site";
import { usePageTransition } from "@/components/providers/TransitionProvider";
import { Stretch } from "@/components/ui/Stretch";

const EASE = [0.85, 0, 0.15, 1] as const;

/** Full-screen menu: each link is a full-width stripe that slides in from alternating sides. */
export function Menu({ onClose }: { onClose: () => void }) {
  const navigate = usePageTransition();

  const go = (href: string, label: string) => {
    onClose();
    window.setTimeout(() => navigate(href, label), 450);
  };

  return (
    <div
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[150] flex flex-col"
      data-lenis-prevent
    >
      {/* Dark band behind the header */}
      <motion.div
        className="h-[72px] shrink-0 bg-ink"
        initial={{ y: "-100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "-100%", transition: { duration: 0.4, delay: 0.25, ease: EASE } }}
        transition={{ duration: 0.5, ease: EASE }}
      />
      <ul className="flex flex-1 flex-col">
        {navLinks.map((link, i) => (
          <motion.li
            key={link.href}
            className={`relative flex-1 overflow-hidden ${i % 2 ? "bg-blue text-snow" : "bg-snow text-ink"}`}
            initial={{ x: i % 2 ? "100%" : "-100%" }}
            animate={{ x: "0%" }}
            exit={{ x: i % 2 ? "-100%" : "100%", transition: { duration: 0.45, delay: i * 0.03, ease: EASE } }}
            transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
          >
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                go(link.href, link.label);
              }}
              className="group/stretch container-x flex h-full items-center justify-between gap-4 transition-colors duration-300 hover:bg-signal hover:text-snow"
            >
              <span className="font-display text-[clamp(1.75rem,6.5vh,5rem)] leading-none font-black uppercase [--from:70%] [--to:150%]">
                <Stretch text={link.label} />
              </span>
              <span className="tag opacity-0 transition-opacity duration-300 group-hover/stretch:opacity-100">Go →</span>
            </a>
          </motion.li>
        ))}
      </ul>

      <motion.div
        className="container-x flex flex-wrap items-center justify-between gap-4 bg-ink py-4 text-sm text-snow"
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
      >
        <a href={`mailto:${site.email}`} className="font-semibold hover:text-signal">
          {site.email}
        </a>
        <ul className="flex gap-5">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} className="font-semibold hover:text-signal">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
