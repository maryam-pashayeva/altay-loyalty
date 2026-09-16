"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useT, LANGS } from "@/lib/i18n";
import { birthdayLabel, formatPhone, shortDate } from "@/lib/format";
import { tierOf } from "@/lib/tier";
import { PageHeader } from "@/components/PageHeader";
import { AddVehicleSheet } from "@/components/AddVehicleSheet";
import { AddCardSheet } from "@/components/AddCardSheet";
import { Card, SectionTitle } from "@/components/ui/Card";
import {
  CakeIcon,
  CardIcon,
  CarIcon,
  GlobeIcon,
  LogoutIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/Icons";

const cardBrand: Record<"visa" | "mastercard" | "other", string> = {
  visa: "VISA",
  mastercard: "MC",
  other: "CARD",
};

function readBool(key: string, fallback: boolean) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === "1";
  } catch {
    return fallback;
  }
}

function Toggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative h-6 w-10 shrink-0 rounded-full transition ${
        on ? "bg-blue-600" : "bg-ink-300"
      }`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[1.125rem]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function ProfilePage() {
  const { customer, updateCustomer, signOut } = useSession();
  const { t, lang, setLang } = useT();
  const [addOpen, setAddOpen] = useState(false);
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [notifCampaigns, setNotifCampaigns] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [removingCard, setRemovingCard] = useState<string | null>(null);
  const [birthDraft, setBirthDraft] = useState("");
  const [savingBirth, setSavingBirth] = useState(false);

  useEffect(() => {
    // Bildiriş parametrlərini localStorage-dan bərpa edirik (yalnız brauzerdə).
    /* eslint-disable react-hooks/set-state-in-effect */
    setNotifCampaigns(readBool("altaywash.notif.campaigns", true));
    setNotifReminders(readBool("altaywash.notif.reminders", true));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function setNotif(key: string, setter: (v: boolean) => void, v: boolean) {
    setter(v);
    try {
      localStorage.setItem(key, v ? "1" : "0");
    } catch {}
  }

  /** Doğum gününü yadda saxlayır — hədiyyə kampaniyası bu tarixə baxır */
  async function saveBirthday() {
    if (!customer || !birthDraft) return;
    setSavingBirth(true);
    try {
      await api.updateProfile({ birthDate: birthDraft });
      updateCustomer({ birthDate: birthDraft });
      setBirthDraft("");
    } finally {
      setSavingBirth(false);
    }
  }

  async function removeVehicle(id: string) {
    if (!customer || customer.vehicles.length <= 1) return;
    setRemoving(id);
    try {
      await api.removeVehicle(id);
      updateCustomer({
        vehicles: customer.vehicles.filter((v) => v.id !== id),
      });
    } finally {
      setRemoving(null);
    }
  }

  async function removeCard(id: string) {
    if (!customer) return;
    setRemovingCard(id);
    try {
      await api.removeCard(id);
      updateCustomer({ cards: customer.cards.filter((c) => c.id !== id) });
    } finally {
      setRemovingCard(null);
    }
  }

  if (!customer) return null;

  const tier = tierOf(customer.tier);

  return (
    <main>
      <PageHeader title={t("profile.title")} />

      <div className="px-5">
        <Card className="flex items-center gap-4">
          <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-500/12 text-lg font-semibold text-blue-600">
            {customer.fullName
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold">{customer.fullName}</p>
            <p className="text-xs text-ink-500">{formatPhone(customer.phone)}</p>
            <p className="mt-1 text-[11px] font-medium text-sun-600">
              {t("profile.tierLine", {
                tier: tier.name,
                pct: tier.cashbackPercent,
              })}
            </p>
          </div>
        </Card>

        {/* Doğum günü — hədiyyə üçün */}
        <section className="mt-6">
          <SectionTitle title={t("profile.birthday")} />
          <Card>
            {customer.birthDate ? (
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sun-400/15 text-sun-600">
                  <CakeIcon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {birthdayLabel(customer.birthDate, lang)}
                  </p>
                  <p className="text-[11px] text-ink-500">
                    {t("profile.birthdaySaved")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs leading-relaxed text-ink-500">
                  {t("profile.birthdayPrompt")}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={birthDraft}
                    onChange={(e) => setBirthDraft(e.target.value)}
                    aria-label={t("profile.birthday")}
                    className="h-11 min-w-0 flex-1 rounded-2xl bg-ink-100 px-3 text-sm outline-none ring-1 ring-ink-200 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={saveBirthday}
                    disabled={!birthDraft || savingBirth}
                    className="h-11 shrink-0 rounded-2xl bg-blue-600 px-4 text-xs font-semibold text-white transition active:scale-95 disabled:opacity-40"
                  >
                    {savingBirth ? t("profile.saving") : t("profile.save")}
                  </button>
                </div>
              </>
            )}
          </Card>
        </section>

        {/* Qaraj */}
        <section className="mt-6">
          <SectionTitle
            title={t("profile.garage")}
            action={
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-1 rounded-full bg-blue-500/12 px-3 py-1.5 text-xs font-medium text-blue-600 transition active:scale-95"
              >
                <PlusIcon className="size-4" />
                {t("profile.newCar")}
              </button>
            }
          />
          <Card className="space-y-1 p-2">
            {customer.vehicles.map((v) => (
              <div key={v.id} className="flex items-center gap-3 rounded-xl p-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600">
                  <CarIcon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="plate inline-block rounded border border-ink-200 bg-white px-1.5 py-0.5 text-[13px] leading-none text-ink-950">
                    {v.plate}
                  </p>
                  <p className="mt-1 truncate text-xs text-ink-500">{v.model}</p>
                </div>
                {customer.vehicles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVehicle(v.id)}
                    disabled={removing === v.id}
                    aria-label={t("profile.delete")}
                    className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-400 transition active:scale-95 disabled:opacity-40"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                )}
              </div>
            ))}
          </Card>
        </section>

        {/* Mənim kartlarım */}
        <section className="mt-6">
          <SectionTitle
            title={t("cards.title")}
            action={
              <button
                type="button"
                onClick={() => setAddCardOpen(true)}
                className="flex items-center gap-1 rounded-full bg-blue-500/12 px-3 py-1.5 text-xs font-medium text-blue-600 transition active:scale-95"
              >
                <PlusIcon className="size-4" />
                {t("cards.add")}
              </button>
            }
          />
          <Card className="space-y-1 p-2">
            {customer.cards.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-ink-400">
                {t("cards.empty")}
              </p>
            ) : (
              customer.cards.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl p-2"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-600">
                    <CardIcon className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <span className="grid h-5 w-8 shrink-0 place-items-center rounded bg-ink-900 text-[9px] font-bold tracking-wide text-white">
                        {cardBrand[c.brand]}
                      </span>
                      •••• {c.last4}
                    </p>
                    <p className="text-[11px] text-ink-500">
                      {t("cards.expires", {
                        mm: String(c.expMonth).padStart(2, "0"),
                        yy: String(c.expYear).padStart(2, "0"),
                      })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCard(c.id)}
                    disabled={removingCard === c.id}
                    aria-label={t("profile.delete")}
                    className="grid size-9 shrink-0 place-items-center rounded-xl text-ink-400 transition active:scale-95 disabled:opacity-40"
                  >
                    <TrashIcon className="size-5" />
                  </button>
                </div>
              ))
            )}
          </Card>
          <p className="mt-2 px-1 text-[11px] leading-relaxed text-ink-400">
            {t("addCard.secureNote")}
          </p>
        </section>

        {/* Dil */}
        <section className="mt-6">
          <SectionTitle title={t("profile.language")} />
          <Card className="flex items-center gap-3">
            <GlobeIcon className="size-5 shrink-0 text-ink-500" />
            <span className="flex-1 text-sm">{t("profile.appLanguage")}</span>
            <div className="flex gap-1 rounded-full bg-ink-100 p-1">
              {LANGS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLang(l.value)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    lang === l.value
                      ? "bg-white text-ink-900 shadow-sm"
                      : "text-ink-500"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Bildiriş parametrləri */}
        <section className="mt-6">
          <SectionTitle title={t("profile.notifSettings")} />
          <Card className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {t("profile.notifCampaigns")}
                </p>
                <p className="text-[11px] text-ink-500">
                  {t("profile.notifCampaignsDesc")}
                </p>
              </div>
              <Toggle
                on={notifCampaigns}
                onChange={(v) =>
                  setNotif(
                    "altaywash.notif.campaigns",
                    setNotifCampaigns,
                    v,
                  )
                }
              />
            </div>
            <div className="flex items-center gap-3 border-t border-ink-200 pt-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {t("profile.notifReminders")}
                </p>
                <p className="text-[11px] text-ink-500">
                  {t("profile.notifRemindersDesc")}
                </p>
              </div>
              <Toggle
                on={notifReminders}
                onChange={(v) =>
                  setNotif(
                    "altaywash.notif.reminders",
                    setNotifReminders,
                    v,
                  )
                }
              />
            </div>
          </Card>
          <p className="mt-2 px-1 text-[11px] leading-relaxed text-ink-400">
            {t("profile.pushNote")}
          </p>
        </section>

        <p className="mt-6 text-center text-[11px] text-ink-400">
          {t("profile.memberSince", {
            date: shortDate(customer.createdAt, lang),
          })}
        </p>

        <button
          onClick={signOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-100 py-3.5 text-sm text-red-500"
        >
          <LogoutIcon className="size-5" />
          {t("profile.signOut")}
        </button>
      </div>

      <AddVehicleSheet open={addOpen} onClose={() => setAddOpen(false)} />
      <AddCardSheet open={addCardOpen} onClose={() => setAddCardOpen(false)} />
    </main>
  );
}
