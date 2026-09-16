"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bonus } from "@/lib/format";
import { tierOf, tierProgress } from "@/lib/tier";
import { useT } from "@/lib/i18n";
import type { Customer } from "@/lib/types";
import { DropIcon, PlusIcon } from "@/components/Icons";
import { TierSheet } from "@/components/TierSheet";

/** Səviyyə rozetkasının rəngi — səviyyəyə uyğun */
const tierBadge: Record<string, string> = {
  bronze: "bg-amber-600 text-white",
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-amber-300 text-amber-950",
  platinum: "bg-indigo-200 text-indigo-900",
};

export function BalanceCard({ customer }: { customer: Customer }) {
  const { t } = useT();
  const [tierOpen, setTierOpen] = useState(false);
  const [barW, setBarW] = useState(0);
  const tier = tierOf(customer.tier);
  const { next, remaining, percent } = tierProgress(
    customer.tier,
    customer.yearlyWashes,
  );
  const targetW = Math.max(6, percent);

  // Progress bar ilk açılışda soldan sağa dolur
  useEffect(() => {
    const t = setTimeout(() => setBarW(targetW), 80);
    return () => clearTimeout(t);
  }, [targetW]);

  return (
    <>
      <div className="text-white">
        {/* Balans + səviyyə rozetkası */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] text-white/90">{t("balance.title")}</p>
            <p className="mt-1 whitespace-nowrap text-[2.75rem] font-bold leading-none tracking-tight">
              {bonus(customer.bonusBalance)}
              <span className="ml-1.5 align-middle text-base font-semibold text-white/80">
                {t("common.bonusUnit")}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTierOpen(true)}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3.5 py-1.5 text-sm font-bold shadow-sm transition active:scale-95 ${
              tierBadge[tier.code] ?? "bg-white/25 text-white"
            }`}
          >
            <span aria-hidden>👑</span>
            {tier.name} · {tier.cashbackPercent}%
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="size-3.5 opacity-80"
              aria-hidden
            >
              <path d="M12 17v-6M12 8h.01" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </button>
        </div>

        {/* Səviyyə irəliləyişi */}
        {next && (
          <div className="mt-6">
            <div className="mb-1.5 flex items-end justify-between">
              <span className="text-[13px] text-white">
                {t("balance.toTier", { tier: next.name })}
              </span>
              <span className="text-[13px] font-bold text-white">
                {t("balance.washesToGo", { n: remaining })}
              </span>
            </div>
            <div className="relative h-3 overflow-hidden rounded-full bg-blue-950/40">
              <div
                className="h-full rounded-full bg-linear-to-r from-cyan-300 to-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.7)] transition-[width] duration-1000 ease-out"
                style={{ width: `${barW}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs font-semibold text-white">
              {percent}%
            </p>
          </div>
        )}

        {/* Paket */}
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/20 pt-4">
          <div className="min-w-0">
            <p className="text-[11px] text-white/80">{t("balance.myPackage")}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-base font-semibold">
              <DropIcon className="size-4 shrink-0" />
              {customer.washesLeft > 0
                ? t("balance.washesLeft", { n: customer.washesLeft })
                : t("balance.noPackage")}
            </p>
          </div>
          <Link
            href="/packages"
            className="pulse-glow flex shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-blue-600 transition active:scale-95"
          >
            <PlusIcon className="size-4" />
            {t("balance.buyPackage")}
          </Link>
        </div>
      </div>

      <TierSheet
        open={tierOpen}
        onClose={() => setTierOpen(false)}
        current={customer.tier}
        yearlyWashes={customer.yearlyWashes}
      />
    </>
  );
}
