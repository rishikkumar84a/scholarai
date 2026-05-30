import { render, screen } from "@testing-library/react";
import { AgentProgressBar } from "@/components/AgentProgressBar";
import { describe, it, expect, vi } from "vitest";

const steps = [
  { label: "Loading profile" },
  { label: "Searching database" },
  { label: "Scoring results" },
];

describe("AgentProgressBar", () => {
  it("renders all steps and marks completed steps", () => {
    render(<AgentProgressBar steps={steps} currentStep={1} />);

    expect(screen.getByText("Agent Running")).toBeInTheDocument();
    expect(screen.getByText("Loading profile")).toBeInTheDocument();
    expect(screen.getByText("Searching database")).toBeInTheDocument();
    expect(screen.getByText("Scoring results")).toBeInTheDocument();
  });

  it("shows 'Agent Complete' when all steps are done", () => {
    render(<AgentProgressBar steps={steps} currentStep={3} />);

    expect(screen.getByText("Agent Complete")).toBeInTheDocument();
  });

  it("calls onDismiss when dismiss button is clicked", () => {
    const handleDismiss = vi.fn();
    render(
      <AgentProgressBar steps={steps} currentStep={1} onDismiss={handleDismiss} />
    );

    const dismissBtn = screen.getByLabelText("Dismiss agent progress");
    dismissBtn.click();

    expect(handleDismiss).toHaveBeenCalledOnce();
  });
});
