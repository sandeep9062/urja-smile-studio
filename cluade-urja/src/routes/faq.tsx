import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Urja Dental Clinic" },
      { name: "description", content: "Answers to common questions about treatments, pricing, insurance and post-treatment care." },
    ],
  }),
  component: FAQPage,
});

const FAQS: Record<string, { q: string; a: string }[]> = {
  General: [
    { q: "Do I need an appointment?", a: "Yes — appointments help us give you our full attention. Book online or call us." },
    { q: "Where are you located?", a: "We're on MG Road, Bengaluru, with ample parking and metro access." },
    { q: "Do you treat children?", a: "Absolutely. Dr. Meera Iyer is our specialist pediatric dentist." },
  ],
  Treatments: [
    { q: "Is root canal painful?", a: "Modern RCT is virtually painless and usually finished in a single visit." },
    { q: "How long do implants last?", a: "With good care, dental implants can last a lifetime." },
    { q: "Are aligners as good as braces?", a: "For most cases, yes — and they're discreet and removable." },
  ],
  Pricing: [
    { q: "Do you offer EMI options?", a: "Yes — interest-free EMI plans are available for treatments above ₹15,000." },
    { q: "Are consultations free?", a: "First-time consultations are complimentary." },
  ],
  Insurance: [
    { q: "Do you accept insurance?", a: "We work with most major health insurers. Bring your card and we'll handle the paperwork." },
    { q: "Do you offer cashless treatment?", a: "Yes, for selected partner insurers." },
  ],
  "Post-Treatment": [
    { q: "When can I eat after a filling?", a: "You can eat as soon as the numbness wears off — typically 1–2 hours." },
    { q: "How do I care for my implants?", a: "Brush, floss and visit us for a check-up every six months." },
  ],
};

function FAQPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    if (!q.trim()) return FAQS;
    const term = q.toLowerCase();
    const out: typeof FAQS = {};
    for (const [k, items] of Object.entries(FAQS)) {
      const matches = items.filter((it) => it.q.toLowerCase().includes(term) || it.a.toLowerCase().includes(term));
      if (matches.length) out[k] = matches;
    }
    return out;
  }, [q]);

  return (
    <>
      <PageHeader title="Frequently Asked Questions" subtitle="Quick answers to what patients ask us most." crumbs={[{ label: "FAQ" }]} />
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…" className="pl-10 h-12" />
        </div>

        <div className="mt-10 space-y-8">
          {Object.entries(filtered).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-lg font-bold text-primary">{category}</h2>
              <Accordion type="single" collapsible className="mt-3">
                {items.map((it, i) => (
                  <AccordionItem key={i} value={`${category}-${i}`}>
                    <AccordionTrigger>{it.q}</AccordionTrigger>
                    <AccordionContent>{it.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
          {Object.keys(filtered).length === 0 && (
            <p className="text-center text-muted-foreground py-12">No questions found. Try a different search.</p>
          )}
        </div>
      </section>
    </>
  );
}
