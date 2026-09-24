import { redirect } from "next/navigation";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/auth-forms";
import { Feedback } from "@/components/ui/feedback";
import { getCurrentUser, getProfileSetupStatus } from "@/src/lib/auth/session";

export const metadata = { title: "Masuk" };

export default async function LoginPage(props: PageProps<"/login">) {
  const [user, searchParams] = await Promise.all([getCurrentUser(), props.searchParams]);
  if (user) {
    const { profile } = await getProfileSetupStatus(user.id);
    redirect(profile?.username ? "/profile" : "/onboarding/profile");
  }

  const message = searchParams.message;
  return <AuthPageShell title="Kembali ke ceritamu." description="Masuk untuk melanjutkan jurnal film dan momen di sekitarnya.">{message === "signed-out" && <div className="mt-6"><Feedback tone="success" title="Kamu sudah keluar dengan aman."/></div>}{message === "signin-required" && <div className="mt-6"><Feedback tone="info" title="Masuk untuk membuka halaman itu."/></div>}<LoginForm/></AuthPageShell>;
}
