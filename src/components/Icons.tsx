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
  <S {...p}>
    <rect x="3" y="8.5" width="18" height="12" rx="2" />
    <path d="M3 13h18M12 8.5V20.5" />
    <path d="M12 8.5C10 8.5 7.5 8 7.5 5.9A2.4 2.4 0 0 1 12 5a2.4 2.4 0 0 1 4.5.9C16.5 8 14 8.5 12 8.5Z" />
  </S>
);

export const UserIcon = (p: P) => (
  <S {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </S>
);

export const PinIcon = (p: P) => (
  <S {...p}>
    <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.5" />
  </S>
);

export const PlusIcon = (p: P) => (
  <S {...p}>
    <path d="M12 5v14M5 12h14" />
  </S>
);

export const CarIcon = (p: P) => (
  <S {...p}>
    <path d="M4 16v2.5M20 16v2.5" />
    <path d="M3 15.5v-3l1.8-4.2A2 2 0 0 1 6.6 7h10.8a2 2 0 0 1 1.8 1.3L21 12.5v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z" />
    <path d="M4.5 12.5h15M7.5 14.5h.01M16.5 14.5h.01" />
  </S>
);

export const DropIcon = (p: P) => (
  <S {...p}>
    <path d="M12 3c-3.2 4.2-5.2 6.9-5.2 9.4a5.2 5.2 0 0 0 10.4 0C17.2 9.9 15.2 7.2 12 3Z" />
    <path d="M10 13.5a2.2 2.2 0 0 0 2.2 2.2" />
  </S>
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
  <S {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
    <path d="M17 5h2.5A1.5 1.5 0 0 1 21 6.5C21 9 19 10.5 17 10.5M7 5H4.5A1.5 1.5 0 0 0 3 6.5C3 9 5 10.5 7 10.5" />
  </S>
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
  <S {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="M3 9.5h18M6.5 15.5h4" />
  </S>
);
