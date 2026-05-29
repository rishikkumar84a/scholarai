import React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SOPScoreCardProps {
  overallScore: number;
  clarityScore: number;
  impactScore: number;
  relevanceScore: number;
  className?: string;
}

export function SOPScoreCard({
  overallScore,
  clarityScore,
  impactScore,
  relevanceScore,
  className,
}: SOPScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-destructive";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-orange-500" />;
    return <AlertTriangle className="w-5 h-5 text-destructive" />;
  };

  return (
    <div
      className={cn(
        "p-6 rounded-xl border border-border bg-card shadow-sm space-y-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight">AI Analysis Score</h3>
        <div className="flex items-center gap-2">
          {getScoreIcon(overallScore)}
          <span className="text-2xl font-bold">{overallScore}/100</span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium">Clarity & Structure</span>
            <span>{clarityScore}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full", getScoreColor(clarityScore))}
              style={{ width: `${clarityScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium">Impact & Persuasion</span>
            <span>{impactScore}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full", getScoreColor(impactScore))}
              style={{ width: `${impactScore}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-medium">Relevance to Program</span>
            <span>{relevanceScore}/100</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full", getScoreColor(relevanceScore))}
              style={{ width: `${relevanceScore}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
