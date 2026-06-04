import Image from "next/image";
import { Heart, MessageCircle, Instagram } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";

const POSTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  image: `https://picsum.photos/seed/insta-${i + 1}/500/500`,
  likes: 80 + Math.floor(Math.random() * 600),
  comments: 5 + Math.floor(Math.random() * 40),
  caption: [
    "Another beautiful smile transformation today ✨",
    "Meet the team behind the magic 💙",
    "Painless root canals are a reality — here's how",
    "Tiny patient, huge smile 🧒",
    "Whitening done right — book your slot",
    "Behind the scenes at our sterilization centre",
    "Q&A: are implants right for me?",
    "Brace yourself — straight teeth coming up",
    "Wedding-day smile makeover ❤️",
    "Tip Tuesday: floss before you brush",
    "Patient love — thank you for the kind words",
    "Open this weekend! Book your check-up",
  ][i],
}));

export default function SocialPage() {
  return (
    <>
      <PageHeader
        title="Follow Us on Instagram"
        subtitle="@urjadentalclinic — smile tips, real transformations and clinic life."
        crumbs={[{ label: "Social" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-coral text-primary-foreground">
              <Instagram className="h-7 w-7" />
            </span>
            <div>
              <p className="font-bold text-lg">@urjadentalclinic</p>
              <p className="text-sm text-muted-foreground">12.4K followers • 540 posts</p>
            </div>
          </div>
          <Button asChild>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <Instagram className="mr-2 h-4 w-4" /> Follow on Instagram
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {POSTS.map((p) => (
            <article
              key={p.id}
              className="group relative rounded-2xl overflow-hidden border border-border bg-card aspect-square"
            >
              <Image
                src={p.image}
                alt={p.caption}
                width={500}
                height={500}
                className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-background p-4 text-center">
                <div className="flex gap-5 text-sm font-semibold">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" fill="currentColor" /> {p.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" fill="currentColor" /> {p.comments}
                  </span>
                </div>
                <p className="mt-3 text-xs line-clamp-3">{p.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
