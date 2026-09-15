"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { distanceKm } from "@/lib/geo";
import { isOpenNow } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Branch } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { PinIcon } from "@/components/Icons";

export default function BranchesPage() {
  const { t } = useT();
  const [branches, setBranches] = useState<Branch[] | null>(null);
  const [me, setMe] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    void api.getBranches().then(setBranches);
    navigator.geolocation?.getCurrentPosition(
      (pos) => setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, []);

  const sorted = useMemo(() => {
    if (!branches) return null;
    if (!me) return branches;
    return [...branches].sort(
      (a, b) => distanceKm(me, a) - distanceKm(me, b),
    );
  }, [branches, me]);

  return (
    <main>
      <PageHeader title={t("branches.title")} subtitle={t("branches.subtitle")} />
      <div className="space-y-3 px-5">
        {sorted
          ? sorted.map((b) => (
              <article key={b.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 size-5 shrink-0 text-aqua-600" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold">{b.name}</h3>
                      {me && (
                        <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">
                          {distanceKm(me, b).toFixed(1)} km
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">{b.address}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-400">
                      {(() => {
                        const open = isOpenNow(b.workingHours);
                        if (open === null) return null;
                        return (
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              open ? "text-mint-600" : "text-red-500"
                            }`}
                          >
                            <span
                              className={`size-1.5 rounded-full ${
                                open ? "bg-mint-500" : "bg-red-500"
                              }`}
                            />
                            {open ? t("branches.open") : t("branches.closed")}
                          </span>
                        );
                      })()}
                      <span>· {b.workingHours}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`tel:${b.phone.replace(/\s/g, "")}`}
                    className="flex-1 rounded-xl bg-ink-100 py-2.5 text-center text-xs"
                  >
                    {t("branches.call")}
                  </a>
                  <a
                    href={`https://waze.com/ul?ll=${b.lat},${b.lng}&navigate=yes`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white"
                  >
                    {t("branches.route")}
                  </a>
                </div>
              </article>
            ))
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    </main>
  );
}
