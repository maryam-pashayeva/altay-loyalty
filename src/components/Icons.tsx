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
