import Link from "next/link";
import type { ReactNode } from "react";

type AuthPageShellProps = { title: string; description: string; children: ReactNode };

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return <section className="flex min-h-dvh items-center px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))]"><div className="mx-auto w-full max-w-sm"><Link href="/" className="focus-ring text-2xl font-bold tracking-tight">mau<span className="text-[var(--color-accent-strong)]">nonton</span></Link><p className="mt-2 text-sm text-secondary">Ingat filmnya. Simpan momennya. Ceritakan rasanya.</p><h1 className="mt-10 text-[1.75rem] font-semibold leading-tight tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-secondary">{description}</p>{children}</div></section>;
}
