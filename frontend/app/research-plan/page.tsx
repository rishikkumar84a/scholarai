"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ResearchPlanCard, type ResearchPlan } from "@/components/ResearchPlanCard";

// Dummy data
const DUMMY_PLANS: ResearchPlan[] = [
  {
    id: "1",
    title: "AI in Robotics for MEXT",
    topic: "Investigating the application of reinforcement learning for dynamic robotic manipulation in unstructured environments.",
    updatedAt: "2026-05-10T00:00:00.000Z",
    paperCount: 8,
  },
  {
    id: "2",
    title: "Large Language Models for Code",
    topic: "Literature review on the evolution of code generation capabilities in modern LLMs.",
    updatedAt: "2026-04-20T00:00:00.000Z",
    paperCount: 15,
  },
];

export default function ResearchPlansPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Plans</h1>
          <p className="text-muted-foreground mt-2">
            Organize your saved papers into structured outlines for your statement of purpose.
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {DUMMY_PLANS.map((plan) => (
          <ResearchPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
