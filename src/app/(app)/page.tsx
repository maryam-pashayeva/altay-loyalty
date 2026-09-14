"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { Campaign, Transaction } from "@/lib/types";
import { BalanceCard } from "@/components/BalanceCard";
import { BranchesQuickCard } from "@/components/BranchesQuickCard";
import { CampaignCard } from "@/components/CampaignCard";
import { CampaignSheet } from "@/components/CampaignSheet";
import { TransactionItem } from "@/components/TransactionItem";
import { VehicleSheet } from "@/components/VehicleSheet";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  CarIcon,
  ChevronDownIcon,
  ChevronIcon,
  QrIcon,
} from "@/components/Icons";

export default function HomePage() {
  const { customer, activeVehicle } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [selected, setSelected] = useState<{
    campaign: Campaign;
    index: number;
  } | null>(null);

  useEffect(() => {
    void api.getCampaigns().then(setCampaigns);
    void api.getTransactions().then(setTransactions);
  }, []);

  if (!customer) return null;

  const firstName = customer.fullName.split(" ")[0];

  return (
    <main className="px-5 pt-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-500">Xoş gəldiniz</p>
            <p className="text-lg font-semibold tracking-tight">{firstName}</p>
          </div>
          <Link
            href="/qr"
            className="grid size-11 place-items-center rounded-2xl bg-ink-100 text-aqua-600"
            aria-label="QR skan et"
          >
            <QrIcon className="size-6" />
          </Link>
        </div>

        {activeVehicle && (
          <button
            type="button"
            onClick={() => customer.vehicles.length >= 2 && setVehicleOpen(true)}
            className="mt-3 flex max-w-full items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1.5 text-xs shadow-sm transition active:scale-[0.98]"
          >
            <CarIcon className="size-4 shrink-0 text-blue-600" />
            <span className="truncate font-medium text-ink-900">
              {activeVehicle.plate}
            </span>
            <span className="truncate text-ink-500">{activeVehicle.model}</span>
            {customer.vehicles.length >= 2 && (
              <ChevronDownIcon className="size-4 shrink-0 text-ink-400" />
            )}
          </button>
        )}
      </div>

      <BalanceCard customer={customer} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <BranchesQuickCard />
        <Link href="/packages" className="card flex items-center gap-3 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-violet-500 to-purple-500 text-white shadow-sm">
            <CarIcon className="size-5" />
          </span>
          <span className="text-sm font-medium">Paketlər</span>
        </Link>
      </div>

      <section className="mt-8">
        <SectionTitle
          title="Kampaniyalar"
          action={
            <Link
              href="/campaigns"
              className="flex items-center gap-0.5 text-xs text-aqua-600"
            >
              Hamısı <ChevronIcon className="size-4" />
            </Link>
          }
        />
        {campaigns ? (
          <div className="relative -mx-5">
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
              {campaigns.map((c, i) => (
                <div key={c.id} className="w-[88%] shrink-0 snap-start">
                  <CampaignCard
                    campaign={c}
                    index={i}
                    onClick={() => setSelected({ campaign: c, index: i })}
                  />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-ink-100 to-transparent" />
          </div>
        ) : (
          <Skeleton className="h-28 w-full" />
        )}
      </section>

      <section className="mt-8">
        <SectionTitle
          title="Son əməliyyatlar"
          action={
            <Link
              href="/history"
              className="flex items-center gap-0.5 text-xs text-aqua-600"
            >
              Hamısı <ChevronIcon className="size-4" />
            </Link>
          }
        />
        {transactions ? (
          <Card className="py-1">
            <ul className="divide-y divide-ink-200">
              {transactions.slice(0, 3).map((t) => (
                <TransactionItem key={t.id} trx={t} />
              ))}
            </ul>
          </Card>
        ) : (
          <Skeleton className="h-40 w-full" />
        )}
      </section>

      <CampaignSheet
        campaign={selected?.campaign ?? null}
        index={selected?.index ?? 0}
        onClose={() => setSelected(null)}
      />
      <VehicleSheet open={vehicleOpen} onClose={() => setVehicleOpen(false)} />
    </main>
  );
}
