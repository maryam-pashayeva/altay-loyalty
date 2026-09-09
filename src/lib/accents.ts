/**
 * Kateqoriya vurğu qradiyentləri — ALTAY ERP tarif kartlarındakı
 * çoxrəngli palitraya istinadən. İkon plitələri və rozetkalar üçün.
 */
export const ACCENTS = [
  "from-blue-500 to-indigo-500",
  "from-rose-500 to-pink-500",
  "from-violet-500 to-purple-500",
  "from-teal-500 to-cyan-500",
  "from-amber-500 to-orange-500",
  "from-emerald-500 to-teal-500",
] as const;

/** Sabit indeksə görə qradiyent seçir (siyahı sırası dəyişməz olduqda). */
export function accentAt(index: number) {
  return ACCENTS[index % ACCENTS.length];
}
