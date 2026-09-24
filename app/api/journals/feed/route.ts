import { getJournalFeed, type FeedKind, type FeedCursor } from "@/src/lib/journals/feed";

export const dynamic = "force-dynamic";

function isFeedKind(value: string | null): value is FeedKind {
  return value === "home" || value === "explore" || value === "profile";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");
  if (!isFeedKind(kind)) return Response.json({ error: "Jenis feed tidak valid." }, { status: 400 });

  const createdAt = searchParams.get("cursorCreatedAt");
  const id = searchParams.get("cursorId");
  const cursor: FeedCursor | undefined = createdAt && id ? { createdAt, id } : undefined;
  try {
    const page = await getJournalFeed(kind, cursor);
    return Response.json(page, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Feed belum dapat dimuat." }, { status: 500 });
  }
}
