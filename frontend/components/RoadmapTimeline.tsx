import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, Clock } from "lucide-react";

export type TaskStatus = "completed" | "in-progress" | "pending";

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: TaskStatus;
}

interface RoadmapTimelineProps {
  tasks: RoadmapTask[];
  className?: string;
  onTaskClick?: (taskId: string) => void;
}

export function RoadmapTimeline({
  tasks,
  className,
  onTaskClick,
}: RoadmapTimelineProps) {
  // Sort tasks by deadline
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-primary" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {sortedTasks.map((task, index) => (
        <div
          key={task.id}
          className="relative flex gap-6"
          onClick={() => onTaskClick?.(task.id)}
        >
          {/* Timeline connecting line */}
          {index !== sortedTasks.length - 1 && (
            <div className="absolute left-2.5 top-8 bottom-[-24px] w-[2px] bg-border" />
          )}

          <div className="relative mt-1 z-10 bg-background flex-shrink-0">
            {getStatusIcon(task.status)}
          </div>

          <div
            className={cn(
              "flex-1 p-5 rounded-xl border transition-colors cursor-pointer",
              task.status === "completed"
                ? "bg-card border-border/50 opacity-70"
                : task.status === "in-progress"
                ? "bg-card border-primary/50 shadow-sm"
                : "bg-muted/30 border-transparent hover:border-border"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              <span className="text-sm font-medium text-muted-foreground bg-background px-2.5 py-1 rounded-md border border-border inline-flex w-fit">
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {task.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
