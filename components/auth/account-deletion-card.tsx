"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";

export function AccountDeletionCard() {
  const [confirming, setConfirming] = useState(false);
  return <section className="card p-5"><p className="eyebrow text-[var(--color-danger)]">Area sensitif</p><h2 className="mt-2 font-serif text-2xl tracking-tight">Hapus akun</h2><p className="mt-2 text-sm leading-6 text-secondary">Menghapus akun akan menghapus jurnal, foto, dan interaksi terkait. Tindakan ini tidak dapat dibatalkan.</p>{confirming ? <div className="mt-5 space-y-4"><Feedback tone="error" title="Alur penghapusan server belum tersedia." description="Tidak ada data yang dihapus sekarang. Hubungi dukungan sampai alur aman ini diimplementasikan."/><Button variant="secondary" className="w-full" onClick={() => setConfirming(false)}>Kembali</Button></div> : <Button variant="danger" className="mt-5" onClick={() => setConfirming(true)}>Mulai hapus akun</Button>}</section>;
}
