import { render, screen } from "@testing-library/react";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { describe, it, expect } from "vitest";

describe("ScholarshipCard", () => {
  it("renders scholarship details correctly", () => {
    render(
      <ScholarshipCard
        id="1"
        name="Fulbright Foreign Student Program"
        provider="US Department of State"
        country="USA"
        deadline="2026-10-15T00:00:00.000Z"
        amount="Full Tuition + Stipend"
        score={0.92}
      />
    );

    expect(screen.getByText("Fulbright Foreign Student Program")).toBeInTheDocument();
    expect(screen.getByText("US Department of State")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("Full Tuition + Stipend")).toBeInTheDocument();
    // Eligible badge check
    expect(screen.getByText("Highly Eligible (92%)")).toBeInTheDocument();
  });
});
