import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/src/lib/tmdb/images";
import type { TmdbMovie } from "@/src/types/tmdb";

type FilmDetailPreviewProps = {
  movie: TmdbMovie;
  onClear: () => void;
  savedForJournal?: boolean;
};

function releaseYear(releaseDate: string | null) {
  return releaseDate?.match(/^\d{4}/)?.[0] ?? "Tahun belum tersedia";
}

export function FilmDetailPreview({ movie, onClear, savedForJournal = false }: FilmDetailPreviewProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path, "w500");
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, "w780");
  const showOriginalTitle = movie.original_title.localeCompare(movie.title, undefined, { sensitivity: "accent" }) !== 0;

  return <section aria-label="Film terpilih" className="card relative overflow-hidden p-4">
    {backdropUrl && <Image src={backdropUrl} alt="" fill sizes="(max-width: 736px) 100vw, 736px" className="object-cover opacity-20" />}
    <div className="relative flex gap-4">
      <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-white/15 bg-[var(--color-surface-raised)] shadow-lg">
        {posterUrl ? <Image src={posterUrl} alt={`Poster ${movie.title}`} fill sizes="96px" className="object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-[0.65rem] leading-4 text-muted">Poster belum tersedia</div>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow">Film terpilih</p>
        <h2 className="mt-2 font-serif text-2xl leading-tight tracking-tight">{movie.title}</h2>
        <p className="mt-1 text-sm text-secondary">{releaseYear(movie.release_date)}{showOriginalTitle ? ` · ${movie.original_title}` : ""}</p>
        {savedForJournal && <p className="mt-3 text-xs font-semibold text-[var(--color-success)]">Siap dipakai di jurnal ini.</p>}
      </div>
    </div>
    {movie.overview && <p className="relative mt-4 line-clamp-3 text-sm leading-6 text-secondary">{movie.overview}</p>}
    <Button onClick={onClear} variant="ghost" size="sm" className="relative mt-4">Ganti film</Button>
  </section>;
}
