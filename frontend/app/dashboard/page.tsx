import { StatsCard } from "@/components/StatsCard";
import { GraduationCap, FileText, CheckCircle2, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your application progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Matched Scholarships"
          value="12"
          icon={GraduationCap}
          description="Based on your profile"
        />
        <StatsCard
          title="Papers Summarized"
          value="34"
          icon={FileText}
          description="In the last 30 days"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Tasks Completed"
          value="8"
          icon={CheckCircle2}
          description="Out of 24 planned tasks"
        />
        <StatsCard
          title="Upcoming Deadlines"
          value="3"
          icon={Clock}
          description="In the next 14 days"
          trend={{ value: 2, isPositive: false }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity placeholder */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="flex-1">Summarized "Attention Is All You Need"</p>
              <span className="text-muted-foreground">2h ago</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <p className="flex-1">Matched with Fulbright Scholarship</p>
              <span className="text-muted-foreground">1d ago</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="flex-1">SOP Analysis completed</p>
              <span className="text-muted-foreground">3d ago</span>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks placeholder */}
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-destructive/10 text-destructive">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-sm">MEXT Application Draft</p>
                <p className="text-xs text-muted-foreground">Oct 15, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="p-2 rounded-md bg-orange-500/10 text-orange-500">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium text-sm">Request LOR from Dr. Smith</p>
                <p className="text-xs text-muted-foreground">Oct 20, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
