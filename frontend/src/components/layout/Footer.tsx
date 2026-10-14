import { SITE } from "@/lib/data";

export function Footer() {
  const year: number = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center sm:px-8">
        <p className="font-mono text-xs text-muted">
          © {year} {SITE.name}
        </p>
        <p className="text-sm text-muted">
          Full-stack web apps · Real-time data pipelines
        </p>
      </div>
    </footer>
  );
}
