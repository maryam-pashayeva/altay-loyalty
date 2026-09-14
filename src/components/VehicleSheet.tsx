"use client";

import { useSession } from "@/lib/session";
import { Sheet } from "@/components/ui/Sheet";
import { CarIcon } from "@/components/Icons";

export function VehicleSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { customer, activeVehicle, setActiveVehicleId } = useSession();

  return (
    <Sheet open={open} onClose={onClose} title="Aktiv avtomobil">
      <div className="space-y-2">
        {customer?.vehicles.map((v) => {
          const active = v.id === activeVehicle?.id;
          return (
            <button
              key={v.id}
              onClick={() => {
                setActiveVehicleId(v.id);
                onClose();
              }}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition ${
                active
                  ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/30"
                  : "border-ink-200 bg-white active:scale-[0.99]"
              }`}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600">
                <CarIcon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-ink-900">
                  {v.plate}
                </span>
                <span className="block truncate text-xs text-ink-500">
                  {v.model}
                </span>
              </span>
              {active && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 shrink-0 text-blue-600"
                  aria-hidden
                >
                  <path d="m5 12.5 4.5 4.5L19 7" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-400">
        QR skan edərkən xal seçilmiş avtomobilə yazılır.
      </p>
    </Sheet>
  );
}
