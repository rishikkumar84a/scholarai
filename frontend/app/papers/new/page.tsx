"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, File, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AgentProgressBar, type AgentStep } from "@/components/AgentProgressBar";

const SUMMARIZE_STEPS: AgentStep[] = [
  { label: "Uploading PDF" },
  { label: "Extracting text" },
  { label: "Generating summary" },
  { label: "Identifying key takeaways" },
];

export default function NewPaperPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [agentStep, setAgentStep] = useState(0);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSummarize = async () => {
    if (!file) return;
    setIsUploading(true);
    setAgentStep(0);

    // Simulate multi-step agent progress
    for (let i = 1; i <= SUMMARIZE_STEPS.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setAgentStep(i);
    }

    setIsUploading(false);
    router.push("/papers/1");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Link
        href="/papers"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Papers
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Paper</h1>
        <p className="text-muted-foreground mt-2">
          Upload a research paper in PDF format to get an AI-generated summary,
          methodology breakdown, and key takeaways.
        </p>
      </div>

      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:bg-muted/50",
          file && "border-primary bg-primary/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Click or drag file to this area to upload</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-sm">
              Supported format: PDF. Maximum file size: 10MB.
            </p>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="file-upload"
              onChange={handleChange}
            />
            <label
              htmlFor="file-upload"
              className="mt-6 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors cursor-pointer text-sm font-medium"
            >
              Select File
            </label>
          </>
        ) : (
          <>
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <File className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{file.name}</h3>
            <p className="text-muted-foreground text-sm mt-2">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm font-medium"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSummarize}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isUploading ? "Analyzing..." : "Summarize Paper"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Agent progress — only visible while summarization is running */}
      {isUploading && (
        <AgentProgressBar
          steps={SUMMARIZE_STEPS}
          currentStep={agentStep}
        />
      )}
    </div>
  );
}
