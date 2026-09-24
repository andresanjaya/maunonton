"use client";

import Link from "next/link";
import { useActionState } from "react";

import { completeProfile, resetPassword, sendPasswordReset, signIn, signUp, type AuthActionState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { Input } from "@/components/ui/input";

const initialAuthState: AuthActionState = {};

function ActionFeedback({ state }: { state: AuthActionState }) {
  if (!state.message || !state.status) return null;
  return <Feedback tone={state.status} title={state.message}/>;
}

function SubmitButton({ children, pending }: { children: string; pending: boolean }) {
  return <Button type="submit" size="lg" className="mt-2 w-full" disabled={pending}>{pending ? "Memproses…" : children}</Button>;
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialAuthState);
  return <form action={formAction} className="mt-7 space-y-4"><ActionFeedback state={state}/><Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required/><Input label="Kata sandi" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required/><p className="-mt-1 text-right text-xs"><Link href="/forgot-password" className="focus-ring font-semibold text-[var(--color-accent-strong)]">Lupa kata sandi?</Link></p><SubmitButton pending={pending}>Masuk</SubmitButton><p className="pt-2 text-center text-xs text-muted">Belum punya akun? <Link href="/register" className="focus-ring font-semibold text-[var(--color-accent-strong)]">Buat akun</Link></p></form>;
}

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, initialAuthState);
  return <form action={formAction} className="mt-7 space-y-4"><ActionFeedback state={state}/><Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required/><Input label="Kata sandi" name="password" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" minLength={8} required/><SubmitButton pending={pending}>Buat akun</SubmitButton><p className="pt-2 text-center text-xs text-muted">Sudah punya akun? <Link href="/login" className="focus-ring font-semibold text-[var(--color-accent-strong)]">Masuk</Link></p></form>;
}

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(sendPasswordReset, initialAuthState);
  return <form action={formAction} className="mt-7 space-y-4"><ActionFeedback state={state}/><Input label="Email" name="email" type="email" autoComplete="email" placeholder="nama@email.com" required/><SubmitButton pending={pending}>Kirim tautan pemulihan</SubmitButton><p className="pt-2 text-center text-xs text-muted"><Link href="/login" className="focus-ring font-semibold text-[var(--color-accent-strong)]">Kembali ke masuk</Link></p></form>;
}

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPassword, initialAuthState);
  return <form action={formAction} className="mt-7 space-y-4"><ActionFeedback state={state}/><Input label="Kata sandi baru" name="password" type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" minLength={8} required/><Input label="Ulangi kata sandi" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Ulangi kata sandi" minLength={8} required/><SubmitButton pending={pending}>Perbarui kata sandi</SubmitButton>{state.status === "success" && <p className="text-center text-xs"><Link href="/profile" className="focus-ring font-semibold text-[var(--color-accent-strong)]">Lanjut ke profil</Link></p>}</form>;
}

export function ProfileOnboardingForm({ defaultDisplayName }: { defaultDisplayName: string }) {
  const [state, formAction, pending] = useActionState(completeProfile, initialAuthState);
  return <form action={formAction} className="mt-7 space-y-4"><ActionFeedback state={state}/><Input label="Nama tampilan" name="displayName" autoComplete="name" defaultValue={defaultDisplayName} maxLength={60} required/><Input label="Username" name="username" autoComplete="username" placeholder="contoh: andre_nonton" minLength={3} maxLength={30} pattern="[a-zA-Z0-9_]+" hint="3–30 karakter. Hanya huruf, angka, dan garis bawah." required/><SubmitButton pending={pending}>Simpan dan lanjutkan</SubmitButton></form>;
}
