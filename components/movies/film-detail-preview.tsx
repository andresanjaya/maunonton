import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/src/lib/tmdb/images";
import type { TmdbMovie } from "@/src/types/tmdb";

type FilmDetailPreviewProps = {
  movie: TmdbMovie;
  onClear: () => void;
  savedForJournal?: boolean;
  compact?: boolean;
};

function releaseYear(releaseDate: string | null) {
  return releaseDate?.match(/^\d{4}/)?.[0] ?? "Tahun belum tersedia";
}

export function FilmDetailPreview({ movie, onClear, savedForJournal = false, compact = false }: FilmDetailPreviewProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path, "w500");
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, "w780");
  const showOriginalTitle = movie.original_title.localeCompare(movie.title, undefined, { sensitivity: "accent" }) !== 0;

  if (!compact) return <section aria-label="Detail film" className="overflow-hidden rounded-[1.125rem] bg-white">
    {backdropUrl && <div className="relative aspect-[16/9] bg-[var(--color-surface-soft)]"><Image src={backdropUrl} alt={`Cuplikan visual ${movie.title}`} fill sizes="(max-width: 640px) 100vw, 640px" className="object-cover" /></div>}
    <div className="flex gap-4 p-4"><div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-[.625rem] bg-[var(--color-surface-soft)]">{posterUrl ? <Image src={posterUrl} alt={`Poster ${movie.title}`} fill sizes="112px" className="object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted">Poster belum tersedia</div>}</div><div className="min-w-0 flex-1"><h2 className="text-xl font-semibold leading-tight">{movie.title}</h2><p className="mt-2 text-sm text-secondary">{releaseYear(movie.release_date)}{showOriginalTitle ? ` · ${movie.original_title}` : ""}</p><Button onClick={onClear} variant="secondary" size="sm" className="mt-5">Kembali ke hasil</Button></div></div>
    {movie.overview && <p className="px-4 pb-5 text-sm leading-6 text-secondary">{movie.overview}</p>}
  </section>;

  return <section aria-label="Film terpilih" className="flex gap-4 rounded-[1.125rem] bg-white p-3">
      <div className="relative h-32 w-[5.5rem] shrink-0 overflow-hidden rounded-[.625rem] bg-[var(--color-surface-soft)]">
        {posterUrl ? <Image src={posterUrl} alt={`Poster ${movie.title}`} fill sizes="96px" className="object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-[0.65rem] leading-4 text-muted">Poster belum tersedia</div>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col py-1">
        <p className="text-xs font-semibold text-[var(--color-accent-strong)]">Film terpilih</p>
        <h2 className="mt-1 line-clamp-2 text-base font-semibold leading-snug">{movie.title}</h2>
        <p className="mt-1 text-sm text-secondary">{releaseYear(movie.release_date)}{showOriginalTitle ? ` · ${movie.original_title}` : ""}</p>
        {savedForJournal && <p className="mt-2 text-xs font-medium text-[var(--color-success)]">Siap untuk jurnal ini</p>}
        <Button onClick={onClear} variant="ghost" size="sm" className="mt-auto self-start px-0">Ganti film</Button>
      </div>
  </section>;
}
