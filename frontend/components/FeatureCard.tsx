import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function FeatureCard({ title, description, icon: Icon, className }: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start p-6 rounded-2xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50",
        className
      )}
    >
      <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
