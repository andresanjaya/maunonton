"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteJournal } from "@/app/journals/actions";
import { ReportModal } from "@/components/social/report-modal";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";

export function JournalActions({ journalId, isOwner }: { journalId: string; isOwner: boolean }) {
  const router = useRouter(); const [message, setMessage] = useState(""); const [deleting, setDeleting] = useState(false);
  async function share() { const url = window.location.href; if (navigator.share) { await navigator.share({ title: "Jurnal maunonton", url }); return; } await navigator.clipboard.writeText(url); setMessage("Tautan jurnal disalin."); }
  async function remove() { if (!window.confirm("Hapus jurnal ini? Foto dan catatannya tidak dapat dipulihkan.")) return; setDeleting(true); const result = await deleteJournal(journalId); setDeleting(false); if (result.error) { setMessage(result.error); return; } router.replace("/profile"); router.refresh(); }
  return <div className="space-y-3"><div className="flex flex-wrap gap-2"><Button variant="secondary" size="sm" onClick={share}>Bagikan</Button>{isOwner && <><Button href={`/journals/${journalId}/edit`} variant="secondary" size="sm">Edit</Button><Button variant="danger" size="sm" disabled={deleting} onClick={remove}>{deleting ? "Menghapus…" : "Hapus"}</Button></>}<ReportModal targetType="journal" targetId={journalId} /></div>{message && <Feedback tone="info" title={message} />}</div>;
}
