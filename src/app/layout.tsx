import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#005BAC",
};

export const metadata: Metadata = {
  title: "Yamaha Eid Offer 2025 | AR Experience",
  description:
    "Explore Yamaha motorcycles in Augmented Reality. View bikes in your real environment, discover Eid offer prices, and book your interest.",
  openGraph: {
    title: "Yamaha Eid Offer 2025 — AR Experience",
    description: "Step inside Yamaha's virtual showroom. Pick a bike. See it in AR. Claim your Eid offer.",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
