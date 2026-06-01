import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, Clock } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-soft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Modern, gentle and trusted dental care — crafted around your comfort and your smile.
          </p>
          <div className="flex gap-2">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground/70 transition hover:bg-primary hover:text-primary-foreground">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Explore</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            {[["/about","About Us"],["/doctors","Our Doctors"],["/services","Services"],["/gallery","Smile Gallery"],["/testimonials","Patient Stories"]].map(([to,label]) => (
              <li key={to}><Link to={to} className="hover:text-primary">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary"/> 24, Wellness Square,<br/>MG Road, Pune 411001</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-primary"/> <a href="tel:+919876543210" className="hover:text-primary">+91 98765 43210</a></li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-primary"/> <a href="mailto:care@urjadental.in" className="hover:text-primary">care@urjadental.in</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">Hours</h4>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> Mon–Sat: 9:30 AM – 9:00 PM</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary"/> Sunday: 10:00 AM – 2:00 PM</li>
            <li className="mt-3 inline-flex items-center gap-2 rounded-full bg-coral/15 px-3 py-1 text-xs font-medium text-coral">● Emergency care available 24×7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Urja Dental Clinic. All rights reserved.</p>
          <p>Crafted with care for healthier smiles.</p>
        </div>
      </div>
    </footer>
  );
}
