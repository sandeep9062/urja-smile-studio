import { Star, Play, Quote } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { TESTIMONIALS } from "@/lib/site-data";

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        title="Patient Testimonials"
        subtitle="Stories from the smiles we've cared for."
        crumbs={[{ label: "Testimonials" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="rounded-2xl border border-border bg-card p-6">
              <Quote className="h-6 w-6 text-coral" />
              <div className="mt-3 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-coral text-coral" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed">&ldquo;{t.review}&rdquo;</p>
              <div className="mt-5 pt-5 border-t border-border">
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.treatment} • {t.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-card border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-2xl md:text-3xl font-bold">Video stories</h2>
          <p className="mt-2 text-muted-foreground">Real patients, in their own words.</p>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative rounded-2xl overflow-hidden border border-border group cursor-pointer"
              >
                <img
                  src={`https://picsum.photos/seed/video-${i}/600/400`}
                  alt={`Video testimonial ${i}`}
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

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold">From Google Reviews</h2>
        <div className="mt-6 rounded-2xl border border-dashed border-border p-12 bg-card text-center">
          <p className="text-sm text-muted-foreground">[ Google Reviews widget placeholder ]</p>
          <p className="mt-2 text-2xl font-bold">
            4.9 <span className="text-coral">★★★★★</span>
          </p>
          <p className="text-sm text-muted-foreground">Based on 1,200+ verified reviews</p>
        </div>
      </section>
    </>
  );
}
