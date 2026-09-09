import { shortDate } from "@/lib/format";
import { accentAt } from "@/lib/accents";
import type { Campaign } from "@/lib/types";

export function CampaignCard({
  campaign,
  index = 0,
}: {
  campaign: Campaign;
  index?: number;
}) {
  return (
    <article className="card flex gap-4 p-4">
      <div
        className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-linear-to-br ${accentAt(
          index,
        )} text-sm font-bold text-white shadow-sm`}
      >
        {campaign.badge ?? "AW"}
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold">{campaign.title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-500">
          {campaign.description}
        </p>
        <p className="mt-2 text-[11px] text-ink-400">
          {shortDate(campaign.validUntil)} tarixinədək
        </p>
      </div>
    </article>
  );
}
