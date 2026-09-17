"use client";

import type { ComponentType } from "react";
import { azn, bonus, dateTime } from "@/lib/format";
import { useT } from "@/lib/i18n";
import type { Transaction } from "@/lib/types";
import {
  DropIcon,
  GiftIcon,
  PackageIcon,
  WalletIcon,
} from "@/components/Icons";
import { IconTile, type Tone } from "@/components/ui/IconTile";

type Meta = {
  Icon: ComponentType<{ className?: string }>;
  tone: Tone;
};

const meta: Record<Transaction["kind"], Meta> = {
  wash: { Icon: DropIcon, tone: "blue" },
  topup: { Icon: WalletIcon, tone: "mint" },
  package: { Icon: PackageIcon, tone: "blue" },
  bonus_earned: { Icon: GiftIcon, tone: "amber" },
  bonus_spent: { Icon: GiftIcon, tone: "amber" },
};

export function TransactionItem({ trx }: { trx: Transaction }) {
  const { t, lang } = useT();
  const { Icon, tone } = meta[trx.kind];
  // Məbləğ varsa manat, yoxdursa (saf bonus əməliyyatı) bonus xalı göstərilir
  const isMoney = trx.amount !== 0;
  const primary = isMoney ? trx.amount : trx.bonusDelta;

  return (
    <li className="flex items-center gap-3 py-3">
      <IconTile Icon={Icon} tone={tone} size="sm" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">
          {trx.titleKey ? t(trx.titleKey) : trx.title}
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
