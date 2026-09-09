"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Branch } from "@/lib/types";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";
import { PinIcon } from "@/components/Icons";

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[] | null>(null);

  useEffect(() => {
    void api.getBranches().then(setBranches);
  }, []);

  return (
    <main>
      <PageHeader title="Filiallar" subtitle="Sizə ən yaxın Altaywash" />
      <div className="space-y-3 px-5">
        {branches
          ? branches.map((b) => (
              <article key={b.id} className="card p-4">
                <div className="flex items-start gap-3">
                  <PinIcon className="mt-0.5 size-5 shrink-0 text-aqua-600" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">{b.name}</h3>
                    <p className="mt-0.5 text-xs text-ink-500">{b.address}</p>
                    <p className="mt-1 text-[11px] text-ink-400">
                      {b.workingHours}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <a
                    href={`tel:${b.phone.replace(/\s/g, "")}`}
                    className="flex-1 rounded-xl bg-ink-100 py-2.5 text-center text-xs"
                  >
                    Zəng et
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-center text-xs font-semibold text-white"
                  >
                    Marşrut
                  </a>
                </div>
              </article>
            ))
          : [0, 1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    </main>
  );
}
