"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Campaign } from "@/lib/types";
import { CampaignCard } from "@/components/CampaignCard";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);

  useEffect(() => {
    void api.getCampaigns().then(setCampaigns);
  }, []);

  return (
    <main>
      <PageHeader title="Kampaniyalar" subtitle="Aktiv təkliflər və endirimlər" />
      <div className="space-y-3 px-5">
        {campaigns
          ? campaigns.map((c, i) => (
              <CampaignCard key={c.id} campaign={c} index={i} />
            ))
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
      </div>
    </main>
  );
}
