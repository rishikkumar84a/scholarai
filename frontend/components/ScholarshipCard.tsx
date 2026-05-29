import React from "react";
import Link from "next/link";
import { EligibilityBadge } from "@/components/EligibilityBadge";
import { Globe, Calendar, DollarSign, Building } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScholarshipCardProps {
  id: string;
  name: string;
  provider: string;
  country: string;
  deadline: string;
  amount: string;
  score: number;
  className?: string;
}

export function ScholarshipCard({
  id,
  name,
  provider,
  country,
  deadline,
  amount,
  score,
  className,
}: ScholarshipCardProps) {
  return (
    <Link
      href={`/scholarships/${id}`}
      className={cn(
        "block p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <Building className="w-4 h-4" />
            {provider}
          </p>
        </div>
        <EligibilityBadge score={score} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mt-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Globe className="w-4 h-4" />
          <span>{country}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{new Date(deadline).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
          <DollarSign className="w-4 h-4" />
          <span>{amount}</span>
        </div>
      </div>
    </Link>
  );
}
