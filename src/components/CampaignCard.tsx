"use client";

import { shortDate } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Campaign } from "@/lib/types";
import { ChevronIcon, GiftIcon } from "@/components/Icons";
import { IconTile } from "@/components/ui/IconTile";

export function CampaignCard({
  campaign,
  onClick,
}: {
  campaign: Campaign;
  onClick?: () => void;
}) {
  const { t, lang } = useT();
  return (
    <button
      type="button"
      onClick={onClick}
      className="card flex w-full items-center gap-3 p-4 pr-3 text-left transition active:scale-[0.99]"
    >
      <IconTile tone="amber" size="lg">
        <span className="text-sm font-bold">{campaign.badge ?? "AW"}</span>
      </IconTile>
      <div className="min-w-0 flex-1 pr-1">
        <h3 className="truncate text-sm font-semibold">{campaign.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">
          {campaign.description}
        </p>
        {campaign.stamps ? (
          <div className="mt-2.5 flex items-center gap-1.5">
            {Array.from({ length: campaign.stamps.total }).map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className={`size-[22px] ${
                  i < campaign.stamps!.done ? "text-blue-600" : "text-ink-300"
                }`}
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2.5c-4 5.2-6.3 8.4-6.3 11.3a6.3 6.3 0 0 0 12.6 0c0-2.9-2.3-6.1-6.3-11.3Z" />
              </svg>
            ))}
            <GiftIcon className="ml-1 size-[22px] text-amber-500" />
          </div>
        ) : (
          <span className="mt-2 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">
            {t("campaign.validUntilShort", {
              date: shortDate(campaign.validUntil, lang),
            })}
          </span>
        )}
      </div>
      <ChevronIcon className="size-5 shrink-0 self-center text-ink-300" />
    </button>
  );
}
