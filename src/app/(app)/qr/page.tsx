"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { azn } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { QrScanner } from "@/components/QrScanner";
import { VehicleSheet } from "@/components/VehicleSheet";
import {
  ScanResultModal,
  type ScanResultData,
} from "@/components/ScanResultModal";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { CarIcon, ChevronDownIcon } from "@/components/Icons";

type Phase =
  | { kind: "scan" }
  | { kind: "loading" }
  | { kind: "confirm"; amount: number; title: string; branchName: string; ref: string }
  | { kind: "processing" }
  | { kind: "error"; message: string };

export default function QrPage() {
  const { customer, activeVehicle, updateCustomer } = useSession();
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>({ kind: "scan" });
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);

  const handleScan = useCallback(
    async (code: string) => {
      if (!customer) return;
      setPhase({ kind: "loading" });
      try {
        const res = await api.scanTerminal(code, activeVehicle?.plate);
        if (res.type === "earn") {
          const from = customer.bonusBalance;
          const to = from + res.points;
          // Tamamlanmış yuma — bonusla yanaşı seriyanı da bir addım irəli aparırıq.
          const streak = customer.washStreak;
          updateCustomer({
            bonusBalance: to,
            washStreak: {
              ...streak,
              current: Math.min(streak.goal, streak.current + 1),
            },
          });
          setResult({
            variant: "earned",
            amount: res.points,
            title: res.title,
            branchName: res.branchName,
            fromBalance: from,
            toBalance: to,
          });
          setPhase({ kind: "scan" });
        } else {
          setPhase({
            kind: "confirm",
            amount: res.amount,
            title: res.title,
            branchName: res.branchName,
            ref: res.ref,
          });
        }
      } catch (e) {
        setPhase({
          kind: "error",
          message: e instanceof Error ? e.message : t("qr.error.generic"),
        });
      }
    },
    [customer, activeVehicle, updateCustomer, t],
  );

  if (!customer) return null;

  const multiCar = customer.vehicles.length >= 2;
  const paused = result !== null || phase.kind === "confirm";

  async function confirmPay(c: Extract<Phase, { kind: "confirm" }>) {
    if (customer!.bonusBalance < c.amount) {
      setPhase({ kind: "error", message: t("qr.insufficient") });
      return;
    }
    setPhase({ kind: "processing" });
    try {
      await api.confirmPayment(c.ref, activeVehicle?.plate);
      const from = customer!.bonusBalance;
      const to = from - c.amount;
      updateCustomer({ bonusBalance: to });
      setResult({
        variant: "paid",
        amount: c.amount,
        title: c.title,
        branchName: c.branchName,
        fromBalance: from,
        toBalance: to,
      });
      setPhase({ kind: "scan" });
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : t("qr.error.pay"),
      });
    }
  }

  return (
    <main>
      <PageHeader title={t("qr.title")} subtitle={t("qr.subtitle")} />

      <div className="px-5">
        {/* İnteraktiv maşın seçimi */}
        {activeVehicle && (
          <button
            type="button"
            onClick={() => multiCar && setVehicleOpen(true)}
            className="mb-3 flex w-full items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-xs"
          >
            <CarIcon className="size-4 shrink-0 text-blue-600" />
            <span className="text-ink-500">{t("qr.writeTo")}</span>
            <span className="font-semibold text-ink-900">
              {activeVehicle.plate}
            </span>
            {multiCar && (
              <span className="ml-auto flex items-center gap-0.5 font-semibold text-blue-600">
                {t("qr.change")} <ChevronDownIcon className="size-4" />
              </span>
            )}
          </button>
        )}

        {/* Skaner sahəsi */}
        {phase.kind === "loading" || phase.kind === "processing" ? (
          <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-950 text-sm text-white/80">
            {phase.kind === "processing" ? t("qr.paying") : t("qr.checking")}
          </div>
        ) : phase.kind === "error" ? (
          <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-100 p-6 text-center">
            <p className="text-sm font-semibold text-red-500">{phase.message}</p>
          </div>
        ) : paused ? (
          <div className="grid aspect-square w-full place-items-center rounded-3xl border border-dashed border-ink-300 bg-ink-100 text-sm text-ink-400">
            {t("qr.cameraPaused")}
          </div>
        ) : (
          <QrScanner onResult={handleScan} />
        )}

        {phase.kind === "error" && (
          <div className="mt-4">
            <Button onClick={() => setPhase({ kind: "scan" })}>
              {t("qr.retry")}
            </Button>
          </div>
        )}
      </div>

      {/* Ödəniş təsdiqi */}
      <Sheet
        open={phase.kind === "confirm"}
        onClose={() => setPhase({ kind: "scan" })}
        title={t("qr.confirmTitle")}
      >
        {phase.kind === "confirm" && (
          <>
            <div className="rounded-2xl border border-ink-200 p-4 text-sm">
              <div className="flex justify-between gap-2">
                <span className="text-ink-500">{t("qr.service")}</span>
                <span className="font-medium text-ink-900">{phase.title}</span>
              </div>
              <div className="mt-2 flex justify-between gap-2">
                <span className="text-ink-500">{t("qr.branch")}</span>
                <span className="font-medium text-ink-900">
                  {phase.branchName}
                </span>
              </div>
              {activeVehicle && (
                <div className="mt-2 flex justify-between gap-2">
                  <span className="text-ink-500">{t("qr.vehicle")}</span>
                  <span className="font-medium text-ink-900">
                    {activeVehicle.plate}
                  </span>
                </div>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-ink-200 pt-3">
                <span className="font-semibold text-ink-900">
                  {t("qr.amount")}
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {azn(phase.amount)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-ink-500">
                {t("qr.fromBonus", { amount: azn(customer.bonusBalance) })}
              </p>
            </div>
            <Button className="mt-4" onClick={() => confirmPay(phase)}>
              {t("qr.confirmPay")}
            </Button>
            <Button
              variant="ghost"
              className="mt-2"
              onClick={() => setPhase({ kind: "scan" })}
            >
              {t("common.cancel")}
            </Button>
          </>
        )}
      </Sheet>

      <ScanResultModal data={result} onClose={() => setResult(null)} />
      <VehicleSheet open={vehicleOpen} onClose={() => setVehicleOpen(false)} />
    </main>
  );
}
