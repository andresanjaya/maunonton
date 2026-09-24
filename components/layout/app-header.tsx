import Link from "next/link";
import { BellIcon } from "@/components/ui/icons";

type AppHeaderProps = { title?: string; eyebrow?: string; compact?: boolean };

export function AppHeader({ title, eyebrow, compact = false }: AppHeaderProps) {
  return <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[rgba(18,18,17,.92)] pt-[env(safe-area-inset-top)] backdrop-blur-md"><div className={`mx-auto flex max-w-[46rem] items-center justify-between px-4 ${compact ? "min-h-16" : "min-h-20"}`}><div>{eyebrow && <p className="text-[0.625rem] font-semibold uppercase tracking-[.13em] text-muted">{eyebrow}</p>}{title ? <p className="mt-0.5 font-serif text-xl tracking-tight">{title}</p> : <Link href="/" className="focus-ring font-serif text-2xl tracking-[-.04em]">mau<span className="text-[var(--color-accent)]">nonton</span></Link>}</div><button type="button" aria-label="Notifikasi" className="focus-ring relative flex size-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-secondary"><BellIcon className="size-5"/><span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[var(--color-accent)]"/></button></div></header>;
}
