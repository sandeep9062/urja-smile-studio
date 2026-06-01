import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { BeforeAfterSlider } from "@/components/site/BeforeAfterSlider";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [
    { title: "Smile Gallery — Urja Dental Clinic" },
    { name: "description", content: "Real before-and-after transformations from our patients." },
  ]}),
  component: GalleryPage,
});

type Item = { id: string; cat: string; title: string; before: string; after: string };

const ITEMS: Item[] = [
  { id:"1", cat:"Whitening", title:"6 shades brighter in one visit", before:"linear-gradient(135deg,#cdb89f,#a6896a)", after:"linear-gradient(135deg,#f7f3e9,#dccfb6)" },
  { id:"2", cat:"Implants", title:"Single tooth implant restoration", before:"linear-gradient(135deg,#8a6a5b,#5a4438)", after:"linear-gradient(135deg,#efe5d3,#cdb89f)" },
  { id:"3", cat:"Aligners", title:"Invisible aligners — 14 months", before:"linear-gradient(135deg,#b29a82,#7a624d)", after:"linear-gradient(135deg,#f4ecd8,#d4c4a3)" },
  { id:"4", cat:"Veneers", title:"Smile makeover with veneers", before:"linear-gradient(135deg,#9b7d63,#5e4836)", after:"linear-gradient(135deg,#fbf7ea,#e4d6b6)" },
  { id:"5", cat:"Whitening", title:"Tea & coffee stains removed", before:"linear-gradient(135deg,#c0a989,#8e7558)", after:"linear-gradient(135deg,#fcf6e7,#e0cda7)" },
  { id:"6", cat:"Implants", title:"Full-arch fixed teeth", before:"linear-gradient(135deg,#6e574a,#3d2e25)", after:"linear-gradient(135deg,#f0e3c6,#cab48b)" },
];

const CATS = ["All", "Whitening", "Implants", "Aligners", "Veneers"];

function GalleryPage() {
  const [cat, setCat] = useState("All");
  const items = cat === "All" ? ITEMS : ITEMS.filter(i => i.cat === cat);

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Real results" title="Smile Gallery" subtitle="Drag the slider on each card to see real before-and-after transformations."/>
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {CATS.map(c => (
              <button key={c} onClick={()=>setCat(c)}
                className={cn("rounded-full border px-4 py-2 text-sm font-semibold transition",
                  cat === c ? "border-primary bg-primary text-primary-foreground shadow-soft" : "border-border bg-card text-foreground hover:border-primary/40")}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
          {items.map(item => (
            <div key={item.id} className="animate-fade-in">
              <BeforeAfterSlider before={item.before} after={item.after}/>
              <div className="mt-3 flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">{item.title}</p>
                <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground">{item.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
