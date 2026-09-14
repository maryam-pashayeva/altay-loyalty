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
        {campaign.stamps ? (
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex gap-1">
              {Array.from({ length: campaign.stamps.total }).map((_, i) => (
                <span
                  key={i}
                  className={`size-2 rounded-full ${
                    i < campaign.stamps!.done ? "bg-blue-600" : "bg-ink-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-medium text-ink-600">
              {campaign.stamps.done}/{campaign.stamps.total}
            </span>
          </div>
        ) : (
          <p className="mt-2 text-[11px] text-ink-500">
            {shortDate(campaign.validUntil)} tarixinədək
          </p>
        )}
      </div>
      <ChevronIcon className="size-4 shrink-0 text-ink-400" />
    </button>
  );
}
