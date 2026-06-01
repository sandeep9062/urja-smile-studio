import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; to?: string };

export function PageHeader({
  title,
  subtitle,
  crumbs = [],
}: {
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
}) {
  return (
    <section className="bg-gradient-soft border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="flex items-center gap-1 hover:text-primary">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.to ? <Link to={c.to} className="hover:text-primary">{c.label}</Link> : <span className="text-foreground">{c.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight animate-fade-up">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base md:text-lg text-muted-foreground animate-fade-up">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
