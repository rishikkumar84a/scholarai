import type { Metadata } from "next";
import "./globals.css";

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
      className="dark h-full antialiased font-sans"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
