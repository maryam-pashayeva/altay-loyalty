import { shortDate } from "@/lib/format";
import { accentAt } from "@/lib/accents";
import type { Campaign } from "@/lib/types";
import { ChevronIcon } from "@/components/Icons";

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
      className="card flex w-full items-center gap-4 p-4 text-left transition active:scale-[0.99]"
    >
      <div
        className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${accentAt(
          index,
        )} text-sm font-bold text-white shadow-sm`}
      >
        {campaign.badge ?? "AW"}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">{campaign.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">
          {campaign.description}
        </p>
        <p className="mt-2 text-[11px] text-ink-400">
          {shortDate(campaign.validUntil)} tarixinədək
        </p>
      </div>
      <ChevronIcon className="size-4 shrink-0 text-ink-300" />
    </button>
  );
}
