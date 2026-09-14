"use client";

import { useState } from "react";
import { azn } from "@/lib/format";
import { tierOf } from "@/lib/tier";
import type { Customer } from "@/lib/types";
import { ChevronIcon } from "@/components/Icons";
import { TierSheet } from "@/components/TierSheet";

/** Səviyyə düyməsinin rəngi — səviyyəyə uyğun */
const tierBadge: Record<string, string> = {
  bronze: "bg-amber-600 text-white",
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-amber-300 text-amber-950",
  platinum: "bg-indigo-200 text-indigo-900",
};

/**
 * Hero balans məzmunu — YALNIZ balans + səviyyə düyməsi (təmiz fokus).
 * Progress və paket ayrıca yerlərdədir. Kart fonu yoxdur — gradient header
 * üzərində göstərilir.
 */
export function BalanceCard({ customer }: { customer: Customer }) {
  const [tierOpen, setTierOpen] = useState(false);
  const tier = tierOf(customer.tier);

  return (
    <>
      <div className="text-white">
        <p className="text-[13px] text-white/90">Bonus balansı</p>
        <p className="mt-1 text-[2.75rem] font-bold leading-none tracking-tight">
          {azn(customer.bonusBalance)}
        </p>

        <button
          type="button"
          onClick={() => setTierOpen(true)}
          className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold shadow-sm transition active:scale-95 ${
            tierBadge[tier.code] ?? "bg-white/25 text-white"
          }`}
        >
          <span aria-hidden>👑</span>
          {tier.name} səviyyə
          <ChevronIcon className="size-4 opacity-70" />
        </button>
      </div>

      <TierSheet
        open={tierOpen}
        onClose={() => setTierOpen(false)}
        current={customer.tier}
        yearlySpend={customer.yearlySpend}
      />
    </>
  );
}
