import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageShellProps = { title: string; description: string; children: ReactNode };

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return <section className="relative flex min-h-dvh items-end overflow-hidden px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:items-center sm:justify-center"><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,18,17,.05),rgba(18,18,17,.82)_48%,#121211_82%),url('/mock/cinema-night.svg')] bg-cover bg-center"/><div className="relative z-10 mx-auto w-full max-w-sm rounded-[1.5rem] border border-[var(--color-border)] bg-[rgba(25,25,24,.96)] p-5 shadow-2xl sm:p-7"><Link href="/" className="focus-ring font-serif text-3xl tracking-[-.04em]">mau<span className="text-[var(--color-accent)]">nonton</span></Link><h1 className="mt-8 font-serif text-3xl tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-secondary">{description}</p>{children}</div></section>;
}
