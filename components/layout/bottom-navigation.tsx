"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import { HomeIcon, PlusIcon, SearchIcon, UserIcon } from "@/components/ui/icons";

type NavigationItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  primary?: boolean;
};

const items: NavigationItem[] = [
  { href: "/", label: "Beranda", icon: HomeIcon },
  { href: "/explore", label: "Jelajah", icon: SearchIcon },
  { href: "/create", label: "Buat", icon: PlusIcon, primary: true },
  { href: "/profile", label: "Profil", icon: UserIcon },
];

export function BottomNavigation() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname.startsWith("/register") || pathname.startsWith("/forgot-password") || pathname.startsWith("/reset-password") || pathname.startsWith("/onboarding") || pathname.startsWith("/auth/")) return null;
  return <nav aria-label="Navigasi utama" className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[rgba(18,18,17,.96)] pb-[max(.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg"><div className="mx-auto grid h-[4.75rem] max-w-md grid-cols-4 items-center px-2">{items.map(({ href, label, icon: Icon, primary }) => { const active = pathname === href; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`focus-ring relative mx-auto flex min-h-14 min-w-16 flex-col items-center justify-center gap-1 rounded-2xl text-[0.65rem] font-medium transition-colors ${active ? "text-[var(--color-ink)]" : "text-[var(--color-ink-muted)]"}`}><span className={primary ? "-mt-5 flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-[#1b1513] shadow-[0_8px_24px_rgba(242,127,98,.25)]" : ""}><Icon className={primary ? "size-6" : "size-5"}/></span><span className={primary ? "-mt-0.5" : ""}>{label}</span>{active && !primary && <span className="absolute bottom-0 size-1 rounded-full bg-[var(--color-accent)]"/>}</Link>; })}</div></nav>;
}
