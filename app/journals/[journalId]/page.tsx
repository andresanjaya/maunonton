import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { JournalActions } from "@/components/journal/journal-actions";
import { JournalDetailContent } from "@/components/journal/journal-detail-content";
import { CommentThread } from "@/components/social/comment-thread";
import { SocialControls } from "@/components/social/social-controls";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { getCurrentUser } from "@/src/lib/auth/session";
import { getTmdbImageUrl } from "@/src/lib/tmdb/images";
import { createClient } from "@/src/lib/supabase/server";

export async function generateMetadata({ params }: PageProps<"/journals/[journalId]">): Promise<Metadata> {
  const { journalId } = await params;
  const supabase = await createClient();
  const { data: journal } = await supabase
    .from("journals")
    .select("film_id, reaction, created_at")
    .eq("id", journalId)
    .eq("visibility", "public")
    .eq("moderation_status", "active")
    .maybeSingle();

  if (!journal) return { title: "Jurnal tidak tersedia", robots: { index: false, follow: false } };

  const { data: film } = await supabase.from("films").select("title, poster_path").eq("id", journal.film_id).maybeSingle();
  if (!film) return { title: "Jurnal tidak tersedia", robots: { index: false, follow: false } };

  const description = journal.reaction.replace(/\s+/g, " ").trim().slice(0, 160);
  const image = getTmdbImageUrl(film.poster_path, "w780");
  return {
    title: `${film.title} — jurnal film`,
    description,
    openGraph: { type: "article", title: `${film.title} — jurnal film`, description, publishedTime: journal.created_at, images: image ? [{ url: image, alt: `Poster ${film.title}` }] : undefined },
    twitter: { card: image ? "summary_large_image" : "summary" },
  };
}
const formatWatchedDate = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(new Date(`${value}T00:00:00`));

export default async function JournalDetailPage({ params }: PageProps<"/journals/[journalId]">) {
  const { journalId } = await params;
  const [supabase, currentUser] = await Promise.all([createClient(), getCurrentUser()]);
  const { data: journal } = await supabase.from("journals").select("id, author_id, film_id, watched_on, mood, rating, reaction, body, visibility, is_spoiler").eq("id", journalId).maybeSingle();
  if (!journal) notFound();
  const [{ data: film }, { data: author }, { data: imageRows }, { count: likeCount }, { count: followerCount }, { data: comments }] = await Promise.all([
    supabase.from("films").select("title, original_title, poster_path").eq("id", journal.film_id).maybeSingle(),
    supabase.from("profiles").select("display_name, username").eq("id", journal.author_id).maybeSingle(),
    supabase.from("journal_images").select("id, storage_path").eq("journal_id", journal.id).order("sort_order"),
    supabase.from("journal_likes").select("*", { count: "exact", head: true }).eq("journal_id", journal.id),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", journal.author_id),
    supabase.from("comments").select("id, author_id, body, created_at").eq("journal_id", journal.id).eq("moderation_status", "active").order("created_at").limit(50),
  ]);
  if (!film || !author) notFound();
  const isOwner = currentUser?.id === journal.author_id;
  const [{ data: existingLike }, { data: existingFollow }, { data: commentProfiles }] = await Promise.all([
    currentUser ? supabase.from("journal_likes").select("journal_id").eq("journal_id", journal.id).eq("user_id", currentUser.id).maybeSingle() : Promise.resolve({ data: null }),
    currentUser && !isOwner ? supabase.from("follows").select("following_id").eq("follower_id", currentUser.id).eq("following_id", journal.author_id).maybeSingle() : Promise.resolve({ data: null }),
    comments?.length ? supabase.from("profiles").select("id, display_name, username").in("id", comments.map((comment) => comment.author_id)) : Promise.resolve({ data: [] }),
  ]);
  const signed = await Promise.all((imageRows ?? []).map(async (image) => { const { data } = await supabase.storage.from("journal-images").createSignedUrl(image.storage_path, 60 * 60); return data?.signedUrl ? { id: image.id, signedUrl: data.signedUrl } : null; }));
  const images = signed.filter((image): image is NonNullable<typeof image> => image !== null);
  const commentItems = (comments ?? []).map((comment) => { const profile = commentProfiles?.find((candidate) => candidate.id === comment.author_id); return { id: comment.id, body: comment.body, authorId: comment.author_id, authorName: profile?.display_name ?? "Member", username: profile?.username ?? "member", createdAt: comment.created_at }; });
  const posterUrl = getTmdbImageUrl(film.poster_path, "w500");
  const initials = author.display_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  return <><AppHeader title="Jurnal" eyebrow={journal.visibility === "private" ? "Hanya untukmu" : "Jurnal publik"} compact /><PageContainer className="space-y-5"><article className="card overflow-hidden"><div className="flex gap-4 p-5">{posterUrl && <div className="relative h-36 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--color-border)]"><Image src={posterUrl} alt={`Poster ${film.title}`} fill sizes="96px" className="object-cover" /></div>}<div className="min-w-0"><p className="eyebrow">{formatWatchedDate(journal.watched_on)}</p><h1 className="mt-2 font-serif text-3xl leading-tight tracking-tight">{film.title}</h1>{film.original_title !== film.title && <p className="mt-1 text-sm text-secondary">{film.original_title}</p>}<div className="mt-4 flex flex-wrap gap-2 text-xs"><span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 font-semibold text-[var(--color-accent-strong)]">{journal.mood}</span>{journal.rating && <span className="rounded-full bg-[var(--color-surface-raised)] px-3 py-1 text-secondary">â˜… {journal.rating.toFixed(1)}</span>}{journal.is_spoiler && <span className="rounded-full bg-[var(--color-surface-raised)] px-3 py-1 text-secondary">Spoiler</span>}</div></div></div><div className="flex items-center gap-3 border-t border-[var(--color-border)] p-4"><span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-xs font-bold text-[var(--color-accent-strong)]">{initials}</span><div><p className="text-sm font-semibold">{author.display_name}</p><p className="text-xs text-muted">@{author.username ?? "member"}</p></div></div><JournalDetailContent reaction={journal.reaction} body={journal.body} isSpoiler={journal.is_spoiler} images={images} /></article><SocialControls journalId={journal.id} authorId={journal.author_id} isOwner={isOwner} initialLiked={Boolean(existingLike)} initialLikeCount={likeCount ?? 0} initialFollowing={Boolean(existingFollow)} initialFollowerCount={followerCount ?? 0} /><CommentThread journalId={journal.id} journalAuthorId={journal.author_id} viewerId={currentUser?.id ?? null} initialComments={commentItems} initialCount={commentItems.length} /><JournalActions journalId={journal.id} isOwner={isOwner} /></PageContainer></>;
}

