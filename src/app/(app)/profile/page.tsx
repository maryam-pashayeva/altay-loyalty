"use client";

import Link from "next/link";
import { useSession } from "@/lib/session";
import { shortDate } from "@/lib/format";
import { tierOf } from "@/lib/tier";
import { PageHeader } from "@/components/PageHeader";
import { Card, SectionTitle } from "@/components/ui/Card";
import {
  CarIcon,
  ChevronIcon,
  LogoutIcon,
  PinIcon,
  PlusIcon,
  GiftIcon,
} from "@/components/Icons";

const links = [
  { href: "/packages", label: "Paketlər və balans", Icon: GiftIcon },
  { href: "/branches", label: "Filiallar", Icon: PinIcon },
];

export default function ProfilePage() {
  const { customer, signOut } = useSession();
  if (!customer) return null;

  const tier = tierOf(customer.tier);

  return (
    <main>
      <PageHeader title="Profil" />

      <div className="px-5">
        <Card className="flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-aqua-500/12 text-lg font-semibold text-aqua-600">
            {customer.fullName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{customer.fullName}</p>
            <p className="text-xs text-ink-500">{customer.phone}</p>
            <p className="mt-1 text-[11px] text-sun-600">
              {tier.name} · {tier.cashbackPercent}% bonus
            </p>
          </div>
        </Card>

        <section className="mt-6">
          <SectionTitle
            title="Avtomobillərim"
            action={
              <button
                type="button"
                className="flex items-center gap-1 rounded-full bg-aqua-500/12 px-3 py-1.5 text-xs font-medium text-aqua-600 transition active:scale-95"
              >
                <PlusIcon className="size-4" />
                Yeni maşın
              </button>
            }
          />
          <Card className="space-y-3">
            {customer.vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-3">
                <CarIcon className="size-5 text-ink-400" />
                <div>
                  <p className="text-sm font-medium">{v.plate}</p>
                  <p className="text-[11px] text-ink-400">{v.model}</p>
                </div>
              </div>
            ))}
          </Card>
        </section>

        <section className="mt-6">
          <SectionTitle title="Bölmələr" />
          <Card className="divide-y divide-ink-200 p-0">
            {links.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3.5"
              >
                <Icon className="size-5 text-ink-400" />
                <span className="flex-1 text-sm">{label}</span>
                <ChevronIcon className="size-4 text-ink-400" />
              </Link>
            ))}
          </Card>
        </section>

        <p className="mt-6 text-center text-[11px] text-ink-400">
          Üzv olma tarixi: {shortDate(customer.createdAt)}
        </p>

        <button
          onClick={signOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-100 py-3.5 text-sm text-red-500"
        >
          <LogoutIcon className="size-5" />
          Hesabdan çıx
        </button>
      </div>
    </main>
  );
}
