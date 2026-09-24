"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { createJournalDraft, publishJournal, type JournalDraftInput, type JournalImageInput } from "@/app/create/actions";
import { MovieSearch } from "@/components/movies/movie-search";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { CameraIcon } from "@/components/ui/icons";
import { Input, Textarea } from "@/components/ui/input";
import { createClient } from "@/src/lib/supabase/client";
import { deleteJournalDraft, readJournalDraft, type DraftImage, type JournalDraft, writeJournalDraft } from "@/src/lib/journal-draft";
import { JOURNAL_MOODS, type JournalVisibility } from "@/src/types/journal";

const BUCKET = "journal-images";
const MAX_IMAGES = 5;
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/heic", "image/heif"]);

type JournalComposerProps = { userId: string; defaultWatchedOn: string };
type UploadProgress = { completed: number; total: number } | null;

function createEmptyDraft(defaultWatchedOn: string): JournalDraft {
  return {
    journalId: undefined,
    selectedFilm: null,
    watchedOn: defaultWatchedOn,
    mood: "",
    reaction: "",
    rating: null,
    body: "",
    isSpoiler: false,
    visibility: "private",
    images: [],
  };
}

function toServerInput(draft: JournalDraft): JournalDraftInput {
  return {
    journalId: draft.journalId,
    filmId: draft.selectedFilm?.filmId ?? null,
    watchedOn: draft.watchedOn,
    mood: draft.mood,
    reaction: draft.reaction,
    rating: draft.rating,
    body: draft.body,
    isSpoiler: draft.isSpoiler,
    visibility: draft.visibility,
  };
}

function safeFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "") || "photo";
}

async function compressImage(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/heic" || file.type === "image/heif" || typeof createImageBitmap !== "function") return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 2048;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 1_500_000) {
      bitmap.close();
      return file;
    }
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const type = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, type === "image/jpeg" ? 0.82 : undefined));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name, { type, lastModified: file.lastModified });
  } catch {
    return file;
  }
}

async function imageDimensions(file: File) {
  try {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  } catch {
    return { width: 1, height: 1 };
  }
}

export function JournalComposer({ userId, defaultWatchedOn }: JournalComposerProps) {
  const router = useRouter();
  const draftKey = `journal-draft:${userId}`;
  const [draft, setDraft] = useState<JournalDraft>(() => createEmptyDraft(defaultWatchedOn));
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>(null);
  const [feedback, setFeedback] = useState<{ tone: "error" | "success"; title: string; description?: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef<DraftImage[]>([]);
  const submissionRef = useRef(false);

  useEffect(() => {
    let active = true;
    readJournalDraft(draftKey).then((stored) => {
      if (active && stored) setDraft(stored);
    }).catch(() => {
      if (active) setFeedback({ tone: "error", title: "Draf lokal tidak dapat dipulihkan", description: "Kamu masih dapat melanjutkan dengan draf baru." });
    }).finally(() => { if (active) setIsHydrated(true); });
    return () => { active = false; };
  }, [draftKey]);

  useEffect(() => {
    if (!isHydrated) return;
    const timer = window.setTimeout(() => {
      writeJournalDraft(draftKey, draft).catch(() => setFeedback({ tone: "error", title: "Draf belum tersimpan di perangkat", description: "Jangan tutup halaman sebelum mencoba lagi." }));
    }, 250);
    return () => window.clearTimeout(timer);
  }, [draft, draftKey, isHydrated]);

  useEffect(() => { imagesRef.current = draft.images; }, [draft.images]);
  useEffect(() => () => { imagesRef.current.forEach((image) => URL.revokeObjectURL(image.previewUrl)); }, []);

  function updateDraft<K extends keyof JournalDraft>(key: K, value: JournalDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function chooseImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    setFeedback(null);

    if (draft.images.length + files.length > MAX_IMAGES) {
      setFeedback({ tone: "error", title: "Maksimal lima foto", description: "Hapus foto lain sebelum menambahkan lagi." });
      return;
    }
    const invalid = files.find((file) => !ACCEPTED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE_BYTES);
    if (invalid) {
      setFeedback({ tone: "error", title: "Foto tidak dapat ditambahkan", description: "Gunakan JPEG, PNG, atau HEIC/HEIF hingga 5 MB per foto." });
      return;
    }

    const images = await Promise.all(files.map(async (file): Promise<DraftImage> => {
      const compressed = await compressImage(file);
      const dimensions = await imageDimensions(compressed);
      return { id: crypto.randomUUID(), file: compressed, previewUrl: URL.createObjectURL(compressed), ...dimensions };
    }));
    setDraft((current) => ({ ...current, images: [...current.images, ...images] }));
  }

  function removeImage(id: string) {
    setDraft((current) => {
      const removed = current.images.find((image) => image.id === id);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return { ...current, images: current.images.filter((image) => image.id !== id) };
    });
  }

  function moveImage(index: number, direction: -1 | 1) {
    setDraft((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.images.length) return current;
      const images = [...current.images];
      [images[index], images[destination]] = [images[destination], images[index]];
      return { ...current, images };
    });
  }

  function validateClientDraft() {
    if (!draft.selectedFilm) return "Pilih film untuk jurnalmu.";
    if (!draft.watchedOn) return "Pilih tanggal menonton.";
    if (!draft.mood) return "Pilih mood yang paling sesuai.";
    if (Array.from(draft.reaction.trim()).length < 10) return "Reaksi perlu setidaknya 10 karakter.";
    return null;
  }

  async function uploadImages(journalId: string) {
    const storage = createClient().storage.from(BUCKET);
    const images = [...draft.images];
    setUploadProgress({ completed: images.filter((image) => Boolean(image.storagePath)).length, total: images.length });

    for (const [index, image] of images.entries()) {
      if (!image.storagePath) {
        const storagePath = `${userId}/${journalId}/${image.id}-${safeFilename(image.file.name)}`;
        const { error } = await storage.upload(storagePath, image.file, {
          cacheControl: "31536000",
          contentType: image.file.type,
          upsert: false,
        });
        if (error) throw new Error(`Foto ${index + 1} gagal diunggah.`);
        images[index] = { ...image, storagePath };
        setDraft((current) => ({ ...current, images: current.images.map((currentImage) => currentImage.id === image.id ? { ...currentImage, storagePath } : currentImage) }));
      }
      setUploadProgress({ completed: index + 1, total: images.length });
    }
    return images;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || submissionRef.current) return;
    const validationError = validateClientDraft();
    if (validationError) {
      setFeedback({ tone: "error", title: "Lengkapi jurnalmu", description: validationError });
      return;
    }

    submissionRef.current = true;
    setIsSubmitting(true);
    setFeedback(null);
    const submissionDraft = { ...draft, journalId: draft.journalId ?? crypto.randomUUID() };
    setDraft(submissionDraft);
    const draftResult = await createJournalDraft(toServerInput(submissionDraft));
    if (draftResult.error || !draftResult.journalId) {
      setFeedback({ tone: "error", title: "Jurnal belum dapat disiapkan", description: draftResult.error });
      setIsSubmitting(false);
      submissionRef.current = false;
      return;
    }

    const journalId = draftResult.journalId;
    setDraft((current) => ({ ...current, journalId }));
    try {
      const uploadedImages = await uploadImages(journalId);
      const imageInputs: JournalImageInput[] = uploadedImages.map((image, sortOrder) => ({
        storagePath: image.storagePath!,
        sortOrder,
        width: image.width,
        height: image.height,
      }));
      const publishResult = await publishJournal({ ...toServerInput(submissionDraft), journalId }, imageInputs);
      if (publishResult.error || !publishResult.journalId) {
        setFeedback({ tone: "error", title: "Jurnal tetap privat", description: publishResult.error });
        setIsSubmitting(false);
        submissionRef.current = false;
        return;
      }

      await deleteJournalDraft(draftKey);
      uploadedImages.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      router.replace(`/journals/${publishResult.journalId}`);
    } catch (error) {
      setFeedback({ tone: "error", title: "Unggah foto terhenti", description: error instanceof Error ? `${error.message} Draf tetap tersimpan; coba terbitkan lagi.` : "Draf tetap tersimpan; coba terbitkan lagi." });
      setIsSubmitting(false);
      submissionRef.current = false;
    } finally {
      setUploadProgress(null);
    }
  }

  const reactionLength = Array.from(draft.reaction.trim()).length;
  return <form onSubmit={submit} className="space-y-6" noValidate><fieldset disabled={isSubmitting} className="space-y-6 disabled:opacity-70">
    <section className="card space-y-5 p-4 sm:p-5"><div><p className="eyebrow">01 · Film</p><h1 className="section-title">Apa yang kamu tonton?</h1><p className="mt-2 text-sm leading-6 text-secondary">Film disiapkan untuk jurnal ini hanya setelah kamu memilihnya.</p></div><MovieSearch selectionMode="journal" selectedFilm={draft.selectedFilm} onSelectedFilmChange={(selectedFilm) => updateDraft("selectedFilm", selectedFilm)} /></section>
    <section className="card space-y-5 p-4 sm:p-5"><div><p className="eyebrow">02 · Momen</p><h2 className="section-title">Bagaimana rasanya?</h2></div><Input label="Tanggal menonton" name="watched-on" type="date" value={draft.watchedOn} onChange={(event) => updateDraft("watchedOn", event.target.value)} required /><fieldset><legend className="field-label">Mood</legend><div className="flex flex-wrap gap-2">{JOURNAL_MOODS.map((mood) => <label key={mood} className="cursor-pointer"><input type="radio" name="mood" value={mood} checked={draft.mood === mood} onChange={() => updateDraft("mood", mood)} className="peer sr-only" /><span className="flex min-h-11 items-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-4 text-sm text-secondary transition peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent-soft)] peer-checked:text-[var(--color-accent-strong)]">{mood}</span></label>)}</div></fieldset><Textarea label="Reaksi" name="reaction" value={draft.reaction} onChange={(event) => updateDraft("reaction", event.target.value)} placeholder="Apa yang masih tertinggal setelah film selesai?" hint={`${reactionLength}/10 karakter minimum`} required /><div><label className="field-label" htmlFor="rating">Rating <span className="text-muted">(opsional)</span></label><select id="rating" value={draft.rating ?? ""} onChange={(event) => updateDraft("rating", event.target.value ? Number(event.target.value) : null)} className="field-input"><option value="">Tidak memberi rating</option>{Array.from({ length: 10 }, (_, index) => (index + 1) / 2).map((rating) => <option key={rating} value={rating}>{rating.toFixed(1)} / 5</option>)}</select></div><Textarea label="Catatan lebih panjang" name="body" value={draft.body} onChange={(event) => updateDraft("body", event.target.value)} placeholder="Simpan detail yang ingin kamu ingat nanti." hint="Opsional" /></section>
    <section className="card space-y-4 p-4 sm:p-5"><div><p className="eyebrow">03 · Foto momen</p><h2 className="section-title">Di luar layar</h2><p className="mt-2 text-sm leading-6 text-secondary">JPEG, PNG, atau HEIC/HEIF yang didukung browser. Maksimal lima foto, masing-masing hingga 5 MB.</p></div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif" multiple className="sr-only" onChange={chooseImages} /><Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={draft.images.length >= MAX_IMAGES}><CameraIcon className="size-5" />Tambah foto</Button>{draft.images.length > 0 && <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">{draft.images.map((image, index) => <li key={image.id} className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-raised)]"><div className="relative aspect-square bg-[var(--color-surface-soft)]"><Image src={image.previewUrl} alt={`Pratinjau foto ${index + 1}`} fill unoptimized className="object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} /><span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[0.65rem] font-semibold text-white">{index + 1}</span></div><div className="flex items-center justify-between gap-1 p-2"><Button type="button" variant="ghost" size="sm" aria-label={`Pindahkan foto ${index + 1} ke kiri`} disabled={index === 0} onClick={() => moveImage(index, -1)}>←</Button><Button type="button" variant="ghost" size="sm" aria-label={`Hapus foto ${index + 1}`} onClick={() => removeImage(image.id)}>Hapus</Button><Button type="button" variant="ghost" size="sm" aria-label={`Pindahkan foto ${index + 1} ke kanan`} disabled={index === draft.images.length - 1} onClick={() => moveImage(index, 1)}>→</Button></div></li>)}</ol>}</section>
    <section className="card space-y-4 p-4 sm:p-5"><p className="eyebrow">04 · Privasi</p><label className="flex min-h-12 items-center justify-between gap-4"><span><span className="block text-sm font-semibold">Mengandung spoiler</span><span className="mt-1 block text-xs text-secondary">Tandai agar pembaca dapat memilih untuk melihatnya.</span></span><input type="checkbox" checked={draft.isSpoiler} onChange={(event) => updateDraft("isSpoiler", event.target.checked)} className="size-5 accent-[var(--color-accent)]" /></label><fieldset><legend className="field-label">Visibilitas</legend><div className="grid grid-cols-2 gap-3">{(["public", "private"] as const).map((visibility) => <label key={visibility} className="cursor-pointer"><input type="radio" name="visibility" value={visibility} checked={draft.visibility === visibility} onChange={() => updateDraft("visibility", visibility as JournalVisibility)} className="peer sr-only" /><span className="flex min-h-14 flex-col justify-center rounded-xl border border-[var(--color-border-strong)] px-4 text-sm capitalize text-secondary peer-checked:border-[var(--color-accent)] peer-checked:bg-[var(--color-accent-soft)] peer-checked:text-[var(--color-accent-strong)]">{visibility === "public" ? "Publik" : "Privat"}<small className="mt-0.5 text-[0.65rem] normal-case text-muted">{visibility === "public" ? "Dapat dibaca orang lain" : "Hanya kamu"}</small></span></label>)}</div></fieldset></section>
  </fieldset>{feedback && <Feedback tone={feedback.tone} title={feedback.title} description={feedback.description} />}{uploadProgress && <Feedback tone="info" title="Mengunggah foto" description={`${uploadProgress.completed} dari ${uploadProgress.total} foto tersimpan dengan aman.`} />}<Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>{isSubmitting ? uploadProgress ? "Mengunggah foto…" : "Menyiapkan jurnal…" : "Terbitkan jurnal"}</Button><p className="text-center text-xs text-muted">Draf disimpan di perangkat ini sampai jurnal berhasil diterbitkan.</p></form>;
}
