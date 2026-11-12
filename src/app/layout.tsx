import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevPanel from "@/components/DevPanel";

export const metadata: Metadata = {
  title: "Lead capture prototype · Santiago Cardona",
  description: "Three ways to capture leads while keeping pricing public. Prototype for Product School.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <DevPanel />
        <Analytics />
      </body>
    </html>
  );
}
