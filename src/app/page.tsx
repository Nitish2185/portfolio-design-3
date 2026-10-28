import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <main className="relative bg-snow">
      <Hero />
      <Manifesto />
      <Work />
      <Services />
      <Experience />
      <Skills />
      <Testimonials />
      <Contact />
    </main>
  );
}
