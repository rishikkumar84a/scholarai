import { render, screen } from "@testing-library/react";
import { FeatureCard } from "@/components/FeatureCard";
import { BookOpen } from "lucide-react";
import { describe, it, expect } from "vitest";

describe("FeatureCard", () => {
  it("renders the title and description correctly", () => {
    render(
      <FeatureCard
        title="Test Feature"
        description="This is a test feature description."
        icon={BookOpen}
      />
    );

    expect(screen.getByText("Test Feature")).toBeInTheDocument();
    expect(screen.getByText("This is a test feature description.")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <FeatureCard
        title="Test"
        description="Desc"
        icon={BookOpen}
        className="custom-class"
      />
    );

    // The first child div should have the custom class
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
