"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function ProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    target_degree: "Masters",
    current_major: "",
    target_countries: "",
    research_interests: "",
    gpa: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Split comma-separated lists into arrays
      const payload = {
        ...formData,
        target_countries: formData.target_countries
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        research_interests: formData.research_interests
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
      };

      await api.post("/api/profiles", payload);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="target_degree" className="text-sm font-medium">
            Target Degree
          </label>
          <select
            id="target_degree"
            value={formData.target_degree}
            onChange={(e) =>
              setFormData({ ...formData, target_degree: e.target.value })
            }
            className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
            required
          >
            <option value="Masters">Masters</option>
            <option value="PhD">PhD</option>
            <option value="Postdoc">Postdoc</option>
            <option value="Undergraduate">Undergraduate</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="current_major" className="text-sm font-medium">
            Current Major
          </label>
          <input
            id="current_major"
            type="text"
            placeholder="e.g. Computer Science"
            value={formData.current_major}
            onChange={(e) =>
              setFormData({ ...formData, current_major: e.target.value })
            }
            className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="target_countries" className="text-sm font-medium">
            Target Countries (comma separated)
          </label>
          <input
            id="target_countries"
            type="text"
            placeholder="e.g. USA, UK, Japan"
            value={formData.target_countries}
            onChange={(e) =>
              setFormData({ ...formData, target_countries: e.target.value })
            }
            className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="research_interests" className="text-sm font-medium">
            Research Interests (comma separated)
          </label>
          <input
            id="research_interests"
            type="text"
            placeholder="e.g. AI, Machine Learning, HCI"
            value={formData.research_interests}
            onChange={(e) =>
              setFormData({ ...formData, research_interests: e.target.value })
            }
            className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="gpa" className="text-sm font-medium">
            GPA (Optional)
          </label>
          <input
            id="gpa"
            type="number"
            step="0.01"
            placeholder="e.g. 3.8"
            value={formData.gpa}
            onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
            className="w-full p-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2 px-4 py-2",
          "bg-primary text-primary-foreground font-medium rounded-md",
          "hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
