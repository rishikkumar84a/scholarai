import React from "react";
import { cn } from "@/lib/utils";
import { FileText, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export interface ResearchPlan {
  id: string;
  title: string;
  topic: string;
  updatedAt: string;
  paperCount: number;
}

interface ResearchPlanCardProps {
  plan: ResearchPlan;
  className?: string;
}

export function ResearchPlanCard({ plan, className }: ResearchPlanCardProps) {
  return (
    <Link
      href={`/research-plan/${plan.id}`}
      className={cn(
        "block p-6 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors group",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {plan.title}
        </h3>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold whitespace-nowrap">
          <FileText className="w-3.5 h-3.5" />
          {plan.paperCount} Papers
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {plan.topic}
      </p>

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Updated {new Date(plan.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          Open Plan <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}
