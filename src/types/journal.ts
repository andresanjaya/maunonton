import type { TmdbMovie } from "@/src/types/tmdb";

export type Mood = "Tersentuh" | "Takjub" | "Tegang" | "Nyaman";

export type JournalEntry = {
  id: string;
  author: { name: string; username: string; initials: string };
  film: { title: string; year: number; poster: string };
  photo: string;
  watchedOn: string;
  mood: Mood;
  rating?: number;
  excerpt: string;
  likes: number;
  comments: number;
};

export type JournalFilmSelection = {
  filmId: string;
  movie: TmdbMovie;
};

export const JOURNAL_MOODS = [
  "Excited",
  "Moved",
  "Comforted",
  "Unsettled",
  "Amused",
  "Disappointed",
] as const;

export type JournalMood = (typeof JOURNAL_MOODS)[number];
export type JournalVisibility = "public" | "private";
