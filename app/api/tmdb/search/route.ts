import type { TmdbMovie, TmdbSearchResponse } from "@/src/types/tmdb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SEARCH_TIMEOUT_MS = 8_000;
const DEFAULT_LANGUAGE = "id-ID";
const MAX_PAGE = 500;

type TmdbApiMovie = Partial<TmdbMovie> & { id?: number };
type TmdbApiResponse = {
  page?: number;
  results?: TmdbApiMovie[];
  total_pages?: number;
  total_results?: number;
};

function jsonError(error: string, status: number) {
  return Response.json({ error }, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getPage(value: string | null) {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isSafeInteger(parsed) ? Math.min(Math.max(parsed, 1), MAX_PAGE) : 1;
}

function getLanguage(value: string | null) {
  return value && /^[a-z]{2,3}-[A-Z]{2}$/.test(value) ? value : DEFAULT_LANGUAGE;
}

function toMovie(movie: TmdbApiMovie): TmdbMovie | null {
  if (!Number.isInteger(movie.id) || movie.id! <= 0) return null;

  const originalTitle = movie.original_title?.trim() ?? "";
  const localizedTitle = movie.title?.trim() ?? "";
  const title = localizedTitle || originalTitle;

  if (!title) return null;

  return {
    id: movie.id!,
    title,
    original_title: originalTitle || title,
    overview: movie.overview?.trim() || null,
    release_date: movie.release_date || null,
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    original_language: movie.original_language || null,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() ?? "";

  if (query.length < 2) {
    return jsonError("Masukkan setidaknya dua karakter untuk mencari film.", 400);
  }

  const apiKey = process.env.TMDB_API_KEY;
  const apiBaseUrl = process.env.TMDB_API_BASE_URL?.replace(/\/$/, "");

  if (!apiKey || !apiBaseUrl) {
    return jsonError("Pencarian film belum dikonfigurasi. Tambahkan TMDB_API_KEY dan TMDB_API_BASE_URL di .env.local, lalu mulai ulang server.", 503);
  }

  const url = new URL("search/movie", `${apiBaseUrl}/`);
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(getPage(searchParams.get("page"))));
  url.searchParams.set("language", getLanguage(searchParams.get("language")));
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("api_key", apiKey);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return jsonError("Pencarian film sedang tidak tersedia. Coba lagi sebentar.", 502);
    }

    const payload = (await response.json()) as TmdbApiResponse;
    const body: TmdbSearchResponse = {
      page: typeof payload.page === "number" ? payload.page : 1,
      results: (payload.results ?? []).map(toMovie).filter((movie): movie is TmdbMovie => movie !== null),
      total_pages: typeof payload.total_pages === "number" ? payload.total_pages : 1,
      total_results: typeof payload.total_results === "number" ? payload.total_results : 0,
    };

    return Response.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return jsonError("Pencarian film terlalu lama. Periksa koneksi lalu coba lagi.", 504);
    }

    return jsonError("Pencarian film sedang tidak tersedia. Coba lagi sebentar.", 502);
  } finally {
    clearTimeout(timeout);
  }
}
