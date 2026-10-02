import { AlertIcon, CheckIcon } from "@/components/ui/icons";

type FeedbackProps = { title: string; description?: string; tone?: "info" | "success" | "error" };
const toneStyles = {
  info: "border-[var(--color-border)] bg-white text-[var(--color-accent-strong)]",
  success: "border-[#b9d9c8] bg-[#edf7f0] text-[var(--color-success)]",
  error: "border-[#ebc4bf] bg-[#fff3f0] text-[var(--color-danger)]",
};

export function Feedback({ title, description, tone = "info" }: FeedbackProps) {
  const Icon = tone === "success" ? CheckIcon : AlertIcon;
  return <div role={tone === "error" ? "alert" : "status"} className={`flex gap-3 rounded-[.875rem] border p-4 ${toneStyles[tone]}`}><Icon className="mt-0.5 size-5 shrink-0"/><div><p className="text-sm font-semibold text-[var(--color-ink)]">{title}</p>{description && <p className="mt-1 text-xs leading-5 text-secondary">{description}</p>}</div></div>;
}

export function Toast({ title, description }: Omit<FeedbackProps, "tone">) {
  return <div role="status" aria-live="polite" className="flex w-full max-w-sm items-start gap-3 rounded-[.875rem] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-card)]"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent-strong)]"><CheckIcon className="size-4"/></span><div><p className="text-sm font-semibold">{title}</p>{description && <p className="mt-1 text-xs leading-5 text-secondary">{description}</p>}</div></div>;
}
