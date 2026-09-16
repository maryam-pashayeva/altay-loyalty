"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { azn, bonus as bonusFmt } from "@/lib/format";
import { tierFor, tierOf } from "@/lib/tier";
import type { WashScan } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { QrScanner } from "@/components/QrScanner";
import { AddCardSheet } from "@/components/AddCardSheet";
import {
  ScanResultModal,
  type ScanResultData,
} from "@/components/ScanResultModal";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { CardIcon, DropIcon, PlusIcon } from "@/components/Icons";

/** Sürətli seçim üçün hazır məbləğlər (₼) */
const AMOUNTS = [0.5, 1, 1.5, 5];

/** Bir ödənişdə icazə verilən aralıq (₼) */
const MIN_AMOUNT = 0.5;
const MAX_AMOUNT = 500;

/** "12,50" → 12.5; boş/yanlış dəyər üçün null */
function parseAmount(raw: string): number | null {
  const n = Number(raw.replace(",", "."));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

const brandLabel: Record<string, string> = {
  visa: "VISA",
  mastercard: "MC",
  other: "CARD",
};

type Terminal = {
  terminalId: string;
  terminalName: string;
  branchName: string;
};

type Phase =
  | { kind: "scan" }
  | { kind: "loading" }
  | ({ kind: "terminal" } & Terminal)
  | ({ kind: "wash" } & WashScan)
  /** Daxili balansın artırılması — QR skan edilmir, birbaşa kartdan */
  | { kind: "topup" }
  | { kind: "processing" }
  | { kind: "error"; message: string };

function QrPageInner() {
  const { customer, updateCustomer, addTransaction } = useSession();
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>({ kind: "scan" });
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  // Sərbəst məbləğ xanası — yalnız mətn kimi saxlanır, `amount` ondan törəyir
  const [custom, setCustom] = useState("");
  const [cardId, setCardId] = useState<string | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const topupParam = searchParams.get("topup");

  // /qr?topup=25 — paketlər səhifəsindən balans artırmaq üçün gəlinib
  useEffect(() => {
    if (topupParam === null) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setPhase({ kind: "topup" });
    setCustom(topupParam);
    setAmount(parseAmount(topupParam));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [topupParam]);

  const handleScan = useCallback(
    async (code: string) => {
      if (!customer) return;
      setPhase({ kind: "loading" });
      try {
        const scan = await api.resolveScan(code);
        if (scan.kind === "wash") {
          // Xidmət sonu QR-ı — ödəniş yoxdur, yalnız bonus təsdiqlənir
          setPhase({ ...scan });
          return;
        }
        setAmount(null);
        setCustom("");
        setCardId(customer.cards[0]?.id ?? null);
        setPhase({ ...scan });
      } catch (e) {
        setPhase({
          kind: "error",
          message: e instanceof Error ? e.message : t("qr.error.generic"),
        });
      }
    },
    [customer, t],
  );

  if (!customer) return null;

  const cards = customer.cards;
  const effectiveCardId = cards.some((c) => c.id === cardId)
    ? cardId
    : (cards[0]?.id ?? null);
  const paused =
    result !== null ||
    phase.kind === "terminal" ||
    phase.kind === "wash" ||
    phase.kind === "topup";
  /** Səviyyəyə uyğun keşbek faizi — xidmət sonu bonusu bundan hesablanır */
  const cashback = tierOf(customer.tier).cashbackPercent;
  const amountValid =
    amount !== null && amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
  const amountOutOfRange = amount !== null && !amountValid;

  /** Hazır məbləğ seçimi — sərbəst xananı təmizləyir */
  function pickPreset(v: number) {
    setAmount(v);
    setCustom("");
  }

  /** Sərbəst xana — rəqəm və bir onluq ayırıcıdan başqa simvol qəbul etmir */
  function changeCustom(raw: string) {
    const cleaned = raw.replace(/[^\d.,]/g, "").replace(/([.,].*)[.,]/g, "$1");
    setCustom(cleaned);
    setAmount(parseAmount(cleaned));
  }

  async function pay(term: Terminal) {
    if (!customer || !amount || !amountValid || !effectiveCardId) return;
    setPhase({ kind: "processing" });
    try {
      await api.payTerminal(term.terminalId, amount, effectiveCardId);
      // Bonus səviyyənin keşbek faizi ilə hesablanır (Bronze 2% … Platinum 8%)
      const bonusEarned = Math.round(amount * cashback) / 100;
      const from = customer.bonusBalance;
      const to = from + bonusEarned;
      // Yuma sayı artır — səviyyə irəliləyişi bundan asılıdır
      const washes = customer.yearlyWashes + 1;
      updateCustomer({
        bonusBalance: to,
        yearlyWashes: washes,
        tier: tierFor(washes),
      });
      addTransaction({
        kind: "wash",
        title: "",
        titleKey: "trx.terminalPay",
        branchName: term.branchName,
        amount: -amount,
        bonusDelta: bonusEarned,
      });
      setResult({
        kind: "pay",
        amount,
        bonusEarned,
        subject: term.terminalName,
        branchName: term.branchName,
        fromBonus: from,
        toBonus: to,
      });
      setPhase({ kind: "scan" });
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : t("pay.error"),
      });
    }
  }

  /** Daxili balansın kartla artırılması — bonus qazandırmır */
  async function topUp() {
    if (!customer || !amount || !amountValid || !effectiveCardId) return;
    setPhase({ kind: "processing" });
    try {
      await api.topUpWallet(amount, effectiveCardId);
      updateCustomer({
        walletBalance: Math.round((customer.walletBalance + amount) * 100) / 100,
      });
      addTransaction({
        kind: "topup",
        title: "",
        titleKey: "trx.topUp",
        branchName: "Altaywash",
        amount,
        bonusDelta: 0,
      });
      setPhase({ kind: "scan" });
      router.replace("/packages");
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : t("pay.error"),
      });
    }
  }

  /**
   * Xidmət sonu QR-ının təsdiqi — heç nə ödənilmir, yalnız bonus yazılır.
   * Yuma sayı da artır (səviyyə ondan asılıdır).
   */
  async function claimWash(scan: WashScan) {
    if (!customer) return;
    const earned = Math.round(scan.amount * cashback) / 100;
    setPhase({ kind: "processing" });
    try {
      await api.confirmWash(scan.washId);
      const from = customer.bonusBalance;
      const to = from + earned;
      const streak = customer.washStreak;
      const reachedGoal = streak.current + 1 >= streak.goal;
      const washes = customer.yearlyWashes + 1;
      updateCustomer({
        bonusBalance: to,
        yearlyWashes: washes,
        tier: tierFor(washes),
        washStreak: {
          ...streak,
          current: reachedGoal ? 0 : streak.current + 1,
        },
        ...(reachedGoal ? { washesLeft: customer.washesLeft + 1 } : {}),
      });
      addTransaction({
        kind: "bonus_earned",
        title: scan.serviceName,
        branchName: scan.branchName,
        amount: 0,
        bonusDelta: earned,
        ...(scan.vehiclePlate ? { vehiclePlate: scan.vehiclePlate } : {}),
      });
      setResult({
        kind: "wash",
        amount: scan.amount,
        bonusEarned: earned,
        subject: scan.serviceName,
        branchName: scan.branchName,
        fromBonus: from,
        toBonus: to,
      });
      setPhase({ kind: "scan" });
    } catch (e) {
      setPhase({
        kind: "error",
        message: e instanceof Error ? e.message : t("wash.error"),
      });
    }
  }

  return (
    <main>
      <PageHeader title={t("qr.title")} subtitle={t("qr.subtitle")} />

      <div className="px-5">
        {/* Skaner sahəsi */}
        {phase.kind === "loading" || phase.kind === "processing" ? (
          <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-950 text-sm text-white/80">
            {phase.kind === "processing" ? t("pay.processing") : t("qr.checking")}
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

      {/* Ödəniş vərəqi — terminala ödəniş və balans artırma eyni formadan keçir */}
      <Sheet
        open={phase.kind === "terminal" || phase.kind === "topup"}
        onClose={() => setPhase({ kind: "scan" })}
        title={phase.kind === "topup" ? t("topup.title") : t("pay.title")}
      >
        {(phase.kind === "terminal" || phase.kind === "topup") && (
          <>
            <div className="flex items-center gap-2 rounded-2xl bg-ink-50 p-3 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500/12 text-blue-600">
                {phase.kind === "topup" ? (
                  <PlusIcon className="size-5" />
                ) : (
                  <CardIcon className="size-5" />
                )}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">
                  {phase.kind === "topup"
                    ? t("topup.walletLabel")
                    : phase.terminalName}
                </p>
                <p className="text-[11px] text-ink-500">
                  {phase.kind === "topup"
                    ? t("topup.currentBalance", {
                        amount: azn(customer.walletBalance),
                      })
                    : phase.branchName}
                </p>
              </div>
            </div>

            {/* Məbləğ */}
            <p className="mb-1.5 mt-4 text-xs font-medium text-ink-500">
              {t("pay.amount")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {AMOUNTS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => pickPreset(v)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    custom === "" && amount === v
                      ? "bg-blue-600 text-white"
                      : "bg-ink-100 text-ink-700"
                  }`}
                >
                  {azn(v)}
                </button>
              ))}
            </div>

            {/* Sərbəst məbləğ */}
            <div
              className={`mt-2 flex items-center gap-2 rounded-2xl border bg-white px-3 py-2.5 transition ${
                amountOutOfRange
                  ? "border-red-400 ring-1 ring-red-400/30"
                  : custom !== "" && amountValid
                    ? "border-blue-500 ring-1 ring-blue-500/30"
                    : "border-ink-200"
              }`}
            >
              <input
                type="text"
                inputMode="decimal"
                value={custom}
                onChange={(e) => changeCustom(e.target.value)}
                placeholder={t("pay.customAmount")}
                aria-label={t("pay.customAmount")}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-ink-900 outline-none placeholder:font-normal placeholder:text-ink-400"
              />
              <span className="shrink-0 text-sm font-semibold text-ink-500">
                ₼
              </span>
            </div>
            <p
              className={`mt-1 px-1 text-[11px] ${
                amountOutOfRange ? "font-medium text-red-500" : "text-ink-400"
              }`}
            >
              {t("pay.amountRange", {
                min: azn(MIN_AMOUNT),
                max: azn(MAX_AMOUNT),
              })}
            </p>

            {/* Kart */}
            <p className="mb-1.5 mt-4 text-xs font-medium text-ink-500">
              {t("pay.card")}
            </p>
            {cards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-300 p-4 text-center">
                <p className="text-xs text-ink-500">{t("pay.noCards")}</p>
                <button
                  type="button"
                  onClick={() => setAddCardOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-500/12 px-3 py-1.5 text-xs font-semibold text-blue-600"
                >
                  <PlusIcon className="size-4" />
                  {t("pay.addCard")}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {cards.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCardId(c.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-left text-sm transition ${
                      effectiveCardId === c.id
                        ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/30"
                        : "border-ink-200 bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="grid h-5 w-8 shrink-0 place-items-center rounded bg-ink-900 text-[9px] font-bold tracking-wide text-white">
                        {brandLabel[c.brand]}
                      </span>
                      <span className="font-semibold text-ink-900">
                        •••• {c.last4}
                      </span>
                    </span>
                    <span
                      className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                        effectiveCardId === c.id
                          ? "border-blue-600 bg-blue-600"
                          : "border-ink-300"
                      }`}
                    >
                      {effectiveCardId === c.id && (
                        <span className="size-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAddCardOpen(true)}
                  className="flex w-full items-center gap-2 rounded-2xl border border-dashed border-ink-300 p-3 text-left text-sm font-medium text-ink-600"
                >
                  <PlusIcon className="size-4 shrink-0" />
                  {t("pay.addCard")}
                </button>
              </div>
            )}

            {phase.kind === "topup" ? (
              <p className="mt-3 rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-medium leading-relaxed text-blue-700">
                {t("topup.note")}
              </p>
            ) : (
              <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-mint-100 px-3 py-2 text-xs font-medium text-mint-600">
                🎁{" "}
                {amountValid
                  ? t("pay.bonusPreview", {
                      pct: cashback,
                      bonus: bonusFmt(Math.round(amount * cashback) / 100),
                    })
                  : t("pay.bonusHint", { pct: cashback })}
              </div>
            )}

            <Button
              className="mt-4"
              disabled={!amountValid || !effectiveCardId}
              onClick={() => (phase.kind === "topup" ? topUp() : pay(phase))}
            >
              {phase.kind === "topup"
                ? t("topup.confirm", { amount: azn(amountValid ? amount : 0) })
                : t("pay.confirm", { amount: azn(amountValid ? amount : 0) })}
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

      {/* Xidmət sonu vərəqi — ödəniş yoxdur, yalnız bonus təsdiqlənir */}
      <Sheet
        open={phase.kind === "wash"}
        onClose={() => setPhase({ kind: "scan" })}
        title={t("wash.title")}
      >
        {phase.kind === "wash" && (
          <>
            <div className="flex items-center gap-2 rounded-2xl bg-ink-50 p-3 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-mint-600">
                <DropIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">
                  {phase.serviceName}
                </p>
                <p className="text-[11px] text-ink-500">{phase.branchName}</p>
              </div>
            </div>

            <div className="mt-3 space-y-2 rounded-2xl border border-ink-200 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">{t("wash.amount")}</span>
                <span className="font-semibold text-ink-900">
                  {azn(phase.amount)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500">
                  {t("wash.rate", { pct: cashback })}
                </span>
                <span className="text-lg font-bold text-mint-600">
                  {bonusFmt((phase.amount * cashback) / 100, { sign: true })}{" "}
                  <span className="text-xs font-semibold">
                    {t("common.bonusUnit")}
                  </span>
                </span>
              </div>
            </div>

            <p className="mt-3 rounded-xl bg-blue-500/10 px-3 py-2 text-xs font-medium text-blue-700">
              {t("wash.noCharge")}
            </p>

            <Button className="mt-4" onClick={() => claimWash(phase)}>
              {t("wash.claim")}
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
      <AddCardSheet open={addCardOpen} onClose={() => setAddCardOpen(false)} />

      <p className="px-5 pt-4 text-center text-[11px] leading-relaxed text-ink-400">
        <Link href="/profile" className="font-semibold text-blue-600">
          {t("cards.title")}
        </Link>
      </p>
    </main>
  );
}

/**
 * `useSearchParams` Suspense sərhədi tələb edir — səhifə statik qurulur.
 */
export default function QrPage() {
  return (
    <Suspense fallback={null}>
      <QrPageInner />
    </Suspense>
  );
}
