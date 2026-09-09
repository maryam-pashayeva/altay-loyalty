"use client";

import { useSession } from "@/lib/session";
import { QrCard } from "@/components/QrCard";
import { PageHeader } from "@/components/PageHeader";
import { azn } from "@/lib/format";
import { tierOf } from "@/lib/tier";

export default function QrPage() {
  const { customer } = useSession();
  if (!customer) return null;

  const tier = tierOf(customer.tier);

  return (
    <main>
      <PageHeader
        title="Loyallıq kartı"
        subtitle="Kassada QR kodu oxutdurun — bonus avtomatik hesablanır."
      />
      <div className="px-5">
        <QrCard cardNumber={customer.cardNumber} fullName={customer.fullName} />

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="card p-4">
            <p className="text-[11px] text-ink-400">Bonus balansı</p>
            <p className="mt-1 text-xl font-semibold">{azn(customer.bonusBalance)}</p>
          </div>
          <div className="card p-4">
            <p className="text-[11px] text-ink-400">Səviyyə</p>
            <p className="mt-1 text-xl font-semibold text-sun-600">
              {tier.name}
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-ink-400">
          Kod işləmirsə operatora kart nömrənizi deyin:
          <br />
          <span className="font-mono tracking-widest text-ink-500">
            {customer.cardNumber}
          </span>
        </p>
      </div>
    </main>
  );
}
