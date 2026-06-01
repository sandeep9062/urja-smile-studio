import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { faqs } from "@/lib/clinic-data";
import { Button } from "@/components/ui/button";
import { BookingDialog } from "@/components/site/BookingDialog";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [
    { title: "FAQ — Urja Dental Clinic" },
    { name: "description", content: "Answers to common questions about treatments, pricing, insurance and visits." },
  ]}),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionHeader eyebrow="FAQ" title="Common questions, clear answers" subtitle="Can't find what you're looking for? Just ask — we love questions."/>
        </div>
      </section>
      <section className="py-12">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="overflow-hidden rounded-2xl border border-border bg-card px-5 shadow-soft">
                <AccordionTrigger className="text-left font-display text-base font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="mt-12 rounded-3xl bg-gradient-hero p-8 text-center text-primary-foreground shadow-elevated">
            <h3 className="font-display text-2xl font-semibold">Still have questions?</h3>
            <p className="mt-2 text-primary-foreground/80">Speak to our care team — we're happy to help.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <BookingDialog>
                <Button className="bg-coral text-coral-foreground hover:opacity-90">Book a consult</Button>
              </BookingDialog>
              <Button asChild variant="outline" className="border-white/30 bg-transparent text-primary-foreground hover:bg-white/10"><a href="tel:+919876543210">Call us</a></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
