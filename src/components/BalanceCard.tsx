import Link from "next/link";
import { azn } from "@/lib/format";
import { tierOf, tierProgress } from "@/lib/tier";
import type { Customer } from "@/lib/types";
import { PlusIcon } from "@/components/Icons";

export function BalanceCard({ customer }: { customer: Customer }) {
  const tier = tierOf(customer.tier);
  const { next, remaining, percent } = tierProgress(
    customer.tier,
    customer.yearlySpend,
  );

  return (
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
        <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {tier.name} · {tier.cashbackPercent}%
        </span>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1 rounded-2xl bg-white/10 px-3 py-2.5 backdrop-blur">
          <p className="text-[11px] text-white/70">Paket balansı</p>
          <p className="text-base font-medium">{azn(customer.walletBalance)}</p>
        </div>
        <Link
          href="/packages"
          className="grid size-12 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm transition active:scale-95"
          aria-label="Balansı artır"
        >
          <PlusIcon className="size-6" />
        </Link>
      </div>

      {next && (
        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-[11px] text-white/75">
            <span>{next.name} səviyyəsinə</span>
            <span>{azn(remaining)} qalıb</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-white transition-[width] duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
