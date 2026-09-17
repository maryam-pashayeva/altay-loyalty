"use client";

import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { DropIcon, FlameIcon, TrophyIcon } from "@/components/Icons";
import { IconTile } from "@/components/ui/IconTile";

/**
 * Yuma seriyası — möhür kartı kimi. Əvvəl sıra dairələr idi: tamamlanmışlar
 * içi ağ nöqtəli yaşıl dairə, qalanlar nömrəli boz dairə. Nə yumaya, nə də
 * mükafata aid heç nə demirdi. İndi hər tamamlanmış yuma bir möhürdür,
 * sonuncu xana isə qoparılan kupon kimi ayrılır.
 */
export function StreakCard() {
  const { customer } = useSession();
  const { t } = useT();
  if (!customer) return null;

  const { current, goal } = customer.washStreak;
  const remaining = Math.max(0, goal - current);
  const ready = remaining === 0;

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <IconTile Icon={FlameIcon} tone="amber" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-900">
            {t("streak.series", { n: current })}
          </p>
          <p className="text-xs text-ink-500">
            {ready ? t("streak.ready") : t("streak.toFree", { n: remaining })}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-stretch gap-1.5">
        {Array.from({ length: goal }).map((_, i) => {
          const done = i < current;
          const next = i === current;
          return (
            <span
              key={i}
              className={`grid aspect-square flex-1 place-items-center rounded-xl text-[13px] font-bold transition ${
                done
                  ? "bg-blue-600 text-white"
                  : next
                    ? "border-2 border-dashed border-blue-400 bg-blue-500/8 text-blue-600"
                    : "bg-ink-100 text-ink-400"
              }`}
            >
              {done ? <DropIcon className="size-[18px]" /> : i + 1}
            </span>
          );
        })}

        {/* Kupon hissəsi — qoparılan tərəf kimi kəsik xətlə ayrılır */}
        <span className="mx-0.5 w-px self-stretch border-l border-dashed border-ink-300" />
        <span
          className={`grid aspect-square flex-1 place-items-center rounded-xl transition ${
            ready
              ? "bg-sun-400 text-amber-950 soft-pulse"
              : "border-2 border-dashed border-sun-400/60 bg-sun-400/10 text-sun-600"
          }`}
        >
          <TrophyIcon className="size-[19px]" />
        </span>
      </div>
    </div>
  );
}
