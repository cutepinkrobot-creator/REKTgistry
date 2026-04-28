import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "REKTgistry — Web3 Scam Registry",
    template: "%s | REKTgistry",
  },
  description: "Community-powered directory of Web3 scammers, rug pulls, and protocol exploits. Search by wallet address, Twitter handle, or project name.",
  keywords: ["web3 scam", "crypto scammer", "rug pull", "blockchain fraud", "NFT scam", "DeFi exploit", "crypto safety"],
  metadataBase: new URL("https://rektgistry.com"),
  openGraph: {
    title: "REKTgistry — Web3 Scam Registry",
    description: "Community-powered directory of Web3 scammers, rug pulls, and protocol exploits.",
    url: "https://rektgistry.com",
    siteName: "REKTgistry",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "REKTgistry — Web3 Scam Registry",
    description: "Community-powered directory of Web3 scammers, rug pulls, and protocol exploits.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col" style={{ background: '#0b0c10', color: '#e2e8f0', fontFamily: "'Orbitron', sans-serif" }}>
        <CloudBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-14">
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
