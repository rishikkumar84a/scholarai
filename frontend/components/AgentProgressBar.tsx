"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Loader2, Bot, CheckCircle2, X } from "lucide-react";

export type AgentStatus = "idle" | "running" | "completed" | "error";

export interface AgentTask {
  id: string;
  name: string;
  status: AgentStatus;
  progress: number; // 0 to 100
}

// Global state or context could be used here. For now, we simulate an active task.
export function AgentProgressBar() {
  const [activeTask, setActiveTask] = useState<AgentTask | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Demo: simulate an agent task starting shortly after mount
  useEffect(() => {
    const startTimer = setTimeout(() => {
      setActiveTask({
        id: "demo-task",
        name: "Summarizing 5 papers...",
        status: "running",
        progress: 10,
      });
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(startTimer);
  }, []);

  // Demo: simulate progress
  useEffect(() => {
    if (!activeTask || activeTask.status !== "running") return;

    const progressInterval = setInterval(() => {
      setActiveTask((prev) => {
        if (!prev) return prev;
        const nextProgress = prev.progress + Math.floor(Math.random() * 15);
        if (nextProgress >= 100) {
          clearInterval(progressInterval);
          return { ...prev, progress: 100, status: "completed" };
        }
        return { ...prev, progress: nextProgress };
      });
    }, 1500);

    return () => clearInterval(progressInterval);
  }, [activeTask?.status]);

  if (!isVisible || !activeTask) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Agent Activity</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
            {activeTask.name}
          </span>
          {activeTask.status === "running" && (
            <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
          )}
          {activeTask.status === "completed" && (
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
          )}
        </div>

        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              activeTask.status === "completed" ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${activeTask.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
