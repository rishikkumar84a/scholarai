import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, HelpCircle } from "lucide-react";

interface EligibilityBadgeProps {
  score: number; // 0 to 1
  className?: string;
}

export function EligibilityBadge({ score, className }: EligibilityBadgeProps) {
  let label = "Low Match";
  let colorClass = "bg-destructive/10 text-destructive border-destructive/20";
  let Icon = AlertCircle;

  if (score >= 0.8) {
    label = "Highly Eligible";
    colorClass = "bg-green-500/10 text-green-500 border-green-500/20";
    Icon = CheckCircle;
  } else if (score >= 0.5) {
    label = "Eligible";
    colorClass = "bg-orange-500/10 text-orange-500 border-orange-500/20";
    Icon = HelpCircle; // Or maybe a different icon
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        colorClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label} ({Math.round(score * 100)}%)
    </div>
  );
}
