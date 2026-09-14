"use client";

import { azn } from "@/lib/format";
import { allTiers, tierOf, tierProgress, TIER_BENEFITS } from "@/lib/tier";
import type { TierCode } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";

const accent: Record<TierCode, string> = {
  bronze: "from-amber-700 to-orange-800",
  silver: "from-slate-400 to-slate-600",
  gold: "from-amber-400 to-amber-500",
  platinum: "from-blue-500 to-indigo-500",
};

export function TierSheet({
  open,
  onClose,
  current,
  yearlySpend,
}: {
  open: boolean;
  onClose: () => void;
  current: TierCode;
  yearlySpend: number;
}) {
  const tier = tierOf(current);
  const { next, remaining, percent } = tierProgress(current, yearlySpend);

  return (
    <Sheet open={open} onClose={onClose} title="Səviyyə və üstünlüklər">
      {/* Cari səviyyə — hero */}
      <div
        className={`rounded-3xl bg-linear-to-br ${accent[current]} p-5 text-white shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              👑
            </span>
            <span className="text-lg font-bold">{tier.name}</span>
          </div>
          <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold backdrop-blur">
            {tier.cashbackPercent}% bonus
          </span>
        </div>

        {next ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-end justify-between text-xs">
              <span className="text-white/90">{next.name} səviyyəsinə</span>
              <span className="font-bold">{azn(remaining)} qalıb</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-black/20">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-700"
                style={{ width: `${Math.max(5, percent)}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-3 text-xs text-white/90">
            Ən yüksək səviyyədəsiniz — təbriklər! 🎉
          </p>
        )}
      </div>

      {/* Bütün səviyyələr + üstünlüklər */}
      <div className="mt-4 space-y-3">
        {allTiers().map((t) => {
          const isCurrent = t.code === current;
          return (
            <div
              key={t.code}
              className={`rounded-2xl border p-4 ${
                isCurrent
                  ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/40"
                  : "border-ink-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`grid size-10 place-items-center rounded-xl bg-linear-to-br ${
                      accent[t.code]
                    } text-sm font-bold text-white shadow-sm`}
                  >
                    {t.cashbackPercent}%
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {t.name}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {t.threshold === 0
                        ? "Başlanğıc səviyyə"
                        : `İllik ${azn(t.threshold)} xərcdən`}
                    </p>
                  </div>
                </div>
                {isCurrent && (
                  <span className="rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                    Cari
                  </span>
                )}
              </div>
              <ul className="mt-3 space-y-1.5">
                {TIER_BENEFITS[t.code].map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-xs text-ink-600"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-3.5 shrink-0 text-blue-600"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.5 4.5L19 7" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-400">
        Səviyyə cari ildəki ümumi xərcə görə avtomatik yenilənir.
      </p>
    </Sheet>
  );
}
