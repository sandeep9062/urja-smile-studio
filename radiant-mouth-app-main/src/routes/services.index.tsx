import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Card } from "@/components/ui/card";
import { services } from "@/lib/clinic-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services/")({
  head: () => ({ meta: [
    { title: "Services — Urja Dental Clinic" },
    { name: "description", content: "Implants, root canals, aligners, whitening, cosmetic, pediatric, oral surgery & gum care." },
  ]}),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Treatments" title="Specialist care for every smile" subtitle="From routine cleaning to full smile makeovers — explore our services."/>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4">
          {services.map((s) => (
            <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group">
              <Card className="h-full border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero text-primary-foreground shadow-soft">
                  <s.icon className="h-6 w-6"/>
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.short}</p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">From <span className="text-primary">{s.priceFrom}</span> · {s.duration}</p>
                <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary">View details <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5"/></span>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
