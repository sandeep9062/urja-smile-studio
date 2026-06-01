import { createFileRoute } from "@tanstack/react-router";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Card } from "@/components/ui/card";
import { doctors } from "@/lib/clinic-data";
import { Stethoscope, Award, Calendar } from "lucide-react";
import { BookingDialog } from "@/components/site/BookingDialog";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/doctors")({
  head: () => ({ meta: [
    { title: "Our Doctors — Urja Dental Clinic" },
    { name: "description", content: "Meet our specialist dentists — implants, orthodontics, endodontics and pediatric care." },
  ]}),
  component: DoctorsPage,
});

function DoctorsPage() {
  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Our team" title="Specialists you can trust" subtitle="Board-certified dentists, each with years of focused expertise."/>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-2 lg:px-8 xl:grid-cols-4">
          {doctors.map((d) => (
            <Card key={d.id} className="overflow-hidden border-border bg-card transition hover:shadow-elevated">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-accent via-secondary to-accent">
                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-background/85 px-3 py-2 backdrop-blur">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Award className="h-3.5 w-3.5"/> {d.experience}+ yrs
                  </div>
                  <Stethoscope className="h-4 w-4 text-primary"/>
                </div>
              </div>
              <div className="p-5">
                <p className="font-display text-lg font-semibold">{d.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{d.qualifications}</p>
                <p className="mt-2 inline-flex rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">{d.specialization}</p>
                <p className="mt-3 text-sm text-muted-foreground">{d.bio}</p>
                <BookingDialog>
                  <Button variant="outline" size="sm" className="mt-4 w-full"><Calendar className="mr-1.5 h-3.5 w-3.5"/> Book with {d.name.split(" ")[1]}</Button>
                </BookingDialog>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
