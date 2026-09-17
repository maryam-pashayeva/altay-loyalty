"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useT } from "@/lib/i18n";
import type { Campaign } from "@/lib/types";
import { CampaignCard } from "@/components/CampaignCard";
import { ReferralCard } from "@/components/ReferralCard";
import { CampaignSheet } from "@/components/CampaignSheet";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CampaignsPage() {
  const { t } = useT();
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [selected, setSelected] = useState<{
    campaign: Campaign;
    index: number;
  } | null>(null);

  useEffect(() => {
    void api.getCampaigns().then(setCampaigns);
  }, []);

  return (
    <main>
      <PageHeader
        title={t("campaigns.title")}
        subtitle={t("campaigns.subtitle")}
      />
      <div className="space-y-3 px-5">
        {campaigns
          ? campaigns.map((c, i) =>
              // Dəvət kampaniyası kartın özündə tamamlanır — vərəq açılmır
              c.share ? (
                <ReferralCard key={c.id} campaign={c} />
              ) : (
                <CampaignCard
                  key={c.id}
                  campaign={c}
                  index={i}
                  onClick={() => setSelected({ campaign: c, index: i })}
                />
              ),
            )
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>

      <CampaignSheet
        campaign={selected?.campaign ?? null}
        index={selected?.index ?? 0}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}
