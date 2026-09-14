"use client";

import { azn } from "@/lib/format";
import { allTiers, TIER_BENEFITS } from "@/lib/tier";
import type { TierCode } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";

const accent: Record<TierCode, string> = {
  bronze: "from-amber-700 to-orange-800",
  silver: "from-slate-400 to-slate-500",
  gold: "from-amber-400 to-amber-500",
  platinum: "from-blue-500 to-indigo-500",
};

export function TierSheet({
  open,
  onClose,
  current,
}: {
  open: boolean;
  onClose: () => void;
  current: TierCode;
}) {
  return (
    <Sheet open={open} onClose={onClose} title="Səviyyələr və üstünlüklər">
      <div className="space-y-3">
        {allTiers().map((tier) => {
          const isCurrent = tier.code === current;
          return (
            <div
              key={tier.code}
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
                      accent[tier.code]
                    } text-sm font-bold text-white shadow-sm`}
                  >
                    {tier.cashbackPercent}%
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900">
                      {tier.name}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {tier.threshold === 0
                        ? "Başlanğıc səviyyə"
                        : `İllik ${azn(tier.threshold)} xərcdən`}
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
                {TIER_BENEFITS[tier.code].map((b) => (
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
                      className="size-3.5 text-blue-600"
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
