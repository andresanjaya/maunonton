import { Button } from "@/components/ui/button";
import { AlertIcon } from "@/components/ui/icons";

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div role="alert" className="flex min-h-56 flex-col items-center justify-center py-8 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#f9e6e3] text-[var(--color-danger)]"><AlertIcon className="size-5"/></span><h2 className="text-lg font-semibold">Feed belum siap</h2><p className="mt-2 max-w-xs text-sm leading-6 text-secondary">Terapkan migrasi Supabase terlebih dahulu, lalu muat ulang halaman ini. Setelah itu jurnal publik akan muncul di sini.</p><Button variant="secondary" className="mt-5" onClick={onRetry}>Muat ulang</Button></div>;
}
