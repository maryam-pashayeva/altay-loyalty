"use client";

import { useEffect, useState } from "react";
import { azn } from "@/lib/format";
import { allTiers, tierOf, tierProgress } from "@/lib/tier";
import { useT, TIER_BENEFITS_I18N } from "@/lib/i18n";
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
  const { t, lang } = useT();
  const [selected, setSelected] = useState<TierCode>(current);

  // Açılanda cari səviyyəni seç
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (open) setSelected(current);
  }, [open, current]);

  const sel = tierOf(selected);
  const isCurrent = selected === current;
  const { next, remaining, percent } = tierProgress(current, yearlySpend);

  return (
    <Sheet open={open} onClose={onClose} title={t("tier.title")}>
      {/* Tab-lar */}
      <div className="flex gap-1 rounded-full bg-ink-100 p-1">
        {allTiers().map((t) => (
          <button
            key={t.code}
            type="button"
            onClick={() => setSelected(t.code)}
            className={`relative flex-1 rounded-full py-2 text-xs font-semibold transition ${
              selected === t.code
                ? "bg-white text-ink-900 shadow-sm"
                : "text-ink-500"
            }`}
          >
            {t.name}
            {t.code === current && (
              <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Seçilmiş səviyyə — hero */}
      <div
        className={`mt-4 rounded-3xl bg-linear-to-br ${accent[selected]} p-5 text-white shadow-sm`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              👑
            </span>
            <span className="text-lg font-bold">{sel.name}</span>
            {isCurrent && (
              <span className="rounded-full bg-white/25 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
                {t("tier.current")}
              </span>
            )}
          </div>
          <span className="rounded-full bg-white/25 px-3 py-1 text-xs font-semibold backdrop-blur">
            {t("tier.bonusBadge", { pct: sel.cashbackPercent })}
          </span>
        </div>

        {isCurrent && next ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-end justify-between text-xs">
              <span className="text-white/90">
                {t("tier.toTier", { tier: next.name })}
              </span>
              <span className="font-bold">
                {t("balance.remaining", { amount: azn(remaining) })}
              </span>
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
            {sel.threshold === 0
              ? t("tier.startLevel")
              : t("tier.unlockAt", { amount: azn(sel.threshold) })}
          </p>
        )}
      </div>

      {/* Üstünlüklər */}
      <p className="mb-2 mt-5 text-xs font-semibold text-ink-500">
        {t("tier.benefitsTitle", { tier: sel.name })}
      </p>
      <ul className="space-y-2.5">
        {TIER_BENEFITS_I18N[lang][selected].map((b) => (
          <li key={b} className="flex items-center gap-2.5 text-sm text-ink-700">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-100 text-blue-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3"
                aria-hidden
              >
                <path d="m5 12.5 4.5 4.5L19 7" />
              </svg>
            </span>
            {b}
          </li>
        ))}
      </ul>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-400">
        {t("tier.autoNote")}
      </p>
    </Sheet>
  );
}
