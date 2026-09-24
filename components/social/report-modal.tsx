"use client";

import { useState } from "react";
import { createReport } from "@/app/social/actions";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";

const reasons = [["spam", "Spam"], ["harassment", "Harassment"], ["inappropriate", "Inappropriate content"], ["copyright", "Copyright concern"], ["unmarked_spoiler", "Unmarked spoiler"], ["other", "Other"]] as const;
export function ReportModal({ targetType, targetId, label = "Laporkan" }: { targetType: "journal" | "comment" | "profile"; targetId: string; label?: string }) {
  const [open, setOpen] = useState(false); const [reason, setReason] = useState<typeof reasons[number][0] | "">(""); const [details, setDetails] = useState(""); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  async function submit() { if (!reason) { setMessage("Pilih alasan laporan."); return; } setPending(true); const result = await createReport(targetType, targetId, reason, details); setPending(false); if (result.error) { setMessage(result.error); return; } setMessage("Laporan terkirim. Terima kasih sudah membantu menjaga komunitas."); setReason(""); setDetails(""); }
  return <>{open ? <div className="card space-y-4 p-4" role="dialog" aria-modal="true" aria-label="Laporkan konten"><div className="flex items-center justify-between"><h2 className="font-serif text-2xl">Laporkan</h2><Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Tutup</Button></div><fieldset><legend className="field-label">Alasan</legend><div className="grid gap-2">{reasons.map(([value, text]) => <label key={value} className="flex min-h-11 items-center gap-3 rounded-xl border border-[var(--color-border)] px-3 text-sm"><input type="radio" name={`reason-${targetId}`} checked={reason === value} onChange={() => setReason(value)} />{text}</label>)}</div></fieldset><textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength={1000} placeholder="Detail tambahan (opsional)" className="field-input min-h-24 resize-y" /><Button className="w-full" disabled={pending} onClick={submit}>{pending ? "Mengirim…" : "Kirim laporan"}</Button>{message && <Feedback tone={message.startsWith("Laporan terkirim") ? "success" : "error"} title={message} />}</div> : <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>{label}</Button>}</>;
}
