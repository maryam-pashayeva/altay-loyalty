"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { azn } from "@/lib/format";
import { tierOf } from "@/lib/tier";
import { useSession } from "@/lib/session";
import type { WashPackage } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { GiftIcon } from "@/components/Icons";

export default function PackagesPage() {
  const { customer } = useSession();
  const [packages, setPackages] = useState<WashPackage[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    void api.getPackages().then(setPackages);
  }, []);

  const cashback = customer ? tierOf(customer.tier).cashbackPercent : 0;

  async function buy(pkg: WashPackage) {
    setPending(pkg.id);
    setDone(null);
    try {
      const { redirectUrl } = await api.purchasePackage(pkg.id);
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      setDone(pkg.id);
    } finally {
      setPending(null);
    }
  }

  return (
    <main>
      <PageHeader
        title="Paketlər"
        subtitle="Əvvəlcədən al, hər yumada qənaət et"
      />
      <div className="space-y-3 px-5">
        {packages
          ? packages.map((pkg) => (
              <article
                key={pkg.id}
                className={`card p-4 ${
                  pkg.popular ? "ring-1 ring-aqua-500/60" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">{pkg.name}</h3>
                      {pkg.popular && (
                        <span className="rounded-md bg-aqua-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-aqua-600">
                          Ən çox seçilən
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink-500">
                      {pkg.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-semibold">{azn(pkg.price)}</p>
                    <p className="text-[11px] text-mint-600">
                      {azn(pkg.savings)} qənaət
                    </p>
                  </div>
                </div>

                {cashback > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-mint-100 px-3 py-2 text-xs font-medium text-mint-600">
                    <GiftIcon className="size-4 shrink-0" />
                    Bu paketlə ~{azn((pkg.price * cashback) / 100)} bonus
                    qazanacaqsan
                  </div>
                )}

                <Button
                  className="mt-3"
                  variant={pkg.popular ? "primary" : "outline"}
                  disabled={pending === pkg.id}
                  onClick={() => buy(pkg)}
                >
                  {pending === pkg.id
                    ? "Emal olunur…"
                    : done === pkg.id
                      ? "Sifariş qeydə alındı"
                      : "Paketi al"}
                </Button>
              </article>
            ))
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}

        <p className="pt-2 text-center text-[11px] leading-relaxed text-ink-400">
          Ödəniş ERP inteqrasiyası qoşulduqdan sonra bank səhifəsinə yönləndirmə
          ilə tamamlanacaq.
        </p>
      </div>
    </main>
  );
}
