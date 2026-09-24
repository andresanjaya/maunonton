"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeartIcon, MessageIcon } from "@/components/ui/icons";
import { getTmdbImageUrl } from "@/src/lib/tmdb/images";
import type { FeedJournal } from "@/src/lib/journals/feed";

function watchedDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}

export function JournalFeedCard({ journal }: { journal: FeedJournal }) {
  const [showSpoiler, setShowSpoiler] = useState(!journal.isSpoiler);
  const posterUrl = getTmdbImageUrl(journal.film.posterPath);
  const initials = journal.author.displayName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const hideContent = journal.isSpoiler && !showSpoiler;

  return <article className="card overflow-hidden"><div className="flex items-center gap-3 p-4"><span aria-label={`${journal.author.displayName} avatar`} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-bold text-[var(--color-accent-strong)]">{initials}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{journal.author.displayName}</p><p className="truncate text-xs text-muted">@{journal.author.username} · {watchedDate(journal.watchedOn)}</p></div><span className="rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[0.65rem] font-semibold text-secondary">{journal.mood}</span></div><Link href={`/journals/${journal.id}`} className="focus-ring block"><div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-raised)]">{journal.coverImageUrl && !hideContent ? <Image src={journal.coverImageUrl} alt={`Momen menonton ${journal.film.title}`} fill sizes="(max-width: 768px) 100vw, 736px" className="object-cover" /> : <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(242,127,98,.18),transparent_45%),var(--color-surface-raised)]" />}{hideContent && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-center"><span className="rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold">Spoiler disembunyikan</span><span className="text-xs leading-5 text-secondary">Gambar dan reaksi disembunyikan sampai kamu memilih untuk melihatnya.</span></div>}<div className="absolute inset-x-0 bottom-0 flex items-end gap-3 bg-gradient-to-t from-black/90 via-black/35 to-transparent p-4 pt-16"><div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-white/15 bg-black/30 shadow-lg">{posterUrl && <Image src={posterUrl} alt={`Poster ${journal.film.title}`} fill sizes="56px" className="object-cover" />}</div><div className="pb-1"><h2 className="font-serif text-xl leading-tight text-white">{journal.film.title}</h2><p className="mt-1 text-xs text-white/65">{journal.rating ? `★ ${journal.rating.toFixed(1)}` : "Tanpa rating"}</p></div></div></div></Link><div className="p-4">{journal.isSpoiler && <span className="inline-flex rounded-full border border-[var(--color-warning)]/30 bg-[rgba(230,185,108,.1)] px-2.5 py-1 text-xs font-semibold text-[var(--color-warning)]">Mengandung spoiler</span>}{hideContent ? <button type="button" onClick={() => setShowSpoiler(true)} className="focus-ring mt-3 min-h-11 rounded-full border border-[var(--color-border-strong)] px-4 text-sm font-semibold text-[var(--color-ink)]">Tampilkan spoiler</button> : <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--color-ink)]">{journal.reaction}</p>}<div className="mt-4 flex items-center gap-5 text-xs text-secondary"><span className="flex items-center gap-1.5"><HeartIcon className="size-4" />{journal.likeCount}</span><span className="flex items-center gap-1.5"><MessageIcon className="size-4" />{journal.commentCount}</span></div></div></article>;
}
