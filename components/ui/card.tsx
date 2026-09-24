import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLElement> & { interactive?: boolean };

export function Card({ className = "", interactive = false, ...props }: CardProps) {
  return <article className={`card ${interactive ? "card-interactive" : ""} ${className}`} {...props}/>;
}
