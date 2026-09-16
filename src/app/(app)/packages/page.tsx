"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { azn, bonus } from "@/lib/format";
import { tierOf } from "@/lib/tier";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import type { WashPackage } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { GiftIcon, PlusIcon } from "@/components/Icons";
import { Card } from "@/components/ui/Card";

export default function PackagesPage() {
  const { customer, updateCustomer } = useSession();
  const { t } = useT();
  const [packages, setPackages] = useState<WashPackage[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  /** Balans çatmayan paket — altında "Balansı artır" xəbərdarlığı görünür */
  const [short, setShort] = useState<{ id: string; missing: number } | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    void api.getPackages().then(setPackages);
  }, []);

  const cashback = customer ? tierOf(customer.tier).cashbackPercent : 0;

  async function buy(pkg: WashPackage) {
    if (!customer) return;

    // Paket daxili balansdan ödənilir. Balans çatmırsa alış başlamır —
    // istifadəçiyə nə qədər çatmadığı göstərilir və ödəniş səhifəsinə yönəlir.
    if (customer.walletBalance < pkg.price) {
      setDone(null);
      setShort({
        id: pkg.id,
        missing: Math.round((pkg.price - customer.walletBalance) * 100) / 100,
      });
      return;
    }

    setShort(null);
    setPending(pkg.id);
    setDone(null);
    try {
      const { redirectUrl } = await api.purchasePackage(pkg.id);
      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }
      // Uğurlu alış — məbləğ balansdan çıxılır, yumalar paketə əlavə olunur.
      updateCustomer({
        walletBalance:
          Math.round((customer.walletBalance - pkg.price) * 100) / 100,
        washesLeft: customer.washesLeft + pkg.washCount,
      });
      setDone(pkg.id);
    } finally {
      setPending(null);
    }
  }

  return (
    <main>
      <PageHeader title={t("packages.title")} subtitle={t("packages.subtitle")} />
      <div className="space-y-3 px-5">
        {customer && (
          <Card className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] text-ink-500">
                {t("packages.walletTitle")}
              </p>
              <p className="mt-0.5 text-xl font-bold text-ink-900">
                {azn(customer.walletBalance)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => router.push("/qr?topup=")}
              className="flex shrink-0 items-center gap-1 rounded-full bg-blue-500/12 px-3.5 py-2 text-xs font-semibold text-blue-600 transition active:scale-95"
            >
              <PlusIcon className="size-4" />
              {t("packages.topUp")}
            </button>
          </Card>
        )}

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
                          {t("packages.popular")}
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
                      {t("packages.savings", { amount: azn(pkg.savings) })}
                    </p>
                  </div>
                </div>

                {cashback > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-mint-100 px-3 py-2 text-xs font-medium text-mint-600">
                    <GiftIcon className="size-4 shrink-0" />
                    {t("packages.bonusHint", {
                      amount: bonus((pkg.price * cashback) / 100),
                    })}
                  </div>
                )}

                {short?.id === pkg.id && (
                  <div className="rise mt-3 rounded-xl bg-sun-400/15 p-3">
                    <p className="text-xs font-medium leading-relaxed text-ink-700">
                      {t("packages.shortBalance", {
                        missing: azn(short.missing),
                        price: azn(pkg.price),
                      })}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        router.push(`/qr?topup=${short.missing}`)
                      }
                      className="mt-2 flex w-full items-center justify-center gap-1 rounded-full bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition active:scale-95"
                    >
                      <PlusIcon className="size-4" />
                      {t("packages.topUpAmount", { amount: azn(short.missing) })}
                    </button>
                  </div>
                )}

                <Button
                  className="mt-3"
                  variant={pkg.popular ? "primary" : "outline"}
                  disabled={pending === pkg.id}
                  onClick={() => buy(pkg)}
                >
                  {pending === pkg.id
                    ? t("packages.processing")
                    : done === pkg.id
                      ? t("packages.ordered")
                      : t("packages.buy")}
                </Button>
              </article>
            ))
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}

        <p className="pt-2 text-center text-[11px] leading-relaxed text-ink-400">
          {t("packages.footer")}
        </p>
      </div>
    </main>
  );
}
