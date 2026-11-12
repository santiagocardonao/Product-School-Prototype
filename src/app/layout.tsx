import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import DevPanel from "@/components/DevPanel";

export const metadata: Metadata = {
  title: "Lead capture prototype · Santiago Cardona",
  description: "Three ways to capture leads while keeping pricing public. Prototype for Product School.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-5 pb-32">{children}</main>
        <DevPanel />
      </body>
    </html>
  );
}
