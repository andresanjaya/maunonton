const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function getTmdbImageUrl(
  path: string | null,
  size: "w342" | "w500" | "w780" = "w342",
) {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}
