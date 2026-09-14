"use client";

import { useSession } from "@/lib/session";

export function StreakCard() {
  const { customer } = useSession();
  if (!customer) return null;

  const { current, goal } = customer.washStreak;
  const remaining = Math.max(0, goal - current);

  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-orange-100 text-2xl">
          🔥
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-900">
            {current} yuma seriyası
          </p>
          <p className="text-xs text-ink-500">
            {remaining > 0
              ? `${remaining} yumaya pulsuz yuma`
              : "Pulsuz yuma hazırdır! 🎉"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {Array.from({ length: goal }).map((_, i) => {
          const done = i < current;
          return (
            <span
              key={i}
              className={`grid size-8 place-items-center rounded-full text-xs font-semibold ${
                done ? "bg-mint-500 text-white" : "bg-ink-100 text-ink-400"
              }`}
            >
              {done ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                  aria-hidden
                >
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
          );
        })}
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-amber-100 text-base">
          🏆
        </span>
      </div>
    </div>
  );
}
