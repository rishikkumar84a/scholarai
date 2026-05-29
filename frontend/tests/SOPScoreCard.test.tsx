import { render, screen } from "@testing-library/react";
import { SOPScoreCard } from "@/components/SOPScoreCard";
import { describe, it, expect } from "vitest";

describe("SOPScoreCard", () => {
  it("renders scores and labels correctly", () => {
    render(
      <SOPScoreCard
        overallScore={85}
        clarityScore={90}
        impactScore={75}
        relevanceScore={50}
      />
    );

    expect(screen.getByText("85/100")).toBeInTheDocument();
    
    expect(screen.getByText("Clarity & Structure")).toBeInTheDocument();
    expect(screen.getByText("90/100")).toBeInTheDocument();

    expect(screen.getByText("Impact & Persuasion")).toBeInTheDocument();
    expect(screen.getByText("75/100")).toBeInTheDocument();

    expect(screen.getByText("Relevance to Program")).toBeInTheDocument();
    expect(screen.getByText("50/100")).toBeInTheDocument();
  });
});
