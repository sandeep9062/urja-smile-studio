import Link from "next/link";
import { CheckCircle2, Target, Eye, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import HolisticVsConventional from "@/components/site/HolisticVsConventional";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Urja Dental"
        subtitle="Two decades of warm, world-class dentistry — built around you."
        crumbs={[{ label: "About" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://picsum.photos/seed/urja-clinic/900/700"
          alt="Urja Dental Clinic reception"
          className="rounded-3xl object-cover w-full h-[420px] shadow-soft"
        />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Our Story</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Dentistry, reimagined with warmth</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Founded in 2003 by Dr. Urja Sharma, our clinic was built on a simple promise — every
            patient deserves expert care delivered with empathy, in a space that feels safe.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Today, our team of 12+ specialists treats over 25,000 patients, blending advanced
            technology with the kindness that has defined us since day one.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "NABH Accredited Clinical Standards",
              "Digital X-rays & 3D imaging",
              "Strict infection-control protocols",
              "Multilingual, family-friendly team",
            ].map((t) => (
              <li key={t} className="flex gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <HolisticVsConventional />

      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Eye,
              title: "Our Vision",
              text: "To be South India's most trusted dental destination — where technology meets genuine care, and every patient leaves smiling.",
            },
            {
              icon: Target,
              title: "Our Mission",
              text: "Deliver world-class dentistry with unwavering ethics, transparent pricing, and a calm experience that dissolves dental anxiety.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <Card key={title} className="border-border">
              <CardContent className="p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-coral text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-muted-foreground">{text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Infrastructure
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            A clinic that feels like a calm retreat
          </h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { src: "facility-1", cap: "Reception & waiting lounge" },
            { src: "facility-2", cap: "Surgical suite" },
            { src: "facility-3", cap: "Pediatric corner" },
            { src: "facility-4", cap: "Digital imaging room" },
            { src: "facility-5", cap: "Sterilization centre" },
            { src: "facility-6", cap: "Consultation rooms" },
          ].map((f) => (
            <figure
              key={f.src}
              className="rounded-2xl overflow-hidden border border-border bg-card"
            >
              <img
                src={`https://picsum.photos/seed/${f.src}/600/400`}
                alt={f.cap}
                className="h-56 w-full object-cover"
              />
              <figcaption className="p-4 text-sm font-medium text-foreground">{f.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>
{/* 
      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Awards & Accreditations
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Recognised for excellence</h2>
          </div>
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {["NABH", "ISO 9001", "IDA Member", "FDI Partner"].map((a) => (
              <div
                key={a}
                className="rounded-2xl border border-border bg-background p-8 flex items-center justify-center font-bold text-lg text-muted-foreground hover:text-primary transition"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section> */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
            Safety First
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Sterilization & safety standards</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: CheckCircle2,
              title: "Class B Autoclave",
              text: "Hospital-grade sterilization for every instrument.",
            },
            {
              icon: CheckCircle2,
              title: "Single-Use Items",
              text: "Disposable masks, gloves, syringes for every patient.",
            },
            {
              icon: CheckCircle2,
              title: "HEPA Air Filtration",
              text: "Surgical-grade air purification across all rooms.",
            },
            {
              icon: CheckCircle2,
              title: "RO-Treated Water",
              text: "Distilled water lines on every dental chair.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-coral text-primary-foreground p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-soft">
          <div>
            <Sparkles className="h-6 w-6" />
            <h3 className="mt-3 text-2xl md:text-3xl font-bold">Ready for a smile you'll love?</h3>
            <p className="mt-2 opacity-90">
              Book a consultation — most slots available within 24 hours.
            </p>
          </div>
          <Link
            href="/book-appointment"
            className="rounded-xl bg-background text-primary px-6 py-3 font-semibold shadow-soft hover:scale-[1.02] transition"
          >
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}
