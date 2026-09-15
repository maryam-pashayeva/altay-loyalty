"use client";

import { useEffect, useState } from "react";
import { azn } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

export type ScanResultData = {
  variant: "earned" | "paid";
  amount: number;
  title: string;
  branchName: string;
  fromBalance: number;
  toBalance: number;
};

function useCountUp(from: number, to: number, active: boolean, ms = 700) {
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [from, to, active, ms]);
  return value;
}

export function ScanResultModal({
  data,
  onClose,
}: {
  data: ScanResultData | null;
  onClose: () => void;
}) {
  const { t } = useT();
  const open = !!data;
  const balance = useCountUp(
    data?.fromBalance ?? 0,
    data?.toBalance ?? 0,
    open,
  );

  if (!data) return null;

  const earned = data.variant === "earned";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-6">
      <button
        aria-label={t("common.close")}
        onClick={onClose}
        className="fade-in absolute inset-0 h-full w-full cursor-default bg-ink-950/50"
      />
      <div className="pop-in relative w-full max-w-[22rem] rounded-3xl bg-white p-6 text-center shadow-[0_20px_60px_-20px_rgba(15,23,42,0.4)]">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-mint-100 text-3xl">
          {earned ? "🎉" : "🚀"}
        </div>
        <h2 className="mt-4 text-lg font-bold tracking-tight text-ink-900">
          {earned ? t("scanResult.earned") : t("scanResult.paid")}
        </h2>
        <p
          className={`mt-1 text-3xl font-bold ${
            earned ? "text-mint-600" : "text-blue-600"
          }`}
        >
          {earned ? "+" : "−"}
          {azn(data.amount)}
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {data.title} · {data.branchName}
        </p>

        <div className="mt-5 rounded-2xl bg-ink-50 py-3">
          <p className="text-[11px] text-ink-500">
            {t("scanResult.newBalance")}
          </p>
          <p className="text-xl font-semibold text-ink-900">{azn(balance)}</p>
        </div>

        <Button className="mt-5" onClick={onClose}>
          {earned ? t("scanResult.earnedCta") : t("scanResult.paidCta")}
        </Button>
      </div>
    </div>
  );
}
