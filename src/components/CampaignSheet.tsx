"use client";

import { useState } from "react";
import { shortDate } from "@/lib/format";
import { accentAt } from "@/lib/accents";
import type { Campaign } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

export function CampaignSheet({
  campaign,
  index = 0,
  onClose,
}: {
  campaign: Campaign | null;
  index?: number;
  onClose: () => void;
}) {
  const [done, setDone] = useState<null | "booked" | "copied" | "shared">(null);

  function handleClose() {
    setDone(null);
    onClose();
  }

  async function handleShare(code: string) {
    const url = `https://altay-loyalty.vercel.app/?ref=${code}`;
    const text = `Altaywash-a qoşul, ilk yumanda hər ikimiz 10 ₼ qazanaq! Kodum: ${code}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Altaywash", text, url });
        setDone("shared");
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        setDone("copied");
      }
    } catch {
      // istifadəçi ləğv etdi — sakit keç
    }
  }

  return (
    <Sheet open={!!campaign} onClose={handleClose}>
      {campaign && (
        <>
          <div
            className={`grid h-24 place-items-center rounded-2xl bg-linear-to-br ${accentAt(
              index,
            )} text-2xl font-bold text-white shadow-sm`}
          >
            {campaign.badge ?? "AW"}
          </div>
          <h2 className="mt-4 text-lg font-bold tracking-tight text-ink-900">
            {campaign.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">
            {campaign.description}
          </p>

          {/* Möhür-kart irəliləyişi (5+1) */}
          {campaign.stamps && (
            <div className="mt-4 rounded-2xl border border-ink-200 bg-ink-50 p-4">
              <div className="flex justify-between gap-2">
                {Array.from({ length: campaign.stamps.total }).map((_, i) => {
                  const filled = i < campaign.stamps!.done;
                  const isGift = i === campaign.stamps!.total - 1;
                  return (
                    <div
                      key={i}
                      className={`grid aspect-square flex-1 place-items-center rounded-xl text-sm font-bold ${
                        filled
                          ? "bg-blue-600 text-white"
                          : isGift
                            ? "border-2 border-dashed border-amber-400 text-amber-500"
                            : "bg-ink-200 text-ink-400"
                      }`}
                    >
                      {isGift ? "★" : i + 1}
                    </div>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-xs text-ink-600">
                {campaign.stamps.done}/{campaign.stamps.total} tamamlandı —{" "}
                <span className="font-semibold text-ink-900">
                  {Math.max(0, campaign.stamps.total - campaign.stamps.done)}{" "}
                  yuma sonra hədiyyə
                </span>
              </p>
            </div>
          )}

          {/* Dəvət kodu */}
          {campaign.share && (
            <div className="mt-4 rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-4 text-center">
              <p className="text-[11px] text-ink-500">Sizin dəvət kodunuz</p>
              <p className="mt-1 font-mono text-base font-semibold tracking-widest text-ink-900">
                {campaign.share.code}
              </p>
            </div>
          )}

          {!campaign.stamps && !campaign.share && (
            <p className="mt-3 text-xs text-ink-500">
              {shortDate(campaign.validUntil)} tarixinədək keçərlidir
            </p>
          )}

          <div className="mt-5">
            {done ? (
              <div className="rounded-2xl bg-mint-100 px-4 py-3 text-center text-sm font-medium text-mint-600">
                {done === "copied"
                  ? "Dəvət linki kopyalandı — dostunla paylaş!"
                  : done === "shared"
                    ? "Paylaşıldı — təşəkkürlər!"
                    : "Uğurla qeydə alındı — tezliklə sizinlə əlaqə saxlanılacaq."}
              </div>
            ) : campaign.share ? (
              <Button onClick={() => handleShare(campaign.share!.code)}>
                {campaign.ctaLabel ?? "Dostunu dəvət et"}
              </Button>
            ) : (
              <Button onClick={() => setDone("booked")}>
                {campaign.ctaLabel ?? "İştirak et"}
              </Button>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}
