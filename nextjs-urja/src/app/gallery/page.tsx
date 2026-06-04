"use client";

import { useState } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/site/PageHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { SERVICES } from "@/lib/site-data";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "dental-implants", label: "Implants" },
  { id: "teeth-whitening", label: "Whitening" },
  { id: "braces-aligners", label: "Braces" },
  { id: "cosmetic-dentistry", label: "Cosmetic" },
];

const ITEMS = SERVICES.flatMap((s) =>
  [1, 2].map((n) => ({
    id: `${s.slug}-${n}`,
    category: s.slug,
    label: s.title,
    before: `https://picsum.photos/seed/g-${s.slug}-b${n}/600/600`,
    after: `https://picsum.photos/seed/g-${s.slug}-a${n}/600/600`,
  })),
);

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const items = filter === "all" ? ITEMS : ITEMS.filter((i) => i.category === filter);
  const current = items.find((i) => i.id === open);

  return (
    <>
      <PageHeader
        title="Smile Gallery"
        subtitle="Real patients. Real transformations."
        crumbs={[{ label: "Gallery" }]}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="flex-wrap h-auto">
            {FILTERS.map((f) => (
              <TabsTrigger key={f.id} value={f.id}>
                {f.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setOpen(item.id)}
              className="group rounded-2xl overflow-hidden border border-border bg-card text-left hover:shadow-soft transition"
            >
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <Image
                      src={item.before}
                      alt={`${item.label} before`}
                      width={300}
                      height={224}
                      className="h-40 sm:h-56 w-full object-cover"
                    />
                  <span className="absolute top-2 left-2 bg-foreground/80 text-background text-[10px] font-bold px-2 py-0.5 rounded">
                    BEFORE
                  </span>
                </div>
                  <div className="relative">
                    <Image
                      src={item.after}
                      alt={`${item.label} after`}
                      width={300}
                      height={224}
                      className="h-40 sm:h-56 w-full object-cover"
                    />
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    AFTER
                  </span>
                </div>
              </div>
              <p className="p-4 text-sm font-medium">{item.label}</p>
            </button>
          ))}
        </div>

        <p className="mt-10 text-xs text-muted-foreground text-center max-w-2xl mx-auto">
          All images shared with patient consent. Individual results may vary. Photographs are for
          illustrative purposes only.
        </p>
      </section>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-3xl">
          <DialogTitle>{current?.label}</DialogTitle>
          {current && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <Image src={current.before} alt="Before" width={400} height={400} className="w-full rounded-lg" />
                <span className="absolute top-2 left-2 bg-foreground/80 text-background text-[10px] font-bold px-2 py-0.5 rounded">
                  BEFORE
                </span>
              </div>
              <div className="relative">
                <Image src={current.after} alt="After" width={400} height={400} className="w-full rounded-lg" />
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                  AFTER
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
