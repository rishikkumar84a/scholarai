import Link from "next/link";
import { ArrowLeft, BookOpen, MessageSquare, Download } from "lucide-react";

// Dummy data
const PLAN_DETAIL = {
  id: "1",
  title: "AI in Robotics for MEXT",
  topic: "Investigating the application of reinforcement learning for dynamic robotic manipulation in unstructured environments.",
  outline: [
    {
      title: "Introduction",
      description: "Overview of current challenges in robotic manipulation and why unstructured environments present unique difficulties. Introduce Reinforcement Learning (RL) as a potential solution.",
      papers: ["Attention Is All You Need", "Deep Reinforcement Learning for Robotic Manipulation"],
    },
    {
      title: "Methodology",
      description: "Propose a hybrid approach using Sim-to-Real transfer combined with a novel attention-based policy network.",
      papers: ["Sim-to-Real Transfer in Deep Reinforcement Learning for Robotics"],
    },
    {
      title: "Expected Outcomes",
      description: "Anticipate a 20% increase in success rate for grasping unknown objects compared to baseline methods.",
      papers: [],
    },
  ],
};

export default async function ResearchPlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link
        href="/research-plan"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Plans
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {PLAN_DETAIL.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            {PLAN_DETAIL.topic}
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border bg-background rounded-md font-medium hover:bg-muted transition-colors whitespace-nowrap">
          <Download className="w-4 h-4" />
          Export to Word
        </button>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Plan Outline</h2>
        <div className="space-y-6">
          {PLAN_DETAIL.outline.map((section, idx) => (
            <div
              key={idx}
              className="p-6 bg-card border border-border rounded-xl space-y-4"
            >
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {section.description}
              </p>

              {section.papers.length > 0 && (
                <div className="pt-4 border-t border-border mt-4">
                  <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Referenced Papers
                  </h4>
                  <ul className="space-y-2">
                    {section.papers.map((paper, pIdx) => (
                      <li
                        key={pIdx}
                        className="text-sm px-3 py-2 bg-muted/50 rounded-md text-foreground flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {paper}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-4">
        <MessageSquare className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">AI Suggestion</h3>
          <p className="text-muted-foreground leading-relaxed">
            Your methodology section could be strengthened by citing a recent paper on
            Transformer-based policies for Sim-to-Real transfer. Consider searching
            your library for papers from 2024 related to "Transformers in Robotics".
          </p>
        </div>
      </div>
    </div>
  );
}
