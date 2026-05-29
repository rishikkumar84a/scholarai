import { render, screen } from "@testing-library/react";
import { StatsCard } from "@/components/StatsCard";
import { Users } from "lucide-react";
import { describe, it, expect } from "vitest";

describe("StatsCard", () => {
  it("renders the title, value, and description", () => {
    render(
      <StatsCard
        title="Total Users"
        value="10,234"
        icon={Users}
        description="Active users this month"
      />
    );

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("10,234")).toBeInTheDocument();
    expect(screen.getByText("Active users this month")).toBeInTheDocument();
  });

  it("renders positive trend correctly", () => {
    render(
      <StatsCard
        title="Revenue"
        value="$12,000"
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
    );

    const trendEl = screen.getByText("+12%");
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass("text-green-500");
  });

  it("renders negative trend correctly", () => {
    render(
      <StatsCard
        title="Churn"
        value="5%"
        icon={Users}
        trend={{ value: 2, isPositive: false }}
      />
    );

    const trendEl = screen.getByText("-2%");
    expect(trendEl).toBeInTheDocument();
    expect(trendEl).toHaveClass("text-destructive");
  });
});
