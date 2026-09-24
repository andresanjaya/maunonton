export type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string | null;
  release_date: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  original_language: string | null;
};

export type TmdbSearchResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};
