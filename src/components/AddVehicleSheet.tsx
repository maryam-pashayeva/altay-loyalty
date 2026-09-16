"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT } from "@/lib/i18n";
import { formatPlate, isValidPlate, titleCase } from "@/lib/format";
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
    if (!customer || !isValidPlate(plate) || model.trim().length < 2) return;
    setBusy(true);
    try {
      const v = await api.addVehicle({
        plate,
        model: titleCase(model),
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
            onChange={(e) => setPlate(formatPlate(e.target.value))}
            placeholder="10-AA-334"
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={plate.length > 0 && !isValidPlate(plate)}
            className={`h-12 w-full rounded-2xl bg-ink-100 px-4 text-sm font-semibold tracking-wider outline-none ring-1 focus:ring-blue-500 ${
              plate.length > 0 && !isValidPlate(plate)
                ? "ring-red-300"
                : "ring-ink-200"
            }`}
          />
          <p className="mt-1 px-1 text-[11px] text-ink-400">
            {t("addVehicle.plateHint")}
          </p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-500">
            {t("addVehicle.modelLabel")}
          </label>
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            onBlur={() => setModel((m) => titleCase(m))}
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
          disabled={busy || !isValidPlate(plate) || model.trim().length < 2}
        >
          {busy ? t("addVehicle.adding") : t("addVehicle.submit")}
        </Button>
      </form>
    </Sheet>
  );
}
