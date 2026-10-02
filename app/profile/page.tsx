import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { JournalFeed } from "@/components/journal/journal-feed";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { getProfileSetupStatus, requireUser } from "@/src/lib/auth/session";
import { getJournalFeed } from "@/src/lib/journals/feed";
import { createClient } from "@/src/lib/supabase/server";

export const metadata = { title: "Profil" };

async function loadProfileData(userId: string) {
  try {
    const supabase = await createClient();
    const [feed, followers, following] = await Promise.all([
      getJournalFeed("profile"),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
      supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
    ]);
    return { feed, followerCount: followers.count ?? 0, followingCount: following.count ?? 0 };
  } catch {
    return null;
  }
}

export default async function ProfilePage() {
  const user = await requireUser();
  const { profile } = await getProfileSetupStatus(user.id);
  if (!profile?.username) redirect("/onboarding/profile");

  const initials = profile.display_name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const data = await loadProfileData(user.id);

  return <>
    <AppHeader compact />
    <PageContainer className="space-y-8">
      <section>
        <div className="flex items-start gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-xl font-semibold">{initials}</div>
          <div className="min-w-0 flex-1 pt-1"><h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight">{profile.display_name}</h1><p className="mt-0.5 text-sm text-muted">@{profile.username}</p><Button href="/settings" variant="secondary" size="sm" className="mt-3">Pengaturan</Button></div>
        </div>
        <dl className="mt-6 grid grid-cols-3 border-y border-[var(--color-border)] py-4 text-center">
          <div className="flex flex-col"><dt className="order-2 mt-1 text-xs text-muted">Jurnal</dt><dd className="order-1 text-lg font-semibold">{data?.feed.journals.length ?? 0}</dd></div>
          <div className="flex flex-col"><dt className="order-2 mt-1 text-xs text-muted">Mengikuti</dt><dd className="order-1 text-lg font-semibold">{data?.followingCount ?? 0}</dd></div>
          <div className="flex flex-col"><dt className="order-2 mt-1 text-xs text-muted">Pengikut</dt><dd className="order-1 text-lg font-semibold">{data?.followerCount ?? 0}</dd></div>
        </dl>
        <form action={signOut}><Button variant="ghost" size="sm" className="mt-3 px-0">Keluar</Button></form>
      </section>
      <section aria-labelledby="my-journal-heading">
        <h2 id="my-journal-heading" className="section-title">Jurnalku</h2>
        <div className="mt-4">{!data ? <ErrorState /> : data.feed.journals.length ? <JournalFeed kind="profile" initialJournals={data.feed.journals} initialCursor={data.feed.nextCursor} /> : <EmptyState title="Belum ada jurnal" description="Pilih film dan simpan kesan pertamamu di sini." actionLabel="Tulis jurnal" actionHref="/create" />}</div>
      </section>
    </PageContainer>
  </>;
}
