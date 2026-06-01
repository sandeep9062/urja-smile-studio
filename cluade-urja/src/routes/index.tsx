import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  Star,
  Quote,
  MapPin,
  Phone,
  MessageCircle,
  CheckCircle2,
  Award,
  Users,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CLINIC, SERVICES, DOCTORS, TESTIMONIALS, USPS } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Urja Dental Clinic — Your Smile, Our Priority" },
      { name: "description", content: "Modern, gentle dental care in Bengaluru. Implants, root canals, braces, whitening and pediatric dentistry. Book online." },
      { property: "og:title", content: "Urja Dental Clinic" },
      { property: "og:description", content: "Your Smile, Our Priority." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-coral/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/70 px-3 py-1 text-xs font-medium text-primary">
              <Smile className="h-3.5 w-3.5" /> Trusted by 25,000+ smiles
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Your Smile,{" "}
              <span className="bg-gradient-coral bg-clip-text text-transparent">Our Priority.</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-lg">
              Warm, modern dentistry for the whole family. From your first cleaning to complete smile makeovers — gentle care, world-class results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-soft">
                <Link to="/book-appointment"><Calendar className="mr-2 h-4 w-4" /> Book Appointment</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">Explore Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                ))}
                <span className="ml-2 font-medium text-foreground">4.9</span> on Google
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" /> NABH Accredited
              </div>
            </div>
          </div>
          <div className="relative animate-fade-up">
            <div className="absolute -inset-4 bg-gradient-coral opacity-20 blur-2xl rounded-3xl" aria-hidden />
            <img
              src="https://picsum.photos/seed/urja-hero/900/1000"
              alt="Confident patient smiling after dental treatment at Urja Dental Clinic"
              className="relative w-full h-[420px] md:h-[520px] object-cover rounded-3xl shadow-soft"
              loading="eager"
            />
            <div className="absolute -bottom-6 -left-6 bg-card border border-border rounded-2xl p-4 shadow-soft hidden sm:flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trusted since</p>
                <p className="text-sm font-semibold">2003 • 22 Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {USPS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/60 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Our Services</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Complete dental care under one roof</h2>
          <p className="mt-4 text-muted-foreground">From routine cleanings to full smile makeovers, our team delivers it all with comfort and precision.</p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ slug, title, short, icon: Icon }) => (
            <Link
              key={slug}
              to="/services/$slug"
              params={{ slug }}
              className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-soft transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-coral text-primary-foreground">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-base">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{short}</p>
              <span className="mt-4 inline-flex items-center text-xs font-semibold text-primary group-hover:gap-2 gap-1 transition-all">
                Learn more <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* DOCTORS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Meet Our Doctors</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Specialists who put you first</h2>
            </div>
            <Button asChild variant="outline"><Link to="/doctors">View all doctors</Link></Button>
          </div>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
            {DOCTORS.map((d) => (
              <div key={d.slug} className="snap-start shrink-0 w-72 rounded-2xl border border-border bg-background overflow-hidden hover:shadow-soft transition">
                <img src={d.image} alt={`Portrait of ${d.name}`} className="h-72 w-full object-cover" loading="lazy" />
                <div className="p-5">
                  <h3 className="font-semibold">{d.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.degree}</p>
                  <p className="text-sm text-primary mt-2 font-medium">{d.specialization}</p>
                  <Button asChild size="sm" className="mt-4 w-full">
                    <Link to="/book-appointment">Book with {d.name.split(" ")[1]}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Patient Stories</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Loved by 25,000+ patients</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <Card key={t.name} className="border-border">
              <CardContent className="p-6">
                <Quote className="h-6 w-6 text-coral" />
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.review}"</p>
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.treatment} • {t.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline"><Link to="/testimonials">Read all reviews</Link></Button>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Smile Gallery</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Real patients. Real transformations.</h2>
            </div>
            <Button asChild variant="outline"><Link to="/gallery">View Full Gallery</Link></Button>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/before-${i}/400/400`} alt="Before treatment" className="h-48 w-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 bg-foreground/80 text-background text-[10px] font-bold uppercase px-2 py-0.5 rounded">Before</span>
                  </div>
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/after-${i}/400/400`} alt="After treatment" className="h-48 w-full object-cover" loading="lazy" />
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded">After</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Award, value: "22+", label: "Years in practice" },
            { icon: Users, value: "25K+", label: "Happy patients" },
            { icon: Star, value: "4.9", label: "Google rating" },
            { icon: CheckCircle2, value: "NABH", label: "Accredited" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-2xl border border-border p-6 bg-card">
              <Icon className="h-6 w-6 mx-auto text-primary" />
              <p className="mt-3 text-3xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Visit us</h2>
            <p className="mt-3 text-muted-foreground">{CLINIC.hours}</p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex gap-3"><MapPin className="h-5 w-5 text-primary shrink-0" />{CLINIC.address}</p>
              <p className="flex gap-3"><Phone className="h-5 w-5 text-primary shrink-0" /><a href={CLINIC.phoneHref} className="hover:text-primary">{CLINIC.phone}</a></p>
            </div>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Button asChild><Link to="/book-appointment">Book Appointment</Link></Button>
              <Button asChild variant="outline" className="bg-[#25D366] text-white hover:bg-[#1ebe5d] hover:text-white border-transparent">
                <a href={CLINIC.whatsapp} target="_blank" rel="noreferrer"><MessageCircle className="mr-2 h-4 w-4" /> WhatsApp Us</a>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border h-80 bg-muted">
            <iframe
              title="Clinic location"
              src="https://www.google.com/maps?q=MG+Road+Bengaluru&output=embed"
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
