/**
 * Faint Swiss-style column grid fixed behind everything.
 * The blend mode keeps it visible on red, black and white sections.
 */
export function GridLines() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] mix-blend-difference">
      <div className="container-x grid h-full grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }, (_, i) => (
          <div
            key={i}
            className={`h-full border-l border-white/[0.07] ${i === 11 || i === 3 ? "border-r" : ""} ${
              i >= 4 ? "hidden md:block" : ""
            } ${i === 3 ? "md:border-r-0" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
