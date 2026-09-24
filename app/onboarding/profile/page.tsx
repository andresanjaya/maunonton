import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ProfileOnboardingForm } from "@/components/auth/auth-forms";
import { Feedback } from "@/components/ui/feedback";
import { getProfileSetupStatus, requireUser } from "@/src/lib/auth/session";

export const metadata = { title: "Pilih username" };

export default async function ProfileOnboardingPage() {
  const user = await requireUser();
  const { profile, error } = await getProfileSetupStatus(user.id);
  if (profile?.username) redirect("/profile");

  const defaultDisplayName = profile?.display_name ?? user.email?.split("@")[0] ?? "";
  return <AuthPageShell title="Namai sudutmu." description="Pilih username unik agar orang lain bisa menemukan jurnalmu.">{error && <div className="mt-6"><Feedback tone="error" title="Profil belum siap" description="Coba lagi sebentar. Jika masalah berlanjut, periksa migrasi Supabase."/></div>}<ProfileOnboardingForm defaultDisplayName={defaultDisplayName}/></AuthPageShell>;
}
