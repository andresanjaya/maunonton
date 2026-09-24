import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/auth-forms";
import { getCurrentUser, getProfileSetupStatus } from "@/src/lib/auth/session";

export const metadata = { title: "Buat akun" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    const { profile } = await getProfileSetupStatus(user.id);
    redirect(profile?.username ? "/profile" : "/onboarding/profile");
  }

  return <AuthPageShell title="Mulai dari satu film." description="Buat ruang kecil untuk menyimpan apa yang kamu tonton dan rasakan."><RegisterForm/></AuthPageShell>;
}
