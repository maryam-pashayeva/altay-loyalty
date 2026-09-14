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
        <h3 className="truncate text-sm font-semibold">{campaign.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">
          {campaign.description}
        </p>
        {campaign.stamps ? (
          <div className="mt-2.5 flex items-center gap-1">
            {Array.from({ length: campaign.stamps.total }).map((_, i) => (
              <svg
                key={i}
                viewBox="0 0 24 24"
                className={`size-4 ${
                  i < campaign.stamps!.done ? "text-blue-600" : "text-ink-300"
                }`}
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 3c-3.2 4.2-5.2 6.9-5.2 9.4a5.2 5.2 0 0 0 10.4 0C17.2 9.9 15.2 7.2 12 3Z" />
              </svg>
            ))}
            <GiftIcon className="ml-1 size-4 text-amber-500" />
          </div>
        ) : (
          <span className="mt-2 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-medium text-ink-500">
            {shortDate(campaign.validUntil)}-dək
          </span>
        )}
      </div>
      <ChevronIcon className="size-5 shrink-0 self-center text-ink-300" />
    </button>
  );
}
