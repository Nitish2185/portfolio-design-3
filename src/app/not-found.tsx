import type { Metadata } from "next";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = { title: "Not found" };

/** 404: the digits breathe between narrow and wide (variable-font width axis). */
export default function NotFound() {
  return (
    <main data-section="Not found" data-tone="dark" className="relative flex min-h-svh flex-col items-center justify-center gap-10 bg-primary px-4 text-center text-snow">
      <h1 aria-label="404 — page not found" className="flex font-display text-[38vw] leading-[0.8] font-black md:text-[30vw]">
        {["4", "0", "4"].map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="inline-block animate-[breathe_2.4s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * -0.8}s` }}
          >
            {d}
          </span>
        ))}
      </h1>
      <p className="tag">Lorem ipsum — this page does not exist</p>
      <TransitionLink
        href="/"
        label="Index"
        className="group/box relative inline-flex items-center gap-6 overflow-hidden border-2 border-snow px-5 py-4 font-display text-sm font-black uppercase transition-colors duration-500 ease-snap hover:text-primary"
      >
        <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-snow transition-transform duration-500 ease-snap group-hover/box:scale-x-100" />
        <span className="relative">Back to index</span>
        <span aria-hidden className="relative">↩</span>
      </TransitionLink>
    </main>
  );
}
