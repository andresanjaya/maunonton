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
    <PageContainer className="space-y-7">
      <section className="card p-5">
        <div className="flex items-start gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[#874c6b] font-serif text-2xl text-white">{initials}</div>
          <div className="min-w-0 flex-1 pt-1"><h1 className="font-serif text-2xl tracking-tight">{profile.display_name}</h1><p className="mt-0.5 text-sm text-muted">@{profile.username}</p><Button href="/settings" variant="secondary" size="sm" className="mt-3">Pengaturan</Button></div>
        </div>
        <p className="mt-5 text-sm leading-6 text-secondary">Menonton pelan-pelan, mengingat lebih lama. Film dan momen kecil di sekitarnya.</p>
        <dl className="mt-5 grid grid-cols-3 border-t border-[var(--color-border)] pt-4 text-center">
          <div><dt className="text-xs text-muted">Jurnal</dt><dd className="mt-1 font-serif text-xl">{data?.feed.journals.length ?? 0}</dd></div>
          <div><dt className="text-xs text-muted">Mengikuti</dt><dd className="mt-1 font-serif text-xl">{data?.followingCount ?? 0}</dd></div>
          <div><dt className="text-xs text-muted">Pengikut</dt><dd className="mt-1 font-serif text-xl">{data?.followerCount ?? 0}</dd></div>
        </dl>
        <form action={signOut}><Button variant="ghost" size="sm" className="mt-5">Keluar</Button></form>
      </section>
      <section aria-labelledby="my-journal-heading">
        <p className="eyebrow">Arsip pribadi</p>
        <h2 id="my-journal-heading" className="section-title">Jurnalku</h2>
        <div className="mt-4">{!data ? <ErrorState /> : data.feed.journals.length ? <JournalFeed kind="profile" initialJournals={data.feed.journals} initialCursor={data.feed.nextCursor} /> : <EmptyState title="Belum ada jurnal" description="Pilih film dan simpan kesan pertamamu di sini." actionLabel="Tulis jurnal" actionHref="/create" />}</div>
      </section>
    </PageContainer>
  </>;
}
