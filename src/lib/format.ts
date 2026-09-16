import type { Lang } from "@/lib/types";

/**
 * Intl-in `az-AZ` lokalı Node və brauzerlərdə ay adlarını "M09" kimi verir,
 * ona görə tarixlər əl ilə (və dil üzrə) formatlanır.
 */
const MONTHS_SHORT: Record<Lang, string[]> = {
  az: [
    "yan", "fev", "mar", "apr", "may", "iyn",
    "iyl", "avq", "sen", "okt", "noy", "dek",
  ],
  ru: [
    "янв", "фев", "мар", "апр", "май", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек",
  ],
  en: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ],
};

const pad = (n: number) => String(n).padStart(2, "0");

export function azn(value: number, opts: { sign?: boolean } = {}) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(abs) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const prefix = opts.sign
    ? value > 0
      ? "+"
      : value < 0
        ? "−"
        : ""
    : value < 0
      ? "−"
      : "";

  return `${prefix}${formatted} ₼`;
}

/**
 * Bonus dəyəri — QƏSDƏN ₼ işarəsi OLMADAN. Bonus xal sistemidir; manat
 * məbləğləri ilə eyni ekranda göründüyü üçün valyuta işarəsi baş qarışdırır.
 */
export function bonus(value: number, opts: { sign?: boolean } = {}) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(abs) ? 0 : 2,
    maximumFractionDigits: 2,
  });

  const prefix = opts.sign
    ? value > 0
      ? "+"
      : value < 0
        ? "−"
        : ""
    : value < 0
      ? "−"
      : "";

  return `${prefix}${formatted}`;
}

/** 06 sen 2026 */
export function shortDate(iso: string, lang: Lang = "az") {
  const d = new Date(iso);
  return `${pad(d.getDate())} ${MONTHS_SHORT[lang][d.getMonth()]} ${d.getFullYear()}`;
}

/** 06 sen, 18:20 */
export function dateTime(iso: string, lang: Lang = "az") {
  const d = new Date(iso);
  return `${pad(d.getDate())} ${MONTHS_SHORT[lang][d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Azərbaycan dövlət nişanı: 2 rəqəm — 2 hərf — 3 rəqəm (məs. 10-AA-334).
 * İstifadəçi yazdıqca defislər avtomatik qoyulur; artıq və yanlış simvollar
 * (hərf yerinə rəqəm və s.) qəbul edilmir.
 */
export function formatPlate(raw: string) {
  const clean = raw.toUpperCase().replace(/[^0-9A-Z]/g, "");

  const region = clean.slice(0, 2).replace(/\D/g, "");
  const rest = clean.slice(region.length);
  const letters = rest.slice(0, 2).replace(/[^A-Z]/g, "");
  const digits = rest.slice(letters.length).replace(/\D/g, "").slice(0, 3);

  return [region, letters, digits].filter(Boolean).join("-");
}

/** Nişan tam doldurulubmu (10-AA-334) */
export function isValidPlate(plate: string) {
  return /^\d{2}-[A-Z]{2}-\d{3}$/.test(plate);
}

/** "toyota  camry" → "Toyota Camry" */
export function titleCase(raw: string) {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** "1995-04-12" → "12 apr 1995"; boş/yanlış dəyər üçün null */
export function birthdayLabel(iso: string | undefined, lang: Lang = "az") {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : shortDate(iso, lang);
}

/** +994 50 123 45 67 formatına salır */
export function formatPhone(raw: string) {
  const digits = phoneDigits(raw);
  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);
  return parts.length ? `+994 ${parts.join(" ")}` : "";
}

export function phoneDigits(raw: string) {
  const digits = raw.replace(/\D/g, "");
  // Ölkə kodunu (994) yalnız tam beynəlxalq formatda (≥12 rəqəm) at;
  // 9 rəqəmli milli nömrəyə toxunma — məs. 099-4XX-XX-XX → "994XXXXXX".
  const national =
    digits.length >= 12 && digits.startsWith("994")
      ? digits.slice(3)
      : digits;
  return national.slice(0, 9);
}

/** İş saatları mətnindən ("09:00 – 21:00") hazırda açıq olub-olmadığını hesablayır. */
export function isOpenNow(workingHours: string): boolean | null {
  const m = workingHours.match(/(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const start = +m[1] * 60 + +m[2];
  const end = +m[3] * 60 + +m[4];
  return end > start ? cur >= start && cur < end : cur >= start || cur < end;
}

const MONTHS_FULL: Record<Lang, string[]> = {
  az: [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
  ],
  ru: [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

/** Cari ayın adı (məs. "Sentyabr") */
export function currentMonthName(lang: Lang = "az") {
  return MONTHS_FULL[lang][new Date().getMonth()];
}

/** Verilən tarix cari təqvim ayına aiddirmi */
export function isThisMonth(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}
