import type { ComponentType, ReactNode } from "react";

/**
 * İkon plitəsi — bütün siyahı sətirləri və qısayollar üçün vahid forma.
 *
 * Əvvəl hər yerdə fərqli idi: bəzisi doymuş qradiyentli kvadrat, bəzisi düz
 * rəngli dairə, rənglər isə təsadüfi seçilirdi. Ona görə interfeys yığma
 * təsiri bağışlayırdı. İndi forma birdir, rəng isə məna daşıyır.
 */
export type Tone = "blue" | "amber" | "mint" | "ink" | "rose";

const tones: Record<Tone, string> = {
  /** xidmət, yuma, filial — brend rəngi */
  blue: "bg-blue-500/10 text-blue-600",
  /** bonus, hədiyyə, səviyyə */
  amber: "bg-sun-400/15 text-sun-600",
  /** balansa daxil olan pul */
  mint: "bg-mint-100 text-mint-600",
  /** neytral: maşın, kart, ayar */
  ink: "bg-ink-100 text-ink-600",
  /** xəbərdarlıq/xüsusi hal */
  rose: "bg-rose-500/10 text-rose-600",
};

const sizes = {
  sm: "size-10 rounded-xl",
  md: "size-11 rounded-2xl",
  lg: "size-14 rounded-2xl",
};

export function IconTile({
  Icon,
  tone = "blue",
  size = "md",
  children,
  className = "",
}: {
  Icon?: ComponentType<{ className?: string }>;
  tone?: Tone;
  size?: keyof typeof sizes;
  children?: ReactNode;
  className?: string;
}) {
  const iconSize = size === "sm" ? "size-5" : size === "md" ? "size-[22px]" : "size-7";
  return (
    <span
      className={`grid shrink-0 place-items-center ${sizes[size]} ${tones[tone]} ${className}`}
    >
      {Icon ? <Icon className={iconSize} /> : children}
    </span>
  );
}
