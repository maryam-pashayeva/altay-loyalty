"use client";

import { useCallback, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { azn } from "@/lib/format";
import { PageHeader } from "@/components/PageHeader";
import { QrScanner } from "@/components/QrScanner";
import { Button } from "@/components/ui/Button";
import { CarIcon } from "@/components/Icons";

type Phase =
  | { kind: "idle" }
  | { kind: "scanning" }
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
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });

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

  return (
    <main>
      <PageHeader
        title="QR-ı skan et"
        subtitle="Terminaldakı QR kodu telefonunla oxut — xal avtomatik hesabına yazılsın."
      />

      <div className="px-5">
        {activeVehicle && (
          <div className="mb-3 flex items-center gap-2 rounded-2xl border border-ink-200 bg-white px-4 py-2.5 text-xs">
            <CarIcon className="size-4 shrink-0 text-blue-600" />
            <span className="text-ink-500">Skan bu maşına yazılacaq:</span>
            <span className="ml-auto font-semibold text-ink-900">
              {activeVehicle.plate}
            </span>
          </div>
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
        ) : phase.kind === "scanning" ? (
          <QrScanner onResult={handleResult} />
        ) : phase.kind === "loading" ? (
          <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-950 text-sm text-white/80">
            Yoxlanılır…
          </div>
        ) : (
          <div className="grid aspect-square w-full place-items-center rounded-3xl border border-dashed border-ink-300 bg-ink-100 p-6 text-center">
            <div>
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white text-blue-600 shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-8"
                  aria-hidden
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <path d="M14 14h3v3h-3zM20 14h1M14 20h3M20 18v3" />
                </svg>
              </div>
              <p className="mt-3 text-sm font-medium text-ink-900">
                Terminaldakı QR-ı skan et
              </p>
              <p className="mt-1 text-xs text-ink-500">
                Kameranı terminalın ekranındakı koda tutun
              </p>
            </div>
          </div>
        )}

        {/* Əsas düymə */}
        <div className="mt-4">
          {phase.kind === "idle" && (
            <Button onClick={() => setPhase({ kind: "scanning" })}>
              Skan etməyə başla
            </Button>
          )}
          {phase.kind === "scanning" && (
            <Button variant="outline" onClick={() => setPhase({ kind: "idle" })}>
              Dayandır
            </Button>
          )}
          {phase.kind === "loading" && (
            <Button disabled>Yoxlanılır…</Button>
          )}
          {(phase.kind === "success" || phase.kind === "error") && (
            <Button onClick={() => setPhase({ kind: "idle" })}>
              {phase.kind === "success" ? "Bitir" : "Yenidən cəhd et"}
            </Button>
          )}
        </div>

        {/* Ehtiyat: müştəri kodu — kassada xal xərcləmək üçün */}
        <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-4 text-center">
          <p className="text-[11px] text-ink-500">
            Xal xərcləmək üçün kassada bu kodu deyin
          </p>
          <p className="mt-1 font-mono text-sm tracking-widest text-ink-900">
            {customer.cardNumber}
          </p>
        </div>
      </div>
    </main>
  );
}
