import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export function HomeIcon(props: IconProps) { return <IconBase {...props}><path d="m3 10 9-7 9 7v10H5a2 2 0 0 1-2-2z"/><path d="M9 20v-6h6v6"/></IconBase>; }
export function SearchIcon(props: IconProps) { return <IconBase {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></IconBase>; }
export function PlusIcon(props: IconProps) { return <IconBase {...props}><path d="M12 5v14M5 12h14"/></IconBase>; }
export function UserIcon(props: IconProps) { return <IconBase {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></IconBase>; }
export function HeartIcon(props: IconProps) { return <IconBase {...props}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></IconBase>; }
export function MessageIcon(props: IconProps) { return <IconBase {...props}><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></IconBase>; }
export function BellIcon(props: IconProps) { return <IconBase {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></IconBase>; }
export function CameraIcon(props: IconProps) { return <IconBase {...props}><path d="M14.5 5 13 3h-2L9.5 5H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3z"/><circle cx="12" cy="13" r="4"/></IconBase>; }
export function FilmIcon(props: IconProps) { return <IconBase {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M17 8h4M3 16h4M17 16h4"/></IconBase>; }
export function AlertIcon(props: IconProps) { return <IconBase {...props}><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></IconBase>; }
export function CheckIcon(props: IconProps) { return <IconBase {...props}><path d="m5 12 4 4L19 6"/></IconBase>; }
