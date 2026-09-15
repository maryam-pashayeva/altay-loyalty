"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import type { Vehicle } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";

const BODY_TYPES: { value: Vehicle["bodyType"]; labelKey: string }[] = [
  { value: "sedan", labelKey: "body.sedan" },
  { value: "suv", labelKey: "body.suv" },
  { value: "minivan", labelKey: "body.minivan" },
  { value: "pickup", labelKey: "body.pickup" },
];

export function AddVehicleSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { customer, updateCustomer } = useSession();
  const { t } = useT();
  const [plate, setPlate] = useState("");
  const [model, setModel] = useState("");
  const [bodyType, setBodyType] = useState<Vehicle["bodyType"]>("sedan");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer || plate.trim().length < 3 || model.trim().length < 2) return;
    setBusy(true);
    try {
      const v = await api.addVehicle({
        plate: plate.trim().toUpperCase(),
        model: model.trim(),
        bodyType,
      });
      updateCustomer({ vehicles: [...customer.vehicles, v] });
      setPlate("");
      setModel("");
      setBodyType("sedan");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title={t("addVehicle.title")}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-500">
            {t("addVehicle.plateLabel")}
          </label>
          <input
            autoFocus
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="10-AA-334"
            className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-sm uppercase outline-none ring-1 ring-ink-200 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-500">
            {t("addVehicle.modelLabel")}
          </label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Toyota Camry"
            className="h-12 w-full rounded-2xl bg-ink-100 px-4 text-sm outline-none ring-1 ring-ink-200 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-500">
            {t("addVehicle.bodyLabel")}
          </label>
          <div className="flex flex-wrap gap-2">
            {BODY_TYPES.map((b) => (
              <button
                key={b.value}
                type="button"
                onClick={() => setBodyType(b.value)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  bodyType === b.value
                    ? "bg-blue-600 text-white"
                    : "bg-ink-100 text-ink-500"
                }`}
              >
                {t(b.labelKey)}
              </button>
            ))}
          </div>
        </div>
        <Button
          type="submit"
          className="mt-2"
          disabled={busy || plate.trim().length < 3 || model.trim().length < 2}
        >
          {busy ? t("addVehicle.adding") : t("addVehicle.submit")}
        </Button>
      </form>
    </Sheet>
  );
}
