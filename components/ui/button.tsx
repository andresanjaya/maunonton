import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[var(--color-accent)] text-[#1b1513] hover:bg-[var(--color-accent-strong)]",
  secondary: "border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] text-[var(--color-ink)] hover:border-[var(--color-accent)]",
  ghost: "border-transparent bg-transparent text-[var(--color-ink-secondary)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-ink)]",
  danger: "border-[rgba(239,130,123,.3)] bg-[rgba(239,130,123,.1)] text-[var(--color-danger)] hover:bg-[rgba(239,130,123,.16)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-10 px-3 text-sm",
  md: "min-h-12 px-5 text-sm",
  lg: "min-h-14 px-6 text-base",
};

type CommonProps = { children: ReactNode; className?: string; variant?: ButtonVariant; size?: ButtonSize };
type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkButtonProps = CommonProps & { href: string; type?: never };

export function Button(props: ButtonProps | LinkButtonProps) {
  if ("href" in props && props.href) {
    const { children, className = "", variant = "primary", size = "md", href } = props;
    const styles = `focus-ring inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
    return <Link href={href} className={styles}>{children}</Link>;
  }

  const { children, className = "", variant = "primary", size = "md", type = "button", ...buttonProps } = props as ButtonProps;
  const styles = `focus-ring inline-flex items-center justify-center gap-2 rounded-full border font-semibold transition-colors disabled:pointer-events-none disabled:opacity-45 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  return <button type={type} {...buttonProps} className={styles}>{children}</button>;
}
