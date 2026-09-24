import { redirect } from "next/navigation";

import { createClient } from "@/src/lib/supabase/server";

export type AuthenticatedUser = {
  id: string;
  email: string | undefined;
};

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) return null;

  return {
    id: userId,
    email: typeof data.claims.email === "string" ? data.claims.email : undefined,
  };
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?message=signin-required");
  return user;
}

export async function getProfileSetupStatus(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("id", userId)
    .maybeSingle();

  return { profile: data, error };
}
