"use client";

import { useState } from "react";

import { JournalFeedCard } from "@/components/journal/journal-feed-card";
import { Button } from "@/components/ui/button";
import { Feedback } from "@/components/ui/feedback";
import { JournalCardSkeleton } from "@/components/ui/skeleton";
import type { FeedCursor, FeedJournal, FeedKind } from "@/src/lib/journals/feed";

type JournalFeedProps = { kind: FeedKind; initialJournals: FeedJournal[]; initialCursor: FeedCursor | null };

export function JournalFeed({ kind, initialJournals, initialCursor }: JournalFeedProps) {
  const [journals, setJournals] = useState(initialJournals);
  const [cursor, setCursor] = useState(initialCursor);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadMore() {
    if (!cursor || loading) return;
    setLoading(true); setError("");
    try {
      const params = new URLSearchParams({ kind, cursorCreatedAt: cursor.createdAt, cursorId: cursor.id });
      const response = await fetch(`/api/journals/feed?${params}`, { cache: "no-store" });
      const payload = await response.json() as { journals?: FeedJournal[]; nextCursor?: FeedCursor | null; error?: string };
      if (!response.ok || !payload.journals) throw new Error(payload.error);
      setJournals((current) => [...current, ...payload.journals!]);
      setCursor(payload.nextCursor ?? null);
    } catch (cause) {
      setError(cause instanceof Error && cause.message ? cause.message : "Feed belum dapat dimuat.");
    } finally { setLoading(false); }
  }

  return <div className="space-y-5">{journals.map((journal) => <JournalFeedCard key={journal.id} journal={journal} />)}{error && <Feedback tone="error" title="Tidak dapat memuat jurnal berikutnya" description={error} />}{loading && <><JournalCardSkeleton /><JournalCardSkeleton /></>}{cursor && <Button variant="secondary" className="w-full" onClick={loadMore} disabled={loading}>{loading ? "Memuat…" : "Muat lebih banyak"}</Button>}</div>;
}
