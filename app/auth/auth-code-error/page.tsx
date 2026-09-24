import Link from "next/link";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";

export const metadata = { title: "Tautan tidak berlaku" };

export default function AuthCodeErrorPage() {
  return <AuthPageShell title="Tautan tidak berlaku" description="Tautan verifikasi atau pemulihan mungkin sudah kedaluwarsa atau pernah digunakan."><Feedback tone="error" title="Kami tidak bisa menyelesaikan permintaan ini."/><Button href="/forgot-password" className="mt-6 w-full">Kirim tautan baru</Button><p className="mt-5 text-center text-xs text-muted"><Link href="/login" className="font-semibold text-[var(--color-accent-strong)]">Kembali ke masuk</Link></p></AuthPageShell>;
}
