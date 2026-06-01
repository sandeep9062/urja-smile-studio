import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingActions } from "@/components/site/FloatingActions";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urja Dental Clinic — Your Smile, Our Priority",
  description:
    "Trusted modern dental care. Implants, root canals, braces, whitening and more. Book your appointment today.",
  authors: [{ name: "Urja Dental Clinic" }],
  openGraph: {
    title: "Urja Dental Clinic — Your Smile, Our Priority",
    description: "Trusted modern dental care for the whole family.",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
          <Toaster richColors position="top-center" />
        </div>
      </body>
    </html>
  );
}
