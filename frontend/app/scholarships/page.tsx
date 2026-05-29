"use client";

import { useState } from "react";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { Search, Filter } from "lucide-react";

// Dummy data for initial UI
const DUMMY_SCHOLARSHIPS = [
  {
    id: "1",
    name: "Fulbright Foreign Student Program",
    provider: "US Department of State",
    country: "USA",
    deadline: "2026-10-15T00:00:00.000Z",
    amount: "Full Tuition + Stipend",
    score: 0.92,
  },
  {
    id: "2",
    name: "MEXT Scholarship",
    provider: "Government of Japan",
    country: "Japan",
    deadline: "2026-05-30T00:00:00.000Z",
    amount: "¥144,000/month + Tuition",
    score: 0.85,
  },
  {
    id: "3",
    name: "Chevening Scholarship",
    provider: "UK Government",
    country: "UK",
    deadline: "2026-11-01T00:00:00.000Z",
    amount: "Full Tuition + Living Costs",
    score: 0.72,
  },
  {
    id: "4",
    name: "DAAD Scholarship",
    provider: "German Academic Exchange Service",
    country: "Germany",
    deadline: "2026-08-15T00:00:00.000Z",
    amount: "€934/month + Travel",
    score: 0.45,
  },
];

export default function ScholarshipsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = DUMMY_SCHOLARSHIPS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scholarships</h1>
          <p className="text-muted-foreground mt-2">
            AI-matched opportunities based on your profile
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-md bg-card hover:bg-muted transition-colors text-sm font-medium">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} {...scholarship} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            No scholarships found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
