"use client";

import { useEffect, useState } from "react";

import { selectFilmForJournal } from "@/app/create/actions";
import { FilmDetailPreview } from "@/components/movies/film-detail-preview";
import { MovieResultCard } from "@/components/movies/movie-result-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Feedback } from "@/components/ui/feedback";
import { SearchIcon } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type { JournalFilmSelection } from "@/src/types/journal";
import type { TmdbMovie, TmdbSearchResponse } from "@/src/types/tmdb";

type MovieSearchProps = {
  selectionMode?: "browse" | "journal";
  selectedFilm?: JournalFilmSelection | null;
  onSelectedFilmChange?: (selection: JournalFilmSelection | null) => void;
};
type SearchStatus = "idle" | "loading" | "success" | "empty" | "error" | "timeout" | "configuration";

const SEARCH_DELAY_MS = 350;

export function MovieSearch({ selectionMode = "browse", selectedFilm, onSelectedFilmChange }: MovieSearchProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<TmdbMovie | null>(null);
  const [internalJournalSelection, setInternalJournalSelection] = useState<JournalFilmSelection | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isSavedForJournal, setIsSavedForJournal] = useState(false);
  const journalSelection = selectedFilm ?? internalJournalSelection;
  const previewMovie = selectionMode === "journal" ? journalSelection?.movie ?? null : selectedMovie;

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      const resetTimer = window.setTimeout(() => {
        setStatus("idle");
        setResults([]);
        setTotalPages(1);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setStatus("loading");
      setError("");

      try {
        const params = new URLSearchParams({ query: trimmedQuery, page: String(page), language: "id-ID" });
        const response = await fetch(`/api/tmdb/search?${params}`, { signal: controller.signal, cache: "no-store" });
        const payload = await response.json() as TmdbSearchResponse & { error?: string };

        if (!response.ok) {
          setError(payload.error ?? "Pencarian film sedang tidak tersedia.");
          setStatus(response.status === 504 ? "timeout" : response.status === 503 ? "configuration" : "error");
          return;
        }

        setResults(payload.results);
        setTotalPages(Math.max(payload.total_pages, 1));
        setStatus(payload.results.length ? "success" : "empty");
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError("Tidak dapat menghubungi pencarian film. Coba lagi.");
        setStatus("error");
      }
    }, SEARCH_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [page, query]);

  function changeQuery(value: string) {
    setQuery(value);
    setPage(1);
  }

  async function selectMovie(movie: TmdbMovie) {
    setError("");
    if (selectionMode === "journal") {
      setIsSelecting(true);
      const result = await selectFilmForJournal(movie);
      setIsSelecting(false);
      if (result.error) {
        setError(result.error);
        setStatus("error");
        return;
      }
      const selection = { movie, filmId: result.filmId! };
      setInternalJournalSelection(selection);
      onSelectedFilmChange?.(selection);
      setIsSavedForJournal(true);
      return;
    }
    setSelectedMovie(movie);
  }

  return <div className="space-y-4">
    <label className="relative block" htmlFor="movie-search">
      <span className="sr-only">Cari judul film</span>
      <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" />
      <input id="movie-search" type="search" value={query} onChange={(event) => changeQuery(event.target.value)} placeholder="Cari judul film" className="field-input pl-12" autoComplete="off" />
    </label>

    {previewMovie && <FilmDetailPreview movie={previewMovie} savedForJournal={selectionMode === "journal" && isSavedForJournal} onClear={() => { if (selectionMode === "journal") { setInternalJournalSelection(null); onSelectedFilmChange?.(null); } else { setSelectedMovie(null); } setIsSavedForJournal(false); }} />}

    {status === "idle" && !previewMovie && <EmptyState title="Cari film untuk memulai" description="Ketik sedikitnya dua huruf. Hasilnya datang langsung dari TMDB dan belum disimpan ke akunmu." />}
    {status === "loading" && <div aria-live="polite" className="space-y-3"><p className="text-sm text-secondary">Mencari film…</p><div className="skeleton h-44 rounded-[var(--radius-lg)]" /><div className="skeleton h-44 rounded-[var(--radius-lg)]" /></div>}
    {status === "timeout" && <Feedback tone="error" title="Pencarian terlalu lama" description={error} />}
    {status === "configuration" && <Feedback tone="error" title="Pencarian belum dikonfigurasi" description={error} />}
    {status === "error" && <Feedback tone="error" title="Pencarian belum tersedia" description={error} />}
    {status === "empty" && <EmptyState title="Film tidak ditemukan" description="Coba periksa ejaan atau cari dengan judul aslinya." />}
    {status === "success" && <div className="space-y-3" aria-live="polite">
      <p className="text-sm text-secondary">Hasil untuk <span className="font-semibold text-[var(--color-ink)]">“{query.trim()}”</span></p>
      {results.map((movie) => <MovieResultCard key={movie.id} movie={movie} onSelect={selectMovie} isSelecting={isSelecting} />)}
      {totalPages > 1 && <div className="flex items-center justify-between gap-3 pt-1"><Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Sebelumnya</Button><span className="text-xs text-muted">Halaman {page} dari {totalPages}</span><Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)}>Berikutnya</Button></div>}
    </div>}
  </div>;
}
