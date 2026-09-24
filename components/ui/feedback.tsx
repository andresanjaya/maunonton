import { AlertIcon, CheckIcon } from "@/components/ui/icons";

type FeedbackProps = { title: string; description?: string; tone?: "info" | "success" | "error" };
const toneStyles = {
  info: "border-[rgba(242,127,98,.2)] bg-[rgba(242,127,98,.07)] text-[var(--color-accent-strong)]",
  success: "border-[rgba(131,185,153,.22)] bg-[rgba(131,185,153,.08)] text-[var(--color-success)]",
  error: "border-[rgba(239,130,123,.22)] bg-[rgba(239,130,123,.08)] text-[var(--color-danger)]",
};

export function Feedback({ title, description, tone = "info" }: FeedbackProps) {
  const Icon = tone === "success" ? CheckIcon : AlertIcon;
  return <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 rounded-2xl border p-4 ${toneStyles[tone]}`}><Icon className="mt-0.5 size-5 shrink-0"/><div><p className="text-sm font-semibold text-[var(--color-ink)]">{title}</p>{description && <p className="mt-1 text-xs leading-5 text-secondary">{description}</p>}</div></div>;
}

export function Toast({ title, description }: Omit<FeedbackProps, "tone">) {
  return <div role="status" aria-live="polite" className="flex w-full max-w-sm items-start gap-3 rounded-2xl border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] p-4 shadow-2xl"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]"><CheckIcon className="size-4"/></span><div><p className="text-sm font-semibold">{title}</p>{description && <p className="mt-1 text-xs leading-5 text-secondary">{description}</p>}</div></div>;
}
