"use server";

import { getCurrentUser } from "@/src/lib/auth/session";
import { createClient } from "@/src/lib/supabase/server";
import { JOURNAL_MOODS, type JournalMood, type JournalVisibility } from "@/src/types/journal";
import type { TmdbMovie } from "@/src/types/tmdb";

type FilmSelection = Pick<TmdbMovie, "id" | "title" | "original_title" | "overview" | "release_date" | "poster_path" | "backdrop_path" | "original_language">;

export type SelectFilmResult = { filmId?: string; error?: string };
export type CreateJournalResult = { journalId?: string; error?: string };

export type JournalImageInput = {
  storagePath: string;
  sortOrder: number;
  width: number;
  height: number;
};

export type JournalDraftInput = {
  journalId?: string;
  filmId: string | null;
  watchedOn: string;
  mood: JournalMood | "";
  reaction: string;
  rating: number | null;
  body: string;
  isSpoiler: boolean;
  visibility: JournalVisibility;
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_IMAGES = 5;

function isFilmSelection(value: FilmSelection) {
  return Number.isInteger(value.id)
    && value.id > 0
    && value.title.trim().length > 0
    && value.title.length <= 500
    && value.original_title.trim().length > 0
    && value.original_title.length <= 500
    && (value.overview === null || value.overview.length <= 10_000)
    && (value.release_date === null || isDate(value.release_date))
    && (value.poster_path === null || value.poster_path.startsWith("/"))
    && (value.backdrop_path === null || value.backdrop_path.startsWith("/"))
    && (value.original_language === null || /^[a-z]{2,3}$/i.test(value.original_language));
}

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`));
}

function validateJournalInput(input: JournalDraftInput) {
  if (!input.filmId || !UUID_PATTERN.test(input.filmId)) return "Pilih film sebelum menerbitkan jurnal.";
  if (!isDate(input.watchedOn)) return "Masukkan tanggal menonton yang valid.";
  if (!JOURNAL_MOODS.includes(input.mood as JournalMood)) return "Pilih mood untuk jurnalmu.";
  if (Array.from(input.reaction.trim()).length < 10) return "Reaksi perlu setidaknya 10 karakter.";
  if (input.rating !== null && (!Number.isFinite(input.rating) || input.rating < 0.5 || input.rating > 5 || input.rating * 2 !== Math.trunc(input.rating * 2))) return "Rating harus antara 0,5 dan 5 dalam kelipatan 0,5.";
  if (input.visibility !== "public" && input.visibility !== "private") return "Pilih visibilitas jurnal yang valid.";
  if (typeof input.isSpoiler !== "boolean") return "Status spoiler tidak valid.";
  return null;
}

function journalValues(input: JournalDraftInput, authorId: string, visibility: JournalVisibility) {
  return {
    author_id: authorId,
    film_id: input.filmId!,
    watched_on: input.watchedOn,
    mood: input.mood,
    reaction: input.reaction.trim(),
    rating: input.rating,
    body: input.body.trim() || null,
    is_spoiler: input.isSpoiler,
    visibility,
  };
}

export async function selectFilmForJournal(movie: FilmSelection): Promise<SelectFilmResult> {
  const user = await getCurrentUser();
  if (!user) return { error: "Masuk lagi untuk memilih film bagi jurnalmu." };
  if (!isFilmSelection(movie)) return { error: "Data film yang dipilih tidak valid." };

  const supabase = await createClient();
  const { data: existing, error: lookupError } = await supabase
    .from("films")
    .select("id")
    .eq("tmdb_id", movie.id)
    .maybeSingle();

  if (lookupError) return { error: "Film belum dapat disiapkan untuk jurnal. Coba lagi." };
  if (existing) return { filmId: existing.id };

  const { data: created, error: createError } = await supabase.from("films").insert({
    tmdb_id: movie.id,
    title: movie.title.trim(),
    original_title: movie.original_title.trim(),
    overview: movie.overview,
    release_date: movie.release_date,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    original_language: movie.original_language,
  }).select("id").single();

  if (!createError && created) return { filmId: created.id };

  // A concurrent selection may win the unique tmdb_id insert race.
  if (createError?.code === "23505") {
    const { data: concurrentFilm } = await supabase.from("films").select("id").eq("tmdb_id", movie.id).maybeSingle();
    if (concurrentFilm) return { filmId: concurrentFilm.id };
  }

  return { error: "Film belum dapat disiapkan untuk jurnal. Coba lagi." };
}

export async function createJournalDraft(input: JournalDraftInput): Promise<CreateJournalResult> {
  const validationError = validateJournalInput(input);
  if (validationError) return { error: validationError };

  const user = await getCurrentUser();
  if (!user) return { error: "Masuk lagi sebelum menerbitkan jurnal." };

  const supabase = await createClient();
  const journalId = input.journalId && UUID_PATTERN.test(input.journalId) ? input.journalId : crypto.randomUUID();

  const { data: film, error: filmError } = await supabase.from("films").select("id").eq("id", input.filmId!).maybeSingle();
  if (filmError || !film) return { error: "Film pilihan tidak ditemukan. Pilih ulang filmnya." };

  const values = journalValues(input, user.id, "private");
  const { data: existing, error: existingError } = await supabase.from("journals").select("id, author_id, visibility").eq("id", journalId).maybeSingle();
  if (existingError) return { error: "Jurnal belum dapat disiapkan. Coba lagi." };

  if (existing) {
    if (existing.author_id !== user.id) return { error: "Jurnal ini tidak dapat diterbitkan dari akunmu." };
    if (existing.visibility !== "private") return { error: "Jurnal yang sudah diterbitkan tidak dapat dipakai sebagai draf baru." };
    const { error } = await supabase.from("journals").update(values).eq("id", journalId).eq("author_id", user.id);
    return error ? { error: "Jurnal belum dapat diperbarui. Coba lagi." } : { journalId };
  }

  const { error } = await supabase.from("journals").insert({ id: journalId, ...values });
  if (error?.code === "23505") {
    const { data: duplicate } = await supabase.from("journals").select("id, author_id").eq("id", journalId).maybeSingle();
    if (duplicate?.author_id === user.id) {
      const { error: updateError } = await supabase.from("journals").update(values).eq("id", journalId).eq("author_id", user.id);
      return updateError ? { error: "Jurnal belum dapat diperbarui. Coba lagi." } : { journalId };
    }
  }
  return error ? { error: "Jurnal belum dapat disiapkan. Coba lagi." } : { journalId };
}

function validateImages(journalId: string, userId: string, images: JournalImageInput[]) {
  if (images.length > MAX_IMAGES) return "Maksimal lima foto dapat ditambahkan.";
  const paths = new Set<string>();
  for (const [index, image] of images.entries()) {
    if (!image.storagePath.startsWith(`${userId}/${journalId}/`) || paths.has(image.storagePath)) return "Salah satu foto tidak valid untuk jurnal ini.";
    if (image.sortOrder !== index || !Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width < 1 || image.height < 1) return "Data foto tidak valid.";
    paths.add(image.storagePath);
  }
  return null;
}

export async function publishJournal(input: JournalDraftInput, images: JournalImageInput[]): Promise<CreateJournalResult> {
  const validationError = validateJournalInput(input);
  if (validationError) return { error: validationError };
  if (!input.journalId || !UUID_PATTERN.test(input.journalId)) return { error: "Jurnal belum siap untuk diterbitkan." };

  const user = await getCurrentUser();
  if (!user) return { error: "Masuk lagi sebelum menerbitkan jurnal." };
  const imageValidationError = validateImages(input.journalId, user.id, images);
  if (imageValidationError) return { error: imageValidationError };

  const supabase = await createClient();
  const { data: journal, error: journalError } = await supabase.from("journals").select("id, author_id").eq("id", input.journalId).maybeSingle();
  if (journalError || !journal || journal.author_id !== user.id) return { error: "Draf jurnal tidak ditemukan. Coba kirim ulang." };

  const { error: clearImagesError } = await supabase.from("journal_images").delete().eq("journal_id", input.journalId);
  if (clearImagesError) return { error: "Foto jurnal belum dapat disiapkan. Coba lagi." };

  if (images.length) {
    const { error: imageError } = await supabase.from("journal_images").insert(images.map((image) => ({
      journal_id: input.journalId!,
      storage_path: image.storagePath,
      sort_order: image.sortOrder,
      width: image.width,
      height: image.height,
    })));
    if (imageError) return { error: "Foto jurnal belum dapat disimpan. Jurnal tetap privat agar aman." };
  }

  const { error: publishError } = await supabase.from("journals").update(journalValues(input, user.id, input.visibility)).eq("id", input.journalId).eq("author_id", user.id);
  if (publishError) return { error: "Jurnal belum dapat diterbitkan. Draf dan foto tetap tersimpan secara privat." };

  return { journalId: input.journalId };
}
