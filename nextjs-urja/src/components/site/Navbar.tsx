"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/doctors", label: "Doctors" },
  { to: "/gallery", label: "Gallery" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background/60 backdrop-blur-sm",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Urja Dental Clinic — Home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-coral text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold tracking-tight">Urja Dental</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Clinic
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition",
                  isActive
                    ? "text-primary bg-accent/60"
                    : "text-foreground/80 hover:text-primary hover:bg-accent/40",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex shadow-soft">
            <Link href="/book-appointment">Book Appointment</Link>
          </Button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-accent/50"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background animate-fade-up">
          <nav className="mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1" aria-label="Mobile">
            {NAV.map((item) => {
              const isActive = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={cn(
                    "px-3 py-2.5 text-sm font-medium rounded-md",
                    isActive ? "text-primary bg-accent/60" : "hover:bg-accent/50",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button asChild className="mt-2 sm:hidden">
              <Link href="/book-appointment">Book Appointment</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
