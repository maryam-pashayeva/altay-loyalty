"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
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
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [active, setActive] = useState<"all" | TransactionKind>("all");

  useEffect(() => {
    void api.getTransactions().then(setTransactions);
  }, []);

  const visible = useMemo(() => {
    if (!transactions) return null;
    if (active === "all") return transactions;
    if (active === "bonus_spent")
      return transactions.filter((t) => t.kind.startsWith("bonus"));
    return transactions.filter((t) => t.kind === active);
  }, [transactions, active]);

  return (
    <main>
      <PageHeader title="Tarixçə" subtitle="Bütün əməliyyatlarınız" />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-5 pb-4 no-scrollbar">
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
