import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CloudBackground from "@/components/CloudBackground";

export const metadata: Metadata = {
  title: "REKTgistry — Web3 Scam Registry",
  description: "Community-powered directory of Web3 scammers, rug pulls, and protocol exploits. Search by wallet address, Twitter handle, or project name.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col" style={{ background: '#0b0c10', color: '#e2e8f0', fontFamily: "'Exo 2', sans-serif" }}>
        <CloudBackground />
        <Navbar />
        <main className="flex-1 relative z-10 pt-14">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
