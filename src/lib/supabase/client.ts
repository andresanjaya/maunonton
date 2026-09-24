import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/src/types/database";

function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return { url, publishableKey };
}

export function createClient() {
  const { url, publishableKey } = getPublicSupabaseConfig();

  return createBrowserClient<Database>(url, publishableKey);
}
