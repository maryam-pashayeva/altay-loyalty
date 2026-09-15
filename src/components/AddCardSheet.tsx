"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import type { SavedCard } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

function detectBrand(digits: string): SavedCard["brand"] {
  if (digits.startsWith("4")) return "visa";
  if (digits.startsWith("5")) return "mastercard";
  return "other";
}

function groupCard(digits: string) {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

/**
 * Kart əlavə etmə vərəqi. Forma nömrə/tarix/CVV alır, LAKİN yaddaşa yalnız
 * brend + son 4 rəqəm + bitmə tarixi yazılır (tokenləşdirmə). Tam nömrə və CVV
 * heç vaxt saxlanmır — real ERP-də provayderin PCI-uyğun sahələri işlədilməli.
 */
export function AddCardSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { customer, updateCustomer } = useSession();
  const { t } = useT();
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [busy, setBusy] = useState(false);

  const digits = number.replace(/\D/g, "").slice(0, 19);
  const [mmRaw, yyRaw] = expiry.split("/");
  const mm = Number(mmRaw);
  const yy = Number(yyRaw);
  const valid =
    digits.length >= 12 &&
    mm >= 1 &&
    mm <= 12 &&
    (yyRaw?.length ?? 0) === 2 &&
    cvv.replace(/\D/g, "").length >= 3;

  function onExpiry(raw: string) {
    const d = raw.replace(/\D/g, "").slice(0, 4);
    setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || !valid) return;
    setBusy(true);
    try {
      // Yalnız göstərici məlumat saxlanılır — PAN və CVV atılır.
      const card = await api.addCard({
        brand: detectBrand(digits),
        last4: digits.slice(-4),
        expMonth: mm,
        expYear: yy,
      });
      updateCustomer({ cards: [...customer.cards, card] });
      setNumber("");
      setExpiry("");
      setCvv("");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={t("addCard.title")}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-500">
            {t("addCard.number")}
          </label>
          <input
            inputMode="numeric"
            autoFocus
            value={groupCard(digits)}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="0000 0000 0000 0000"
            className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-base tracking-wide outline-none ring-1 ring-ink-200 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium text-ink-500">
              {t("addCard.expiry")}
            </label>
            <input
              inputMode="numeric"
              value={expiry}
              onChange={(e) => onExpiry(e.target.value)}
              placeholder="MM/YY"
              className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-base outline-none ring-1 ring-ink-200 focus:ring-blue-500"
            />
          </div>
          <div className="w-24">
            <label className="mb-1.5 block text-xs font-medium text-ink-500">
              {t("addCard.cvv")}
            </label>
            <input
              inputMode="numeric"
              value={cvv}
              onChange={(e) =>
                setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              placeholder="123"
              className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-base outline-none ring-1 ring-ink-200 focus:ring-blue-500"
            />
          </div>
        </div>

        <p className="text-[11px] leading-relaxed text-ink-400">
          {t("addCard.secureNote")}
        </p>

        <Button type="submit" className="mt-1" disabled={busy || !valid}>
          {busy ? t("addCard.saving") : t("addCard.save")}
        </Button>
      </form>
    </Sheet>
  );
}
