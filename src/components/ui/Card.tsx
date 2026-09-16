import type { ReactNode } from "react";

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`card p-4 ${className}`}>{children}</div>;
}

export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="eyebrow text-ink-500">{title}</h2>
      {action}
    </div>
  );
}
