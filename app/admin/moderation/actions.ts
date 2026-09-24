"use server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/src/lib/auth/session";
import { createAdminClient } from "@/src/lib/supabase/admin";
const allowed = () => new Set((process.env.ADMIN_USER_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean));
export async function setModerationStatus(journalId: string, status: "active" | "hidden" | "removed" | "under_review"): Promise<void> { const user = await getCurrentUser(); if (!user || !allowed().has(user.id)) return; try { const { error } = await createAdminClient().from("journals").update({ moderation_status: status }).eq("id", journalId); if (error) return; revalidatePath("/admin/moderation"); } catch { return; } }
