"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase";
import { LogIn, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

import { Suspense } from "react";

function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const next = searchParams.get("next") ?? "/dashboard";

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const supabase = getSupabaseClient();
    
    // get URL origin safely
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      console.error("Error signing in with Google:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-2xl border border-border shadow-sm">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md text-center">
            {error === "auth_failed" 
              ? "Authentication failed. Please try again." 
              : "An error occurred during sign in."}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={cn(
            "w-full flex items-center justify-center gap-3 px-4 py-3",
            "bg-primary text-primary-foreground font-medium rounded-lg",
            "hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <LogIn className="w-5 h-5" />
          )}
          {isLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
