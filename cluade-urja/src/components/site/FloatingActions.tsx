import { Phone, MessageCircle } from "lucide-react";
import { CLINIC } from "@/lib/site-data";

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={CLINIC.phoneHref}
        aria-label="Call clinic"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft hover:scale-105 transition"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={CLINIC.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp clinic"
        className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-soft hover:scale-105 transition"
        style={{ backgroundColor: "#25D366" }}
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  );
}
