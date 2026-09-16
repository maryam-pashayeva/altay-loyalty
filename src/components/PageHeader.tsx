export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="px-5 pb-5 pt-7">
      <h1 className="text-[1.75rem] font-bold leading-none tracking-tight text-ink-950">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>
      )}
    </header>
  );
}
