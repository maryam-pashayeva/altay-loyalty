type P = { className?: string };

const S = ({
  children,
  className = "size-6",
}: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

/**
 * İki qatlı (duotone) baza: alt qatda yumşaq dolğu, üstdə dəqiq xətt.
 * Yalnız xətdən ibarət ikonlar plitənin içində boş və hazır-şablon görünürdü;
 * dolğu onlara həcm verir və hər ikonun öz xarakteri olur.
 */
const D = ({
  children,
  className = "size-6",
}: P & { children: React.ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

/** Duotone dolğu qatı */
const Fill = ({ d, o = 0.18 }: { d: string; o?: number }) => (
  <path d={d} fill="currentColor" fillOpacity={o} stroke="none" />
);

export const HomeIcon = (p: P) => (
  <S {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5 9.8V20h14V9.8" />
  </S>
);

export const QrIcon = (p: P) => (
  <S {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <path d="M14 14h3v3h-3zM20 14h1M14 20h3M20 18v3" />
  </S>
);

export const HistoryIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.2 2" />
  </S>
);

export const GiftIcon = (p: P) => (
  <D {...p}>
    <Fill d="M3.5 8.6h17v11.6a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1Z" />
    <rect x="3.5" y="8.6" width="17" height="12.6" rx="2" />
    {/* lent */}
    <path d="M3.5 13.2h17M12 8.6v12.6" strokeWidth={1.7} />
    {/* bant */}
    <path d="M12 8.6C10 8.6 7.6 8.1 7.6 6.1A2.3 2.3 0 0 1 12 5.2a2.3 2.3 0 0 1 4.4.9c0 2-2.4 2.5-4.4 2.5Z" />
  </D>
);

export const UserIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </S>
);

export const PinIcon = (p: P) => (
  <D {...p}>
    <Fill d="M12 21.2s7.2-5.9 7.2-11.3a7.2 7.2 0 1 0-14.4 0c0 5.4 7.2 11.3 7.2 11.3Z" />
    <path d="M12 21.2s7.2-5.9 7.2-11.3a7.2 7.2 0 1 0-14.4 0c0 5.4 7.2 11.3 7.2 11.3Z" />
    <circle cx="12" cy="9.8" r="2.6" fill="#fff" />
  </D>
);

export const PlusIcon = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const CarIcon = (p: P) => (
  <D {...p}>
    <Fill d="M3 15.4v-3l1.8-4.1A2 2 0 0 1 6.6 7h10.8a2 2 0 0 1 1.8 1.3L21 12.4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <path d="M3 15.4v-3l1.8-4.1A2 2 0 0 1 6.6 7h10.8a2 2 0 0 1 1.8 1.3L21 12.4v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    {/* şüşə xətti və orta dayaq */}
    <path d="M4.6 12.4h14.8M12 7.2v5.2" />
    {/* təkərlər */}
    <circle cx="7.4" cy="16.4" r="1.7" fill="#fff" />
    <circle cx="16.6" cy="16.4" r="1.7" fill="#fff" />
  </D>
);

export const DropIcon = (p: P) => (
  <D {...p}>
    <Fill d="M12 2.6c-3.4 4.4-5.5 7.3-5.5 9.9a5.5 5.5 0 0 0 11 0c0-2.6-2.1-5.5-5.5-9.9Z" />
    <path d="M12 2.6c-3.4 4.4-5.5 7.3-5.5 9.9a5.5 5.5 0 0 0 11 0c0-2.6-2.1-5.5-5.5-9.9Z" />
    {/* parıltı — suyun üzərindəki işıq */}
    <path d="M9.2 12.9a2.9 2.9 0 0 0 2.9 2.9" strokeWidth={1.8} />
    <circle cx="14.6" cy="9.4" r="0.8" fill="currentColor" stroke="none" />
  </D>
);

export const ChevronDownIcon = (p: P) => (
  <S {...p}>
    <path d="m6 9 6 6 6-6" />
  </S>
);

export const ArrowUpRightIcon = (p: P) => (
  <S {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </S>
);

export const BellIcon = (p: P) => (
  <S {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </S>
);

export const FlashIcon = (p: P) => (
  <S {...p}>
    <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12l1-8.5Z" />
  </S>
);

export const FlashOffIcon = (p: P) => (
  <S {...p}>
    <path d="M13 2 8.2 8.5M10 22l1-8.5H4.5l3-4M3 3l18 18" />
  </S>
);

export const CopyIcon = (p: P) => (
  <S {...p}>
    <rect x="9" y="9" width="12" height="12" rx="2.5" />
    <path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
  </S>
);

export const KeyboardIcon = (p: P) => (
  <S {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M7 10h.01M11 10h.01M15 10h.01M17 10h.01M7 14h10" />
  </S>
);

export const TrashIcon = (p: P) => (
  <S {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13M10 11v6M14 11v6" />
  </S>
);

export const GlobeIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21C9.5 18.5 8.2 15.3 8.2 12S9.5 5.5 12 3Z" />
  </S>
);

export const BellRingIcon = (p: P) => (
  <S {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </S>
);

export const FlameIcon = ({ className = "size-6" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.96 2.29a.75.75 0 0 0-1.07-.14 9.74 9.74 0 0 0-3.54 6.18 7.55 7.55 0 0 1-1.7-1.72.75.75 0 0 0-1.16-.08A9 9 0 1 0 15.68 4.53a7.46 7.46 0 0 1-2.72-2.24Zm2.79 11.96a3.75 3.75 0 1 1-7.31-1.17c.63.46 1.35.81 2.13 1a5.99 5.99 0 0 1 1.93-3.55 3.75 3.75 0 0 1 3.25 3.72Z"
    />
  </svg>
);

export const TrophyIcon = (p: P) => (
  <D {...p}>
    <Fill d="M7 4h10v5a5 5 0 0 1-10 0Z" o={0.22} />
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5C21 9 19 10.5 17 10.5M7 5H4.5A1.5 1.5 0 0 0 3 6.5C3 9 5 10.5 7 10.5" />
  </D>
);

export const ChevronIcon = (p: P) => (
  <S {...p}>
    <path d="m9 5 7 7-7 7" />
  </S>
);

export const LogoutIcon = (p: P) => (
  <S {...p}>
    <path d="M15 5H6.5A1.5 1.5 0 0 0 5 6.5v11A1.5 1.5 0 0 0 6.5 19H15" />
    <path d="M17 8.5 20.5 12 17 15.5M20 12h-9" />
  </S>
);

export const CardIcon = (p: P) => (
  <D {...p}>
    <Fill d="M3 5.2h18v13.6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <rect x="3" y="5.2" width="18" height="14.6" rx="2.5" />
    {/* maqnit zolağı */}
    <path d="M3 9.4h18" strokeWidth={2.2} />
    {/* çip və nömrə */}
    <rect x="6" y="12.4" width="3.6" height="2.8" rx="0.8" />
    <path d="M13 15.2h5" />
  </D>
);

/** Balansın artırılması — pul kisəsi (siyahıda "+" işarəsindən aydındır) */
export const WalletIcon = (p: P) => (
  <D {...p}>
    <Fill d="M3.4 7.8h17.2v11a1.4 1.4 0 0 1-1.4 1.4H4.8a1.4 1.4 0 0 1-1.4-1.4Z" />
    <path d="M3.4 9.2V7.4A1.6 1.6 0 0 1 5 5.8h11.2a1.2 1.2 0 0 1 1.2 1.2v1" />
    <rect x="3.4" y="7.8" width="17.2" height="12.4" rx="2" />
    <path d="M20.6 12.4h-3.4a1.9 1.9 0 0 0 0 3.8h3.4" />
    <circle cx="17.6" cy="14.3" r="0.8" fill="currentColor" stroke="none" />
  </D>
);

/** Yuma paketi — üst-üstə yığılmış yuma sayı */
export const PackageIcon = (p: P) => (
  <D {...p}>
    <Fill d="m12 3.2 8 4v9.6l-8 4-8-4V7.2Z" />
    <path d="m12 3.2 8 4v9.6l-8 4-8-4V7.2Z" />
    <path d="m4 7.2 8 4 8-4M12 11.2v9.6" />
  </D>
);

/**
 * Yuma seriyası — parıldayan maşın. Seriyanın sonunda gələn şey budur:
 * təmiz, işıldayan avtomobil. (Əvvəl burada alov nişanı vardı — vərdiş
 * tətbiqlərindən gələn klişe idi, yuma ilə əlaqəsi yox idi.)
 */
export const WashShineIcon = (p: P) => (
  <D {...p}>
    {/* kuza — aşağıda geniş, yuxarıda dar salon (mikroavtobus yox, avtomobil) */}
    <Fill d="M2.6 16v-1.7a1.5 1.5 0 0 1 1.5-1.5h12.2a1.5 1.5 0 0 1 1.5 1.5V16a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8Z" />
    <path d="M2.6 16v-1.7a1.5 1.5 0 0 1 1.5-1.5h12.2a1.5 1.5 0 0 1 1.5 1.5V16a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8Z" />
    {/* salon */}
    <Fill d="M5.1 12.8 6.7 9.9a1.9 1.9 0 0 1 1.7-1h3.6a1.9 1.9 0 0 1 1.7 1l1.6 2.9Z" o={0.3} />
    <path d="M5.1 12.8 6.7 9.9a1.9 1.9 0 0 1 1.7-1h3.6a1.9 1.9 0 0 1 1.7 1l1.6 2.9" />
    <path d="M10.2 8.9v3.9" />
    {/* təkərlər */}
    <circle cx="6.5" cy="17" r="1.5" fill="#fff" />
    <circle cx="13.7" cy="17" r="1.5" fill="#fff" />
    {/* parıltı — təmizliyin nişanı */}
    <path
      d="M19 3 19.8 5.2 22 6 19.8 6.8 19 9 18.2 6.8 16 6 18.2 5.2Z"
      fill="currentColor"
      stroke="none"
    />
    <path
      d="M15.2 2.4 15.6 3.6 16.8 4 15.6 4.4 15.2 5.6 14.8 4.4 13.6 4 14.8 3.6Z"
      fill="currentColor"
      fillOpacity={0.45}
      stroke="none"
    />
  </D>
);
