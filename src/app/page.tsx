import { site } from "@/content/site";

export default function Home() {
  return (
    <main className="container-x flex min-h-svh flex-col justify-center gap-6 bg-blue text-snow">
      <p className="tag">Portfolio — {site.year}</p>
      <h1 className="font-display text-[16vw] leading-[0.8] font-black uppercase stretch-narrow">
        {site.firstName}
      </h1>
      <h1 className="font-display text-[16vw] leading-[0.8] font-black uppercase stretch-wide">
        {site.lastName}
      </h1>
    </main>
  );
}
