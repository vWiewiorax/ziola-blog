import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Portal Zielarski — zioła i zdrowie naturalne",
    template: "%s | Portal Zielarski",
  },
  description:
    "Praktyczny portal o ziołach, naparach i naturalnych sposobach na zdrowie. Przepisy, dawkowanie i przeciwwskazania opisane prostym językiem.",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    siteName: "Portal Zielarski",
    url: getSiteUrl(),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${montserrat.variable} antialiased`}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
