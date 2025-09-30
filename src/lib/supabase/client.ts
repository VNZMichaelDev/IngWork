"use client";
import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    // Soft warning in dev; avoids crashing the app before env is configured
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("Supabase env vars are not set. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    }
  }
  return createBrowserClient(url ?? "", anon ?? "");
}
