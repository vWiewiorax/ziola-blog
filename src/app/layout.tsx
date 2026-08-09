import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"] });
const lora = Lora({ variable: "--font-lora", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: {
    default: "Zielnik Zdrowia — blog o ziołach i zdrowiu naturalnym",
    template: "%s | Zielnik Zdrowia",
  },
  description:
    "Praktyczny blog o ziołach, naparach i naturalnych sposobach na zdrowie. Przepisy, dawkowanie i przeciwwskazania opisane prostym językiem.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className={`${inter.variable} ${lora.variable} antialiased`}>
        <SiteHeader />
        <main className="mx-auto max-w-5xl px-5 py-12">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
