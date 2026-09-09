import { azn, dateTime } from "@/lib/format";
import type { Transaction } from "@/lib/types";

const labels: Record<Transaction["kind"], { text: string; tone: string }> = {
  wash: { text: "Yuma", tone: "bg-ink-100 text-ink-500" },
  topup: { text: "Artırım", tone: "bg-mint-100 text-mint-600" },
  bonus_earned: { text: "Bonus", tone: "bg-sun-400/15 text-sun-600" },
  bonus_spent: { text: "Bonus xərci", tone: "bg-sun-400/10 text-sun-600/80" },
};

export function TransactionItem({ trx }: { trx: Transaction }) {
  const badge = labels[trx.kind];
  const primary = trx.amount !== 0 ? trx.amount : trx.bonusDelta;

  return (
    <li className="flex items-center gap-3 py-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{trx.title}</p>
          <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${badge.tone}`}>
            {badge.text}
          </span>
        </div>
        <p className="mt-0.5 truncate text-xs text-ink-400">
          {trx.branchName}
          {trx.vehiclePlate ? ` · ${trx.vehiclePlate}` : ""} ·{" "}
          {dateTime(trx.createdAt)}
        </p>
      </div>

      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            primary > 0 ? "text-mint-600" : "text-ink-900"
          }`}
        >
          {azn(primary, { sign: true })}
        </p>
        {trx.amount !== 0 && trx.bonusDelta !== 0 && (
          <p className="text-[11px] text-sun-600">
            {azn(trx.bonusDelta, { sign: true })} bonus
          </p>
        )}
      </div>
    </li>
  );
}
