import type { Metadata } from "next";
import { SiteLayoutWrapper } from "@/components/site/SiteLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import { CLINIC } from "@/lib/site-data";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://urjadental.com"),
  title: {
    default: "Urja Dental Clinic — Your Smile, Our Priority",
    template: "%s | Urja Dental Clinic",
  },
  description:
    "Trusted modern dental care. Implants, root canals, braces, whitening and more. Book your appointment today.",
  authors: [{ name: CLINIC.name }],
  creator: CLINIC.name,
  publisher: CLINIC.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://urjadental.com",
    siteName: CLINIC.name,
    title: CLINIC.name,
    description: CLINIC.tagline,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: CLINIC.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CLINIC.name,
    description: CLINIC.tagline,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://urjadental.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "@id": "https://urjadental.com/#dentist",
  name: CLINIC.name,
  description: CLINIC.tagline,
  url: "https://urjadental.com",
  logo: "https://urjadental.com/logo.png",
  image: "https://urjadental.com/og-image.jpg",
  telephone: CLINIC.phone,
  email: CLINIC.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "123 Wellness Avenue, MG Road",
    addressLocality: "Bengaluru",
    postalCode: "560001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "20:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "14:00",
    },
  ],
  priceRange: "₹₹",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "25000",
    bestRating: "5",
  },
  sameAs: [
    "https://www.facebook.com/urjadental",
    "https://www.instagram.com/urjadental",
    "https://twitter.com/urjadental",
    "https://www.youtube.com/@urjadental",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <SiteLayoutWrapper>
            {children}
          </SiteLayoutWrapper>
          <Toaster richColors position="top-center" />
        </div>
      </body>
    </html>
  );
}