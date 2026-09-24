"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/src/lib/auth/session";
import { createClient } from "@/src/lib/supabase/server";

export async function deleteJournal(journalId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: "Masuk lagi untuk menghapus jurnal." };
  const supabase = await createClient();
  const { error } = await supabase.from("journals").delete().eq("id", journalId).eq("author_id", user.id);
  if (error) return { error: "Jurnal belum dapat dihapus." };
  revalidatePath("/"); revalidatePath("/explore"); revalidatePath("/profile");
  return { success: true };
}

export async function updateJournal(journalId: string, values: { watchedOn: string; mood: string; reaction: string; body: string; rating: number | null; isSpoiler: boolean; visibility: "public" | "private" }) {
  const user = await getCurrentUser();
  if (!user) return { error: "Masuk lagi untuk mengubah jurnal." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.watchedOn) || values.reaction.trim().length < 10) return { error: "Tanggal dan reaksi jurnal belum valid." };
  if (!values.mood.trim() || (values.rating !== null && (values.rating < 0.5 || values.rating > 5 || values.rating * 2 !== Math.trunc(values.rating * 2)))) return { error: "Mood atau rating jurnal belum valid." };
  const supabase = await createClient();
  const { error } = await supabase.from("journals").update({ watched_on: values.watchedOn, mood: values.mood, reaction: values.reaction.trim(), body: values.body.trim() || null, rating: values.rating, is_spoiler: values.isSpoiler, visibility: values.visibility }).eq("id", journalId).eq("author_id", user.id);
  if (error) return { error: "Jurnal belum dapat diperbarui." };
  revalidatePath(`/journals/${journalId}`); revalidatePath("/"); revalidatePath("/explore"); revalidatePath("/profile");
  return { success: true };
}
