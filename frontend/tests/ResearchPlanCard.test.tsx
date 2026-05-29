import { render, screen } from "@testing-library/react";
import { ResearchPlanCard, ResearchPlan } from "@/components/ResearchPlanCard";
import { describe, it, expect } from "vitest";

const dummyPlan: ResearchPlan = {
  id: "1",
  title: "AI in Robotics",
  topic: "Review of latest literature on reinforcement learning in robotic manipulation.",
  updatedAt: "2026-05-10T00:00:00.000Z",
  paperCount: 12,
};

describe("ResearchPlanCard", () => {
  it("renders plan details correctly", () => {
    render(<ResearchPlanCard plan={dummyPlan} />);

    expect(screen.getByText("AI in Robotics")).toBeInTheDocument();
    expect(
      screen.getByText("Review of latest literature on reinforcement learning in robotic manipulation.")
    ).toBeInTheDocument();
    expect(screen.getByText("12 Papers")).toBeInTheDocument();
    
    // Check if the link is correct
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/research-plan/1");
  });
});
