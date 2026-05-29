"use client";

import { useState } from "react";
import { RoadmapTimeline, type RoadmapTask } from "@/components/RoadmapTimeline";
import { Play, Sparkles } from "lucide-react";

// Dummy tasks
const INITIAL_TASKS: RoadmapTask[] = [
  {
    id: "1",
    title: "Draft SOP for MEXT",
    description:
      "Start drafting your Statement of Purpose focusing on your research interest in Robotics and alignment with University of Tokyo.",
    deadline: "2026-06-15T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "2",
    title: "Request Letters of Recommendation",
    description:
      "Reach out to Prof. Smith and Dr. Jones to request LORs. Provide them with your updated resume and draft SOP.",
    deadline: "2026-07-01T00:00:00.000Z",
    status: "in-progress",
  },
  {
    id: "3",
    title: "Take TOEFL Exam",
    description:
      "Take the scheduled TOEFL exam. Target score: 100+. Ensure score reports are sent to target universities.",
    deadline: "2026-07-20T00:00:00.000Z",
    status: "pending",
  },
  {
    id: "4",
    title: "Submit MEXT Application",
    description:
      "Final review and submission of the MEXT scholarship application package to the local embassy.",
    deadline: "2026-08-30T00:00:00.000Z",
    status: "pending",
  },
];

export default function RoadmapPage() {
  const [tasks, setTasks] = useState<RoadmapTask[]>(INITIAL_TASKS);

  const handleTaskClick = (taskId: string) => {
    // simple toggle for demo purposes
    setTasks((current) =>
      current.map((t) => {
        if (t.id === taskId) {
          const nextStatus =
            t.status === "pending"
              ? "in-progress"
              : t.status === "in-progress"
              ? "completed"
              : "pending";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Roadmap</h1>
          <p className="text-muted-foreground mt-2">
            Your personalized action plan based on your profile and target scholarships.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
          <Sparkles className="w-4 h-4" />
          Regenerate Plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <div className="p-6 bg-card border border-border rounded-xl">
            <RoadmapTimeline tasks={tasks} onTaskClick={handleTaskClick} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-card border border-border rounded-xl space-y-4 sticky top-8">
            <h3 className="font-semibold text-lg border-b border-border pb-4">
              Progress Overview
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span className="font-medium">
                  {tasks.filter((t) => t.status === "completed").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">In Progress</span>
                <span className="font-medium">
                  {tasks.filter((t) => t.status === "in-progress").length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-medium">
                  {tasks.filter((t) => t.status === "pending").length}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <button className="w-full py-2 px-4 rounded-md font-medium border border-border bg-background hover:bg-muted transition-colors text-sm flex justify-center items-center gap-2">
                <Play className="w-4 h-4" />
                Start Next Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
