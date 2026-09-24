import Link from "next/link";

import { signOut } from "@/app/auth/actions";
import { AccountDeletionCard } from "@/components/auth/account-deletion-card";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/src/lib/auth/session";
import { createClient } from "@/src/lib/supabase/server";
import { BlockedUsersCard } from "@/components/social/blocked-users-card";

export const metadata = { title: "Pengaturan" };

export default async function SettingsPage() {
  const user = await requireUser();
  const supabase = await createClient(); const { data: blocks } = await supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id); const { data: profiles } = blocks?.length ? await supabase.from("profiles").select("id, display_name, username").in("id", blocks.map((block) => block.blocked_id)) : { data: [] };
  return <><AppHeader title="Pengaturan" eyebrow="Akun & privasi" compact/><PageContainer className="space-y-6"><section className="card p-5"><p className="eyebrow">Akun</p><h1 className="mt-2 font-serif text-2xl tracking-tight">{user.email}</h1><p className="mt-2 text-sm text-secondary">Sesi ini divalidasi di server.</p><form action={signOut}><Button variant="secondary" className="mt-5">Keluar</Button></form></section><BlockedUsersCard users={(profiles ?? []).map((profile) => ({ id: profile.id, name: profile.display_name, username: profile.username ?? "member" }))} /><section className="card p-5"><p className="eyebrow">Bantuan & kebijakan</p><div className="mt-3 grid gap-3 text-sm font-semibold text-[var(--color-accent-strong)]"><Link href="/privacy">Kebijakan Privasi</Link><Link href="/terms">Ketentuan Penggunaan</Link><Link href="/community-guidelines">Pedoman Komunitas</Link><Link href="/support">Dukungan</Link><Link href="/about">Kredit & tentang</Link></div></section><AccountDeletionCard/></PageContainer></>;
}
