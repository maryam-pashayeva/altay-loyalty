"use client";

import { useT } from "@/lib/i18n";
import {
  NOTIFICATIONS,
  type NotificationTone,
} from "@/lib/notifications";
import { Sheet } from "@/components/ui/Sheet";

const dot: Record<NotificationTone, string> = {
  mint: "bg-mint-500",
  blue: "bg-blue-500",
  amber: "bg-amber-500",
};

export function NotificationsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useT();

  return (
    <Sheet open={open} onClose={onClose} title={t("notifications.title")}>
      <ul className="space-y-1">
        {NOTIFICATIONS.map((n) => (
          <li
            key={n.id}
            className="flex gap-3 rounded-2xl p-3 transition active:bg-ink-100"
          >
            <span
              className={`mt-1.5 size-2 shrink-0 rounded-full ${dot[n.tone]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink-900">
                  {t(n.titleKey)}
                </p>
                <span className="shrink-0 text-[11px] text-ink-400">
                  {t(n.timeKey)}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
                {t(n.textKey)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
