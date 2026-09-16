import { TIERS } from "@/lib/api/mock-data";
import type { Tier, TierCode } from "@/lib/types";

const ORDER: TierCode[] = ["bronze", "silver", "gold", "platinum"];

export function tierOf(code: TierCode): Tier {
  return TIERS[code];
}

/** Bütün səviyyələr aşağıdan yuxarıya sıralı */
export function allTiers(): Tier[] {
  return ORDER.map((c) => TIERS[c]);
}

/** Növbəti səviyyə və ona çatmaq üçün qalan yuma sayı */
export function tierProgress(code: TierCode, yearlyWashes: number) {
  const index = ORDER.indexOf(code);
  const next = ORDER[index + 1];

  if (!next) {
    return { next: null, remaining: 0, percent: 100 };
  }

  const current = TIERS[code].washesRequired;
  const target = TIERS[next].washesRequired;
  const span = target - current;
  const done = Math.max(0, yearlyWashes - current);

  return {
    next: TIERS[next],
    remaining: Math.max(0, target - yearlyWashes),
    percent: Math.min(100, Math.round((done / span) * 100)),
  };
}

/**
 * Yuma sayına uyğun səviyyə. Real ERP səviyyəni özü qaytarır; bu funksiya
 * yumadan dərhal sonra tətbiqdə optimistik yeniləmə üçündür.
 */
export function tierFor(yearlyWashes: number): TierCode {
  let code: TierCode = "bronze";
  for (const c of ORDER) {
    if (yearlyWashes >= TIERS[c].washesRequired) code = c;
  }
  return code;
}
