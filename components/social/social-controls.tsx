"use client";

import { useState } from "react";

import { blockUser, toggleFollow, toggleLike } from "@/app/social/actions";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { HeartIcon } from "@/components/ui/icons";

type SocialControlsProps = { journalId: string; authorId: string; isOwner: boolean; initialLiked: boolean; initialLikeCount: number; initialFollowing: boolean; initialFollowerCount: number };

export function SocialControls({ journalId, authorId, isOwner, initialLiked, initialLikeCount, initialFollowing, initialFollowerCount }: SocialControlsProps) {
  const [liked, setLiked] = useState(initialLiked); const [likeCount, setLikeCount] = useState(initialLikeCount); const [following, setFollowing] = useState(initialFollowing); const [followerCount, setFollowerCount] = useState(initialFollowerCount); const [pending, setPending] = useState<"like" | "follow" | "block" | null>(null); const [message, setMessage] = useState("");
  async function like() { if (pending) return; const next = !liked; const previous = { liked, likeCount }; setLiked(next); setLikeCount((value) => Math.max(0, value + (next ? 1 : -1))); setPending("like"); const result = await toggleLike(journalId, authorId, next); setPending(null); if (result.error) { setLiked(previous.liked); setLikeCount(previous.likeCount); setMessage(result.error); } else if (typeof result.count === "number") setLikeCount(result.count); }
  async function follow() { if (pending) return; const next = !following; const previous = { following, followerCount }; setFollowing(next); setFollowerCount((value) => Math.max(0, value + (next ? 1 : -1))); setPending("follow"); const result = await toggleFollow(authorId, next); setPending(null); if (result.error) { setFollowing(previous.following); setFollowerCount(previous.followerCount); setMessage(result.error); } else if (typeof result.count === "number") setFollowerCount(result.count); }
  async function block() { if (!window.confirm("Blokir pengguna ini? Kamu tidak akan melihat atau dapat berinteraksi dengan jurnal mereka.")) return; setPending("block"); const result = await blockUser(authorId); setPending(null); if (result.error) setMessage(result.error); else setMessage("Pengguna diblokir."); }
  return <div className="space-y-3"><div className="flex flex-wrap gap-2"><Button variant={liked ? "primary" : "secondary"} size="sm" disabled={pending === "like"} onClick={like}><HeartIcon className="size-4" />{liked ? "Disukai" : "Suka"} · {likeCount}</Button>{!isOwner && <><Button variant={following ? "primary" : "secondary"} size="sm" disabled={pending === "follow"} onClick={follow}>{following ? "Mengikuti" : "Ikuti"} · {followerCount}</Button><Button variant="ghost" size="sm" disabled={pending === "block"} onClick={block}>Blokir</Button></>}</div>{message && <Feedback tone="info" title={message} />}</div>;
}
