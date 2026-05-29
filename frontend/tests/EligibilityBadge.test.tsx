import { render, screen } from "@testing-library/react";
import { EligibilityBadge } from "@/components/EligibilityBadge";
import { describe, it, expect } from "vitest";

describe("EligibilityBadge", () => {
  it("renders Highly Eligible for scores >= 0.8", () => {
    render(<EligibilityBadge score={0.85} />);
    expect(screen.getByText("Highly Eligible (85%)")).toBeInTheDocument();
  });

  it("renders Eligible for scores >= 0.5 and < 0.8", () => {
    render(<EligibilityBadge score={0.65} />);
    expect(screen.getByText("Eligible (65%)")).toBeInTheDocument();
  });

  it("renders Low Match for scores < 0.5", () => {
    render(<EligibilityBadge score={0.3} />);
    expect(screen.getByText("Low Match (30%)")).toBeInTheDocument();
  });
});
