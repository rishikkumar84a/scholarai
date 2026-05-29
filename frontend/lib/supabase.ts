import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in browser (Client Components).
 * Reads NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Singleton browser client for convenience.
 * Import this in any client component that needs Supabase access.
 */
let _client: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseClient() {
  if (!_client) {
    _client = createClient();
  }
  return _client;
}
