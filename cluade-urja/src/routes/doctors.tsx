import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, GraduationCap, Calendar } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { DOCTORS } from "@/lib/site-data";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Our Doctors — Urja Dental Clinic" },
      { name: "description", content: "Meet our team of specialist dentists — implantologists, orthodontists, pediatric dentists and more." },
    ],
  }),
  component: DoctorsPage,
});

function DoctorsPage() {
  return (
    <>
      <PageHeader title="Our Doctors" subtitle="A specialist for every smile — meet the team behind Urja Dental." crumbs={[{ label: "Doctors" }]} />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DOCTORS.map((d) => (
          <article key={d.slug} className="rounded-3xl overflow-hidden border border-border bg-card hover:shadow-soft transition">
            <img src={d.image} alt={`Portrait of ${d.name}`} className="h-80 w-full object-cover" loading="lazy" />
            <div className="p-6">
              <h2 className="text-xl font-bold">{d.name}</h2>
              <p className="text-sm text-primary font-medium mt-1">{d.specialization}</p>
              <p className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{d.degree}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1"><Calendar className="h-3.5 w-3.5" />{d.experience}</p>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{d.bio}</p>
              <div className="mt-5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-coral text-coral" />)}
              </div>
              <Button asChild className="mt-5 w-full">
                <Link to="/book-appointment">Book with {d.name.split(" ").slice(1).join(" ")}</Link>
              </Button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
