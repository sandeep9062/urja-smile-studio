import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Calendar } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SERVICES, type Service } from "@/lib/site-data";
import { toast } from "sonner";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }): { service: Service } => {
    const service = SERVICES.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.service.title} — Urja Dental Clinic` },
          { name: "description", content: loaderData.service.short },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="text-2xl font-bold">Service not found</h1>
      <Link to="/services" className="mt-4 inline-block text-primary underline">Back to services</Link>
    </div>
  ),
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData() as { service: Service };
  const Icon = service.icon;

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.short}
        crumbs={[{ label: "Services", to: "/services" }, { label: service.title }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-coral text-primary-foreground">
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">What is {service.title.toLowerCase()}?</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{service.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Who needs it?</h2>
            <ul className="mt-4 space-y-2">
              {service.whoNeeds.map((w) => (
                <li key={w} className="flex gap-2 text-sm"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" />{w}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Our procedure</h2>
            <ol className="mt-5 space-y-4">
              {service.procedure.map((step, i) => (
                <li key={step} className="flex gap-4 items-start">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                  <p className="text-sm leading-relaxed pt-1.5">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Before & After</h2>
            <div className="mt-5 grid sm:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-border grid grid-cols-2">
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${service.slug}-b-${i}/300/300`} alt="Before" className="h-32 w-full object-cover" loading="lazy" />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-foreground/80 text-background px-1.5 py-0.5 rounded">BEFORE</span>
                  </div>
                  <div className="relative">
                    <img src={`https://picsum.photos/seed/${service.slug}-a-${i}/300/300`} alt="After" className="h-32 w-full object-cover" loading="lazy" />
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">AFTER</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="mt-5">
              {service.faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ConsultationForm serviceTitle={service.title} />
        </aside>
      </section>
    </>
  );
}

function ConsultationForm({ serviceTitle }: { serviceTitle: string }) {
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    if (name.length < 2) { toast.error("Please enter your name"); return; }
    if (!/^[0-9+\s-]{7,15}$/.test(phone)) { toast.error("Please enter a valid phone number"); return; }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Thanks! We'll call you within 2 hours.");
      form.reset();
    }, 800);
  };
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-2 text-primary"><Calendar className="h-5 w-5" /><span className="text-xs font-semibold uppercase tracking-wider">Free Consultation</span></div>
      <h3 className="mt-2 text-xl font-bold">Book a consultation</h3>
      <p className="mt-1 text-sm text-muted-foreground">Most slots within 24 hours.</p>
      <div className="mt-5 space-y-3">
        <div><Label htmlFor="cf-name">Name</Label><Input id="cf-name" name="name" required maxLength={100} placeholder="Your full name" /></div>
        <div><Label htmlFor="cf-phone">Phone</Label><Input id="cf-phone" name="phone" type="tel" required placeholder="+91 98xxx xxxxx" /></div>
        <div><Label htmlFor="cf-service">Service</Label><Input id="cf-service" name="service" defaultValue={serviceTitle} readOnly /></div>
        <div><Label htmlFor="cf-date">Preferred date</Label><Input id="cf-date" name="date" type="date" /></div>
        <div><Label htmlFor="cf-note">Brief note (optional)</Label><Textarea id="cf-note" name="note" rows={3} maxLength={300} /></div>
        <Button type="submit" className="w-full" disabled={submitting}>{submitting ? "Sending…" : "Request Callback"}</Button>
      </div>
    </form>
  );
}
