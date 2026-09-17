"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { currentMonthName, isThisMonth } from "@/lib/format";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { UNREAD_NOTIFICATIONS } from "@/lib/notifications";
import type { Campaign } from "@/lib/types";
import { BalanceCard } from "@/components/BalanceCard";
import { BranchesQuickCard } from "@/components/BranchesQuickCard";
import { CampaignCard } from "@/components/CampaignCard";
import { ReferralCard } from "@/components/ReferralCard";
import { CampaignSheet } from "@/components/CampaignSheet";
import { StreakCard } from "@/components/StreakCard";
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
} from "@/components/Icons";

export default function HomePage() {
  const { customer, activeVehicle, transactions } = useSession();
  const { t, lang } = useT();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifUnread, setNotifUnread] = useState(true);
  const [selected, setSelected] = useState<{
    campaign: Campaign;
    index: number;
  } | null>(null);

  useEffect(() => {
    void api.getCampaigns().then(setCampaigns);
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNotifUnread(localStorage.getItem("altaywash.notifRead") !== "1");
    } catch {}
  }, []);

  function openNotifications() {
    setNotifOpen(true);
    setNotifUnread(false);
    try {
      localStorage.setItem("altaywash.notifRead", "1");
    } catch {}
  }

  if (!customer) return null;

  const firstName = customer.fullName.split(" ")[0];
  const initials = customer.fullName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  const multiCar = customer.vehicles.length >= 2;
  const recent = transactions?.filter((t) => isThisMonth(t.createdAt));

  return (
    <main>
      {/* Full-bleed gradient header */}
      <div className="relative overflow-hidden bg-linear-to-br from-blue-700 via-blue-600 to-blue-500 px-5 pb-16 pt-[calc(env(safe-area-inset-top)+1.5rem)] text-white">
        <div
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-white/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 size-56 rounded-full bg-cyan-400/20 blur-3xl"
          aria-hidden
        />

        <div className="relative flex items-center justify-between">
          <Link
            href="/profile"
            className="-m-1 flex items-center gap-3 rounded-2xl p-1"
          >
            <span className="relative grid size-11 shrink-0 place-items-center rounded-full bg-white/20 text-sm font-bold text-white ring-2 ring-white/40 backdrop-blur">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-amber-400 ring-2 ring-blue-600" />
            </span>
            <span className="leading-tight">
              <span className="block text-xs text-white/80">
                {t("home.greeting")}
              </span>
              <span className="block text-base font-bold tracking-tight">
                {firstName}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={openNotifications}
            className="relative grid size-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur transition active:scale-95"
            aria-label={t("home.notifications")}
          >
            <BellIcon className="size-6" />
            {notifUnread && UNREAD_NOTIFICATIONS > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-blue-600">
                {UNREAD_NOTIFICATIONS}
              </span>
            )}
          </button>
        </div>

        {activeVehicle && (
          <button
            type="button"
            onClick={() => multiCar && setVehicleOpen(true)}
            className="relative mt-4 flex max-w-full items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs text-white backdrop-blur transition active:scale-[0.98]"
          >
            <CarIcon className="size-4 shrink-0" />
            <span className="truncate font-semibold">{activeVehicle.plate}</span>
            <span className="truncate text-white/70">{activeVehicle.model}</span>
            {multiCar && (
              <ChevronDownIcon className="size-4 shrink-0 text-white/70" />
            )}
          </button>
        )}

        <div className="relative mt-6">
          <BalanceCard customer={customer} />
        </div>
      </div>

      {/* Ağ məzmun vərəqi — gradientin üstünə qıvrılır */}
      <div className="content-sheet relative -mt-8 rounded-t-[28px] bg-ink-100 px-5 pt-6">
        <StreakCard />

        <div className="mt-3">
          <BranchesQuickCard />
        </div>

        <section className="mt-8">
          <SectionTitle
            title={t("home.campaigns")}
            action={
              campaigns && campaigns.length > 1 ? (
                <Link
                  href="/campaigns"
                  className="flex items-center gap-0.5 text-xs text-blue-600"
                >
                  {t("home.seeAll")} <ChevronIcon className="size-4" />
                </Link>
              ) : undefined
            }
          />
          {campaigns ? (
            <div className="relative -mx-5">
              <div
                className={`flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 no-scrollbar ${
                  campaigns.length > 1 ? "pr-8" : ""
                }`}
              >
                {campaigns.map((c, i) => (
                  <div
                    key={c.id}
                    /* Tək kampaniya varsa tam eni tutsun — yanda "davamı var"
                       təəssüratı yaradan boşluq qalmasın. */
                    className={`shrink-0 snap-start ${
                      campaigns.length > 1 ? "w-[85%]" : "w-full"
                    }`}
                  >
                    {c.share ? (
                      <ReferralCard campaign={c} />
                    ) : (
                      <CampaignCard
                        campaign={c}
                        index={i}
                        onClick={() => setSelected({ campaign: c, index: i })}
                      />
                    )}
                  </div>
                ))}
              </div>
              {campaigns.length > 1 && (
                <div className="pointer-events-none absolute inset-y-0 right-0 w-5 bg-linear-to-l from-ink-100 to-transparent" />
              )}
            </div>
          ) : (
            <Skeleton className="h-28 w-full" />
          )}
        </section>

        <section className="mt-8">
          <SectionTitle
            title={`${t("home.recent")} · ${currentMonthName(lang)}`}
          />
          {recent ? (
            recent.length ? (
              <>
                <Card className="py-1">
                  <ul className="divide-y divide-ink-200">
                    {recent.map((t) => (
                      <TransactionItem key={t.id} trx={t} />
                    ))}
                  </ul>
                </Card>
                <Link
                  href="/history"
                  className="mt-3 flex h-12 w-full items-center justify-center gap-1 rounded-2xl border border-ink-200 bg-white text-sm font-semibold text-blue-600 transition active:scale-[0.99]"
                >
                  {t("home.allTransactions")}
                  <ChevronIcon className="size-4" />
                </Link>
              </>
            ) : (
              <Card className="py-8 text-center">
                <p className="text-sm text-ink-500">{t("home.noneThisMonth")}</p>
                <Link
                  href="/history"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                >
                  {t("home.allTransactions")} <ChevronIcon className="size-4" />
                </Link>
              </Card>
            )
          ) : (
            <Skeleton className="h-40 w-full" />
          )}
        </section>
      </div>

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
