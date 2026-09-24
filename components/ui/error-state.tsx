import { Button } from "@/components/ui/button";
import { AlertIcon } from "@/components/ui/icons";

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return <div role="alert" className="card flex min-h-72 flex-col items-center justify-center p-8 text-center"><span className="mb-5 flex size-14 items-center justify-center rounded-full bg-[rgba(239,130,123,.1)] text-[var(--color-danger)]"><AlertIcon className="size-6"/></span><h2 className="font-serif text-2xl tracking-tight">Feed belum siap</h2><p className="mt-2 max-w-xs text-sm leading-6 text-secondary">Terapkan migrasi Supabase terlebih dahulu, lalu muat ulang halaman ini. Setelah itu jurnal publik akan muncul di sini.</p><Button variant="secondary" className="mt-6" onClick={onRetry}>Muat ulang</Button></div>;
}
