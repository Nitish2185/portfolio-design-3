import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Work />
      <div className="h-[100vh] bg-snow" />
    </main>
  );
}
