"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { CampaignCard } from "@/components/CampaignCard";
import { CampaignSheet } from "@/components/CampaignSheet";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CampaignsPage() {
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
      <PageHeader title="Kampaniyalar" subtitle="Aktiv təkliflər və endirimlər" />
      <div className="space-y-3 px-5">
        {campaigns
          ? campaigns.map((c, i) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                index={i}
                onClick={() => setSelected({ campaign: c, index: i })}
              />
            ))
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
