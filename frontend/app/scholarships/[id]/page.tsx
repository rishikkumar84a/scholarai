import { EligibilityBadge } from "@/components/EligibilityBadge";
import { ArrowLeft, Globe, Calendar, DollarSign, Building, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Dummy data
const SCHOLARSHIP = {
  id: "1",
  name: "Fulbright Foreign Student Program",
  provider: "US Department of State",
  country: "USA",
  deadline: "2026-10-15T00:00:00.000Z",
  amount: "Full Tuition + Stipend",
  score: 0.92,
  description:
    "The Fulbright Foreign Student Program enables graduate students, young professionals and artists from abroad to study and conduct research in the United States. The Fulbright Program operates in more than 160 countries worldwide.",
  requirements: [
    "Completed undergraduate degree",
    "Minimum GPA of 3.5",
    "English language proficiency (TOEFL/IELTS)",
    "2 years of professional experience (preferred)",
  ],
  benefits: [
    "Full tuition funding",
    "Monthly stipend for living expenses",
    "Health insurance",
    "J-1 visa sponsorship",
  ]
};

export default async function ScholarshipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // In a real app we would fetch based on id, using SCHOLARSHIP for now
  
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link
        href="/scholarships"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Scholarships
      </Link>

      <div className="space-y-6 bg-card p-8 rounded-2xl border border-border shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{SCHOLARSHIP.name}</h1>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Building className="w-5 h-5" />
              {SCHOLARSHIP.provider}
            </p>
          </div>
          <EligibilityBadge score={SCHOLARSHIP.score} className="text-sm px-3 py-1" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{SCHOLARSHIP.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deadline</p>
              <p className="font-medium">
                {new Date(SCHOLARSHIP.deadline).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Funding</p>
              <p className="font-medium">{SCHOLARSHIP.amount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              About this Scholarship
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {SCHOLARSHIP.description}
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Key Requirements
            </h2>
            <ul className="space-y-3">
              {SCHOLARSHIP.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl space-y-6">
            <h3 className="font-semibold text-lg">Benefits</h3>
            <ul className="space-y-3">
              {SCHOLARSHIP.benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <button className={cn(
              "w-full py-3 px-4 rounded-lg font-medium",
              "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            )}>
              Add to Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
