import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [
    { title: "Contact Us — Urja Dental Clinic" },
    { name: "description", content: "Visit Urja Dental Clinic, call us, or send us a message." },
  ]}),
  component: ContactPage,
});

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string,string> = {};
    if (form.name.trim().length < 2) errs.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!/^[+\d][\d\s-]{7,15}$/.test(form.phone.trim())) errs.phone = "Invalid phone";
    if (form.message.trim().length < 10) errs.message = "Please write a brief message";
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSent(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name:"", email:"", phone:"", message:"" });
    }
  };

  return (
    <>
      <section className="bg-gradient-soft py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Contact" title="We'd love to hear from you" subtitle="Visit, call, WhatsApp or send us a message — we respond fast."/>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-5">
            <Card className="border-border p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  { icon: MapPin, t: "Visit", d: "24, Wellness Square,\nMG Road, Pune 411001" },
                  { icon: Phone, t: "Call", d: "+91 98765 43210", href: "tel:+919876543210" },
                  { icon: MessageCircle, t: "WhatsApp", d: "Chat with us anytime", href: "https://wa.me/919876543210" },
                  { icon: Mail, t: "Email", d: "care@urjadental.in", href: "mailto:care@urjadental.in" },
                ].map((i) => (
                  <a key={i.t} href={i.href ?? "#"} className="block rounded-xl bg-accent/40 p-4 transition hover:bg-accent">
                    <i.icon className="h-5 w-5 text-primary"/>
                    <p className="mt-2 text-sm font-semibold">{i.t}</p>
                    <p className="whitespace-pre-line text-xs text-muted-foreground">{i.d}</p>
                  </a>
                ))}
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-accent/30 p-4">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary"/>
                <div className="text-sm">
                  <p className="font-semibold">Hours</p>
                  <p className="text-muted-foreground">Mon–Sat: 9:30 AM – 9:00 PM<br/>Sunday: 10:00 AM – 2:00 PM</p>
                  <p className="mt-1 text-xs font-medium text-coral">● 24×7 emergency line</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden border-border">
              <div className="relative aspect-[16/10] bg-[linear-gradient(135deg,oklch(0.94_0.04_195),oklch(0.96_0.02_220))]">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral text-coral-foreground shadow-elevated">
                      <MapPin className="h-6 w-6"/>
                    </div>
                    <p className="mt-2 text-sm font-semibold">Urja Dental Clinic</p>
                    <p className="text-xs text-muted-foreground">Interactive map placeholder</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card className="border-border p-7 shadow-card">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-hero text-primary-foreground shadow-elevated">
                  <Check className="h-7 w-7"/>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold">Message sent!</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">Thank you for reaching out. Our care coordinator will reply within 24 hours.</p>
                <Button variant="outline" className="mt-5" onClick={()=>setSent(false)}>Send another</Button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h3 className="font-display text-xl font-semibold">Send us a message</h3>
                <div>
                  <Label htmlFor="cname">Full Name *</Label>
                  <Input id="cname" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="mt-1.5" placeholder="Your name"/>
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="cemail">Email *</Label>
                    <Input id="cemail" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-1.5"/>
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="cphone">Phone *</Label>
                    <Input id="cphone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="mt-1.5"/>
                    {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="cmsg">Message *</Label>
                  <Textarea id="cmsg" rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} className="mt-1.5" placeholder="How can we help you?"/>
                  {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90">
                  <Send className="mr-2 h-4 w-4"/> Send Message
                </Button>
                <p className="text-center text-xs text-muted-foreground">We typically respond within 24 hours.</p>
              </form>
            )}
          </Card>
        </div>
      </section>
    </>
  );
}
