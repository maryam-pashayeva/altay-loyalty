"use client";

import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { TrophyIcon } from "@/components/Icons";

export function StreakCard() {
  const { customer } = useSession();
  const { t } = useT();
  if (!customer) return null;

  const { current, goal } = customer.washStreak;
  const remaining = Math.max(0, goal - current);

  return (
    <div className="card p-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink-900">
          {t("streak.series", { n: current })}
        </p>
        <p className="mt-0.5 text-xs text-ink-500">
          {remaining > 0
            ? t("streak.toFree", { n: remaining })
            : t("streak.ready")}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {Array.from({ length: goal }).map((_, i) => {
          const done = i < current;
          const next = i === current;
          return (
            <span
              key={i}
              className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${
                done
                  ? "bg-mint-500"
                  : next
                    ? "bg-blue-100 text-blue-600 soft-pulse"
                    : "bg-ink-100 text-ink-400"
              }`}
            >
              {done ? (
                <span className="size-2 rounded-full bg-white" />
              ) : (
                i + 1
              )}
            </span>
          );
        })}
        {/* Mükafat — sıranın hədəfi; qalanlardan bir az iri və halqalıdır */}
        <span
          className={`ml-1 grid size-9 shrink-0 place-items-center rounded-full ring-2 transition ${
            remaining === 0
              ? "bg-sun-400 text-amber-950 ring-sun-400/40 soft-pulse"
              : "bg-sun-400/15 text-sun-600 ring-sun-400/30"
          }`}
        >
          <TrophyIcon className="size-[21px]" />
        </span>
      </div>
    </div>
  );
}
