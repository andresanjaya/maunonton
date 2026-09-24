import { JournalComposer } from "@/components/journal/journal-composer";
import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { requireUser } from "@/src/lib/auth/session";

export const metadata = { title: "Jurnal baru" };

export default async function CreatePage() {
  const user = await requireUser();
  const defaultWatchedOn = new Date().toISOString().slice(0, 10);
  return <><AppHeader title="Jurnal baru" eyebrow="Simpan momennya" compact /><PageContainer><JournalComposer userId={user.id} defaultWatchedOn={defaultWatchedOn} /></PageContainer></>;
}
