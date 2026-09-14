"use client";

import { Sheet } from "@/components/ui/Sheet";

type Note = {
  id: string;
  title: string;
  text: string;
  time: string;
  tone: "mint" | "blue" | "amber";
  unread?: boolean;
};

const NOTES: Note[] = [
  {
    id: "n1",
    title: "Xal qazandınız",
    text: "Kompleks yuma üçün +1.25 ₼ bonus hesabınıza yazıldı.",
    time: "2 saat əvvəl",
    tone: "mint",
    unread: true,
  },
  {
    id: "n2",
    title: "Yeni kampaniya",
    text: "Həftəiçi 20% endirim başladı — indi yoxlayın.",
    time: "Dünən",
    tone: "blue",
    unread: true,
  },
  {
    id: "n3",
    title: "Paketiniz azalır",
    text: "Paketinizdə 3 yuma qaldı. Yeniləmək üçün toxunun.",
    time: "3 gün əvvəl",
    tone: "amber",
  },
];

const dot: Record<Note["tone"], string> = {
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
  return (
    <Sheet open={open} onClose={onClose} title="Bildirişlər">
      <ul className="space-y-1">
        {NOTES.map((n) => (
          <li
            key={n.id}
            className="flex gap-3 rounded-2xl p-3 transition active:bg-ink-100"
          >
            <span
              className={`mt-1.5 size-2 shrink-0 rounded-full ${dot[n.tone]}`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-ink-900">{n.title}</p>
                <span className="shrink-0 text-[11px] text-ink-400">
                  {n.time}
                </span>
              </div>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
                {n.text}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Sheet>
  );
}
