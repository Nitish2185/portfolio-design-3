"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/** Tells every Motion animation to respect the visitor's "reduce motion" setting. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
