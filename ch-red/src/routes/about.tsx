import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Award, Sparkles, Heart, Microscope, Droplets } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [
    { title: "About Urja Dental Clinic" },
    { name: "description", content: "Our story, vision and uncompromising sterilization standards." },
  ]}),
  component: AboutPage,
});

const sterility = [
  { icon: Droplets, title: "Autoclave sterilization", desc: "Every instrument autoclave-sealed per patient, color-coded for traceability." },
  { icon: ShieldCheck, title: "Single-use disposables", desc: "Gloves, needles, suction tips and bibs — never reused, ever." },
  { icon: Microscope, title: "Hospital-grade surfaces", desc: "Fumigation cycles and chair disinfection between every appointment." },
];

function AboutPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">Our story</span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Two decades of gentle, fearless dentistry.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Urja Dental Clinic was founded in 2004 with a simple promise — dentistry that's painless, transparent and crafted around the patient. Today, we're one of the most loved clinics in the city, with 25,000+ smiles transformed.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { icon: Heart, title: "Our Vision", text: "A world where no one fears the dentist's chair — where care is gentle, ethical and elegantly delivered." },
            { icon: Sparkles, title: "Our Mission", text: "To craft healthier, more confident smiles through specialist care, modern technology and deep empathy." },
            { icon: Award, title: "Our Values", text: "Honesty before upselling. Comfort before convenience. Excellence in every visit." },
          ].map((v) => (
            <Card key={v.title} className="border-border bg-card p-7">
              <v.icon className="h-9 w-9 text-primary"/>
              <h3 className="mt-4 font-display text-xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Inside Urja" title="A clinic designed to put you at ease" subtitle="Open, light-filled spaces. Premium chairs. Calming music. Zero clinical anxiety."/>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-accent to-secondary shadow-soft" />
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">Clinic photo placeholders — replace with real photography.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Sterilization & safety" title="Hospital-grade hygiene, every visit." subtitle="We go beyond mandated protocols — because your safety is non-negotiable."/>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {sterility.map((s) => (
              <Card key={s.title} className="border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                  <s.icon className="h-5 w-5"/>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Recognition" title="Awarded and accredited"/>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Best Dental Clinic 2024","ISO 9001:2015 Certified","ADA Member Practice","Indian Dental Association"].map((a) => (
              <Card key={a} className="flex items-center gap-3 border-border bg-card p-5">
                <Award className="h-8 w-8 text-coral"/>
                <p className="text-sm font-semibold">{a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
