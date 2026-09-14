import { shortDate } from "@/lib/format";
import { accentAt } from "@/lib/accents";
import type { Campaign } from "@/lib/types";
import { ChevronIcon, GiftIcon } from "@/components/Icons";

export function CampaignCard({
  campaign,
  index = 0,
  onClick,
}: {
  campaign: Campaign;
  index?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card flex w-full items-center gap-3 p-4 pr-3 text-left transition active:scale-[0.99]"
    >
      <div
        className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${accentAt(
          index,
        )} text-sm font-bold text-white shadow-sm`}
      >
        {campaign.badge ?? "AW"}
      </div>
      <div className="min-w-0 flex-1 pr-1">
        <h3 className="text-sm font-semibold">{campaign.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
          {campaign.description}
        </p>
        {campaign.stamps ? (
          <div className="mt-2.5 flex items-center gap-1.5">
            {Array.from({ length: campaign.stamps.total }).map((_, i) => (
              <span
                key={i}
                className={`size-3 rounded-full ${
                  i < campaign.stamps!.done
                    ? "bg-blue-600"
                    : "bg-ink-200 ring-1 ring-inset ring-ink-300"
                }`}
              />
            ))}
            <GiftIcon className="ml-0.5 size-4 text-amber-500" />
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-ink-500">
            {shortDate(campaign.validUntil)} tarixinədək
          </p>
        )}
      </div>
      <ChevronIcon className="size-5 shrink-0 self-center text-ink-300" />
    </button>
  );
}
