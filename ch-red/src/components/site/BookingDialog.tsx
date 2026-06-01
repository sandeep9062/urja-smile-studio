import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { doctors, services } from "@/lib/clinic-data";
import { Check, ChevronLeft, ChevronRight, CalendarCheck2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const TIME_SLOTS = ["10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM","06:00 PM","06:30 PM","07:00 PM"];

export function BookingDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [doctorId, setDoctorId] = useState<string>("");
  const [serviceSlug, setServiceSlug] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>();
  const [slot, setSlot] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", reason: "", history: "" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [done, setDone] = useState(false);

  const reset = () => { setStep(1); setDoctorId(""); setServiceSlug(""); setDate(undefined); setSlot(""); setForm({ name:"",phone:"",email:"",reason:"",history:""}); setErrors({}); setDone(false); };

  const canNext1 = doctorId && serviceSlug;
  const canNext2 = date && slot;

  const validate3 = () => {
    const e: Record<string,string> = {};
    if (form.name.trim().length < 2) e.name = "Please enter your full name";
    if (!/^[+\d][\d\s-]{7,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email";
    if (form.reason.trim().length < 3) e.reason = "Tell us briefly why you're visiting";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => { if (validate3()) setDone(true); };

  return (
    <Dialog open={open} onOpenChange={(o)=>{ setOpen(o); if(!o) setTimeout(reset,200);}}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto p-0">
        {done ? (
          <div className="p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-hero shadow-elevated">
              <Check className="h-8 w-8 text-primary-foreground"/>
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold">Appointment Requested!</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Thank you, <b>{form.name}</b>. We've received your request with <b>{doctors.find(d=>d.id===doctorId)?.name}</b> on <b>{date && format(date,"EEE, d MMM")}</b> at <b>{slot}</b>. Our team will confirm via call/WhatsApp shortly.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5"/> Ref #URJ-{Math.floor(Math.random()*9000+1000)}
            </div>
            <Button className="mt-6 w-full" onClick={()=>setOpen(false)}>Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader className="border-b border-border bg-gradient-soft px-6 py-5">
              <DialogTitle className="font-display text-xl">Book your appointment</DialogTitle>
              <DialogDescription>Step {step} of 3 — takes under a minute.</DialogDescription>
              <div className="mt-3 flex gap-1.5">
                {[1,2,3].map(i => (
                  <div key={i} className={cn("h-1.5 flex-1 rounded-full", i<=step ? "bg-primary" : "bg-border")}/>
                ))}
              </div>
            </DialogHeader>

            <div className="px-6 py-5">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <Label className="text-sm font-semibold">Choose a doctor</Label>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {doctors.map(d => (
                        <button key={d.id} type="button" onClick={()=>setDoctorId(d.id)}
                          className={cn("rounded-xl border p-3 text-left transition", doctorId===d.id ? "border-primary bg-accent shadow-soft" : "border-border hover:border-primary/50")}>
                          <p className="text-sm font-semibold">{d.name}</p>
                          <p className="text-xs text-muted-foreground">{d.specialization}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">{d.experience} yrs experience</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Reason / Service</Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {services.map(s => (
                        <button key={s.slug} type="button" onClick={()=>setServiceSlug(s.slug)}
                          className={cn("rounded-full border px-3 py-1.5 text-xs font-medium transition", serviceSlug===s.slug ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50")}>
                          {s.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-semibold">Pick a date</Label>
                    <div className="mt-2 rounded-xl border border-border p-2">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d)=> d < new Date(new Date().setHours(0,0,0,0))} className={cn("p-0 pointer-events-auto")}/>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Available time slots</Label>
                    {!date ? (
                      <p className="mt-3 text-sm text-muted-foreground">Select a date to view available slots.</p>
                    ) : (
                      <div className="mt-3 grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(t => (
                          <button key={t} type="button" onClick={()=>setSlot(t)}
                            className={cn("rounded-lg border px-2 py-2 text-xs font-medium transition", slot===t ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50")}>
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1.5"/>
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input id="phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="mt-1.5"/>
                      {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email (optional)</Label>
                    <Input id="email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-1.5"/>
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason for visit *</Label>
                    <Input id="reason" value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="mt-1.5" placeholder="e.g. toothache, cleaning, consultation"/>
                    {errors.reason && <p className="mt-1 text-xs text-destructive">{errors.reason}</p>}
                  </div>
                  <div>
                    <Label htmlFor="history">Brief medical history</Label>
                    <Textarea id="history" rows={3} value={form.history} onChange={e=>setForm({...form,history:e.target.value})} className="mt-1.5" placeholder="Any allergies, ongoing medication, BP/diabetes, prior dental work..."/>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-border px-6 py-4">
              <Button variant="ghost" onClick={()=>setStep(s=>Math.max(1,s-1))} disabled={step===1}>
                <ChevronLeft className="mr-1 h-4 w-4"/> Back
              </Button>
              {step < 3 ? (
                <Button onClick={()=>setStep(s=>s+1)} disabled={(step===1 && !canNext1) || (step===2 && !canNext2)} className="bg-gradient-hero text-primary-foreground">
                  Continue <ChevronRight className="ml-1 h-4 w-4"/>
                </Button>
              ) : (
                <Button onClick={submit} className="bg-gradient-hero text-primary-foreground">
                  <CalendarCheck2 className="mr-2 h-4 w-4"/> Confirm Booking
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
