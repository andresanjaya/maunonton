import Image from "next/image";
import { Card } from "@/components/ui/card";
import { HeartIcon, MessageIcon } from "@/components/ui/icons";
import type { JournalEntry } from "@/src/types/journal";

export function JournalCard({ entry }: { entry: JournalEntry }) {
  return (
    <Card interactive>
      <div className="flex items-center gap-3 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-bold text-[var(--color-accent-strong)]">{entry.author.initials}</span>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{entry.author.name}</p><p className="truncate text-xs text-muted">@{entry.author.username} · {entry.watchedOn}</p></div>
        <span className="rounded-full bg-[var(--color-surface-soft)] px-2.5 py-1 text-[0.65rem] font-semibold text-secondary">{entry.mood}</span>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-raised)]">
        <Image src={entry.photo} alt={`Momen menonton ${entry.film.title}`} fill sizes="(max-width: 768px) 100vw, 736px" className="object-cover"/>
        <div className="absolute inset-x-0 bottom-0 flex items-end gap-3 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 pt-16">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-white/15 shadow-lg"><Image src={entry.film.poster} alt={`Poster ${entry.film.title}`} fill sizes="56px" className="object-cover"/></div>
          <div className="pb-1"><h3 className="font-serif text-xl leading-tight">{entry.film.title}</h3><p className="mt-1 text-xs text-white/65">{entry.film.year}{entry.rating ? ` · ★ ${entry.rating}` : ""}</p></div>
        </div>
      </div>
      <div className="p-4"><p className="text-sm leading-6 text-[var(--color-ink)]">{entry.excerpt}</p><div className="mt-4 flex items-center gap-5 text-xs text-secondary"><span className="flex items-center gap-1.5"><HeartIcon className="size-4"/>{entry.likes}</span><span className="flex items-center gap-1.5"><MessageIcon className="size-4"/>{entry.comments}</span></div></div>
    </Card>
  );
}
