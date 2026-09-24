"use client";

import type { JournalDraftInput } from "@/app/create/actions";
import type { JournalFilmSelection } from "@/src/types/journal";

const DATABASE_NAME = "maunonton-journal-drafts";
const STORE_NAME = "drafts";

export type DraftImage = {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  storagePath?: string;
};

export type JournalDraft = Omit<JournalDraftInput, "filmId"> & {
  selectedFilm: JournalFilmSelection | null;
  images: DraftImage[];
};

type StoredImage = Omit<DraftImage, "previewUrl">;
type StoredDraft = Omit<JournalDraft, "images"> & { images: StoredImage[] };

function openDatabase() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
  });
}

export async function readJournalDraft(key: string): Promise<JournalDraft | null> {
  const database = await openDatabase();
  const stored = await new Promise<StoredDraft | undefined>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result as StoredDraft | undefined);
  });
  database.close();

  if (!stored) return null;
  return { ...stored, images: stored.images.map((image) => ({ ...image, previewUrl: URL.createObjectURL(image.file) })) };
}

export async function writeJournalDraft(key: string, draft: JournalDraft) {
  const database = await openDatabase();
  const stored: StoredDraft = {
    ...draft,
    images: draft.images.map((image) => ({
      id: image.id,
      file: image.file,
      width: image.width,
      height: image.height,
      storagePath: image.storagePath,
    })),
  };
  await new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).put(stored, key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
  database.close();
}

export async function deleteJournalDraft(key: string) {
  const database = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const request = database.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(key);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
  database.close();
}
