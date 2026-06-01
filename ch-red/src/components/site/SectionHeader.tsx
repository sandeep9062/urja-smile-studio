import { cn } from "@/lib/utils";

export function SectionHeader({ eyebrow, title, subtitle, align = "center", className }:
  { eyebrow?: string; title: string; subtitle?: string; align?: "center" | "left"; className?: string }) {
  return (
    <div className={cn("mx-auto max-w-2xl", align === "center" ? "text-center" : "text-left", className)}>
      {eyebrow && (
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>}
    </div>
  );
}
