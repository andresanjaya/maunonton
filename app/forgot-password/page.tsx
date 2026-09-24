import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { ForgotPasswordForm } from "@/components/auth/auth-forms";

export const metadata = { title: "Pulihkan kata sandi" };

export default function ForgotPasswordPage() {
  return <AuthPageShell title="Cari jalan pulang." description="Masukkan emailmu. Kami akan mengirim tautan untuk membuat kata sandi baru."><ForgotPasswordForm/></AuthPageShell>;
}
