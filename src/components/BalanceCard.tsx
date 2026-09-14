"use client";

import Link from "next/link";
import { useState } from "react";
import { azn } from "@/lib/format";
import { tierOf, tierProgress } from "@/lib/tier";
import type { Customer } from "@/lib/types";
import { PlusIcon, QrIcon } from "@/components/Icons";
import { TierSheet } from "@/components/TierSheet";

export function BalanceCard({ customer }: { customer: Customer }) {
  const [tierOpen, setTierOpen] = useState(false);
  const tier = tierOf(customer.tier);
  const { next, remaining, percent } = tierProgress(
    customer.tier,
    customer.yearlySpend,
  );

  return (
    <>
      <div className="rise relative overflow-hidden rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 p-5 text-white shadow-[0_18px_40px_-22px_rgba(37,99,235,0.65)]">
        <div
          className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-white/15 blur-2xl"
          aria-hidden
        />

        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-white/70">Bonus balansı</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight">
              {azn(customer.bonusBalance)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTierOpen(true)}
              className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur transition active:scale-95"
            >
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
            <Link
              href="/qr"
              aria-label="QR skan et"
              className="grid size-9 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition active:scale-95"
            >
              <QrIcon className="size-5" />
            </Link>
          </div>
        </div>

        {next && (
          <div className="mt-5">
            <div className="mb-1.5 flex items-end justify-between">
              <span className="text-[11px] text-white/75">
                {next.name} səviyyəsinə
              </span>
              <span className="text-[11px] font-semibold text-white">
                {azn(remaining)} qalıb
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-700"
                style={{ width: `${Math.max(6, percent)}%` }}
              />
            </div>
            <p className="mt-1 text-right text-[10px] text-white/60">
              {percent}%
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur">
            <p className="text-[11px] text-white/70">Paket balansı</p>
            <p className="text-base font-medium">
              {azn(customer.walletBalance)}
            </p>
          </div>
          <Link
            href="/packages"
            className="grid size-12 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm transition active:scale-95"
            aria-label="Balansı artır"
          >
            <PlusIcon className="size-6" />
          </Link>
        </div>
      </div>

      <TierSheet
        open={tierOpen}
        onClose={() => setTierOpen(false)}
        current={customer.tier}
      />
    </>
  );
}
