import type { Metadata } from "next";
import { DM_Sans, Literata } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inkwell — Documents",
  description: "A simple place to write and keep your documents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${literata.variable} h-full`}>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
