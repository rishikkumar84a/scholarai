import { render, screen, act } from "@testing-library/react";
import { AgentProgressBar } from "@/components/AgentProgressBar";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("AgentProgressBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("becomes visible and shows task after initial delay", () => {
    render(<AgentProgressBar />);
    
    // Initially null because isVisible is false
    expect(screen.queryByText("Agent Activity")).not.toBeInTheDocument();

    // Advance time by 5 seconds
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText("Agent Activity")).toBeInTheDocument();
    expect(screen.getByText("Summarizing 5 papers...")).toBeInTheDocument();
  });
});
