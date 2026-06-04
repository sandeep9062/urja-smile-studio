import React from "react";
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Heart,
  ShieldOff,
  ArrowRight,
} from "lucide-react";

export default function HolisticVsConventional() {
  return (
    <section className="w-full bg-gradient-soft py-12 px-4 md:py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/70 px-3 py-1 text-xs font-medium text-primary tracking-wide">
            <Sparkles className="h-3.5 w-3.5" />
            Only Holistic Dentistry Clinic in Tricity
          </span>
          <h2 className="mt-4 md:mt-5 text-2xl sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Your Natural Tooth is
            Precious.
            <br />
            <span className="bg-gradient-coral bg-clip-text text-transparent">
              Once Lost, It Cannot Regenerate.
            </span>
          </h2>
          <p className="mt-4 md:mt-5 text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            At Urja Dental, we carefully preserve your natural tooth and help
            avoid unnecessary root canals through specialized holistic dentistry
            and acupuncture protocols.
          </p>
        </div>

        {/* ── Split Comparison Card ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-soft border border-border bg-card">
          {/* ── LEFT: Conventional ── */}
          <div className="relative p-6 sm:p-8 md:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border bg-background">
            <div>
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    The Standard Approach
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold">
                    Conventional Dentistry
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Often relies heavily on aggressive, invasive drilling. When even{" "}
                <strong className="text-destructive">
                  5mm of extra grinding
                </strong>{" "}
                occurs, it causes permanent, irreversible structural loss.
              </p>

              {/* Issue List */}
              <div className="rounded-2xl border border-border bg-card p-6 mb-8 space-y-4">
                <div className="flex items-start gap-3">
                  <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">
                      Aggressive Drilling:
                    </strong>{" "}
                    Shaves away vital layers quickly, leading to premature root
                    canals.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">
                      Permanent Particle Loss:
                    </strong>{" "}
                    Micro-fractures and disappearing tooth structure that your
                    body cannot regrow.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldOff className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">High Anxiety:</strong>{" "}
                    Clinical environments packed with loud, intimidating
                    mechanical tools.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="pt-5 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
              <span>Every Millimeter Matters</span>
              <span className="text-destructive">Invasive Treatment</span>
            </div>
          </div>

          {/* ── RIGHT: Urja Holistic ── */}
          <div className="relative p-6 sm:p-8 md:p-12 flex flex-col justify-between bg-gradient-to-br from-accent/40 via-background to-accent/20 overflow-hidden">
            {/* Decorative glows */}
            <div
              className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-coral/10 blur-3xl"
              aria-hidden
            />

            <div className="relative">
              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-soft">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold text-primary uppercase tracking-widest">
                    The Urja Philosophy
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold">
                    Urja Holistic Dentistry
                  </h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-foreground/80 mb-8 leading-relaxed">
                We prioritize saving your biological tooth. By integrating{" "}
                <strong className="text-primary">
                  natural healing energy
                </strong>{" "}
                with tailored acupuncture protocols, we preserve every
                millimeter of your natural health.
              </p>

              {/* Benefits List */}
              <div className="rounded-2xl border border-primary/15 bg-card/95 backdrop-blur p-6 mb-8 space-y-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">
                      Acupuncture Protocols:
                    </strong>{" "}
                    Activates natural healing meridians to lower inflammation
                    and soothe nerves gently.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">
                      Structure Protection:
                    </strong>{" "}
                    Minimal-intervention mindset designed specifically to avoid
                    unnecessary root canals.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground/80">
                    <strong className="text-foreground">
                      Premium, Peaceful Atmosphere:
                    </strong>{" "}
                    Calming soft golden vibes with comforting natural accents for
                    complete anxiety relief.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer bar */}
            <div className="relative pt-5 border-t border-primary/15 flex items-center justify-between text-[11px] text-primary uppercase tracking-widest font-semibold">
              <span>Structure Preserved</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" /> 100% Biocompatible
              </span>
            </div>
          </div>
        </div>

        {/* ── Footer Tagline ── */}
        <div className="mt-8 md:mt-12 text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
            Save the Tooth Naturally.
          </p>
          <div className="mt-2 h-1 w-20 bg-gradient-coral mx-auto rounded-full" />
        </div>
      </div>
    </section>
  );
}