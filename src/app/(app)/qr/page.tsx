"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { azn } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { QrScanner } from "@/components/QrScanner";
import { AddCardSheet } from "@/components/AddCardSheet";
import {
  ScanResultModal,
  type ScanResultData,
} from "@/components/ScanResultModal";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { CardIcon, PlusIcon } from "@/components/Icons";

/** Terminalda seçilə bilən məbləğlər (₼) */
const AMOUNTS = [0.5, 1, 1.5, 5];

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
  | { kind: "processing" }
  | { kind: "error"; message: string };

export default function QrPage() {
  const { customer, updateCustomer } = useSession();
  const { t } = useT();
  const [phase, setPhase] = useState<Phase>({ kind: "scan" });
  const [result, setResult] = useState<ScanResultData | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [addCardOpen, setAddCardOpen] = useState(false);

  const handleScan = useCallback(
    async (code: string) => {
      if (!customer) return;
      setPhase({ kind: "loading" });
      try {
        const term = await api.scanTerminal(code);
        setAmount(null);
        setCardId(customer.cards[0]?.id ?? null);
        setPhase({ kind: "terminal", ...term });
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
  const paused = result !== null || phase.kind === "terminal";

  async function pay(term: Terminal) {
    if (!customer || !amount || !effectiveCardId) return;
    setPhase({ kind: "processing" });
    try {
      await api.payTerminal(term.terminalId, amount, effectiveCardId);
      const bonusEarned = amount; // hər 1 ₼-ə 1 bonus
      const from = customer.bonusBalance;
      const to = from + bonusEarned;
      updateCustomer({ bonusBalance: to });
      setResult({
        paidAmount: amount,
        bonusEarned,
        terminalName: term.terminalName,
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

      {/* Ödəniş vərəqi */}
      <Sheet
        open={phase.kind === "terminal"}
        onClose={() => setPhase({ kind: "scan" })}
        title={t("pay.title")}
      >
        {phase.kind === "terminal" && (
          <>
            <div className="flex items-center gap-2 rounded-2xl bg-ink-50 p-3 text-sm">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-500/12 text-blue-600">
                <CardIcon className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-ink-900">
                  {phase.terminalName}
                </p>
                <p className="text-[11px] text-ink-500">{phase.branchName}</p>
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
                  onClick={() => setAmount(v)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    amount === v
                      ? "bg-blue-600 text-white"
                      : "bg-ink-100 text-ink-700"
                  }`}
                >
                  {azn(v)}
                </button>
              ))}
            </div>

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

            <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-mint-100 px-3 py-2 text-xs font-medium text-mint-600">
              🎁 {t("pay.bonusHint")}
            </div>

            <Button
              className="mt-4"
              disabled={!amount || !effectiveCardId}
              onClick={() => pay(phase)}
            >
              {t("pay.confirm", { amount: amount ? azn(amount) : azn(0) })}
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
