import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--color-accent)] text-[#241b19] hover:bg-[#ec5f48]",
  secondary: "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] hover:border-[var(--color-border-strong)]",
  ghost: "border-transparent bg-transparent text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-ink)]",
  danger: "border-transparent bg-[#f9e6e3] text-[var(--color-danger)] hover:bg-[#f4d7d3]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-11 px-3 text-sm",
  md: "min-h-12 px-5 text-[.9375rem]",
  lg: "min-h-[3.25rem] px-6 text-[.9375rem]",
};

type CommonProps = { children: ReactNode; className?: string; variant?: ButtonVariant; size?: ButtonSize };
type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkButtonProps = CommonProps & { href: string; type?: never };

export function Button(props: ButtonProps | LinkButtonProps) {
  if ("href" in props && props.href) {
    const { children, className = "", variant = "primary", size = "md", href } = props;
    const styles = `focus-ring inline-flex items-center justify-center gap-2 rounded-[.75rem] border font-semibold transition-colors active:scale-[.99] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    return <Link href={href} className={styles}>{children}</Link>;
  }

  const { children, className = "", variant = "primary", size = "md", type = "button", ...buttonProps } = props as ButtonProps;
  const styles = `focus-ring inline-flex items-center justify-center gap-2 rounded-[.75rem] border font-semibold transition-colors active:scale-[.99] disabled:pointer-events-none disabled:opacity-55 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  return <button type={type} {...buttonProps} className={styles}>{children}</button>;
}
