import Link from "next/link";
import { ArrowLeft, BookOpen, Layers, Target, CheckCircle2 } from "lucide-react";

// Dummy data
const PAPER_DETAIL = {
  id: "1",
  title: "Attention Is All You Need",
  authors: "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit",
  summary:
    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
  methodology: [
    "Replaced RNNs and CNNs entirely with Self-Attention mechanisms.",
    "Introduced Multi-Head Attention to allow the model to jointly attend to information from different representation subspaces at different positions.",
    "Utilized Positional Encoding to inject some information about the relative or absolute position of the tokens in the sequence.",
  ],
  keyTakeaways: [
    "Transformer achieves state-of-the-art BLEU scores on translation tasks.",
    "Significantly faster to train than architectures based on recurrent or convolutional layers.",
    "Paved the way for modern Large Language Models (LLMs) like GPT and BERT.",
  ],
};

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  // Use id to fetch, for now using dummy

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link
        href="/papers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Papers
      </Link>

      <div className="space-y-4 border-b border-border pb-8">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-semibold">
          AI Summary Generated
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          {PAPER_DETAIL.title}
        </h1>
        <p className="text-lg text-muted-foreground">{PAPER_DETAIL.authors}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Executive Summary
            </h2>
            <div className="p-6 bg-card border border-border rounded-xl">
              <p className="leading-relaxed text-card-foreground">
                {PAPER_DETAIL.summary}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Methodology
            </h2>
            <ul className="space-y-4">
              {PAPER_DETAIL.methodology.map((point, i) => (
                <li key={i} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Key Takeaways
            </h2>
            <div className="grid gap-3">
              {PAPER_DETAIL.keyTakeaways.map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 border border-border rounded-lg bg-card"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium text-sm">{point}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl space-y-6 sticky top-8">
            <h3 className="font-semibold text-lg border-b border-border pb-4">
              Actions
            </h3>
            
            <button className="w-full py-2.5 px-4 rounded-md font-medium border border-border bg-background hover:bg-muted transition-colors text-sm text-left flex justify-between items-center">
              View Original PDF
              <ArrowLeft className="w-4 h-4 rotate-135" /> 
            </button>
            <button className="w-full py-2.5 px-4 rounded-md font-medium border border-border bg-background hover:bg-muted transition-colors text-sm text-left flex justify-between items-center">
              Add to Research Plan
              <ArrowLeft className="w-4 h-4 rotate-135" />
            </button>
            <button className="w-full py-2.5 px-4 rounded-md font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm text-center">
              Generate Citation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
