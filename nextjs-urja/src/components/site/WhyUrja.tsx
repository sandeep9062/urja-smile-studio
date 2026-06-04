"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

// ─── Data ─────────────────────────────────────────────────────────────────────

const pillars = [
  {
    id: "01",

   image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
    
    // Fallback gradient shown when image is missing / loading
    fallbackGradient: "linear-gradient(135deg, #e8d5c0 0%, #d4b896 50%, #c9a97a 100%)",
    imageAlt: "Patient receiving gentle dental treatment at Urja",
    tag: "Zero anxiety",
    headline: "We treat the person,\nnot just the tooth.",
    body: "Every visit starts with a conversation. Our pain-free protocols and calm environment make even nervous patients feel at home.",
    nudge: "mt-0",
  },
  {
    id: "02",
image: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&q=80",
    
    fallbackGradient: "linear-gradient(135deg, #d6e8d5 0%, #a8ccb0 50%, #7daf8a 100%)",
    imageAlt: "Advanced digital scanning technology at Urja Dental",
    tag: "Precision tech",
    headline: "Diagnosed right\nthe first time.",
    body: "3D digital scans, intraoral cameras, and AI-assisted analysis — no guesswork, no repeat visits.",
    nudge: "mt-16 md:mt-24",
  },
  {
    id: "03",
image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=600&q=80",
    
    fallbackGradient: "linear-gradient(135deg, #d5dde8 0%, #96adc9 50%, #7a96b8 100%)",
    imageAlt: "Urja dental team in a modern clean clinic",
    tag: "Honest care",
    headline: "We tell you what\nyou actually need.",
    body: "Transparent treatment plans with fixed pricing. No upsells, no unnecessary procedures — ever.",
    nudge: "mt-8 md:mt-12",
  },
];

// ─── Component ─────────────────────────────────────────────────────

export default function WhyUrja() {
  return (
    <section
      className="relative overflow-hidden bg-accent/15 py-20 sm:py-24 md:py-32"
      aria-labelledby="why-urja-heading"
    >
      {/* ── Background texture: subtle noise grain ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* ── Decorative circle accent top-right ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[480px] w-[480px] rounded-full border border-coral/20 opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 h-[280px] w-[280px] rounded-full border border-coral/15 opacity-50"
      />

      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16">

        {/* ── Section header ── */}
        <div className="mb-14 sm:mb-16 md:mb-20 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-lg">
            {/* Eyebrow */}
            <p className="mb-3 sm:mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-coral">
              <span className="inline-block h-px w-8 bg-coral" />
              Why choose us
            </p>

            <h2
              id="why-urja-heading"
              className="text-[2rem] leading-[1.1] tracking-tight text-foreground sm:text-[2.5rem] md:text-[3.25rem] lg:text-[3.75rem]"
            >
              Dentistry done
              <br />
              <em className="not-italic text-coral">differently.</em>
            </h2>
          </div>

          {/* Right: short descriptor + CTA */}
          <div className="flex flex-col items-start sm:items-end gap-4 shrink-0">
            <p className="max-w-[22rem] sm:text-right text-sm leading-relaxed text-muted-foreground">
              Three things Urja does that most dental clinics simply don't.
            </p>
            <Link
              href="/about"
              className="group inline-flex items-center gap-1.5 rounded-full border border-coral/60 px-5 py-2 text-xs font-semibold tracking-wide text-coral transition-all hover:bg-coral hover:text-primary-foreground"
            >
              Our story
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
            </Link>
          </div>
        </div>

        {/* ── Three pillars ── */}

        {/* 
          MOBILE  (< sm):  single column, full-width cards, stacked
          TABLET  (sm–md): 2-col then overflow; we use a single-col scroll
          DESKTOP (md+):   3-col side-by-side with vertical stagger via mt-* 
        */}

        {/* Mobile & tablet: vertical stack, centered */}
        <div className="flex flex-col gap-8 sm:gap-10 md:hidden">
          {pillars.map((p) => (
            <MobileCard key={p.id} pillar={p} />
          ))}
        </div>

        {/* Desktop: 3-col staggered grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-5 lg:gap-7 xl:gap-8 md:items-start">
          {pillars.map((p) => (
            <DesktopCard key={p.id} pillar={p} />
          ))}
        </div>

      
      </div>
    </section>
  );
}

// ─── Desktop card (staggered portrait) ────────────────────────────────────────

function DesktopCard({ pillar }: { pillar: typeof pillars[0] }) {
  return (
    <article className={`group flex flex-col ${pillar.nudge}`}>

      {/* Image frame */}
      <div
        className="relative overflow-hidden rounded-2xl aspect-[3/4]"
        style={{ background: pillar.fallbackGradient }}
      >
        <img
          src={pillar.image}
          alt={pillar.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />

        {/* Dark gradient at bottom for card legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Number tag — top left */}
        <span className="absolute top-4 left-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-[11px] font-black text-coral backdrop-blur-sm shadow-sm">
          {pillar.id}
        </span>

        {/* Category pill — top right */}
        <span className="absolute top-4 right-4 rounded-full bg-coral px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-primary-foreground shadow-md">
          {pillar.tag}
        </span>

        {/* Headline overlaid on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-xl leading-[1.2] text-white whitespace-pre-line tracking-tight">
            {pillar.headline}
          </h3>
        </div>
      </div>

      {/* Body text below image */}
      <p className="mt-4 px-1 text-sm leading-relaxed text-muted-foreground">
        {pillar.body}
      </p>
    </article>
  );
}

// ─── Mobile card (horizontal image + text side-by-side on sm, stacked on xs) ──

function MobileCard({ pillar }: { pillar: typeof pillars[0] }) {
  return (
    <article className="group flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">

      {/* Image — square on mobile, portrait on sm */}
      <div
        className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] sm:w-48 sm:shrink-0 sm:aspect-[3/4]"
        style={{ background: pillar.fallbackGradient }}
      >
        <img
          src={pillar.image}
          alt={pillar.imageAlt}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Number */}
        <span className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/80 text-[10px] font-black text-coral backdrop-blur-sm shadow-sm">
          {pillar.id}
        </span>

        {/* Tag pill */}
        <span className="absolute top-3 right-3 rounded-full bg-coral px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
          {pillar.tag}
        </span>
      </div>

      {/* Text */}
      <div className="flex flex-col justify-center gap-2 pt-1 sm:pt-3">
        <h3 className="text-xl leading-[1.2] tracking-tight text-foreground whitespace-pre-line sm:text-[1.35rem]">
          {pillar.headline}
        </h3>
        <p className="text-[13px] sm:text-sm leading-relaxed text-muted-foreground max-w-sm">
          {pillar.body}
        </p>
      </div>
    </article>
  );
}