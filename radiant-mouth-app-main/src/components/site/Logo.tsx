import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2c-2.5 0-4.5 1.5-4.5 4 0 1.2.4 2.3 1 3.3.7 1.2.9 2.5.9 3.8v5.5c0 1.9 1 3.4 2.6 3.4 1.1 0 1.5-.9 1.7-2 .2-1.3.4-2 1.3-2s1.1.7 1.3 2c.2 1.1.6 2 1.7 2 1.6 0 2.6-1.5 2.6-3.4v-5.5c0-1.3.2-2.6.9-3.8.6-1 1-2.1 1-3.3 0-2.5-2-4-4.5-4-1.5 0-2.5.6-3 .6s-1.5-.6-3-.6Z"/>
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg font-bold tracking-tight">Urja Dental</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Clinic</span>
      </span>
    </Link>
  );
}
