"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/src/lib/auth/session";
import { createClient } from "@/src/lib/supabase/server";

type Result = { error?: string; count?: number; following?: boolean; comment?: { id: string; body: string; authorId: string; authorName: string; username: string; createdAt: string } };

async function interactionContext(targetUserId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Masuk untuk berinteraksi." } as const;
  const supabase = await createClient();
  const { data: blocked } = await supabase.rpc("users_are_blocked", { first_user_id: user.id, second_user_id: targetUserId });
  if (blocked) return { error: "Interaksi tidak tersedia untuk pengguna ini." } as const;
  return { user, supabase } as const;
}

export async function toggleFollow(targetUserId: string, shouldFollow: boolean): Promise<Result> {
  const context = await interactionContext(targetUserId); if ("error" in context) return context;
  if (context.user.id === targetUserId) return { error: "Kamu tidak dapat mengikuti dirimu sendiri." };
  const { error } = shouldFollow
    ? await context.supabase.from("follows").insert({ follower_id: context.user.id, following_id: targetUserId })
    : await context.supabase.from("follows").delete().eq("follower_id", context.user.id).eq("following_id", targetUserId);
  if (error && error.code !== "23505") return { error: "Status mengikuti belum dapat diperbarui." };
  const { count } = await context.supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", targetUserId);
  revalidatePath("/"); revalidatePath("/profile");
  return { following: shouldFollow, count: count ?? 0 };
}

export async function toggleLike(journalId: string, authorId: string, shouldLike: boolean): Promise<Result> {
  const context = await interactionContext(authorId); if ("error" in context) return context;
  const { error } = shouldLike
    ? await context.supabase.from("journal_likes").insert({ journal_id: journalId, user_id: context.user.id })
    : await context.supabase.from("journal_likes").delete().eq("journal_id", journalId).eq("user_id", context.user.id);
  if (error && error.code !== "23505") return { error: "Suka belum dapat diperbarui." };
  const { count } = await context.supabase.from("journal_likes").select("*", { count: "exact", head: true }).eq("journal_id", journalId);
  return { count: count ?? 0 };
}

export async function addComment(journalId: string, authorId: string, body: string): Promise<Result> {
  const context = await interactionContext(authorId); if ("error" in context) return context;
  if (body.trim().length < 1 || body.trim().length > 1000) return { error: "Komentar harus berisi 1–1000 karakter." };
  const { data, error } = await context.supabase.from("comments").insert({ journal_id: journalId, author_id: context.user.id, body: body.trim() }).select("id, body, author_id, created_at").single();
  if (error || !data) return { error: "Komentar belum dapat dikirim." };
  const { data: profile } = await context.supabase.from("profiles").select("display_name, username").eq("id", context.user.id).maybeSingle();
  return { comment: { id: data.id, body: data.body, authorId: data.author_id, authorName: profile?.display_name ?? "Member", username: profile?.username ?? "member", createdAt: data.created_at } };
}

export async function deleteComment(commentId: string): Promise<Result> {
  const user = await getCurrentUser(); if (!user) return { error: "Masuk untuk menghapus komentar." };
  const supabase = await createClient(); const { error } = await supabase.from("comments").delete().eq("id", commentId);
  return error ? { error: "Komentar belum dapat dihapus." } : {};
}

export async function blockUser(targetUserId: string): Promise<Result> {
  const user = await getCurrentUser(); if (!user) return { error: "Masuk untuk memblokir pengguna." };
  if (user.id === targetUserId) return { error: "Kamu tidak dapat memblokir dirimu sendiri." };
  const supabase = await createClient(); const { error } = await supabase.from("blocks").insert({ blocker_id: user.id, blocked_id: targetUserId });
  if (error && error.code !== "23505") return { error: "Pengguna belum dapat diblokir." };
  revalidatePath("/"); revalidatePath("/explore"); return {};
}

export async function unblockUser(targetUserId: string): Promise<Result> {
  const user = await getCurrentUser(); if (!user) return { error: "Masuk untuk membuka blokir." };
  const supabase = await createClient(); const { error } = await supabase.from("blocks").delete().eq("blocker_id", user.id).eq("blocked_id", targetUserId);
  return error ? { error: "Blokir belum dapat dibuka." } : {};
}

export async function createReport(targetType: "journal" | "comment" | "profile", targetId: string, reason: "spam" | "harassment" | "inappropriate" | "copyright" | "unmarked_spoiler" | "other", details?: string): Promise<Result> {
  const user = await getCurrentUser(); if (!user) return { error: "Masuk untuk mengirim laporan." };
  const supabase = await createClient(); const { error } = await supabase.from("reports").insert({ reporter_id: user.id, target_type: targetType, target_id: targetId, reason, details: details?.trim() || null });
  if (error?.code === "23505") return { error: "Laporan untuk konten ini masih dalam peninjauan." };
  return error ? { error: "Laporan belum dapat dikirim." } : {};
}
