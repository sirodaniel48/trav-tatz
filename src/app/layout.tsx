import type { Metadata } from "next";
import { Playfair_Display, DM_Sans, Space_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const spaceMono = Space_Mono({
  variable: "--font-spacemono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "DESINKS | Tattoos, Lashes & Eyebrows | Mobile",
  description: "Premium tattoo and beauty studio in Mobile. Book online — $35 deposit, guest checkout.",
  openGraph: { locale: "en_US" },
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "name": "DESINKS",
              "image": "/logo.png",
              "description": "Premium mobile tattoo and beauty studio.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mobile",
                "addressRegion": "AL",
                "addressCountry": "US"
              },
              "areaServed": {
                "@type": "City",
                "name": "Mobile"
              },
              "telephone": "+15551234567"
            })
          }}
        />
      </body>
    </html>
  );
}
