import { render, screen } from "@testing-library/react";
import { PaperSummaryCard } from "@/components/PaperSummaryCard";
import { describe, it, expect } from "vitest";

describe("PaperSummaryCard", () => {
  it("renders paper summary details correctly", () => {
    render(
      <PaperSummaryCard
        id="1"
        title="Attention Is All You Need"
        authors="Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin"
        createdAt="2026-10-15T00:00:00.000Z"
        summaryPreview="The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer..."
      />
    );

    expect(screen.getByText("Attention Is All You Need")).toBeInTheDocument();
    expect(screen.getByText(/Ashish Vaswani/)).toBeInTheDocument();
    expect(screen.getByText(/The dominant sequence transduction models/)).toBeInTheDocument();
    expect(screen.getByText("View Details")).toBeInTheDocument();
  });
});
