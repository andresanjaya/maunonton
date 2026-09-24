import { AppHeader } from "@/components/layout/app-header";
import { PageContainer } from "@/components/layout/page-container";
import { EmptyState } from "@/components/ui/empty-state";

export default function NotFound() {
  return <><AppHeader title="Halaman tidak ditemukan" compact /><PageContainer className="pt-8"><EmptyState title="Cerita ini tidak ditemukan" description="Tautannya mungkin salah, jurnalnya tidak publik, atau sudah tidak tersedia." actionLabel="Kembali ke beranda" actionHref="/" /></PageContainer></>;
}
