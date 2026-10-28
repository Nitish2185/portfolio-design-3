"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { scramble } from "@/lib/gsap";
import { site, socials } from "@/content/site";
import { ProximityText } from "@/components/ui/ProximityText";
import { SectionHead } from "@/components/ui/SectionHead";

const EASE = [0.85, 0, 0.15, 1] as const;

type Answers = { name: string; email: string; message: string };

const steps = [
  { key: "name", question: () => "What's your name?", placeholder: "Lorem Ipsum", type: "text" },
  { key: "email", question: (a: Answers) => `Hi ${a.name.split(" ")[0] || "there"} — your email?`, placeholder: "you@example.com", type: "email" },
  { key: "message", question: () => "What are we making?", placeholder: "Lorem ipsum dolor sit amet…", type: "textarea" },
] as const;

/**
 * Contact: a giant cursor-reactive headline and a conversational form
 * that asks one question at a time (Motion AnimatePresence), then opens
 * the visitor's email app with everything filled in.
 */
export function Contact() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Answers>({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLAnchorElement>(null);
  const interacted = useRef(false);

  const done = step === steps.length;
  const current = steps[Math.min(step, steps.length - 1)];

  const go = (to: number) => {
    interacted.current = true;
    setDirection(to > step ? 1 : -1);
    setError("");
    setStep(to);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = answers[current.key].trim();
    if (!value) return setError("Lorem ipsum — please fill this in.");
    if (current.key === "email" && !/^\S+@\S+\.\S+$/.test(value)) return setError("That email looks off.");
    if (step < steps.length - 1) return go(step + 1);

    const subject = encodeURIComponent(`Hello from ${answers.name}`);
    const body = encodeURIComponent(`${answers.message}\n\n— ${answers.name} (${answers.email})`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    go(steps.length);
  };

  return (
    <section id="contact" data-section="Contact" data-tone="dark" className="relative overflow-hidden bg-primary py-24 text-snow md:py-36">
      <SectionHead label="Contact" note="Let's talk — reply within 48h" className="container-x mb-10" />

      <h2 className="container-x mb-16 font-display text-[22vw] leading-[0.8] font-black uppercase md:mb-24 md:text-[17vw]">
        <ProximityText text="Say hello" min={55} max={150} radius={420} />
      </h2>

      <div className="container-x grid gap-16 md:grid-cols-12 md:gap-6">
        {/* Conversational form */}
        <div className="md:col-span-7">
          <div className="mb-8 flex gap-1.5" aria-hidden>
            {steps.map((s, i) => (
              <motion.span
                key={s.key}
                className="block h-1.5 flex-1 origin-left bg-snow"
                initial={false}
                animate={{ scaleX: i < step ? 1 : i === step ? 0.35 : 0.06, opacity: i <= step ? 1 : 0.4 }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            ))}
          </div>

          <div className="relative min-h-[300px] overflow-hidden">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {done ? (
                <motion.div
                  key="done"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex flex-col gap-6"
                >
                  <p className="font-display text-5xl leading-none font-black uppercase stretch-wide md:text-6xl">Thank you!</p>
                  <p className="max-w-md text-lg opacity-80">Your email app should open with the message ready to send.</p>
                  <button type="button" onClick={() => go(0)} className="tag self-start underline underline-offset-4">
                    Start over
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key={current.key}
                  onSubmit={onSubmit}
                  custom={direction}
                  variants={{
                    enter: (d: number) => ({ x: `${d * 60}%`, opacity: 0 }),
                    center: { x: "0%", opacity: 1 },
                    exit: (d: number) => ({ x: `${d * -60}%`, opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: EASE }}
                  onAnimationComplete={(definition) => {
                    // Focus the field once it has slid in, but never on page load
                    if (definition === "center" && interacted.current) {
                      document.getElementById(`f-${current.key}`)?.focus({ preventScroll: true });
                    }
                  }}
                  className="flex flex-col gap-6"
                >
                  <label htmlFor={`f-${current.key}`} className="font-display text-3xl leading-tight font-black uppercase md:text-5xl">
                    {current.question(answers)}
                  </label>
                  {current.type === "textarea" ? (
                    <textarea
                      id={`f-${current.key}`}
                      rows={3}
                      value={answers.message}
                      placeholder={current.placeholder}
                      onChange={(e) => setAnswers((a) => ({ ...a, message: e.target.value }))}
                      className="w-full resize-none border-b-2 border-snow bg-transparent pb-3 text-2xl outline-none placeholder:text-snow/35 md:text-3xl"
                    />
                  ) : (
                    <input
                      id={`f-${current.key}`}
                      type={current.type}
                      value={answers[current.key]}
                      placeholder={current.placeholder}
                      onChange={(e) => setAnswers((a) => ({ ...a, [current.key]: e.target.value }))}
                      className="w-full border-b-2 border-snow bg-transparent pb-3 text-2xl outline-none placeholder:text-snow/35 md:text-4xl"
                    />
                  )}
                  <p role="alert" className="tag min-h-4 text-signal">
                    {error}
                  </p>
                  <div className="flex items-center gap-6">
                    <button
                      type="submit"
                      className="group/box relative inline-flex items-center gap-6 overflow-hidden border-2 border-snow px-5 py-4 font-display text-sm font-black uppercase transition-colors duration-500 ease-snap hover:text-primary"
                    >
                      <span aria-hidden className="absolute inset-0 origin-left scale-x-0 bg-snow transition-transform duration-500 ease-snap group-hover/box:scale-x-100" />
                      <span className="relative">{step === steps.length - 1 ? "Send it" : "Next"}</span>
                      <span aria-hidden className="relative">↵</span>
                    </button>
                    {step > 0 && (
                      <button type="button" onClick={() => go(step - 1)} className="tag opacity-70 hover:opacity-100">
                        ← Back
                      </button>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Direct contact */}
        <div className="flex flex-col gap-10 md:col-span-4 md:col-start-9">
          <div>
            <p className="tag mb-2 opacity-60">Or write directly</p>
            <a
              ref={emailRef}
              href={`mailto:${site.email}`}
              onPointerEnter={() => scramble(emailRef.current, site.email, 0.6)}
              className="font-display text-2xl font-black break-all md:text-3xl"
            >
              {site.email}
            </a>
          </div>
          <div>
            <p className="tag mb-3 opacity-60">Elsewhere</p>
            <ul className="flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.label}>
                  <motion.a
                    href={s.href}
                    aria-label={s.label}
                    className="relative flex h-14 items-center overflow-hidden border-2 border-snow font-display text-sm font-black uppercase"
                    initial="rest"
                    animate="rest"
                    whileHover="hover"
                  >
                    <motion.span className="px-4" variants={{ rest: { width: "auto" }, hover: { width: "auto" } }}>
                      {s.short}
                    </motion.span>
                    <motion.span
                      className="overflow-hidden whitespace-nowrap"
                      variants={{ rest: { width: 0, opacity: 0 }, hover: { width: "auto", opacity: 1 } }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <span className="pr-4">{s.label}</span>
                    </motion.span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
          <p className="tag flex items-center gap-2">
            <span className="inline-block size-2 animate-blink bg-signal" /> {site.status}
          </p>
        </div>
      </div>
    </section>
  );
}
