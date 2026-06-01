import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "./BookingDialog";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/doctors", label: "Doctors" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Smile Gallery" },
  { to: "/social", label: "Social" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl shadow-soft" : "bg-background/60 backdrop-blur-md"
    )}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active ? "bg-accent text-accent-foreground" : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:+919876543210" className="hidden items-center gap-2 text-sm font-medium text-primary md:flex">
            <Phone className="h-4 w-4" /> +91 98765 43210
          </a>
          <BookingDialog>
            <Button size="sm" className="hidden md:inline-flex bg-gradient-hero text-primary-foreground shadow-soft hover:opacity-90">
              Book Appointment
            </Button>
          </BookingDialog>
          <button
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden animate-fade-in">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((n) => {
              const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium",
                    active ? "bg-accent text-accent-foreground" : "text-foreground/80 hover:bg-secondary"
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
            <BookingDialog>
              <Button className="mt-2 w-full bg-gradient-hero text-primary-foreground">Book Appointment</Button>
            </BookingDialog>
          </nav>
        </div>
      )}
    </header>
  );
}
