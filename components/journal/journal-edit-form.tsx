"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { updateJournal } from "@/app/journals/actions";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { Input, Textarea } from "@/components/ui/input";
import { JOURNAL_MOODS } from "@/src/types/journal";

type Props = { journalId: string; initial: { watchedOn: string; mood: string; reaction: string; body: string; rating: number | null; isSpoiler: boolean; visibility: "public" | "private" } };

export function JournalEditForm({ journalId, initial }: Props) {
  const router = useRouter(); const [form, setForm] = useState(initial); const [error, setError] = useState(""); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSaving(true); setError(""); const result = await updateJournal(journalId, form); setSaving(false); if (result.error) { setError(result.error); return; } router.replace(`/journals/${journalId}`); router.refresh(); }
  return <form onSubmit={submit} className="space-y-5"><Input label="Tanggal menonton" type="date" value={form.watchedOn} onChange={(event) => setForm({ ...form, watchedOn: event.target.value })} /><fieldset><legend className="field-label">Mood</legend><div className="flex flex-wrap gap-2">{JOURNAL_MOODS.map((mood) => <label key={mood}><input type="radio" className="peer sr-only" checked={form.mood === mood} onChange={() => setForm({ ...form, mood })} /><span className="flex min-h-11 items-center rounded-full border border-[var(--color-border-strong)] px-4 text-sm peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent-soft)]">{mood}</span></label>)}</div></fieldset><Textarea label="Reaksi" value={form.reaction} onChange={(event) => setForm({ ...form, reaction: event.target.value })} /><Textarea label="Catatan" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} /><select value={form.rating ?? ""} onChange={(event) => setForm({ ...form, rating: event.target.value ? Number(event.target.value) : null })} className="field-input"><option value="">Tanpa rating</option>{Array.from({ length: 10 }, (_, index) => (index + 1) / 2).map((rating) => <option key={rating} value={rating}>{rating.toFixed(1)} / 5</option>)}</select><label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={form.isSpoiler} onChange={(event) => setForm({ ...form, isSpoiler: event.target.checked })} /> Mengandung spoiler</label><div className="grid grid-cols-2 gap-3">{(["public", "private"] as const).map((visibility) => <label key={visibility}><input type="radio" className="peer sr-only" checked={form.visibility === visibility} onChange={() => setForm({ ...form, visibility })} /><span className="flex min-h-12 items-center justify-center rounded-xl border border-[var(--color-border-strong)] capitalize peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent-soft)]">{visibility === "public" ? "Publik" : "Privat"}</span></label>)}</div>{error && <Feedback tone="error" title="Perubahan belum tersimpan" description={error} />}<Button type="submit" className="w-full" disabled={saving}>{saving ? "Menyimpan…" : "Simpan perubahan"}</Button></form>;
}
