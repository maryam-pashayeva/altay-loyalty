"use client";

import { useState } from "react";
import { shortDate } from "@/lib/format";
import { accentAt } from "@/lib/accents";
import { useT } from "@/lib/i18n";
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
  const { t, lang } = useT();
  const [done, setDone] = useState<null | "booked" | "copied" | "shared">(null);

  function handleClose() {
    setDone(null);
    onClose();
  }

  async function handleShare(code: string) {
    const url = `https://altay-loyalty.vercel.app/?ref=${code}`;
    const text = t("campaign.shareText", { code });
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
                {t("campaign.stampsDone", {
                  done: campaign.stamps.done,
                  total: campaign.stamps.total,
                })}{" "}
                <span className="font-semibold text-ink-900">
                  {t("campaign.stampsLeft", {
                    n: Math.max(
                      0,
                      campaign.stamps.total - campaign.stamps.done,
                    ),
                  })}
                </span>
              </p>
            </div>
          )}

          {/* Dəvət kodu */}
          {campaign.share && (
            <div className="mt-4 rounded-2xl border border-dashed border-ink-300 bg-ink-50 p-4 text-center">
              <p className="text-[11px] text-ink-500">
                {t("campaign.inviteCode")}
              </p>
              <p className="mt-1 font-mono text-base font-semibold tracking-widest text-ink-900">
                {campaign.share.code}
              </p>
            </div>
          )}

          {!campaign.stamps && !campaign.share && (
            <p className="mt-3 text-xs text-ink-500">
              {t("campaign.validUntil", {
                date: shortDate(campaign.validUntil, lang),
              })}
            </p>
          )}

          <div className="mt-5">
            {done ? (
              <div className="rounded-2xl bg-mint-100 px-4 py-3 text-center text-sm font-medium text-mint-600">
                {done === "copied"
                  ? t("campaign.done.copied")
                  : done === "shared"
                    ? t("campaign.done.shared")
                    : t("campaign.done.booked")}
              </div>
            ) : campaign.share ? (
              <Button onClick={() => handleShare(campaign.share!.code)}>
                {campaign.ctaLabel ?? t("campaign.invite")}
              </Button>
            ) : (
              <Button onClick={() => setDone("booked")}>
                {campaign.ctaLabel ?? t("campaign.participate")}
              </Button>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}
