import { Phone, MessageCircle, CalendarPlus } from "lucide-react";
import { BookingDialog } from "./BookingDialog";

export function MobileStickyBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-3">
        <a href="tel:+919876543210" className="flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium text-foreground">
          <Phone className="h-5 w-5 text-primary"/> Call
        </a>
        <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-1 border-x border-border py-2.5 text-xs font-medium text-foreground">
          <MessageCircle className="h-5 w-5 text-[oklch(0.65_0.16_150)]"/> WhatsApp
        </a>
        <BookingDialog>
          <button className="flex w-full flex-col items-center justify-center gap-1 bg-gradient-hero py-2.5 text-xs font-semibold text-primary-foreground">
            <CalendarPlus className="h-5 w-5"/> Book
          </button>
        </BookingDialog>
      </div>
    </div>
  );
}
