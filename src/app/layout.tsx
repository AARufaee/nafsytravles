import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { isClerkConfigured } from "@/lib/admin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nafsy Travels",
  description:
    "Browse travel packages, request a custom trip, and book your next journey with Nafsy Travels.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const body = (
    <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col antialiased bg-white text-zinc-900`}>
      <SiteHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <SiteFooter />
    </body>
  );

  const html = (
    <html lang="en" className="h-full">
      {body}
    </html>
  );

  return isClerkConfigured() ? <ClerkProvider>{html}</ClerkProvider> : html;
}
