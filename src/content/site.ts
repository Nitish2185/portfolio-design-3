/**
 * All placeholder content for the portfolio lives here.
 * Replace the lorem ipsum with your own details when you're ready.
 */

export const site = {
  name: "Lorem Ipsum",
  firstName: "Lorem",
  lastName: "Ipsum",
  initials: "LI",
  role: "Dolor sit amet & consectetur",
  tagline: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua, ut enim ad minim veniam.",
  email: "hello@example.com",
  location: "Ipsum City",
  coordinates: "48.8566° N, 2.3522° E",
  timeZone: "UTC",
  status: "Lorem ipsum for new projects",
  resume: "/resume.pdf",
  year: 2026,
  description:
    "Lorem ipsum dolor sit amet. Placeholder portfolio built with Next.js, GSAP, Motion, Lenis and Three.js.",
};

export const navLinks = [
  { label: "Index", href: "/#top" },
  { label: "Manifesto", href: "/#manifesto" },
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Experience", href: "/#experience" },
  { label: "Skills", href: "/#skills" },
  { label: "Contact", href: "/#contact" },
];

export const socials = [
  { label: "LinkedIn", short: "Li", href: "#" },
  { label: "GitHub", short: "Gh", href: "#" },
  { label: "Behance", short: "Be", href: "#" },
  { label: "Instagram", short: "Ig", href: "#" },
];

/** Lines of the manifesto: they slide in from alternating sides. `chip` adds a small coloured shape inline. */
export const manifesto: { text: string; chip?: "primary" | "signal" | "ink" }[] = [
  { text: "Lorem ipsum", chip: "primary" },
  { text: "dolor sit amet," },
  { text: "consectetur", chip: "signal" },
  { text: "adipiscing elit" },
  { text: "sed do eiusmod.", chip: "ink" },
];

export const about = {
  intro:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  more: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  facts: [
    { value: 9, suffix: "yrs", label: "Lorem ipsum" },
    { value: 86, suffix: "", label: "Dolor projects" },
    { value: 31, suffix: "", label: "Amet clients" },
    { value: 7, suffix: "×", label: "Consectetur" },
  ],
};

export type Project = {
  slug: string;
  title: string;
  kind: string;
  year: string;
  client: string;
  role: string;
  summary: string;
  tags: string[];
  /** Background / shape / accent colours for the generated poster art */
  colors: [string, string, string];
  poster: "circle" | "bars" | "triangle" | "dots" | "split";
};

export const projects: Project[] = [
  {
    slug: "aurum",
    title: "Aurum",
    kind: "Lorem identity",
    year: "2026",
    client: "Aurum Dolor AG",
    role: "Lorem direction",
    summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.",
    tags: ["Lorem", "Ipsum", "Dolor"],
    colors: ["#e10600", "#f4f5f7", "#ffd23f"],
    poster: "circle",
  },
  {
    slug: "kinetik",
    title: "Kinetik",
    kind: "Ipsum platform",
    year: "2025",
    client: "Kinetik Amet",
    role: "Ipsum engineering",
    summary: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    tags: ["Sit", "Amet", "Elit"],
    colors: ["#ffd23f", "#0c0c10", "#f4f5f7"],
    poster: "bars",
  },
  {
    slug: "monolith",
    title: "Monolith",
    kind: "Dolor campaign",
    year: "2025",
    client: "Monolith Tempor",
    role: "Dolor motion",
    summary: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    tags: ["Tempor", "Magna", "Labore"],
    colors: ["#0c0c10", "#e10600", "#f4f5f7"],
    poster: "triangle",
  },
  {
    slug: "parallel",
    title: "Parallel",
    kind: "Amet product",
    year: "2024",
    client: "Parallel Aliqua",
    role: "Amet design",
    summary: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    tags: ["Aliqua", "Veniam", "Nisi"],
    colors: ["#f4f5f7", "#0c0c10", "#e10600"],
    poster: "dots",
  },
  {
    slug: "vector",
    title: "Vector",
    kind: "Sit editorial",
    year: "2024",
    client: "Vector Nostrud",
    role: "Sit art direction",
    summary: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    tags: ["Ullamco", "Laboris", "Commodo"],
    colors: ["#a30400", "#ffd23f", "#f4f5f7"],
    poster: "split",
  },
  {
    slug: "halcyon",
    title: "Halcyon",
    kind: "Elit experience",
    year: "2023",
    client: "Halcyon Minim",
    role: "Elit prototyping",
    summary: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur.",
    tags: ["Minim", "Veniam", "Quis"],
    colors: ["#ffd23f", "#f4f5f7", "#e10600"],
    poster: "circle",
  },
];

export const services = [
  {
    title: "Lorem Systems",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore.",
    points: ["Lorem ipsum", "Dolor sit", "Amet elit", "Sed tempor"],
  },
  {
    title: "Ipsum Interfaces",
    text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    points: ["Ullamco", "Laboris", "Nisi ut", "Aliquip"],
  },
  {
    title: "Dolor Motion",
    text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    points: ["Reprehenderit", "Voluptate", "Cillum", "Fugiat"],
  },
  {
    title: "Amet Direction",
    text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est.",
    points: ["Occaecat", "Proident", "Officia", "Mollit"],
  },
  {
    title: "Elit Prototypes",
    text: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni.",
    points: ["Voluptas", "Aspernatur", "Consequuntur", "Magni"],
  },
];

export const experience = [
  { period: "2024–NOW", role: "LOREM LEAD", company: "IPSUM STUDIO", status: "ACTIVE" },
  { period: "2021–2024", role: "SENIOR DOLOR", company: "AMET LABS", status: "DONE" },
  { period: "2019–2021", role: "SIT DESIGNER", company: "ELIT & CO", status: "DONE" },
  { period: "2017–2019", role: "JUNIOR TEMPOR", company: "MAGNA AGENCY", status: "DONE" },
  { period: "2016–2017", role: "INTERN ALIQUA", company: "VENIAM LTD", status: "DONE" },
];

export const skills = [
  "Lorem",
  "Ipsum",
  "Dolor",
  "Sit",
  "Amet",
  "Consectetur",
  "Adipiscing",
  "Elit",
  "Sed",
  "Eiusmod",
  "Tempor",
  "Incididunt",
  "Labore",
  "Magna",
  "Aliqua",
  "Veniam",
  "Nostrud",
  "Ullamco",
  "Laboris",
  "Commodo",
  "Duis",
  "Irure",
  "Velit",
  "Cillum",
];

export const testimonials = [
  {
    quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
    name: "Lorem Dolor",
    title: "Founder — Ipsum Co.",
  },
  {
    quote: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
    name: "Amet Sit",
    title: "Director — Elit Studio",
  },
  {
    quote: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    name: "Tempor Magna",
    title: "Head of Product — Aliqua",
  },
  {
    quote: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
    name: "Veniam Quis",
    title: "CTO — Nostrud Labs",
  },
];
