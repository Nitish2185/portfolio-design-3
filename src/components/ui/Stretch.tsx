type Props = {
  text: string;
  className?: string;
};

/**
 * Letters that widen one after another on hover (font width axis),
 * like a wave passing through the word. Parent needs `group/stretch`.
 */
export function Stretch({ text, className = "" }: Props) {
  return (
    <span aria-label={text} className={`inline-flex ${className}`}>
      {Array.from(text).map((char, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block transition-[font-stretch,color] duration-500 ease-out-quint [font-stretch:var(--from,100%)] group-hover/stretch:[font-stretch:var(--to,150%)]"
          style={{ transitionDelay: `${i * 25}ms` }}
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
