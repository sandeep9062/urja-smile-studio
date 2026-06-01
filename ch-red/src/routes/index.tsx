import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingDialog } from "@/components/site/BookingDialog";
import { SectionHeader } from "@/components/site/SectionHeader";
import { services, doctors, testimonials, usps } from "@/lib/clinic-data";
import { ShieldCheck, Star, MapPin, ArrowRight, Award, Sparkles, Phone, MessageCircle, BadgeCheck } from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import smileImg from "@/assets/smile-1.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urja Dental Clinic — Modern, Gentle, Trusted Dental Care" },
      { name: "description", content: "Book a painless dental consult at Urja Dental Clinic. Implants, aligners, whitening, kids' dentistry and more — by award-winning specialists." },
      { property: "og:title", content: "Urja Dental Clinic" },
      { property: "og:description", content: "Premium dental care. Gentle hands. Beautiful smiles." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-coral/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Voted Best Dental Clinic 2024
            </span>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Gentle dentistry, <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">beautifully crafted</span> smiles.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Painless treatments, world-class technology and dentists who actually listen. Your most comfortable dental visit starts here.
            </p>
            <div className="flex flex-wrap gap-3">
              <BookingDialog>
                <Button size="lg" className="h-12 bg-gradient-hero px-6 text-base text-primary-foreground shadow-elevated hover:opacity-90">
                  Book Appointment <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </BookingDialog>
              <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                <a href="tel:+919876543210"><Phone className="mr-2 h-4 w-4"/> Call Us</a>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><div className="flex">{[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-coral text-coral"/>)}</div> <b className="text-foreground">4.9/5</b> · 1,200+ Google reviews</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary"/> ADA-grade sterilization</span>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl shadow-elevated ring-1 ring-border">
              <img src={heroImg} alt="Bright modern dental clinic interior" className="aspect-[4/3] w-full object-cover" width={1536} height={1024}/>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-card p-4 shadow-elevated ring-1 ring-border sm:block">
              <div className="flex items-center gap-3">
                <img src={smileImg} alt="Happy patient" className="h-12 w-12 rounded-full object-cover" loading="lazy"/>
                <div>
                  <p className="text-sm font-semibold">25,000+ smiles</p>
                  <p className="text-xs text-muted-foreground">transformed since 2004</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-2xl bg-gradient-hero p-4 text-primary-foreground shadow-elevated sm:block">
              <Award className="h-6 w-6"/>
              <p className="mt-1 text-xs font-semibold">15+ Awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* USPs */}
      <section className="border-y border-border bg-background">
        <div className="mx-auto grid max-w-7xl gap-px overflow-hidden bg-border sm:grid-cols-2 lg:grid-cols-4">
          {usps.map((u) => (
            <div key={u.title} className="bg-background p-6 transition hover:bg-accent/40">
              <p className="font-display text-2xl font-bold text-primary">{u.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="What we do" title="Comprehensive dental care, under one roof" subtitle="From routine cleanings to full smile makeovers — specialist care for every age."/>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group">
                <Card className="h-full border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-card">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                    <s.icon className="h-6 w-6"/>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{s.short}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition group-hover:opacity-100">
                    Learn more <ArrowRight className="ml-1 h-3.5 w-3.5"/>
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Meet the team" title="Specialists who care, deeply" subtitle="Board-certified dentists with decades of combined experience."/>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((d) => (
              <Card key={d.id} className="overflow-hidden border-border bg-card transition hover:shadow-card">
                <div className="aspect-[4/5] bg-gradient-to-br from-accent to-secondary" />
                <div className="p-5">
                  <p className="font-display text-lg font-semibold">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.qualifications}</p>
                  <p className="mt-2 text-sm text-primary">{d.specialization}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{d.experience}+ years experience</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg"><Link to="/doctors">Meet all doctors</Link></Button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Patient stories" title="Real people. Real smiles." />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t,i) => (
              <Card key={i} className="border-border bg-card p-6">
                <div className="flex gap-0.5">{[...Array(t.rating)].map((_,i)=><Star key={i} className="h-4 w-4 fill-coral text-coral"/>)}</div>
                <p className="mt-3 text-sm text-foreground/90">"{t.text}"</p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-hero font-semibold text-primary-foreground">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* MAP + TRUST */}
      <section className="bg-gradient-soft py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeader align="left" eyebrow="Visit us" title="Easy to find. Easier to love." subtitle="Free parking, wheelchair access and a calm waiting lounge."/>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-primary"/> 24, Wellness Square, MG Road, Pune 411001</li>
              <li className="flex items-start gap-3"><Phone className="mt-0.5 h-5 w-5 text-primary"/> +91 98765 43210</li>
              <li className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 text-primary"/> WhatsApp us anytime</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {["ADA Certified","ISO 9001:2015","DCI Approved","Best Clinic 2024"].map(b => (
                <span key={b} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1.5 text-xs font-semibold text-primary">
                  <BadgeCheck className="h-3.5 w-3.5"/> {b}
                </span>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-card">
            <div className="aspect-[4/3] w-full bg-[linear-gradient(135deg,oklch(0.94_0.04_195),oklch(0.96_0.02_220))]">
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral text-coral-foreground shadow-elevated">
                    <MapPin className="h-7 w-7"/>
                  </div>
                  <p className="mt-3 font-display text-lg font-semibold">Urja Dental Clinic</p>
                  <p className="text-xs text-muted-foreground">Google Map placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 text-center text-primary-foreground shadow-elevated sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl"/>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Your healthiest smile is one click away.</h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/80">Book a consult in under 60 seconds. We'll handle the rest.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <BookingDialog>
                <Button size="lg" className="h-12 bg-coral px-6 text-base text-coral-foreground hover:opacity-90">Book Appointment</Button>
              </BookingDialog>
              <Button asChild variant="outline" size="lg" className="h-12 border-white/30 bg-transparent px-6 text-base text-primary-foreground hover:bg-white/10">
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4"/> WhatsApp</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
