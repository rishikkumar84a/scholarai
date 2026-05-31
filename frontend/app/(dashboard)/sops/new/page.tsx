"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function NewSOPPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    targetProgram: "",
    content: "",
  });

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate API call to analyze SOP
    await new Promise((resolve) => setTimeout(resolve, 2500));
    
    setIsAnalyzing(false);
    router.push("/sops/1"); // Push to dummy analyzed SOP
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Link
        href="/sops"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to SOPs
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">New SOP Analysis</h1>
        <p className="text-muted-foreground mt-2">
          Paste your Statement of Purpose below. Our AI will analyze it for clarity, impact, and relevance to your target program.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Document Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g. Draft 1 - MEXT"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-3 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="targetProgram" className="text-sm font-medium">
              Target Program / Scholarship
            </label>
            <input
              id="targetProgram"
              type="text"
              placeholder="e.g. Stanford MS CS"
              value={formData.targetProgram}
              onChange={(e) =>
                setFormData({ ...formData, targetProgram: e.target.value })
              }
              className="w-full p-3 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium flex justify-between">
            <span>SOP Content</span>
            <span className="text-muted-foreground font-normal">
              {formData.content.length} characters
            </span>
          </label>
          <textarea
            id="content"
            placeholder="Paste your Statement of Purpose here..."
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            className="w-full p-4 h-96 border border-border rounded-md bg-card focus:ring-2 focus:ring-primary focus:outline-none resize-none leading-relaxed"
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isAnalyzing || formData.content.length < 100}
            className={cn(
              "flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            )}
          >
            {isAnalyzing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isAnalyzing ? "Analyzing..." : "Analyze SOP"}
          </button>
        </div>
      </form>
    </div>
  );
}
