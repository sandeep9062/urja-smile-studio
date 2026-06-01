import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/lib/clinic-data";
import { Star, Play, Quote } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({ meta: [
    { title: "Testimonials — Urja Dental Clinic" },
    { name: "description", content: "Patient reviews, Google ratings and video stories from real Urja patients." },
  ]}),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Patient love" title="Stories from our smile family" subtitle="Real reviews from real patients across Google, in-clinic and beyond."/>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-card px-5 py-3 shadow-soft ring-1 ring-border">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#4285F4] font-bold text-white">G</div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_,i)=><Star key={i} className="h-4 w-4 fill-coral text-coral"/>)}
                  <span className="ml-1 text-sm font-bold">4.9</span>
                </div>
                <p className="text-xs text-muted-foreground">Google · 1,200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Watch" title="Video stories"/>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[1,2,3].map(i => (
              <div key={i} className="group relative aspect-video cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-primary/80 to-primary-glow shadow-card">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary shadow-elevated transition group-hover:scale-110">
                    <Play className="ml-1 h-6 w-6 fill-current"/>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-sm font-semibold text-white">Patient Story #{i}</p>
                  <p className="text-xs text-white/80">Smile transformation journey</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-soft py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Google reviews" title="What patients say"/>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...testimonials, ...testimonials].slice(0,6).map((t,i) => (
              <Card key={i} className="relative border-border bg-card p-6">
                <Quote className="absolute right-4 top-4 h-7 w-7 text-accent"/>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-hero font-semibold text-primary-foreground">{t.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <div className="flex gap-0.5">{[...Array(t.rating)].map((_,i)=><Star key={i} className="h-3 w-3 fill-coral text-coral"/>)}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/90">"{t.text}"</p>
                <p className="mt-3 text-xs text-muted-foreground">{t.role} · verified visit</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
