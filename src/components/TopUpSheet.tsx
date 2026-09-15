"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useT } from "@/lib/i18n";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import { CardIcon, CopyIcon } from "@/components/Icons";

/**
 * Balans artırma vərəqi — tətbiq daxilində ödəniş QƏBUL OLUNMUR (vergi/uçot
 * səbəbi). Yalnız köçürmə ediləcək kart nömrəsi və onun QR kodu göstərilir;
 * istifadəçi öz bank tətbiqi ilə QR-ı skan edir və ya karta köçürmə edir.
 * Kart nömrəsi bir dəfə daxil edilir və yaddaşda saxlanılır (yenidən soruşulmur).
 */
const CARD_KEY = "altaywash.topup.card";
const NAME_KEY = "altaywash.topup.name";

/** Rəqəmləri 4-lük qruplara ayırır: 4169 7388 1234 5678 */
function groupCard(digits: string) {
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

export function TopUpSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useT();
  const [card, setCard] = useState("");
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(false);
  const [draftCard, setDraftCard] = useState("");
  const [draftName, setDraftName] = useState("");
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  // Açılanda saxlanmış kartı oxu (yalnız brauzerdə)
  useEffect(() => {
    if (!open) return;
    let savedCard = "";
    let savedName = "";
    try {
      savedCard = localStorage.getItem(CARD_KEY) ?? "";
      savedName = localStorage.getItem(NAME_KEY) ?? "";
    } catch {}
    /* eslint-disable react-hooks/set-state-in-effect */
    setCard(savedCard);
    setName(savedName);
    setDraftCard(savedCard);
    setDraftName(savedName);
    setEditing(savedCard.length < 12);
    setCopied(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [open]);

  // Kart dəyişdikcə QR-ı yenidən qur
  useEffect(() => {
    if (!card || card.length < 12) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQr("");
      return;
    }
    let alive = true;
    QRCode.toDataURL(card, { width: 320, margin: 1 })
      .then((url) => {
        if (alive) setQr(url);
      })
      .catch(() => {
        if (alive) setQr("");
      });
    return () => {
      alive = false;
    };
  }, [card]);

  function saveCard() {
    const digits = draftCard.replace(/\D/g, "").slice(0, 19);
    if (digits.length < 12) return;
    const nm = draftName.trim();
    setCard(digits);
    setName(nm);
    setEditing(false);
    try {
      localStorage.setItem(CARD_KEY, digits);
      if (nm) localStorage.setItem(NAME_KEY, nm);
      else localStorage.removeItem(NAME_KEY);
    } catch {}
  }

  async function copyCard() {
    try {
      await navigator.clipboard.writeText(card);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <Sheet open={open} onClose={onClose} title={t("topup.title")}>
      <p className="text-sm leading-relaxed text-ink-600">
        {t("topup.instructions")}
      </p>

      {editing ? (
        <div className="mt-4 space-y-3">
          <p className="text-[11px] leading-relaxed text-ink-500">
            {t("topup.setCardPrompt")}
          </p>
          <input
            inputMode="numeric"
            autoFocus
            value={groupCard(draftCard.replace(/\D/g, "").slice(0, 19))}
            onChange={(e) => setDraftCard(e.target.value.replace(/\D/g, ""))}
            placeholder="0000 0000 0000 0000"
            className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-base tracking-wide outline-none ring-1 ring-ink-200 focus:ring-blue-500"
          />
          <input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder={t("topup.namePlaceholder")}
            className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-sm outline-none ring-1 ring-ink-200 focus:ring-blue-500"
          />
          <Button
            onClick={saveCard}
            disabled={draftCard.replace(/\D/g, "").length < 12}
          >
            {t("topup.save")}
          </Button>
        </div>
      ) : (
        <>
          {/* QR kod */}
          <div className="mt-4 flex justify-center">
            {qr ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qr}
                alt="QR"
                className="size-48 rounded-2xl border border-ink-200 bg-white p-2"
              />
            ) : (
              <div className="size-48 rounded-2xl bg-ink-100" />
            )}
          </div>

          {/* Kart nömrəsi + kopyala */}
          <div className="mt-4 rounded-2xl border border-ink-200 p-4">
            <div className="flex items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600">
                <CardIcon className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-ink-500">
                  {t("topup.cardNumber")}
                </p>
                <p className="font-mono text-base font-semibold tracking-wider text-ink-900">
                  {groupCard(card)}
                </p>
                {name && (
                  <p className="text-[11px] text-ink-500">
                    {t("topup.holderName")}: {name}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={copyCard}
                className="flex shrink-0 items-center gap-1 rounded-full bg-blue-500/12 px-3 py-1.5 text-xs font-semibold text-blue-600 transition active:scale-95"
              >
                <CopyIcon className="size-4" />
                {copied ? t("topup.copied") : t("topup.copy")}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDraftCard(card);
              setDraftName(name);
              setEditing(true);
            }}
            className="mt-3 block w-full text-center text-xs font-semibold text-blue-600"
          >
            {t("topup.edit")}
          </button>
        </>
      )}

      <p className="mt-4 text-[11px] leading-relaxed text-ink-400">
        {t("topup.noInAppPay")}
      </p>
    </Sheet>
  );
}
