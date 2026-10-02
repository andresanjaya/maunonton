import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string };

export function Input({ label, hint, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;
  const messageId = inputId ? `${inputId}-message` : undefined;
  return <label htmlFor={inputId} className="block"><span className="field-label">{label}</span><input id={inputId} className={`field-input ${className}`} aria-invalid={Boolean(error)} aria-describedby={error || hint ? messageId : undefined} {...props}/>{(error || hint) && <span id={messageId} className={`mt-2 block text-xs ${error ? "text-[var(--color-danger)]" : "text-muted"}`}>{error ?? hint}</span>}</label>;
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string };

export function Textarea({ label, hint, error, id, className = "", ...props }: TextareaProps) {
  const inputId = id ?? props.name;
  const messageId = inputId ? `${inputId}-message` : undefined;
  return <label htmlFor={inputId} className="block"><span className="field-label">{label}</span><textarea id={inputId} aria-invalid={Boolean(error)} aria-describedby={error || hint ? messageId : undefined} className={`field-input min-h-32 resize-y ${className}`} {...props}/>{(error || hint) && <span id={messageId} className={`mt-2 block text-xs ${error ? "text-[var(--color-danger)]" : "text-muted"}`}>{error ?? hint}</span>}</label>;
}
