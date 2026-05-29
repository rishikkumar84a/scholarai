import { ProfileForm } from "@/components/ProfileForm";

export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg p-8 space-y-8 bg-card rounded-2xl border border-border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Complete your profile</h1>
          <p className="text-muted-foreground text-sm">
            We need a few details to find the best scholarships and generate accurate research plans for you.
          </p>
        </div>

        <ProfileForm />
      </div>
    </div>
  );
}
