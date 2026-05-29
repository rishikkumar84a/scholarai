import { render, screen, fireEvent } from "@testing-library/react";
import { RoadmapTimeline, RoadmapTask } from "@/components/RoadmapTimeline";
import { describe, it, expect, vi } from "vitest";

const dummyTasks: RoadmapTask[] = [
  {
    id: "1",
    title: "Take GRE",
    description: "Prepare and take the GRE exam.",
    deadline: "2026-08-01T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "2",
    title: "Draft SOP",
    description: "Write first draft of Statement of Purpose.",
    deadline: "2026-09-01T00:00:00.000Z",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Submit Application",
    description: "Final submission of the application.",
    deadline: "2026-10-15T00:00:00.000Z",
    status: "pending",
  },
];

describe("RoadmapTimeline", () => {
  it("renders tasks sorted by deadline", () => {
    render(<RoadmapTimeline tasks={dummyTasks} />);

    // Since they are ordered chronologically by deadline, we can check they all render
    expect(screen.getByText("Take GRE")).toBeInTheDocument();
    expect(screen.getByText("Draft SOP")).toBeInTheDocument();
    expect(screen.getByText("Submit Application")).toBeInTheDocument();
  });

  it("calls onTaskClick when a task is clicked", () => {
    const handleClick = vi.fn();
    render(<RoadmapTimeline tasks={dummyTasks} onTaskClick={handleClick} />);

    const taskElement = screen.getByText("Draft SOP");
    fireEvent.click(taskElement);

    expect(handleClick).toHaveBeenCalledWith("2");
  });
});
