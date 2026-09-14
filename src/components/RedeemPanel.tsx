"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CopyIcon } from "@/components/Icons";

/**
 * "Bonusla ödə" tabı — özünəxidmət terminalının skan etməsi üçün müştərinin
 * QR/kodunu göstərir. Kassa/operator yoxdur.
 */
export function RedeemPanel({ cardNumber }: { cardNumber: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(cardNumber, {
      width: 480,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setSrc)
      .catch(() => setSrc(null));
  }, [cardNumber]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(cardNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // kopyalama alınmadı
    }
  }

  return (
    <div className="mt-4">
      <div className="rise rounded-3xl border border-ink-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-ink-900">
          Terminal skanerinə göstərin
        </p>
        <p className="mx-auto mt-1 max-w-[16rem] text-xs leading-relaxed text-ink-500">
          Bu QR kodu terminalın skanerinə tutun — xal balansınız avtomatik
          tətbiq olunacaq.
        </p>

        <div className="mx-auto mt-5 grid size-52 place-items-center rounded-2xl border border-ink-100 p-2">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt="Loyallıq kodunun QR forması"
              className="size-full"
            />
          ) : (
            <div className="size-full animate-pulse rounded-xl bg-ink-100" />
          )}
        </div>

        <p className="mt-4 font-mono text-sm tracking-widest text-ink-900">
          {cardNumber}
        </p>
        <button
          type="button"
          onClick={copy}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-4 py-2 text-xs font-semibold text-ink-700 transition active:scale-95"
        >
          <CopyIcon className="size-4" />
          {copied ? "Kopyalandı" : "Kodu kopyala"}
        </button>
      </div>
    </div>
  );
}
