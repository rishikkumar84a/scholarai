"use client";

import { useState } from "react";
import { Upload, FileText, Loader2, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface ResumeAnalysis {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

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

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // POST to the FastAPI resume analysis endpoint
      const response = await api.upload("/api/resume/analyze", formData);
      setAnalysis(response as ResumeAnalysis);
    } catch {
      // Fallback to dummy data until backend is available
      setAnalysis({
        overallScore: 78,
        strengths: [
          "Strong technical skills section with relevant technologies",
          "Quantified achievements in work experience",
          "Clean, well-structured layout",
        ],
        weaknesses: [
          "Missing a professional summary / objective statement",
          "Research experience section lacks detail on methodology",
          "No publications or conference presentations listed",
        ],
        suggestions: [
          "Add a 2-3 sentence professional summary tailored to your target scholarship",
          "Expand research descriptions with specific tools, datasets, and outcomes",
          "Include any teaching or mentoring experience — scholarship committees value this",
        ],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Analyzer</h1>
        <p className="text-muted-foreground mt-2">
          Upload your resume and get AI-powered feedback to strengthen your scholarship applications.
        </p>
      </div>

      {/* Upload area */}
      {!analysis && (
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
              <h3 className="text-lg font-semibold">
                Upload your resume
              </h3>
              <p className="text-muted-foreground text-sm mt-2 max-w-sm">
                Supported formats: PDF, DOCX. Maximum file size: 5MB.
              </p>
              <input
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                id="resume-upload"
                onChange={handleChange}
              />
              <label
                htmlFor="resume-upload"
                className="mt-6 px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors cursor-pointer text-sm font-medium"
              >
                Select File
              </label>
            </>
          ) : (
            <>
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{file.name}</h3>
              <p className="text-muted-foreground text-sm mt-2">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={() => setFile(null)}
                  className="px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm font-medium"
                  disabled={isAnalyzing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Analysis results */}
      {analysis && (
        <div className="space-y-8">
          {/* Score header */}
          <div className="flex items-center justify-between p-6 bg-card border border-border rounded-xl">
            <div>
              <h2 className="text-xl font-bold">Overall Score</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Based on scholarship-readiness criteria
              </p>
            </div>
            <div className="text-4xl font-bold">
              <span
                className={cn(
                  analysis.overallScore >= 80
                    ? "text-green-500"
                    : analysis.overallScore >= 60
                    ? "text-orange-500"
                    : "text-destructive"
                )}
              >
                {analysis.overallScore}
              </span>
              <span className="text-muted-foreground text-lg">/100</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Strengths
              </h3>
              <ul className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-card-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-6 bg-card border border-border rounded-xl space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Areas to Improve
              </h3>
              <ul className="space-y-3">
                {analysis.weaknesses.map((w, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-card-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Suggestions
            </h3>
            <ul className="space-y-3">
              {analysis.suggestions.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg text-sm"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Re-upload */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => {
                setAnalysis(null);
                setFile(null);
              }}
              className="px-6 py-2.5 border border-border rounded-md bg-background hover:bg-muted transition-colors text-sm font-medium"
            >
              Upload a Different Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
