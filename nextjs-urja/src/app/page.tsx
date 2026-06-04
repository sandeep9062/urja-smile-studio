import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Star,
  Quote,
  MapPin,
  Phone,
  Briefcase,
  Award,
  Users,
  Smile,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CLINIC, SERVICES, DOCTORS, TESTIMONIALS, USPS } from "@/lib/site-data";
import HolisticVsConventional from "@/components/site/HolisticVsConventional";
import WhyUrja from "@/components/site/WhyUrja";

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div
          className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-coral/20 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-28 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/70 px-3 py-1 text-xs font-medium text-primary">
              <Smile className="h-3.5 w-3.5" /> Trusted by 25,000+ smiles
            </span>
            <h1 className="mt-4 md:mt-5 text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.1] md:leading-[1.05] tracking-tight">
              Your Smile,{" "}
              <span className="bg-gradient-coral bg-clip-text text-transparent">Our Priority.</span>
            </h1>
            <p className="mt-4 md:mt-5 text-base md:text-lg text-muted-foreground max-w-lg">
              Warm, modern dentistry for the whole family. From your first cleaning to complete
              smile makeovers — gentle care, world-class results.
            </p>
            <div className="mt-6 md:mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-soft w-full sm:w-auto">
                <Link href="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" /> Book Appointment
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/services">
                  Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 md:mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                ))}
                <span className="ml-2 font-medium text-foreground">4.9</span> on Google
              </div>
              
            </div>
          </div>
          <div className="relative animate-fade-up">
            <div
              className="absolute -inset-4 bg-gradient-coral opacity-20 blur-2xl rounded-3xl"
              aria-hidden
            />
            <Image
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80"
              alt="Confident patient smiling after dental treatment at Urja Dental Clinic"
              width={800}
              height={520}
              priority
              className="relative w-full h-[300px] sm:h-[420px] md:h-[520px] object-cover rounded-3xl shadow-soft"
            />
            <div className="absolute -bottom-4 md:-bottom-6 -left-3 md:-left-6 bg-card border border-border rounded-xl md:rounded-2xl p-3 md:p-4 shadow-soft hidden sm:flex items-center gap-3">
              <div className="flex h-8 md:h-10 w-8 md:w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Award className="h-4 md:h-5 w-4 md:w-5" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-muted-foreground">Trusted since</p>
                <p className="text-xs md:text-sm font-semibold">2003 • 22 Years</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP STRIP */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
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
<WhyUrja/>



      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Our Services
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            Complete dental care under one roof
          </h2>
          <p className="mt-4 text-muted-foreground">
            From routine cleanings to full smile makeovers, our team delivers it all with comfort
            and precision.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map(({ slug, title, short, image }) => (
            <Link
              key={slug}
              href={`/services/${slug}`}
              className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-soft transition"
            >
              <div className="relative h-40 w-full overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-base">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{short}</p>
                <span className="mt-4 inline-flex items-center text-xs font-semibold text-primary group-hover:gap-2 gap-1 transition-all">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DOCTORS */}
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                Meet Our Doctors
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">Specialists who put you first</h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/doctors">View all doctors</Link>
            </Button>
          </div>
          <div className="mt-10 flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4">
            {DOCTORS.map((d) => (
              <div
                key={d.slug}
                className="snap-start shrink-0 w-72 rounded-2xl border border-border bg-background overflow-hidden hover:shadow-soft transition"
              >
                <Image
                  src={d.image}
                  alt={`Portrait of ${d.name}`}
                  width={288}
                  height={288}
                  className="h-72 w-full object-cover"
                />
                <div className="p-5">
                   <h3 className="font-semibold">{d.name}</h3>
                   <p className="text-xs text-muted-foreground mt-0.5">{d.degree}</p>
                   <p className="text-sm text-primary mt-2 font-medium">{d.specialization}</p>
                   <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                     <Briefcase className="h-3.5 w-3.5" />
                     {d.experience}
                   </p>
                   <Button asChild size="sm" className="mt-4 w-full">
                     <Link href="/book-appointment">Book with {d.name.split(" ")[1]}</Link>
                   </Button>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Patient Stories
          </p>
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
                <p className="mt-4 text-sm leading-relaxed text-foreground/90">
                  &ldquo;{t.review}&rdquo;
                </p>
                <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-coral/20"
                  />
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.treatment} • {t.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button asChild variant="outline">
            <Link href="/testimonials">Read all reviews</Link>
          </Button>
        </div>
      </section>

  <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Video stories</h2>
          <p className="mt-2 text-muted-foreground">Real patients, in their own words.</p>
          <div className="mt-6 sm:mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-border group cursor-pointer"
              >
                <Image
                  src={`https://picsum.photos/seed/video-${i}/600/400`}
                  alt={`Video testimonial ${i}`}
                  width={600}
                  height={400}
                  className="h-56 w-full object-cover"
                />
                <div className="absolute inset-0 bg-foreground/40 group-hover:bg-foreground/30 transition flex items-center justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft group-hover:scale-110 transition">
                    <Play className="h-7 w-7 ml-1" fill="currentColor" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="bg-gradient-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
                Smile Gallery
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">
                Real patients. Real transformations.
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/gallery">View Full Gallery</Link>
            </Button>
          </div>
          <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border bg-card">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <Image
                      src={`https://picsum.photos/seed/before-${i}/400/400`}
                      alt="Before treatment"
                      width={400}
                      height={192}
                      className="h-32 sm:h-48 w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-foreground/80 text-background text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      Before
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src={`https://picsum.photos/seed/after-${i}/400/400`}
                      alt="After treatment"
                      width={400}
                      height={192}
                      className="h-32 sm:h-48 w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                      After
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
          {[
            { icon: Award, value: "22+", label: "Years in practice" },
            { icon: Users, value: "25K+", label: "Happy patients" },
            { icon: Star, value: "4.9", label: "Google rating" },
      
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 bg-card">
              <Icon className="h-5 sm:h-6 w-5 sm:w-6 mx-auto text-primary" />
              <p className="mt-2 sm:mt-3 text-xl sm:text-3xl font-bold">{value}</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="bg-card border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 grid md:grid-cols-2 gap-8 md:gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Visit us</h2>
            <p className="mt-3 text-muted-foreground">{CLINIC.hours}</p>
            <div className="mt-6 space-y-3 text-sm">
              <p className="flex gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                {CLINIC.address}
              </p>
              <p className="flex gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a href={CLINIC.phoneHref} className="hover:text-primary">
                  {CLINIC.phone}
                </a>
              </p>
            </div>
            <div className="mt-6 flex gap-3 flex-wrap">
              <Button asChild>
                <Link href="/book-appointment">Book Appointment</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-[#25D366] text-white hover:bg-[#1ebe5d] hover:text-white border-transparent"
              >
                <a href={CLINIC.whatsapp} target="_blank" rel="noreferrer">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border h-80 bg-muted">
            <iframe
              title="Clinic location"
              src="https://www.google.com/maps?q=MG+Road+Bengaluru&output=embed"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </>
  );
}