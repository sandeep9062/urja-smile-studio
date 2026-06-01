"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock } from "lucide-react";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CLINIC } from "@/lib/site-data";
import { toast } from "sonner";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value.trim();
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement).value.trim();
    const msg = (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim();
    if (name.length < 2) return toast.error("Please enter your name");
    if (!/^[0-9+\s-]{7,15}$/.test(phone)) return toast.error("Invalid phone");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast.error("Invalid email");
    if (msg.length < 5) return toast.error("Please enter your message");
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message sent! We'll respond within one business day.");
      form.reset();
    }, 700);
  };

  return (
    <>
      <PageHeader
        title="Contact Us"
        subtitle="We'd love to hear from you."
        crumbs={[{ label: "Contact" }]}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {[
            { icon: MapPin, title: "Visit us", body: CLINIC.address },
            { icon: Phone, title: "Call us", body: CLINIC.phone, href: CLINIC.phoneHref },
            {
              icon: MessageCircle,
              title: "WhatsApp",
              body: "Chat with our team",
              href: CLINIC.whatsapp,
            },
            { icon: Mail, title: "Email", body: CLINIC.email, href: `mailto:${CLINIC.email}` },
            { icon: Clock, title: "Hours", body: CLINIC.hours },
          ].map(({ icon: Icon, title, body, href }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{title}</p>
                {href ? (
                  <a href={href} className="text-sm text-muted-foreground hover:text-primary">
                    {body}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{body}</p>
                )}
              </div>
            </div>
          ))}

          <div className="rounded-2xl overflow-hidden border border-border h-72 bg-muted">
            <iframe
              title="Google Maps"
              src="https://www.google.com/maps?q=MG+Road+Bengaluru&output=embed"
              className="w-full h-full"
            />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-soft space-y-4 h-fit"
        >
          <h2 className="text-2xl font-bold">Send us a message</h2>
          <p className="text-sm text-muted-foreground">
            We typically respond within one business day.
          </p>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required maxLength={100} />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
          </div>
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" maxLength={150} />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={5} required maxLength={1000} />
          </div>
          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? "Sending…" : "Send Message"}
          </Button>
        </form>
      </section>
    </>
  );
}
