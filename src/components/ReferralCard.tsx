"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n";
import { copyCode, shareInvite } from "@/lib/share";
import type { Campaign } from "@/lib/types";
import { CopyIcon, GiftIcon } from "@/components/Icons";

/**
 * Dəvət kampaniyası üçün kart. Ümumi kampaniya sətrindən fərqli olaraq işi
 * kartın özündə bitir: kod görünür, paylaşma bir toxunuşdadır. Kodu tıklama
 * arxasında gizlətmək bu kampaniyanı mənasız edirdi.
 */
export function ReferralCard({ campaign }: { campaign: Campaign }) {
  const { t } = useT();
  const code = campaign.share!.code;
  const [note, setNote] = useState<string | null>(null);

  async function share() {
    const outcome = await shareInvite(code, t("campaign.shareText", { code }));
    if (outcome === "shared") setNote(t("campaign.done.shared"));
    if (outcome === "copied") setNote(t("campaign.done.copied"));
  }

  async function copy() {
    if (await copyCode(code)) setNote(t("campaign.codeCopied"));
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-start gap-3 p-4 pb-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-500/12 text-blue-600">
          <GiftIcon className="size-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink-900">
            {t("campaign.invite")}
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-ink-500">
            {campaign.description}
          </p>
        </div>
      </div>

      {/* Kod — kartın üzərində, çünki paylaşılacaq şey budur */}
      <div className="px-4">
        <button
          type="button"
          onClick={copy}
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-dashed border-ink-300 bg-ink-50 px-3 py-2.5 text-left transition active:scale-[0.99]"
        >
          <span className="min-w-0">
            <span className="block text-[10px] text-ink-500">
              {t("campaign.inviteCode")}
            </span>
            <span className="mt-0.5 block truncate font-mono text-sm font-semibold tracking-widest text-ink-900">
              {code}
            </span>
          </span>
          <CopyIcon className="size-5 shrink-0 text-ink-400" />
        </button>
      </div>

      <div className="p-4 pt-3">
        <button
          type="button"
          onClick={share}
          className="flex h-11 w-full items-center justify-center rounded-2xl bg-blue-600 text-sm font-semibold text-white transition active:scale-[0.98]"
        >
          {campaign.ctaLabel ?? t("campaign.invite")}
        </button>
        {note && (
          <p className="rise mt-2 text-center text-xs font-medium text-mint-600">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
