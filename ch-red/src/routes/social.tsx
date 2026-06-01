import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Instagram, Heart, MessageCircle, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/social")({
  head: () => ({ meta: [
    { title: "Digital Hub — Urja Dental Clinic" },
    { name: "description", content: "Latest posts, smile reels and tips from @urjadental." },
  ]}),
  component: SocialPage,
});

const POSTS = [
  { tag: "Smile Reveal", g: "linear-gradient(135deg,oklch(0.9_0.06_30),oklch(0.96_0.04_60))", likes: "2.1k", comments: "84" },
  { tag: "Patient Story", g: "linear-gradient(135deg,oklch(0.85_0.08_200),oklch(0.94_0.04_195))", likes: "1.4k", comments: "62" },
  { tag: "Tips & Tricks", g: "linear-gradient(135deg,oklch(0.92_0.05_140),oklch(0.96_0.03_120))", likes: "987", comments: "41" },
  { tag: "Behind the Chair", g: "linear-gradient(135deg,oklch(0.88_0.07_280),oklch(0.94_0.04_300))", likes: "3.2k", comments: "120" },
  { tag: "Before / After", g: "linear-gradient(135deg,oklch(0.92_0.06_40),oklch(0.96_0.03_30))", likes: "5.6k", comments: "210" },
  { tag: "Team Spotlight", g: "linear-gradient(135deg,oklch(0.86_0.06_210),oklch(0.93_0.04_220))", likes: "1.8k", comments: "73" },
  { tag: "Kids' Corner", g: "linear-gradient(135deg,oklch(0.9_0.06_60),oklch(0.95_0.03_80))", likes: "2.4k", comments: "98" },
  { tag: "Aligner Journey", g: "linear-gradient(135deg,oklch(0.87_0.08_180),oklch(0.94_0.04_190))", likes: "1.1k", comments: "47" },
  { tag: "Reel", g: "linear-gradient(135deg,oklch(0.88_0.07_330),oklch(0.94_0.04_350))", likes: "8.4k", comments: "390" },
];

function SocialPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Instagram className="h-3.5 w-3.5"/> @urjadental
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Follow our daily dose of smiles.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">Reels, transformations, oral-care tips and behind-the-scenes from our clinic.</p>
          <Button asChild size="lg" className="mt-6 bg-gradient-coral text-coral-foreground hover:opacity-90">
            <a href="#" target="_blank" rel="noreferrer"><Instagram className="mr-2 h-4 w-4"/> Follow on Instagram</a>
          </Button>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Latest posts" title="Straight from our Instagram"/>
          <div className="mt-10 grid grid-cols-3 gap-2 sm:gap-4">
            {POSTS.map((p, i) => (
              <div key={i} className="group relative aspect-square overflow-hidden rounded-2xl shadow-soft" style={{ background: p.g }}>
                <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-black/60 via-transparent p-3 opacity-0 transition group-hover:opacity-100">
                  <div className="flex flex-wrap gap-3 text-xs font-semibold text-white">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5 fill-white"/> {p.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5"/> {p.comments}</span>
                    <span className="hidden items-center gap-1 sm:flex"><Bookmark className="h-3.5 w-3.5"/></span>
                  </div>
                </div>
                <span className="absolute left-2 top-2 rounded-full bg-background/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
