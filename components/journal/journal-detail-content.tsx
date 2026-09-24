"use client";

import Image from "next/image";
import { useState } from "react";

type JournalDetailContentProps = { reaction: string; body: string | null; isSpoiler: boolean; images: { id: string; signedUrl: string }[] };

export function JournalDetailContent({ reaction, body, isSpoiler, images }: JournalDetailContentProps) {
  const [showSpoiler, setShowSpoiler] = useState(!isSpoiler);
  if (isSpoiler && !showSpoiler) return <section className="border-t border-[var(--color-border)] p-5"><span className="inline-flex rounded-full border border-[var(--color-warning)]/30 bg-[rgba(230,185,108,.1)] px-3 py-1 text-xs font-semibold text-[var(--color-warning)]">Mengandung spoiler</span><p className="mt-4 text-sm leading-6 text-secondary">Reaksi dan gambar disembunyikan untuk menjaga pengalaman menontonmu.</p><button type="button" onClick={() => setShowSpoiler(true)} className="focus-ring mt-4 min-h-11 rounded-full border border-[var(--color-border-strong)] px-4 text-sm font-semibold">Tampilkan spoiler</button></section>;
  return <><section className="border-t border-[var(--color-border)] p-5"><p className="font-serif text-2xl leading-snug tracking-tight">{reaction}</p>{body && <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-secondary">{body}</p>}</section>{images.length > 0 && <section className="border-t border-[var(--color-border)] p-5"><p className="eyebrow">Momen di sekitarnya</p><div className="mt-4 grid grid-cols-2 gap-3">{images.map((image, index) => <div key={image.id} className="relative aspect-square overflow-hidden rounded-xl border border-[var(--color-border)]"><Image src={image.signedUrl} alt={`Foto momen ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 368px" className="object-cover" /></div>)}</div></section>}</>;
}
