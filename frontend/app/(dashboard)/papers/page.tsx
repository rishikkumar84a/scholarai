"use client";

import Link from "next/link";
import { PaperSummaryCard } from "@/components/PaperSummaryCard";
import { Plus } from "lucide-react";

// Dummy data
const DUMMY_PAPERS = [
  {
    id: "1",
    title: "Attention Is All You Need",
    authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit",
    createdAt: "2026-10-15T00:00:00.000Z",
    summaryPreview:
      "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms...",
  },
  {
    id: "2",
    title: "Language Models are Few-Shot Learners",
    authors: "Tom B. Brown, Benjamin Mann, Nick Ryder, Melanie Subbiah",
    createdAt: "2026-10-14T00:00:00.000Z",
    summaryPreview:
      "Recent work has demonstrated substantial gains on many NLP tasks and benchmarks by pre-training on a large corpus of text followed by fine-tuning on a specific task. While typically task-agnostic in architecture, this method still requires task-specific fine-tuning datasets of thousands or tens of thousands of examples. By contrast, humans can generally perform a new language task from only a few examples...",
  },
];

export default function PapersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paper Summaries</h1>
          <p className="text-muted-foreground mt-2">
            Your library of AI-analyzed research papers
          </p>
        </div>
        <Link
          href="/papers/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Upload Paper
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DUMMY_PAPERS.map((paper) => (
          <PaperSummaryCard key={paper.id} {...paper} />
        ))}
      </div>
    </div>
  );
}
