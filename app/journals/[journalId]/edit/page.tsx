import { notFound, redirect } from "next/navigation";

import { JournalEditForm } from "@/components/journal/journal-edit-form";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/src/lib/auth/session";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = { title: "Edit jurnal" };

export default async function EditJournalPage({ params }: PageProps<"/journals/[journalId]/edit">) {
  const [{ journalId }, user, supabase] = await Promise.all([params, requireUser(), createClient()]);
  const { data: journal } = await supabase.from("journals").select("id, author_id, watched_on, mood, reaction, body, rating, is_spoiler, visibility").eq("id", journalId).maybeSingle();
  if (!journal) notFound(); if (journal.author_id !== user.id) redirect(`/journals/${journalId}`);
  return <><AppHeader title="Edit jurnal" eyebrow="Perbarui catatanmu" compact /><PageContainer><JournalEditForm journalId={journal.id} initial={{ watchedOn: journal.watched_on, mood: journal.mood, reaction: journal.reaction, body: journal.body ?? "", rating: journal.rating, isSpoiler: journal.is_spoiler, visibility: journal.visibility === "public" ? "public" : "private" }} /></PageContainer></>;
}
