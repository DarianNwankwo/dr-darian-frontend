import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Darian's Study",
  description: "I don't know what I'm doing here. I'm just doing stuff.",
  icons: {
    icon: [
      {
        url: "/emoji.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  },
  openGraph: {
    title: "Darian's Study",
    description: "I don't know what I'm doing here. I'm just doing stuff.",
    type: "website",
    url: "https://dr-darian-ai.vercel.app",
  },
  twitter: {
    card: "summary",
    title: "Darian's Study",
    description: "I don't know what I'm doing here. I'm just doing stuff.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
