import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FileText, Clock, ExternalLink } from "lucide-react";

interface PaperSummaryCardProps {
  id: string;
  title: string;
  authors: string;
  createdAt: string;
  summaryPreview: string;
  className?: string;
}

export function PaperSummaryCard({
  id,
  title,
  authors,
  createdAt,
  summaryPreview,
  className,
}: PaperSummaryCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col p-6 rounded-xl border border-border bg-card shadow-sm transition-colors hover:border-primary/50",
        className
      )}
    >
      <div className="flex-1">
        <h3 className="text-lg font-semibold line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {authors}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-3">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm mt-4 line-clamp-3 leading-relaxed text-muted-foreground">
          {summaryPreview}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">
          <FileText className="w-3.5 h-3.5" />
          Summary Generated
        </div>
        <Link
          href={`/papers/${id}`}
          className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-1"
        >
          View Details
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
