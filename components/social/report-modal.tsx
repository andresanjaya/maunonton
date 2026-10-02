"use client";

import { useEffect, useRef, useState } from "react";
import { createReport } from "@/app/social/actions";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";

const reasons = [["spam", "Spam"], ["harassment", "Pelecehan"], ["inappropriate", "Konten tidak pantas"], ["copyright", "Hak cipta"], ["unmarked_spoiler", "Spoiler tanpa tanda"], ["other", "Lainnya"]] as const;
export function ReportModal({ targetType, targetId, label = "Laporkan" }: { targetType: "journal" | "comment" | "profile"; targetId: string; label?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false); const [reason, setReason] = useState<typeof reasons[number][0] | "">(""); const [details, setDetails] = useState(""); const [message, setMessage] = useState(""); const [pending, setPending] = useState(false);
  useEffect(() => { const dialog = dialogRef.current; if (!dialog) return; if (open && !dialog.open) dialog.showModal(); if (!open && dialog.open) dialog.close(); }, [open]);
  async function submit() { if (!reason) { setMessage("Pilih alasan laporan."); return; } setPending(true); const result = await createReport(targetType, targetId, reason, details); setPending(false); if (result.error) { setMessage(result.error); return; } setMessage("Laporan terkirim. Terima kasih sudah membantu menjaga komunitas."); setReason(""); setDetails(""); }
  return <><Button variant="ghost" size="sm" onClick={() => setOpen(true)}>{label}</Button><dialog ref={dialogRef} onClose={() => setOpen(false)} aria-labelledby={`report-title-${targetId}`} className="report-dialog"><div className="flex items-center justify-between gap-3"><h2 id={`report-title-${targetId}`} className="text-xl font-semibold">Laporkan konten</h2><Button variant="ghost" size="sm" onClick={() => setOpen(false)}>Tutup</Button></div><fieldset className="mt-5"><legend className="field-label">Alasan</legend><div className="grid gap-2">{reasons.map(([value, text]) => <label key={value} className="flex min-h-11 items-center gap-3 rounded-[.625rem] border border-[var(--color-border)] px-3 text-sm"><input type="radio" name={`reason-${targetId}`} checked={reason === value} onChange={() => setReason(value)} />{text}</label>)}</div></fieldset><label className="mt-5 block"><span className="field-label">Detail tambahan (opsional)</span><textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength={1000} className="field-input min-h-24 resize-y" /></label><Button className="mt-5 w-full" disabled={pending} onClick={submit}>{pending ? "Mengirim…" : "Kirim laporan"}</Button>{message && <div className="mt-4"><Feedback tone={message.startsWith("Laporan terkirim") ? "success" : "error"} title={message} /></div>}</dialog></>;
}
