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
  return <nav aria-label="Navigasi utama" className="bottom-nav fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(.75rem,env(safe-area-inset-bottom))]"><div className="bottom-nav-inner mx-auto grid h-[4.5rem] max-w-[26rem] grid-cols-4 items-center rounded-[1.75rem] bg-[#191a19] px-2 shadow-[0_10px_30px_rgba(20,20,18,.16)]">{items.map(({ href, label, icon: Icon, primary }) => { const active = pathname === href; return <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`focus-ring mx-auto flex min-h-14 min-w-16 flex-col items-center justify-center gap-1 rounded-xl text-[.6875rem] font-medium transition-colors ${active ? "text-white" : "text-[#b7b9b4] hover:text-white"}`}><span className={primary ? `flex size-7 items-center justify-center rounded-lg ${active ? "bg-[var(--color-accent)] text-[#191a19]" : "bg-[#343633] text-[var(--color-accent)]"}` : ""}><Icon className={primary ? "size-4" : "size-5"}/></span><span>{label}</span></Link>; })}</div></nav>;
}
