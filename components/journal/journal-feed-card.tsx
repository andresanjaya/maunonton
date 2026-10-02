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

  return <article className="card overflow-hidden">
    <div className="flex items-center gap-3 p-4">
      <span aria-label={`${journal.author.displayName} avatar`} className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-xs font-semibold">{initials}</span>
      <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{journal.author.displayName}</p><p className="truncate text-xs text-muted">@{journal.author.username} · {watchedDate(journal.watchedOn)}</p></div>
      {journal.visibility === "private" && <span className="text-xs font-medium text-secondary">Privat</span>}
    </div>
    {hideContent ? <div className="flex aspect-[4/3] flex-col items-center justify-center bg-[var(--color-surface-soft)] p-6 text-center"><p className="text-sm font-semibold">Spoiler disembunyikan</p><p className="mt-2 max-w-xs text-sm text-secondary">Foto dan reaksi akan muncul setelah kamu memilih untuk melihatnya.</p><button type="button" onClick={() => setShowSpoiler(true)} className="focus-ring mt-4 min-h-11 rounded-[.75rem] border border-[var(--color-border-strong)] bg-white px-4 text-sm font-semibold">Tampilkan spoiler</button></div> : <Link href={`/journals/${journal.id}`} className="focus-ring block"><div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-soft)]">{(journal.coverImageUrl || posterUrl) ? <Image src={journal.coverImageUrl || posterUrl!} alt={journal.coverImageUrl ? `Momen menonton ${journal.film.title}` : `Poster ${journal.film.title}`} fill sizes="(max-width: 640px) 100vw, 640px" className="object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-muted">Foto belum tersedia</div>}</div></Link>}
    <div className="space-y-2 p-4">
      <Link href={`/journals/${journal.id}`} className="focus-ring block text-base font-semibold leading-snug hover:text-[var(--color-accent-strong)]">{journal.film.title}</Link>
      <p className="text-xs text-secondary"><span className="font-medium text-[var(--color-accent-strong)]">{journal.mood}</span>{journal.rating ? ` · ★ ${journal.rating.toFixed(1)}` : ""}{journal.isSpoiler ? " · Spoiler" : ""}</p>
      {!hideContent && <p className="line-clamp-3 text-sm leading-6">{journal.reaction}</p>}
      <div className="flex items-center gap-5 pt-2 text-xs text-secondary"><span className="flex items-center gap-1.5"><HeartIcon className="size-4" />{journal.likeCount}</span><span className="flex items-center gap-1.5"><MessageIcon className="size-4" />{journal.commentCount}</span></div>
    </div>
  </article>;
}
