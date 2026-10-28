import type { Project } from "@/content/site";

type Props = {
  project: Project;
  className?: string;
  /** Hide the title/year typography (for gallery tiles) */
  bare?: boolean;
  variant?: Project["poster"];
};

/** Generated Swiss-style poster art for a project. Swap for real images later. */
export function Poster({ project, className = "", bare = false, variant }: Props) {
  const [bg, shape, accent] = project.colors;
  const kind = variant ?? project.poster;

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ background: bg }}>
      {kind === "circle" && (
        <>
          <div className="absolute top-[12%] left-[10%] aspect-square w-[80%] rounded-full" style={{ background: shape }} />
          <div className="absolute top-[38%] left-[34%] aspect-square w-[32%]" style={{ background: accent }} />
        </>
      )}
      {kind === "bars" && (
        <div className="absolute inset-0 flex items-end gap-[4%] px-[8%] pb-[22%]">
          {[70, 40, 90, 55, 80, 30].map((h, i) => (
            <div key={i} className="flex-1" style={{ height: `${h}%`, background: i === 2 ? accent : shape }} />
          ))}
        </div>
      )}
      {kind === "triangle" && (
        <>
          <div className="absolute inset-[10%] [clip-path:polygon(50%_0,100%_100%,0_100%)]" style={{ background: shape }} />
          <div className="absolute top-[55%] left-[42%] aspect-square w-[16%] rounded-full" style={{ background: accent }} />
        </>
      )}
      {kind === "dots" && (
        <div className="absolute inset-[10%] grid grid-cols-5 gap-[6%]">
          {Array.from({ length: 25 }, (_, i) => (
            <div key={i} className="aspect-square rounded-full" style={{ background: i === 12 || i === 6 ? accent : shape }} />
          ))}
        </div>
      )}
      {kind === "split" && (
        <>
          <div className="absolute inset-0 [clip-path:polygon(0_0,100%_0,0_100%)]" style={{ background: shape }} />
          <div className="absolute top-1/2 left-1/2 aspect-square w-[45%] -translate-1/2 rounded-full border-[10px]" style={{ borderColor: accent }} />
        </>
      )}

      {!bare && (
        <div className="absolute inset-0 flex flex-col justify-between p-[6%]" style={{ color: accent === bg ? shape : accent }}>
          <span className="tag self-end mix-blend-difference" style={{ color: "#fff" }}>
            {project.year}
          </span>
          <span
            className="font-display text-[clamp(1.1rem,2.3vw,2.3rem)] leading-none font-black uppercase [font-stretch:125%] mix-blend-difference"
            style={{ color: "#fff" }}
          >
            {project.title}
          </span>
        </div>
      )}
    </div>
  );
}
