"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { azn } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { QrScanner } from "@/components/QrScanner";
import { RedeemPanel } from "@/components/RedeemPanel";
import { VehicleSheet } from "@/components/VehicleSheet";
import { Button } from "@/components/ui/Button";
import { CarIcon, ChevronDownIcon, KeyboardIcon } from "@/components/Icons";

type Phase =
  | { kind: "scan" }
  | { kind: "loading" }
  | {
      kind: "success";
      points: number;
      title: string;
      branchName: string;
      vehiclePlate?: string;
    }
  | { kind: "error"; message: string };

export default function QrPage() {
  const { customer, activeVehicle } = useSession();
  const [tab, setTab] = useState<"earn" | "redeem">("earn");
  const [phase, setPhase] = useState<Phase>({ kind: "scan" });
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [manual, setManual] = useState("");
  const [manualOpen, setManualOpen] = useState(false);

  const handleResult = useCallback(
    async (code: string) => {
      setPhase({ kind: "loading" });
      try {
        const res = await api.scanTerminal(code, activeVehicle?.plate);
        setPhase({ kind: "success", ...res });
      } catch (e) {
        setPhase({
          kind: "error",
          message: e instanceof Error ? e.message : "Xəta baş verdi",
        });
      }
    },
    [activeVehicle],
  );

  if (!customer) return null;

  const multiCar = customer.vehicles.length >= 2;

  return (
    <main>
      <PageHeader title="Terminal QR" />

      <div className="px-5">
        {/* Tablar: qazan / xərclə */}
        <div className="flex gap-1 rounded-full bg-ink-100 p-1">
          {(
            [
              ["earn", "Xal qazan"],
              ["redeem", "Bonusla ödə"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 rounded-full py-2 text-xs font-semibold transition ${
                tab === key ? "bg-white text-ink-900 shadow-sm" : "text-ink-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "redeem" ? (
          <RedeemPanel cardNumber={customer.cardNumber} />
        ) : (
          <div className="mt-4">
            <p className="mb-3 text-xs leading-relaxed text-ink-500">
              Terminalın ekranındakı QR kodu telefonunla oxut — xal seçilmiş
              maşının hesabına yazılsın.
            </p>

            {/* İnteraktiv maşın seçimi */}
            {activeVehicle && (
              <button
                type="button"
                onClick={() => multiCar && setVehicleOpen(true)}
                className="mb-3 flex w-full items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-xs"
              >
                <CarIcon className="size-4 shrink-0 text-blue-600" />
                <span className="text-ink-500">Skan bu maşına yazılacaq:</span>
                <span className="font-semibold text-ink-900">
                  {activeVehicle.plate}
                </span>
                {multiCar && (
                  <span className="ml-auto flex items-center gap-0.5 font-semibold text-blue-600">
                    Dəyiş <ChevronDownIcon className="size-4" />
                  </span>
                )}
              </button>
            )}

            {/* Skan sahəsi / nəticə */}
            {phase.kind === "success" ? (
              <div className="rise grid aspect-square w-full place-items-center rounded-3xl bg-linear-to-br from-blue-600 to-blue-500 p-6 text-center text-white">
                <div>
                  <div className="mx-auto grid size-16 place-items-center rounded-full bg-white/20">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-9"
                      aria-hidden
                    >
                      <path d="m5 12.5 4.5 4.5L19 7" />
                    </svg>
                  </div>
                  <p className="mt-4 text-3xl font-bold">+{azn(phase.points)}</p>
                  <p className="mt-1 text-sm text-white/80">hesabınıza yazıldı</p>
                  <p className="mt-3 text-xs text-white/80">
                    {phase.title} · {phase.branchName}
                  </p>
                  {phase.vehiclePlate && (
                    <p className="mt-1 text-xs font-medium text-white/90">
                      🚗 {phase.vehiclePlate}
                    </p>
                  )}
                </div>
              </div>
            ) : phase.kind === "error" ? (
              <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-100 p-6 text-center">
                <p className="text-sm font-semibold text-red-500">
                  {phase.message}
                </p>
              </div>
            ) : phase.kind === "loading" ? (
              <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-950 text-sm text-white/80">
                Yoxlanılır…
              </div>
            ) : (
              <QrScanner onResult={handleResult} />
            )}

            {/* Alt hərəkətlər */}
            <div className="mt-4">
              {phase.kind === "success" || phase.kind === "error" ? (
                <Button onClick={() => setPhase({ kind: "scan" })}>
                  {phase.kind === "success" ? "Yenidən skan et" : "Təkrar cəhd"}
                </Button>
              ) : phase.kind === "scan" ? (
                manualOpen ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (manual.trim().length >= 4) handleResult(manual.trim());
                    }}
                    className="flex gap-2"
                  >
                    <input
                      autoFocus
                      value={manual}
                      onChange={(e) => setManual(e.target.value)}
                      placeholder="Terminal kodu"
                      className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-sm outline-none ring-1 ring-ink-200 focus:ring-blue-500"
                    />
                    <Button
                      type="submit"
                      className="w-auto shrink-0 px-5"
                      disabled={manual.trim().length < 4}
                    >
                      Təsdiqlə
                    </Button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setManualOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-100 py-3 text-sm font-medium text-ink-700 transition active:scale-[0.98]"
                  >
                    <KeyboardIcon className="size-5" />
                    Kodu əllə daxil et
                  </button>
                )
              ) : null}
            </div>
          </div>
        )}
      </div>

      <VehicleSheet open={vehicleOpen} onClose={() => setVehicleOpen(false)} />
    </main>
  );
}
