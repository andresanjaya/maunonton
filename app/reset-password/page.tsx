import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ResetPasswordForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Kata sandi baru" };

export default function ResetPasswordPage() {
  return <AuthPageShell title="Buat kata sandi baru." description="Pilih kata sandi yang kuat dan mudah kamu ingat."><ResetPasswordForm/></AuthPageShell>;
}
