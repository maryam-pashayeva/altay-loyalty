"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { distanceKm } from "@/lib/geo";
import { useT } from "@/lib/i18n";
import { ArrowUpRightIcon, PinIcon } from "@/components/Icons";

/** Ana səhifədəki "Filiallar" qısayolu — icazə verilərsə ən yaxın filialı və
 *  məsafəni göstərir; əks halda sadəcə "Filiallar" qalır. */
export function BranchesQuickCard() {
  const { t } = useT();
  const [nearest, setNearest] = useState<{ name: string; km: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const branches = await api.getBranches();
          if (cancelled) return;
          const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          let best: { name: string; km: number } | null = null;
          for (const b of branches) {
            const km = distanceKm(me, b);
            if (!best || km < best.km) {
              best = { name: b.name.replace(/^Altaywash\s*/, ""), km };
            }
          }
          setNearest(best);
        } catch {
          // filiallar alınmadı — sakit keç
        }
      },
      () => {
        // icazə yoxdur — sadəcə "Filiallar" qalır
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Link href="/branches" className="card flex items-center gap-3 p-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-teal-500 to-cyan-500 text-white shadow-sm">
        <PinIcon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">
          {t("branchesQuick.title")}
        </span>
        <span className="block truncate text-xs text-ink-500">
          {nearest
            ? t("branchesQuick.nearest", {
                name: nearest.name,
                km: nearest.km.toFixed(1),
              })
            : t("branchesQuick.subtitle")}
        </span>
      </span>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
        <ArrowUpRightIcon className="size-4" />
      </span>
    </Link>
  );
}
