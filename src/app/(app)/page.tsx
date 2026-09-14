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
import { NotificationsSheet } from "@/components/NotificationsSheet";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  BellIcon,
  CarIcon,
  ChevronDownIcon,
  ChevronIcon,
  DropIcon,
} from "@/components/Icons";

export default function HomePage() {
  const { customer, activeVehicle } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
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
  const initials = customer.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <main className="px-5 pt-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <Link
            href="/profile"
            className="-m-1 flex items-center gap-3 rounded-xl p-1"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-500/12 text-sm font-semibold text-blue-600">
              {initials}
            </span>
            <span className="text-base font-semibold tracking-tight">
              Salam, {firstName} 👋
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setNotifOpen(true)}
            className="relative grid size-11 place-items-center rounded-2xl bg-ink-100 text-ink-700 transition active:scale-95"
            aria-label="Bildirişlər"
          >
            <BellIcon className="size-6" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-red-500 ring-2 ring-ink-100" />
          </button>
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

      {/* Paket — hero-dan ayrıca, aydın widget */}
      <div className="card mt-3 flex items-center gap-3 p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <DropIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">Paketim</p>
          <p className="text-xs text-ink-500">
            {customer.washesLeft > 0
              ? `${customer.washesLeft} yuma qalıb`
              : "Aktiv paket yoxdur"}
          </p>
        </div>
        <Link
          href="/packages"
          className="shrink-0 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition active:scale-95"
        >
          Paket al
        </Link>
      </div>

      <div className="mt-3">
        <BranchesQuickCard />
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
            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 pr-8 no-scrollbar">
              {campaigns.map((c, i) => (
                <div key={c.id} className="w-[85%] shrink-0 snap-start">
                  <CampaignCard
                    campaign={c}
                    index={i}
                    onClick={() => setSelected({ campaign: c, index: i })}
                  />
                </div>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-linear-to-l from-ink-100 to-transparent" />
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
      <NotificationsSheet
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </main>
  );
}
