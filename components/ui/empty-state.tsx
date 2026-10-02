import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FilmIcon } from "@/components/ui/icons";

type EmptyStateProps = { title: string; description: string; actionLabel?: string; actionHref?: string; icon?: ReactNode };

export function EmptyState({ title, description, actionLabel, actionHref, icon }: EmptyStateProps) {
  return <div className="flex min-h-56 flex-col items-center justify-center py-8 text-center"><span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-white text-[var(--color-accent-strong)]">{icon ?? <FilmIcon className="size-5"/>}</span><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 max-w-xs text-sm leading-6 text-secondary">{description}</p>{actionLabel && actionHref && <Button href={actionHref} className="mt-5">{actionLabel}</Button>}</div>;
}
