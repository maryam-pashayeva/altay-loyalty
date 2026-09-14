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
  const [done, setDone] = useState(false);

  function handleClose() {
    setDone(false);
    onClose();
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
          <p className="mt-3 text-xs text-ink-400">
            {shortDate(campaign.validUntil)} tarixinədək keçərlidir
          </p>

          <div className="mt-5">
            {done ? (
              <div className="rounded-2xl bg-mint-100 px-4 py-3 text-center text-sm font-medium text-mint-600">
                Uğurla qeydə alındı — tezliklə sizinlə əlaqə saxlanılacaq.
              </div>
            ) : (
              <Button onClick={() => setDone(true)}>
                {campaign.ctaLabel ?? "İştirak et"}
              </Button>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}
