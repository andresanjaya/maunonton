"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser, getProfileSetupStatus } from "@/src/lib/auth/session";
import { createClient } from "@/src/lib/supabase/server";

export type AuthActionState = {
  message?: string;
  status?: "error" | "success";
};

function getString(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function validEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

async function getOrigin() {
  const requestHeaders = await headers();
  return requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

async function postLoginDestination(userId: string) {
  const { profile } = await getProfileSetupStatus(userId);
  return profile?.username ? "/profile" : "/onboarding/profile";
}

export async function signUp(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!validEmail(email)) return { status: "error", message: "Masukkan alamat email yang valid." };
  if (password.length < 8) return { status: "error", message: "Kata sandi minimal 8 karakter." };

  const supabase = await createClient();
  const origin = await getOrigin();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${origin}/auth/confirm?next=/onboarding/profile` },
  });

  if (error) return { status: "error", message: error.message };
  if (!data.user) return { status: "error", message: "Akun belum dapat dibuat. Coba lagi." };
  if (data.session) redirect("/onboarding/profile");

  return {
    status: "success",
    message: "Cek emailmu untuk memverifikasi akun, lalu lanjutkan memilih username.",
  };
}

export async function signIn(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!validEmail(email) || !password) {
    return { status: "error", message: "Masukkan email dan kata sandi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return { status: "error", message: "Email atau kata sandi tidak cocok." };
  }

  redirect(await postLoginDestination(data.user.id));
}

export async function sendPasswordReset(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = getString(formData, "email").toLowerCase();
  if (!validEmail(email)) return { status: "error", message: "Masukkan alamat email yang valid." };

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Jika email terdaftar, tautan pengaturan ulang sudah dikirim." };
}

export async function resetPassword(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");
  if (password.length < 8) return { status: "error", message: "Kata sandi minimal 8 karakter." };
  if (password !== confirmPassword) return { status: "error", message: "Konfirmasi kata sandi belum sama." };

  const user = await getCurrentUser();
  if (!user) return { status: "error", message: "Tautan pemulihan sudah kedaluwarsa. Minta tautan baru." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };

  return { status: "success", message: "Kata sandi diperbarui. Kamu tetap masuk dengan aman." };
}

export async function completeProfile(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const username = getString(formData, "username").toLowerCase();
  const displayName = getString(formData, "displayName");
  const user = await getCurrentUser();

  if (!user) return { status: "error", message: "Sesi berakhir. Masuk lagi untuk melanjutkan." };
  if (!/^[a-z0-9_]{3,30}$/.test(username)) {
    return { status: "error", message: "Username harus 3–30 karakter: huruf, angka, atau garis bawah." };
  }
  if (!displayName) return { status: "error", message: "Masukkan nama yang ingin ditampilkan." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, username, display_name: displayName }, { onConflict: "id" });

  if (error) {
    const message = error.code === "23505" ? "Username itu sudah dipakai. Coba yang lain." : error.message;
    return { status: "error", message };
  }

  redirect("/profile");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login?message=signed-out");
}
