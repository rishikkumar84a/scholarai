import Link from "next/link";
import { ArrowLeft, MessageSquareWarning, Lightbulb, TrendingUp } from "lucide-react";
import { SOPScoreCard } from "@/components/SOPScoreCard";

// Dummy data
const SOP_ANALYSIS = {
  id: "1",
  title: "SOP for Stanford MS CS",
  targetProgram: "Stanford University - MS Computer Science",
  overallScore: 82,
  scores: {
    clarity: 85,
    impact: 75,
    relevance: 88,
  },
  feedback: [
    {
      type: "improvement",
      title: "Strengthen the hook",
      description:
        "Your opening paragraph is good, but it takes too long to get to the point. Consider starting directly with your most impactful research experience rather than a generic childhood anecdote.",
    },
    {
      type: "praise",
      title: "Strong technical alignment",
      description:
        "You've clearly articulated how your past work in distributed systems aligns with Prof. Ng's current research group. This shows great program relevance.",
    },
    {
      type: "suggestion",
      title: "Quantify your impact",
      description:
        "In paragraph 3, you mention improving model efficiency. Add specific metrics (e.g., 'reduced inference time by 40%') to make this achievement more concrete.",
    },
  ],
  originalText: "Since I was a child, I have always been fascinated by computers...",
};

export default async function SOPDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <Link
        href="/sops"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to SOPs
      </Link>

      <div className="space-y-2 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight">{SOP_ANALYSIS.title}</h1>
        <p className="text-lg text-muted-foreground">
          Target: {SOP_ANALYSIS.targetProgram}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Detailed Feedback</h2>
            <div className="space-y-4">
              {SOP_ANALYSIS.feedback.map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border border-border bg-card shadow-sm flex gap-4"
                >
                  <div className="mt-1 flex-shrink-0">
                    {item.type === "improvement" && (
                      <MessageSquareWarning className="w-5 h-5 text-orange-500" />
                    )}
                    {item.type === "praise" && (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    )}
                    {item.type === "suggestion" && (
                      <Lightbulb className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Original Text</h2>
            <div className="p-6 bg-muted/30 border border-border rounded-xl">
              <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                {SOP_ANALYSIS.originalText}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-8">
            <SOPScoreCard
              overallScore={SOP_ANALYSIS.overallScore}
              clarityScore={SOP_ANALYSIS.scores.clarity}
              impactScore={SOP_ANALYSIS.scores.impact}
              relevanceScore={SOP_ANALYSIS.scores.relevance}
            />
            
            <button className="w-full mt-6 py-3 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Improve with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
