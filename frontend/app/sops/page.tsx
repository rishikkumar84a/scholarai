"use client";

import Link from "next/link";
import { Plus, PenTool, Clock, ChevronRight } from "lucide-react";

// Dummy data
const DUMMY_SOPS = [
  {
    id: "1",
    title: "SOP for Stanford MS CS",
    targetProgram: "Stanford University - MS Computer Science",
    createdAt: "2026-10-10T00:00:00.000Z",
    overallScore: 82,
  },
  {
    id: "2",
    title: "Draft 1 - MEXT Scholarship",
    targetProgram: "MEXT - University of Tokyo",
    createdAt: "2026-09-25T00:00:00.000Z",
    overallScore: 65,
  },
];

export default function SOPsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Statement of Purpose</h1>
          <p className="text-muted-foreground mt-2">
            Analyze your SOP drafts with AI to improve clarity and impact.
          </p>
        </div>
        <Link
          href="/sops/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DUMMY_SOPS.map((sop) => (
          <Link
            key={sop.id}
            href={`/sops/${sop.id}`}
            className="block p-6 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-lg font-semibold line-clamp-1">{sop.title}</h3>
              <div
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  sop.overallScore >= 80
                    ? "bg-green-500/10 text-green-500"
                    : "bg-orange-500/10 text-orange-500"
                }`}
              >
                {sop.overallScore}/100
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {sop.targetProgram}
            </p>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {new Date(sop.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1 text-primary">
                View Feedback <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
