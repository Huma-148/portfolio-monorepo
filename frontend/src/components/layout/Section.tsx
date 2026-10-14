import type { SectionHeaderProps, SectionProps } from "@/lib/interface";

export function Section({
  id,
  children,
  className = "",
  enclosed = true,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 ${enclosed ? "py-20 md:py-28" : ""} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-12 max-w-2xl md:mb-16">
      {eyebrow ? (
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
