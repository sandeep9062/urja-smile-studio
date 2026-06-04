import React from "react";
import Image from "next/image";
import { ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const WhyUrja: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-soft py-8 px-4 md:py-16 sm:px-6 lg:px-8">
      {/* Decorative glows */}
      <div
        className="absolute top-0 right-0 -z-10 h-80 w-80 rounded-full bg-coral/10 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

        <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/70 px-3 py-1 text-xs font-medium text-primary tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            The Holistic Difference
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight tracking-tight">
            Your Natural Teeth Are{" "}
            <span className="bg-gradient-coral bg-clip-text text-transparent">
              Irreplaceable.
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Traditional dentistry often relies on aggressive drilling that
            removes healthy structure permanently. At{" "}
            <strong className="text-foreground font-semibold">Urja Dental</strong>,
            we believe every millimeter matters. We combine advanced biological
            dentistry with specialized acupuncture protocols to preserve your
            natural smile and avoid unnecessary root canals.
          </p>
        </div>

        {/* ── Image Banner (98% width) ── */}
        <div className="mx-auto w-full sm:w-[98%] relative group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:shadow-xl hover:border-primary/30">
          <div className="relative aspect-[4/3] sm:aspect-[21/9] w-full">
            <Image
              src="/assets/why-urja.png"
              alt="Urja Dental - Conventional vs Holistic Dentistry Comparison"
              fill
              priority
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* Subtle overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground italic">
          *Visual representation of irreversible structure loss vs. holistic
          biological preservation.
        </p>

        {/* ── Key Value Props ── */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-soft transition">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">
                Micro-Preservation
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Saving every millimeter of enamel with minimal intervention.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-soft transition">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/10 text-coral">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">
                Acupuncture Protocols
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Natural pain & healing management through holistic techniques.
              </p>
            </div>
          </div>
        </div>

        {/* ── CTA ── */}
        <div className="mt-6 sm:mt-8 text-center">
          <Button asChild size="lg" className="shadow-soft">
            <Link href="/book-appointment">
              Experience Holistic Care <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WhyUrja;