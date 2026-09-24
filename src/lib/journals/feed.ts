import { createClient } from "@/src/lib/supabase/server";

export type FeedKind = "home" | "explore" | "profile";
export type FeedCursor = { createdAt: string; id: string };
export type FeedJournal = {
  id: string;
  author: { id: string; username: string; displayName: string; avatarPath: string | null };
  film: { title: string; originalTitle: string; posterPath: string | null };
  watchedOn: string;
  mood: string;
  rating: number | null;
  reaction: string;
  isSpoiler: boolean;
  coverStoragePath: string | null;
  coverImageUrl: string | null;
  likeCount: number;
  commentCount: number;
  createdAt: string;
};

const PAGE_SIZE = 10;

export async function getJournalFeed(kind: FeedKind, cursor?: FeedCursor) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_journal_feed", {
    feed_kind: kind,
    cursor_created_at: cursor?.createdAt ?? null,
    cursor_id: cursor?.id ?? null,
    page_size: PAGE_SIZE + 1,
  });
  if (error) throw new Error("Unable to load journal feed");

  const page = (data ?? []).slice(0, PAGE_SIZE);
  const signedUrls = await Promise.all(page.map(async (journal) => {
    if (!journal.cover_storage_path) return null;
    const { data: signed } = await supabase.storage.from("journal-images").createSignedUrl(journal.cover_storage_path, 60 * 30);
    return signed?.signedUrl ?? null;
  }));

  const journals: FeedJournal[] = page.map((journal, index) => ({
    id: journal.id,
    author: { id: journal.author_id, username: journal.author_username ?? "member", displayName: journal.author_display_name, avatarPath: journal.author_avatar_path },
    film: { title: journal.film_title, originalTitle: journal.film_original_title, posterPath: journal.film_poster_path },
    watchedOn: journal.watched_on,
    mood: journal.mood,
    rating: journal.rating,
    reaction: journal.reaction,
    isSpoiler: journal.is_spoiler,
    coverStoragePath: journal.cover_storage_path,
    coverImageUrl: signedUrls[index],
    likeCount: Number(journal.like_count),
    commentCount: Number(journal.comment_count),
    createdAt: journal.created_at,
  }));
  const nextItem = (data ?? [])[PAGE_SIZE];
  return { journals, nextCursor: nextItem ? { createdAt: nextItem.created_at, id: nextItem.id } satisfies FeedCursor : null };
}
