"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Kassada oxudulan QR. Dəyər olaraq müştəri kart nömrəsi kodlanır —
 * ERP tərəfdə eyni kod ilə müştəri tapılır.
 */
export function QrCard({
  cardNumber,
  fullName,
  size = 240,
}: {
  cardNumber: string;
  fullName: string;
  size?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(cardNumber, {
      width: size * 2,
      margin: 1,
      color: { dark: "#05131f", light: "#ffffff" },
    })
      .then(setSrc)
      .catch(() => setSrc(null));
  }, [cardNumber, size]);

  return (
    <div className="rise flex flex-col items-center rounded-3xl border border-ink-200 bg-white p-5 text-ink-950 shadow-[0_10px_30px_-18px_rgba(13,33,54,0.25)]">
      <div
        className="grid place-items-center rounded-2xl"
        style={{ width: size, height: size }}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Loyallıq kartının QR kodu" width={size} height={size} />
        ) : (
          <div className="size-full animate-pulse rounded-2xl bg-ink-950/10" />
        )}
      </div>
      <p className="mt-3 text-sm font-semibold">{fullName}</p>
      <p className="font-mono text-xs tracking-widest text-ink-950/60">
        {cardNumber}
      </p>
    </div>
  );
}
