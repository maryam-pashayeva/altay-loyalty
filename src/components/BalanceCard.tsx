"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bonus } from "@/lib/format";
import { allTiers, tierOf, tierProgress } from "@/lib/tier";
import { useT } from "@/lib/i18n";
import type { Customer } from "@/lib/types";
import { CrownIcon, DropIcon, PlusIcon } from "@/components/Icons";
import { TierSheet } from "@/components/TierSheet";

/** Səviyyə nişanının rəngi */
const tierBadge: Record<string, string> = {
  bronze: "bg-amber-700/90 text-amber-50",
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-sun-400 text-amber-950",
  platinum: "bg-indigo-200 text-indigo-950",
};

export function BalanceCard({ customer }: { customer: Customer }) {
  const { t } = useT();
  const [tierOpen, setTierOpen] = useState(false);
  const [filled, setFilled] = useState(false);
  const tier = tierOf(customer.tier);
  const { next, remaining, percent } = tierProgress(
    customer.tier,
    customer.yearlyWashes,
  );

  /* Şkala üç bərabər mərhələdən ibarətdir: Bronze→Silver, Silver→Gold,
     Gold→Platinum. Eşiklər (0/10/25/60) qeyri-bərabər olduğu üçün onları
     həqiqi nisbətdə yerləşdirsək, ilk iki ad üst-üstə düşür və oxunmur.
     Bərabər mərhələlər həm oxunaqlıdır, həm də doğru şeyi göstərir:
     cari mərhələnin nə qədərini keçmisən. */
  const stops = allTiers();
  const legs = stops.length - 1;
  const legIndex = stops.findIndex((s) => s.code === customer.tier);
  const overall = Math.min(
    100,
    ((legIndex + (next ? percent / 100 : 0)) / legs) * 100,
  );

  // Sayğac açılışda bir dəfə dolur
  useEffect(() => {
    const id = setTimeout(() => setFilled(true), 120);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <div className="text-white">
        {/* Bonus göstəricisi */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow text-white/60">{t("balance.title")}</p>
            <p className="mt-2 flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="figure text-[3.25rem] font-bold leading-none">
                {bonus(customer.bonusBalance)}
              </span>
              <span className="eyebrow text-white/70">
                {t("common.bonusUnit")}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setTierOpen(true)}
            aria-label={t("tier.title")}
            className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition active:scale-95 ${
              tierBadge[tier.code] ?? "bg-white/20 text-white"
            }`}
          >
            <CrownIcon className="size-4" />
            <span className="eyebrow">
              {tier.name} · {tier.cashbackPercent}%
            </span>
          </button>
        </div>

        {/* Səviyyə şkalası */}
        <div className="mt-7">
          <div className="relative h-1.5 rounded-full bg-blue-950/45">
            <div
              className="h-full origin-left rounded-full bg-linear-to-r from-cyan-300 to-emerald-300 transition-transform duration-[900ms] ease-out"
              style={{
                width: `${Math.max(1.5, overall)}%`,
                transform: filled ? "scaleX(1)" : "scaleX(0)",
              }}
            />
            {stops.map((s, i) => {
              const done = i <= legIndex;
              return (
                <span
                  key={s.code}
                  className={`absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-blue-700 ${
                    done ? "bg-emerald-300" : "bg-blue-950/70"
                  }`}
                  style={{ left: `${(i / legs) * 100}%` }}
                  aria-hidden
                />
              );
            })}
          </div>

          <div className="relative mt-2.5 h-3">
            {stops.map((s, i) => (
              <span
                key={s.code}
                className={`absolute top-0 whitespace-nowrap text-[11px] font-semibold tracking-wide ${
                  i <= legIndex ? "text-white" : "text-white/45"
                } ${
                  i === 0
                    ? ""
                    : i === legs
                      ? "-translate-x-full"
                      : "-translate-x-1/2"
                }`}
                style={{
                  left: `${(i / legs) * 100}%`,
                  fontFamily: "var(--font-display)",
                }}
              >
                {s.name}
              </span>
            ))}
          </div>

          <p className="mt-4 text-[13px] text-white/85">
            {next
              ? t("balance.gaugeToNext", { n: remaining, tier: next.name })
              : t("balance.gaugeTop")}
          </p>
        </div>

        {/* Paket */}
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div className="min-w-0">
            <p className="eyebrow text-white/60">{t("balance.myPackage")}</p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[15px] font-semibold">
              <DropIcon className="size-4 shrink-0 text-cyan-300" />
              {customer.washesLeft > 0
                ? t("balance.washesLeft", { n: customer.washesLeft })
                : t("balance.noPackage")}
            </p>
          </div>
          <Link
            href="/packages"
            className="flex shrink-0 items-center gap-1 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-blue-700 transition active:scale-95"
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
