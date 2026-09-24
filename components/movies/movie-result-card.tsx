import Image from "next/image";

import { Button } from "@/components/ui/button";
import { getTmdbImageUrl } from "@/src/lib/tmdb/images";
import type { TmdbMovie } from "@/src/types/tmdb";

type MovieResultCardProps = {
  movie: TmdbMovie;
  onSelect: (movie: TmdbMovie) => void;
  isSelecting?: boolean;
};

function releaseYear(releaseDate: string | null) {
  return releaseDate?.match(/^\d{4}/)?.[0] ?? "Tahun belum tersedia";
}

export function MovieResultCard({ movie, onSelect, isSelecting = false }: MovieResultCardProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path);
  const showOriginalTitle = movie.original_title.localeCompare(movie.title, undefined, { sensitivity: "accent" }) !== 0;

  return <article className="card flex min-h-44 gap-3 p-3 sm:p-4">
    <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
      {posterUrl ? <Image src={posterUrl} alt={`Poster ${movie.title}`} fill sizes="96px" className="object-cover" /> : <div className="flex h-full items-center justify-center px-2 text-center text-[0.65rem] leading-4 text-muted">Poster belum tersedia</div>}
    </div>
    <div className="flex min-w-0 flex-1 flex-col py-0.5">
      <div>
        <h2 className="line-clamp-2 font-serif text-xl leading-tight tracking-tight">{movie.title}</h2>
        <p className="mt-1 text-xs text-muted">{releaseYear(movie.release_date)}</p>
        {showOriginalTitle && <p className="mt-2 line-clamp-1 text-xs text-secondary">Judul asli: {movie.original_title}</p>}
      </div>
      <Button onClick={() => onSelect(movie)} disabled={isSelecting} variant="secondary" size="sm" className="mt-auto self-start">
        {isSelecting ? "Menyiapkan…" : "Pilih film"}
      </Button>
    </div>
  </article>;
}
