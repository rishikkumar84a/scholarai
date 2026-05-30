"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Bot, CheckCircle2, Circle, X } from "lucide-react";

export interface AgentStep {
  label: string;
}

interface AgentProgressBarProps {
  /** Ordered list of steps the agent will execute. */
  steps: AgentStep[];
  /** Zero-based index of the step currently running. Set to steps.length when all steps are done. */
  currentStep: number;
  /** Optional callback to dismiss / hide the widget. */
  onDismiss?: () => void;
  className?: string;
}

/**
 * Renders a floating progress widget showing which step an AI agent is on.
 * Import this only on pages where an agent is actively running
 * (e.g. scholarship matcher, paper summarizer).
 */
export function AgentProgressBar({
  steps,
  currentStep,
  onDismiss,
  className,
}: AgentProgressBarProps) {
  const isComplete = currentStep >= steps.length;
  const progressPercent =
    steps.length > 0 ? Math.min((currentStep / steps.length) * 100, 100) : 0;

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300",
        className
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">
              {isComplete ? "Agent Complete" : "Agent Running"}
            </span>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Dismiss agent progress"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-4">
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              isComplete ? "bg-green-500" : "bg-primary"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step list */}
        <ul className="space-y-2">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isActive = idx === currentStep && !isComplete;

            return (
              <li key={idx} className="flex items-center gap-2 text-sm">
                {isDone && (
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                )}
                {isActive && (
                  <Loader2 className="w-4 h-4 animate-spin text-primary flex-shrink-0" />
                )}
                {!isDone && !isActive && (
                  <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={cn(
                    isDone && "text-muted-foreground line-through",
                    isActive && "text-foreground font-medium",
                    !isDone && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
