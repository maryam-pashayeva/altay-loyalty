"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { Campaign, Transaction } from "@/lib/types";
import { BalanceCard } from "@/components/BalanceCard";
import { CampaignCard } from "@/components/CampaignCard";
import { TransactionItem } from "@/components/TransactionItem";
import { Card, SectionTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { CarIcon, ChevronIcon, PinIcon, QrIcon } from "@/components/Icons";

export default function HomePage() {
  const { customer } = useSession();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);

  useEffect(() => {
    void api.getCampaigns().then(setCampaigns);
    void api.getTransactions().then(setTransactions);
  }, []);

  if (!customer) return null;

  const firstName = customer.fullName.split(" ")[0];

  return (
    <main className="px-5 pt-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-ink-400">Xoş gəldiniz</p>
          <p className="text-lg font-semibold tracking-tight">{firstName}</p>
        </div>
        <Link
          href="/qr"
          className="grid size-11 place-items-center rounded-2xl bg-ink-100 text-aqua-600"
          aria-label="QR kartı aç"
        >
          <QrIcon className="size-6" />
        </Link>
      </div>

      <BalanceCard customer={customer} />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link href="/branches" className="card flex items-center gap-3 p-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 text-white shadow-sm">
            <PinIcon className="size-5" />
          </span>
          <span className="text-sm font-medium">Filiallar</span>
        </Link>
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
            <Link href="/campaigns" className="flex items-center gap-0.5 text-xs text-aqua-600">
              Hamısı <ChevronIcon className="size-4" />
            </Link>
          }
        />
        {campaigns ? (
          <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-1 no-scrollbar">
            {campaigns.map((c, i) => (
              <div key={c.id} className="w-[85%] shrink-0 snap-start">
                <CampaignCard campaign={c} index={i} />
              </div>
            ))}
          </div>
        ) : (
          <Skeleton className="h-28 w-full" />
        )}
      </section>

      <section className="mt-8">
        <SectionTitle
          title="Son əməliyyatlar"
          action={
            <Link href="/history" className="flex items-center gap-0.5 text-xs text-aqua-600">
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
    </main>
  );
}
