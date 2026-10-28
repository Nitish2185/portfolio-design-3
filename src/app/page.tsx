import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <div className="h-[100vh] bg-snow" />
    </main>
  );
}
