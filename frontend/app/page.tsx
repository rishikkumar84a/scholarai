import Link from "next/link";
import { FeatureCard } from "@/components/FeatureCard";
import {
  Search,
  FileText,
  PenTool,
  Map,
  Compass,
  FileBadge,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          ScholarAI
        </div>
        <nav>
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 transition-colors"
          >
            Login
          </Link>
        </nav>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center py-32 px-4 text-center bg-gradient-to-b from-background to-primary/5">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Your AI Copilot for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary-foreground">
              Scholarships & Research
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
            Automate scholarship discovery, summarize complex research papers,
            improve your SOP, and build a winning application roadmap—all in one
            place.
          </p>
          <Link
            href="/login"
            className="px-8 py-4 text-lg font-semibold text-primary-foreground bg-primary rounded-full hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg shadow-primary/25"
          >
            Get Started for Free
          </Link>
        </section>

        {/* Supported Scholarships Strip */}
        <section className="py-10 border-y border-border bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-6">
              Supported Global Scholarships
            </p>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70 grayscale">
              <span className="text-2xl font-bold font-serif">MEXT</span>
              <span className="text-2xl font-bold font-serif">FULBRIGHT</span>
              <span className="text-2xl font-bold font-serif">DAAD</span>
              <span className="text-2xl font-bold font-serif">CHEVENING</span>
              <span className="text-2xl font-bold font-serif">ERASMUS+</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4 bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stop wasting hundreds of hours. Let our specialized AI agents
                handle the repetitive work so you can focus on your research.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Scholarship Matcher"
                description="Find the scholarships you are actually eligible for using advanced vector search across our database."
                icon={Search}
              />
              <FeatureCard
                title="Paper Summarizer"
                description="Upload PDFs and instantly extract key findings, methodologies, and limitations without reading 20 pages."
                icon={FileText}
              />
              <FeatureCard
                title="SOP Analyzer"
                description="Get your Statement of Purpose evaluated on 5 critical dimensions and receive a fully rewritten, improved draft."
                icon={PenTool}
              />
              <FeatureCard
                title="Application Roadmap"
                description="Generate a detailed, month-by-month timeline tracking all your scholarship tasks and deadlines."
                icon={Map}
              />
              <FeatureCard
                title="Research Plan"
                description="Input your topic and get weekly study plans, methodology suggestions, and foundational reading lists."
                icon={Compass}
              />
              <FeatureCard
                title="Resume Optimizer"
                description="Identify keyword gaps and get stronger, outcome-driven bullet points for your academic CV."
                icon={FileBadge}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-background text-center text-muted-foreground">
        <p>© 2026 ScholarAI. Built for OpenAI x Outskill AI Builders Hackathon.</p>
      </footer>
    </div>
  );
}
