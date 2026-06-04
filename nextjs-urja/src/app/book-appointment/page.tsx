"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Calendar, User, Stethoscope, Clock, Video, Building } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SERVICES, DOCTORS } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { appointmentBookingSchema } from "@/lib/validators";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM",
];

type FormState = {
  consultationType: "VIDEO" | "PHYSICAL" | "";
  service: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  complaint: string;
};

const STEPS = [
  { id: 1, label: "Consultation", icon: Video },
  { id: 2, label: "Service", icon: Stethoscope },
  { id: 3, label: "Doctor", icon: User },
  { id: 4, label: "Date & Time", icon: Calendar },
  { id: 5, label: "Details", icon: Clock },
];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState<FormState>({
    consultationType: "", service: "", doctor: "", date: "", time: "",
    name: "", phone: "", email: "", complaint: "",
  });
  const [done, setDone] = useState(false);

  const update = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return !!form.consultationType;
    if (step === 2) return !!form.service;
    if (step === 3) return !!form.doctor;
    if (step === 4) return !!form.date && !!form.time;
    return true;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setFieldErrors({});

    const payload = {
      service: form.service,
      doctor: form.doctor,
      consultationType: form.consultationType as "VIDEO" | "PHYSICAL",
      date: form.date,
      time: form.time,
      name: form.name,
      phone: form.phone,
      email: form.email,
      complaint: form.complaint,
      website: "", // honeypot
    };

    // Client-side Zod validation — same schema the server uses.
    const parsed = appointmentBookingSchema.safeParse(payload);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".") || "_root";
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      toast.error(parsed.error.issues[0]?.message || "Please check your details");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setServerError("You've made too many requests. Please wait a moment and try again.");
          toast.error("Too many requests — please slow down");
        } else if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
          toast.error(data.fieldErrors[Object.keys(data.fieldErrors)[0]] || data.error || "Please check the form");
        } else {
          setServerError(data.error || "Failed to submit");
          toast.error(data.error || "Failed to submit");
        }
        return;
      }
      setDone(true);
    } catch (err) {
      setServerError("Network error — please try again");
      toast.error("Network error — please try again");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <>
        <PageHeader title="Appointment Confirmed" crumbs={[{ label: "Book Appointment" }]} />
        <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-bold">Thank you, {form.name.split(" ")[0]}!</h2>
            <p className="mt-2 text-muted-foreground">
              Your appointment request has been received. We'll confirm via WhatsApp within 2 hours.
            </p>
            <dl className="mt-8 text-left rounded-2xl bg-muted p-6 space-y-3 text-sm">
              <Row label="Type" value={form.consultationType === "VIDEO" ? "Video Consultation" : "Physical Visit"} />
              <Row label="Service" value={form.service} />
              <Row label="Doctor" value={form.doctor} />
              <Row label="Date" value={form.date} />
              <Row label="Time" value={form.time} />
              <Row label="Phone" value={form.phone} />
            </dl>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Book an Appointment"
        subtitle="Five quick steps — under a minute."
        crumbs={[{ label: "Book Appointment" }]}
      />

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <ol className="flex items-center justify-between mb-10">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex-1 flex items-center">
              <div
                className={cn(
                  "flex flex-col items-center gap-2",
                  step >= s.id ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition",
                    step > s.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : step === s.id
                        ? "bg-background border-primary text-primary"
                        : "bg-background border-border",
                  )}
                >
                  {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
                </span>
                <span className="text-xs font-medium hidden sm:block">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn("flex-1 h-0.5 mx-2", step > s.id ? "bg-primary" : "bg-border")}
                />
              )}
            </li>
          ))}
        </ol>

        <form
          onSubmit={submit}
          noValidate
          className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-soft"
        >
          {/* Honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />

          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold">How would you like to consult?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose between a video consultation from home or visiting the clinic in person.
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => update("consultationType", "VIDEO")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-left transition",
                    form.consultationType === "VIDEO"
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <Video className="h-7 w-7" />
                  </span>
                  <div className="text-center">
                    <p className="font-semibold">Video Consultation</p>
                    <p className="text-xs text-muted-foreground mt-1">Consult from the comfort of your home</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => update("consultationType", "PHYSICAL")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-xl border-2 p-6 text-left transition",
                    form.consultationType === "PHYSICAL"
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Building className="h-7 w-7" />
                  </span>
                  <div className="text-center">
                    <p className="font-semibold">Physical Visit</p>
                    <p className="text-xs text-muted-foreground mt-1">Visit our clinic in person</p>
                  </div>
                </button>
              </div>
              {fieldErrors.consultationType && <p className="mt-2 text-xs text-destructive">{fieldErrors.consultationType}</p>}
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold">What can we help with?</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                {SERVICES.map((s) => (
                  <button
                    type="button"
                    key={s.slug}
                    onClick={() => update("service", s.title)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                      form.service === s.title
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-coral text-primary-foreground">
                      <s.icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium text-sm">{s.title}</span>
                  </button>
                ))}
              </div>
              {fieldErrors.service && <p className="mt-2 text-xs text-destructive">{fieldErrors.service}</p>}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold">Choose your doctor</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => update("doctor", "Any available")}
                  className={cn(
                    "rounded-xl border p-4 text-left transition",
                    form.doctor === "Any available"
                      ? "border-primary bg-accent"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <p className="font-semibold">Any available doctor</p>
                  <p className="text-xs text-muted-foreground mt-1">Fastest scheduling</p>
                </button>
                {DOCTORS.map((d) => (
                  <button
                    type="button"
                    key={d.slug}
                    onClick={() => update("doctor", d.name)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                      form.doctor === d.name
                        ? "border-primary bg-accent"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <img src={d.image} alt="" className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm">{d.name}</p>
                      <p className="text-xs text-muted-foreground">{d.specialization}</p>
                    </div>
                  </button>
                ))}
              </div>
              {fieldErrors.doctor && <p className="mt-2 text-xs text-destructive">{fieldErrors.doctor}</p>}
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold">Pick a date & time</h2>
              <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date">Preferred date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.date}
                    onChange={(e) => update("date", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                    aria-invalid={!!fieldErrors.date}
                  />
                  {fieldErrors.date && <p className="mt-1 text-xs text-destructive">{fieldErrors.date}</p>}
                </div>
                <div>
                  <Label>Time slot</Label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => update("time", t)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition",
                          form.time === t
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.time && <p className="mt-1 text-xs text-destructive">{fieldErrors.time}</p>}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Your details</h2>
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98xxx xxxxx"
                    aria-invalid={!!fieldErrors.phone}
                  />
                  {fieldErrors.phone && <p className="mt-1 text-xs text-destructive">{fieldErrors.phone}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="complaint">Briefly describe your concern</Label>
                <Textarea
                  id="complaint"
                  rows={4}
                  maxLength={1000}
                  value={form.complaint}
                  onChange={(e) => update("complaint", e.target.value)}
                />
                {fieldErrors.complaint && <p className="mt-1 text-xs text-destructive">{fieldErrors.complaint}</p>}
              </div>
              {serverError && (
                <p className="rounded-lg bg-destructive/10 text-destructive text-sm px-3 py-2">{serverError}</p>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || submitting}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 5 ? (
              <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Confirm Appointment"}
              </Button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-right">{value || "—"}</dd>
    </div>
  );
}
