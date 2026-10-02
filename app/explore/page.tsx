import { JournalFeed } from "@/components/journal/journal-feed";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { MovieSearch } from "@/components/movies/movie-search";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { getJournalFeed } from "@/src/lib/journals/feed";

export const metadata = { title: "Jelajah" };

async function loadExploreFeed() {
  try {
    return await getJournalFeed("explore");
  } catch {
    return null;
  }
}

export default async function ExplorePage() {
  const feed = await loadExploreFeed();

  return <>
    <AppHeader title="Jelajah" compact />
    <PageContainer className="space-y-8">
      <section aria-labelledby="film-heading">
        <h1 id="film-heading" className="display-title">Cari film</h1>
        <p className="mt-2 text-sm text-secondary">Temukan film dan cerita di sekitarnya.</p>
        <div className="mt-5"><MovieSearch /></div>
      </section>
      <section aria-labelledby="explore-feed-heading" className="border-t border-[var(--color-border)] pt-8">
        <h2 id="explore-feed-heading" className="section-title">Jurnal publik terbaru</h2>
        <div className="mt-4">
          {!feed ? <ErrorState /> : feed.journals.length ? <JournalFeed kind="explore" initialJournals={feed.journals} initialCursor={feed.nextCursor} /> : <EmptyState title="Belum ada jurnal publik" description="Coba lagi ketika komunitas mulai membagikan catatannya." />}
        </div>
      </section>
    </PageContainer>
  </>;
}
