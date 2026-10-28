import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);
gsap.config({ nullTargetWarn: false });

export { gsap, ScrollTrigger, SplitText, useGSAP };

/** Characters used by every scramble / decode effect. */
export const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>";

/** True when the visitor asked their OS for less motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Decodes an element's text from random characters into `text`. */
export function scramble(el: Element | null, text: string, duration = 1) {
  if (!el) return;
  if (prefersReducedMotion()) {
    el.textContent = text;
    return;
  }
  return gsap.to(el, {
    duration,
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: duration * 0.35 },
    ease: "none",
    overwrite: true,
  });
}
