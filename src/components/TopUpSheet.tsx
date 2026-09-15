"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { azn } from "@/lib/format";
import type { SavedCard } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/Icons";

const PRESETS = [10, 20, 50, 100];

const brandLabel: Record<SavedCard["brand"], string> = {
  visa: "VISA",
  mastercard: "MC",
};

/** Kart göstəricisi — brend rozetkası + son 4 rəqəm (tam nömrə saxlanmır). */
function CardLabel({ card }: { card: SavedCard }) {
  const { t } = useT();
  return (
    <span className="flex items-center gap-2">
      <span className="grid h-5 w-8 shrink-0 place-items-center rounded bg-ink-900 text-[9px] font-bold tracking-wide text-white">
        {brandLabel[card.brand]}
      </span>
      <span className="font-semibold text-ink-900">•••• {card.last4}</span>
      <span className="text-[11px] text-ink-400">
        {t("cards.expires", {
          mm: String(card.expMonth).padStart(2, "0"),
          yy: String(card.expYear).padStart(2, "0"),
        })}
      </span>
    </span>
  );
}

export function TopUpSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { customer, updateCustomer } = useSession();
  const { t } = useT();
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [cardId, setCardId] = useState<string>("new");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const cards = customer?.cards ?? [];

  // Açılanda vəziyyəti sıfırla və mövcud kartı seç
  useEffect(() => {
    if (!open) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setDone(false);
    setBusy(false);
    setAmount(null);
    setCustom("");
    setCardId(cards[0]?.id ?? "new");
    /* eslint-enable react-hooks/set-state-in-effect */
    // yalnız açılış anında — cards asılılığı qəsdən xaric edilib
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pickPreset(v: number) {
    setAmount(v);
    setCustom("");
  }

  function onCustom(raw: string) {
    const cleaned = raw.replace(/[^\d]/g, "").slice(0, 4);
    setCustom(cleaned);
    setAmount(cleaned ? Number(cleaned) : null);
  }

  async function pay() {
    if (!customer || !amount || amount <= 0) return;
    setBusy(true);
    try {
      let useCardId = cardId;
      // Yeni kart seçilibsə əvvəlcə tokenləşdiririk (mock) və ya banka yönlənir.
      if (useCardId === "new") {
        const { card, redirectUrl } = await api.addCard();
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
        if (card) {
          updateCustomer({ cards: [...customer.cards, card] });
          useCardId = card.id;
        }
      }
      const res = await api.topUp(amount, useCardId);
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }
      updateCustomer({ walletBalance: customer.walletBalance + amount });
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (!customer) return null;

  return (
    <Sheet open={open} onClose={onClose} title={t("topup.title")}>
      {done ? (
        <div className="py-4 text-center">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-mint-100 text-3xl">
            🎉
          </div>
          <p className="mt-4 text-sm font-semibold text-mint-600">
            {t("topup.success", { amount: azn(amount ?? 0) })}
          </p>
          <p className="mt-1 text-xs text-ink-500">
            {t("wallet.title")}: {azn(customer.walletBalance)}
          </p>
          <Button className="mt-5" onClick={onClose}>
            {t("scanResult.paidCta")}
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-2xl bg-ink-50 p-4 text-center">
            <p className="text-[11px] text-ink-500">{t("wallet.title")}</p>
            <p className="text-2xl font-bold text-ink-900">
              {azn(customer.walletBalance)}
            </p>
          </div>

          {/* Məbləğ */}
          <p className="mb-1.5 text-xs font-medium text-ink-500">
            {t("topup.amount")}
          </p>
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => pickPreset(v)}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  amount === v && !custom
                    ? "bg-blue-600 text-white"
                    : "bg-ink-100 text-ink-700"
                }`}
              >
                {v} ₼
              </button>
            ))}
          </div>
          <input
            inputMode="numeric"
            value={custom}
            onChange={(e) => onCustom(e.target.value)}
            placeholder={t("topup.customAmount")}
            className="mt-2 h-12 w-full rounded-2xl bg-ink-100 px-4 text-sm outline-none ring-1 ring-ink-200 focus:ring-blue-500"
          />

          {/* Ödəniş kartı */}
          <p className="mb-1.5 mt-4 text-xs font-medium text-ink-500">
            {t("topup.payWith")}
          </p>
          <div className="space-y-2">
            {cards.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCardId(c.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-2xl border p-3 text-left text-sm transition ${
                  cardId === c.id
                    ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/30"
                    : "border-ink-200 bg-white"
                }`}
              >
                <CardLabel card={c} />
                <span
                  className={`grid size-5 shrink-0 place-items-center rounded-full border ${
                    cardId === c.id
                      ? "border-blue-600 bg-blue-600"
                      : "border-ink-300"
                  }`}
                >
                  {cardId === c.id && (
                    <span className="size-2 rounded-full bg-white" />
                  )}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCardId("new")}
              className={`flex w-full items-center gap-2 rounded-2xl border p-3 text-left text-sm font-medium transition ${
                cardId === "new"
                  ? "border-blue-500 bg-blue-50/60 text-blue-700 ring-1 ring-blue-500/30"
                  : "border-dashed border-ink-300 text-ink-600"
              }`}
            >
              <PlusIcon className="size-4 shrink-0" />
              {t("cards.new")}
            </button>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-ink-400">
            {t("topup.secureNote")}
          </p>

          <Button
            className="mt-4"
            disabled={busy || !amount || amount <= 0}
            onClick={pay}
          >
            {busy
              ? t("topup.processing")
              : t("topup.pay", { amount: amount ? azn(amount) : azn(0) })}
          </Button>
        </>
      )}
    </Sheet>
  );
}
