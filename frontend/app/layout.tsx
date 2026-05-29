import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AgentProgressBar } from "@/components/AgentProgressBar";
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
  title: "ScholarAI — AI Copilot for Scholarships & Research",
  description:
    "Your AI copilot for scholarships, research papers, SOPs, and academic applications. Powered by OpenAI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <AgentProgressBar />
      </body>
    </html>
  );
}
