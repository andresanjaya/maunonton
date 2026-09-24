import { JournalFeed } from "@/components/journal/journal-feed";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { getCurrentUser } from "@/src/lib/auth/session";
import { getJournalFeed } from "@/src/lib/journals/feed";

async function loadHomeFeed() {
  try {
    return await getJournalFeed("home");
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [user, feed] = await Promise.all([getCurrentUser(), loadHomeFeed()]);

  return <>
    <AppHeader eyebrow="Dari orang-orangmu" title="Beranda" />
    <PageContainer className="space-y-5">
      <section>
        <p className="eyebrow">Mengikuti</p>
        <h1 className="section-title">Jurnal terbaru</h1>
        <p className="mt-2 text-sm leading-6 text-secondary">Catatan publik dari orang-orang yang kamu ikuti.</p>
      </section>
      {!feed ? <ErrorState /> : feed.journals.length ? <JournalFeed kind="home" initialJournals={feed.journals} initialCursor={feed.nextCursor} /> : <EmptyState title={user ? "Belum ada jurnal dari orang-orangmu" : "Masuk untuk melihat feed"} description={user ? "Saat kamu mengikuti seseorang, jurnal publik mereka akan muncul di sini." : "Masuk untuk melihat jurnal dari akun yang kamu ikuti."} actionLabel={user ? "Jelajahi jurnal" : "Masuk"} actionHref={user ? "/explore" : "/login"} />}
    </PageContainer>
  </>;
}
