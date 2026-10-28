# Lorem Ipsum — Swiss Kinetic Portfolio

A loud, animation-heavy personal portfolio in a **Swiss / kinetic-type** style: deep wine red, white and black with yellow highlights, stretchy variable-font typography, pixel tiles and a crosshair cursor. All text is **lorem ipsum placeholder**.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · GSAP (ScrollTrigger, SplitText, ScrambleText) · Motion · Lenis · Three.js

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Make it yours

Almost everything you'll want to change is in **[`src/content/site.ts`](src/content/site.ts)**.

| What | Where |
| --- | --- |
| Name, initials, role, email, location, coordinates, time zone | `site` |
| Menu and social links | `navLinks`, `socials` |
| Manifesto lines (and their coloured shapes) | `manifesto` |
| About text and stats | `about` |
| Projects (also creates `/work/<slug>` pages) | `projects` |
| Services accordion | `services` |
| Departures-board jobs | `experience` |
| Word-sphere skills | `skills` |
| Testimonial cards | `testimonials` |
| Résumé download | replace `public/resume.pdf` |
| Colours and fonts | `src/app/globals.css` (`@theme`: change `--color-primary` to recolour the whole site) and `src/app/layout.tsx` |

**Your photo:** the halftone block in `src/components/sections/Manifesto.tsx` is a placeholder. Put an image in `public/` and swap in a `next/image` `<Image>`.

**Project images:** posters are generated art (`src/components/ui/Poster.tsx`). Replace them with real screenshots the same way.

**Contact form:** there's no server. After the last question it opens the visitor's email app with the message filled in. To receive messages directly, point it at a service such as Formspree or a Next.js Server Action.

## What moves, and how

| Part | Effect | Built with |
| --- | --- | --- |
| Intro | Wall of tiles; the name decodes and stretches 50→150% wide; tiles collapse from the centre | GSAP + ScrambleText |
| Cursor | Full-screen crosshair with live X/Y; snaps around links like a target lock | GSAP `quickTo` |
| Header | Shows the section you're in (decodes on change) and scroll % | Motion `useScroll` |
| Menu | Full-width stripes slide in from alternating sides; links stretch on hover | Motion |
| Page changes | Diagonal wave of black pixel tiles with a decoding label | Motion `useAnimate` |
| Hero | Your name built from thousands of square particles: they assemble, flee the cursor, burst on click, fold into a sphere on scroll; role text stretches toward the cursor | Three.js shaders + GSAP |
| Manifesto | Lines slide in from alternating sides and stretch to fill the column exactly | GSAP ScrollTrigger |
| Work | Pinned 3D carousel ring turned by scrolling; titles decode | CSS 3D + GSAP |
| Services | Accordion rows sweep red, titles stretch letter by letter, equalizer loops | Motion |
| Experience | Split-flap departures board; every character flips into place | GSAP |
| Skills | 3D sphere of words: follows the mouse, drag and fling with inertia | GSAP ticker |
| Testimonials | Swipeable card deck | Motion drag |
| Contact | Giant cursor-stretch headline; one-question-at-a-time form | Motion `AnimatePresence` |
| Footer | The page "lifts" away with rounded corners; email marquee; live clock | GSAP + CSS |
| Case studies | Decoding/stretching title, sticky info panel, posters unclip; **press and hold** to open the next project | GSAP + Motion |
| 404 | Digits breathe between narrow and wide | CSS keyframes |

Visitors with **"reduce motion"** turned on get a calm version: no intro, still particles, instant text, no looping marquee.

## Project layout

```
src/
  app/                 pages, layout, global styles, 404
    work/[slug]/       case-study pages
  components/
    sections/          one file per page section
    layout/            Nav, Menu, Footer
    providers/         smooth scroll, page transitions, Motion config
    three/             Three.js particle-name scene
    ui/                cursor, loader, posters, buttons, text effects…
  content/site.ts      all placeholder content
  lib/                 GSAP setup, scroll and intro helpers
```

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new); no extra settings are needed.
