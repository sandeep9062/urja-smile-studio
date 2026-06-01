import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { services } from "@/lib/clinic-data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/site/BookingDialog";
import { ArrowLeft, Check, Clock, IndianRupee, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({ meta: [
    { title: `${loaderData?.service.title ?? "Service"} — Urja Dental Clinic` },
    { name: "description", content: loaderData?.service.short ?? "Specialist dental treatment." },
  ]}),
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-3xl font-bold">Service not found</h1>
      <Button asChild className="mt-6"><Link to="/services">Back to services</Link></Button>
    </div>
  ),
});

function ServiceDetail() {
  const { service } = Route.useLoaderData();
  const Icon = service.icon;
  return (
    <>
      <section className="bg-gradient-soft py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="mr-1 h-4 w-4"/> All services</Link>
          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-hero text-primary-foreground shadow-elevated">
              <Icon className="h-8 w-8"/>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{service.title}</h1>
              <p className="mt-1 text-muted-foreground">{service.short}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border p-7">
              <h2 className="font-display text-xl font-semibold">About the treatment</h2>
              <p className="mt-3 text-base text-muted-foreground">{service.description}</p>
            </Card>
            <Card className="border-border p-7">
              <h2 className="font-display text-xl font-semibold">What's included</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.highlights.map((h: string) => (
                  <li key={h} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary"/> {h}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="border-border p-7">
              <h2 className="font-display text-xl font-semibold">Our promise</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, title: "Sterile & Safe", text: "Hospital-grade protocols" },
                  { icon: Clock, title: "On-time", text: "Respect for your schedule" },
                  { icon: IndianRupee, title: "Transparent", text: "No hidden costs, ever" },
                ].map(p => (
                  <div key={p.title} className="rounded-xl bg-accent/40 p-4">
                    <p.icon className="h-5 w-5 text-primary"/>
                    <p className="mt-2 text-sm font-semibold">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{p.text}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="border-border bg-gradient-hero p-6 text-primary-foreground shadow-card">
              <p className="text-xs uppercase tracking-wider opacity-80">Starting from</p>
              <p className="mt-1 font-display text-3xl font-bold">{service.priceFrom}</p>
              <p className="mt-1 text-sm opacity-80">{service.duration}</p>
              <BookingDialog>
                <Button className="mt-5 w-full bg-coral text-coral-foreground hover:opacity-90">Book this treatment</Button>
              </BookingDialog>
              <p className="mt-3 text-center text-xs opacity-80">0% EMI on plans above ₹10,000</p>
            </Card>
            <Card className="border-border p-5">
              <p className="text-sm font-semibold">Questions?</p>
              <p className="mt-1 text-xs text-muted-foreground">Speak to our care coordinator</p>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full"><a href="tel:+919876543210">+91 98765 43210</a></Button>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}
