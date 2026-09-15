"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import {
  HistoryIcon,
  HomeIcon,
  PinIcon,
  QrIcon,
  UserIcon,
} from "@/components/Icons";

const items = [
  { href: "/", labelKey: "nav.home", Icon: HomeIcon },
  { href: "/branches", labelKey: "nav.branches", Icon: PinIcon },
  { href: "/qr", labelKey: "nav.scan", Icon: QrIcon, primary: true },
  { href: "/history", labelKey: "nav.history", Icon: HistoryIcon },
  { href: "/profile", labelKey: "nav.profile", Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useT();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white shadow-[0_-3px_18px_rgba(15,23,42,0.08)]">
      <div className="mx-auto flex w-full max-w-[30rem] items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map(({ href, labelKey, Icon, primary }) => {
          const active = pathname === href;
          const label = t(labelKey);

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="flex flex-1 flex-col items-center justify-end gap-1 pb-2"
              >
                <span className="relative -mt-6">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-blue-500 pulse-ring"
                    aria-hidden
                  />
                  <span className="relative grid size-14 place-items-center rounded-2xl bg-blue-600 text-white shadow-[0_8px_22px_rgba(37,99,235,0.5)]">
                    <Icon className="size-7" />
                  </span>
                </span>
                <span className="text-[10px] text-ink-500">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex flex-1 flex-col items-center gap-1 py-2 text-[10px] transition ${
                active ? "font-semibold text-blue-600" : "text-ink-400"
              }`}
            >
              <span
                className={`grid size-8 place-items-center rounded-xl transition ${
                  active ? "bg-blue-600/12" : ""
                }`}
              >
                <Icon className="size-[22px]" />
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
