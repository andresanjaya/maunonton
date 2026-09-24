import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FilmIcon } from "@/components/ui/icons";

type EmptyStateProps = { title: string; description: string; actionLabel?: string; actionHref?: string; icon?: ReactNode };

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return <div className="card flex min-h-72 flex-col items-center justify-center p-8 text-center"><span className="mb-5 flex size-14 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-raised)] text-[var(--color-accent-strong)]">{icon ?? <FilmIcon className="size-6"/>}</span><h2 className="font-serif text-2xl tracking-tight">{title}</h2><p className="mt-2 max-w-xs text-sm leading-6 text-secondary">{description}</p>{actionLabel && actionHref && <Button href={actionHref} className="mt-6">{actionLabel}</Button>}</div>;
}
