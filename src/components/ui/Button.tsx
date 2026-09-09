import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-[0.98]",
  ghost: "bg-ink-100 text-ink-900 hover:bg-ink-200 active:scale-[0.98]",
  outline:
    "border border-ink-200 text-ink-900 hover:bg-ink-100 active:scale-[0.98]",
};

const base =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-[15px] transition disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  children,
}: {
  variant?: Variant;
  className?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </Link>
  );
}
