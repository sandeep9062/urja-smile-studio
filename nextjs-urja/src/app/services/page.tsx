import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { SERVICES } from "@/lib/site-data";

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="World-class dental care for every age and every need."
        crumbs={[{ label: "Services" }]}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map(({ slug, title, short, icon: Icon }) => (
          <article
            key={slug}
            className="rounded-2xl border border-border bg-card p-7 hover:border-primary/40 hover:shadow-soft transition flex flex-col"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-coral text-primary-foreground">
              <Icon className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-lg font-bold">{title}</h2>
            <p className="mt-2 text-sm text-muted-foreground flex-1">{short}</p>
            <Link
              href={`/services/${slug}`}
              className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}
