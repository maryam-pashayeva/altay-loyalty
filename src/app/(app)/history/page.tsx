"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import type { Transaction, TransactionKind } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { TransactionItem } from "@/components/TransactionItem";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

const filters: { key: "all" | TransactionKind; label: string }[] = [
  { key: "all", label: "Hamısı" },
  { key: "wash", label: "Yumalar" },
  { key: "topup", label: "Artırımlar" },
  { key: "bonus_spent", label: "Bonus" },
];

export default function HistoryPage() {
  const { customer } = useSession();
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [active, setActive] = useState<"all" | TransactionKind>("all");
  const [vehicle, setVehicle] = useState<string>("all");

  useEffect(() => {
    void api.getTransactions().then(setTransactions);
  }, []);

  const vehicles = customer?.vehicles ?? [];
  const showVehicleFilter = vehicles.length >= 2;

  const visible = useMemo(() => {
    if (!transactions) return null;
    return transactions.filter((t) => {
      const byKind =
        active === "all"
          ? true
          : active === "bonus_spent"
            ? t.kind.startsWith("bonus")
            : t.kind === active;
      const byVehicle = vehicle === "all" ? true : t.vehiclePlate === vehicle;
      return byKind && byVehicle;
    });
  }, [transactions, active, vehicle]);

  return (
    <main>
      <PageHeader title="Tarixçə" subtitle="Bütün əməliyyatlarınız" />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-5 pb-3 no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setActive(f.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs transition ${
              active === f.key
                ? "bg-blue-600 font-semibold text-white"
                : "bg-ink-100 text-ink-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {showVehicleFilter && (
        <div className="-mx-1 flex gap-2 overflow-x-auto px-5 pb-4 no-scrollbar">
          <button
            onClick={() => setVehicle("all")}
            className={`shrink-0 rounded-full px-4 py-2 text-xs transition ${
              vehicle === "all"
                ? "bg-ink-900 font-semibold text-white"
                : "bg-ink-100 text-ink-500"
            }`}
          >
            Bütün maşınlar
          </button>
          {vehicles.map((v) => (
            <button
              key={v.id}
              onClick={() => setVehicle(v.plate)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs transition ${
                vehicle === v.plate
                  ? "bg-ink-900 font-semibold text-white"
                  : "bg-ink-100 text-ink-500"
              }`}
            >
              {v.plate}
            </button>
          ))}
        </div>
      )}

      <div className="px-5">
        {visible ? (
          visible.length ? (
            <Card className="py-1">
              <ul className="divide-y divide-ink-200">
                {visible.map((t) => (
                  <TransactionItem key={t.id} trx={t} />
                ))}
              </ul>
            </Card>
          ) : (
            <p className="py-16 text-center text-sm text-ink-400">
              Bu bölmədə hələ əməliyyat yoxdur.
            </p>
          )
        ) : (
          <Skeleton className="h-64 w-full" />
        )}
      </div>
    </main>
  );
}
