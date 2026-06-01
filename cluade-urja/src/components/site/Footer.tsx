import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MessageCircle, MapPin, Phone, Mail, Sparkles } from "lucide-react";
import { CLINIC } from "@/lib/site-data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-coral text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight">Urja Dental</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Clinic</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            Warm, modern dentistry in the heart of the city. Trusted by families for over two decades.
          </p>
          <div className="mt-5 flex gap-3">
            {[
              { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
              { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
              { icon: Youtube, label: "YouTube", href: "https://youtube.com" },
              { icon: MessageCircle, label: "WhatsApp", href: CLINIC.whatsapp },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/60 text-foreground hover:bg-primary hover:text-primary-foreground transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/services", "Services"],
              ["/doctors", "Our Doctors"],
              ["/gallery", "Smile Gallery"],
              ["/testimonials", "Testimonials"],
              ["/faq", "FAQs"],
              ["/social", "Instagram"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-muted-foreground hover:text-primary transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />{CLINIC.address}</li>
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" /><a href={CLINIC.phoneHref} className="hover:text-primary">{CLINIC.phone}</a></li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" /><a href={`mailto:${CLINIC.email}`} className="hover:text-primary">{CLINIC.email}</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Hours</h3>
          <p className="mt-4 text-sm text-muted-foreground">{CLINIC.hours}</p>
          <p className="mt-4 text-sm text-muted-foreground">Emergency consultations available — please call ahead.</p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {CLINIC.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Privacy Policy</a>
            <a href="#" className="hover:text-primary">Terms of Use</a>
            <span>Developed by <span className="font-semibold text-primary">DigiBoffins</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
