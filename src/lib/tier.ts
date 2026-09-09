import { TIERS } from "@/lib/api/mock-data";
import type { Tier, TierCode } from "@/lib/types";

const ORDER: TierCode[] = ["silver", "gold", "platinum"];

export function tierOf(code: TierCode): Tier {
  return TIERS[code];
}

/** Növbəti səviyyə və ona çatmaq üçün qalan məbləğ */
export function tierProgress(code: TierCode, yearlySpend: number) {
  const index = ORDER.indexOf(code);
  const next = ORDER[index + 1];

  if (!next) {
    return { next: null, remaining: 0, percent: 100 };
  }

  const current = TIERS[code].threshold;
  const target = TIERS[next].threshold;
  const span = target - current;
  const done = Math.max(0, yearlySpend - current);

  return {
    next: TIERS[next],
    remaining: Math.max(0, target - yearlySpend),
    percent: Math.min(100, Math.round((done / span) * 100)),
  };
}
