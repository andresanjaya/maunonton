import Link from "next/link";

type AppHeaderProps = { title?: string; eyebrow?: string; compact?: boolean };

export function AppHeader({ title, eyebrow, compact = false }: AppHeaderProps) {
  return <header className="border-b border-[var(--color-border)] bg-[var(--color-canvas)] pt-[env(safe-area-inset-top)]"><div className={`mx-auto flex max-w-[40rem] items-center px-5 ${compact ? "min-h-14" : "min-h-16"}`}><div>{eyebrow && <p className="text-xs text-muted">{eyebrow}</p>}{title ? <p className="text-lg font-semibold tracking-tight">{title}</p> : <Link href="/" className="focus-ring text-xl font-bold tracking-tight">mau<span className="text-[var(--color-accent-strong)]">nonton</span></Link>}</div></div></header>;
}
