"use client";

import type { ComponentType } from "react";
import { azn, bonus, dateTime } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Transaction } from "@/lib/types";
import { DropIcon, GiftIcon, PlusIcon } from "@/components/Icons";

type Meta = {
  Icon: ComponentType<{ className?: string }>;
  tone: string;
};

const meta: Record<Transaction["kind"], Meta> = {
  wash: { Icon: DropIcon, tone: "bg-blue-50 text-blue-600" },
  topup: { Icon: PlusIcon, tone: "bg-mint-100 text-mint-600" },
  bonus_earned: { Icon: GiftIcon, tone: "bg-sun-400/15 text-sun-600" },
  bonus_spent: { Icon: GiftIcon, tone: "bg-sun-400/15 text-sun-600" },
};

export function TransactionItem({ trx }: { trx: Transaction }) {
  const { t, lang } = useT();
  const { Icon, tone } = meta[trx.kind];
  // Məbləğ varsa manat, yoxdursa (saf bonus əməliyyatı) bonus xalı göstərilir
  const isMoney = trx.amount !== 0;
  const primary = isMoney ? trx.amount : trx.bonusDelta;

  return (
    <li className="flex items-center gap-3 py-3">
      <span
        className={`grid size-10 shrink-0 place-items-center rounded-full ${tone}`}
      >
        <Icon className="size-5" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">
          {trx.title}
        </p>
        <p className="mt-0.5 truncate text-xs text-ink-500">
          {trx.branchName}
          {trx.vehiclePlate ? ` · ${trx.vehiclePlate}` : ""} ·{" "}
          {dateTime(trx.createdAt, lang)}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p
          className={`text-sm font-bold ${
            primary > 0 ? "text-mint-600" : "text-ink-900"
          }`}
        >
          {isMoney
            ? azn(primary, { sign: true })
            : `${bonus(primary, { sign: true })} ${t("transaction.bonusSuffix")}`}
        </p>
        {trx.amount !== 0 && trx.bonusDelta !== 0 && (
          <p className="text-[11px] font-medium text-sun-600">
            {bonus(trx.bonusDelta, { sign: true })}{" "}
            {t("transaction.bonusSuffix")}
          </p>
        )}
      </div>
    </li>
  );
}
