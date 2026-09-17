"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { azn } from "@/lib/format";
import { useT } from "@/lib/i18n";
import { copyCode, inviteUrl, shareInvite } from "@/lib/share";
import type { Campaign } from "@/lib/types";
import { Sheet } from "@/components/ui/Sheet";
import { CopyIcon, QrIcon } from "@/components/Icons";

/**
 * Dəvət kampaniyası. Ümumi kampaniya sətrindən çıxarılıb, çünki burada
 * göstəriləsi əsl məlumat var: dəvətin nəticəsi, link və paylaşma yolu.
 */
export function ReferralCard({ campaign }: { campaign: Campaign }) {
  const { t } = useT();
  const share = campaign.share!;
  const link = inviteUrl(share.code);
  const [note, setNote] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  // QR yalnız vərəq açılanda çəkilir
  useEffect(() => {
    if (!qrOpen || qr) return;
    void QRCode.toDataURL(link, {
      width: 512,
      margin: 1,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then(setQr)
      .catch(() => setQr(null));
  }, [qrOpen, qr, link]);

  // Bildiriş özü sönür
  useEffect(() => {
    if (!note) return;
    const id = setTimeout(() => setNote(null), 2600);
    return () => clearTimeout(id);
  }, [note]);

  async function onShare() {
    const outcome = await shareInvite(
      share.code,
      t("campaign.shareText", { code: share.code }),
    );
    if (outcome === "shared") setNote(t("campaign.done.shared"));
    if (outcome === "copied") setNote(t("campaign.done.copied"));
  }

  const stats = [
    { value: share.joined, label: t("referral.joined") },
    { value: share.activated, label: t("referral.activated") },
    { value: azn(share.earned), label: t("referral.earned") },
  ];

  return (
    <>
      <div className="card overflow-hidden">
        {/* Başlıq — illüstrasiya ilə */}
        <div className="relative overflow-hidden bg-linear-to-br from-sun-400/25 via-orange-100 to-rose-100 px-4 pb-4 pt-5">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-[17px] font-bold leading-snug tracking-tight text-ink-900">
                {t("referral.title")}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
                {campaign.description}
              </p>
            </div>
            <Image
              src="/onboarding/slide-3-reward.png"
              alt=""
              width={88}
              height={88}
              /* Şəklin ağ fonu qradiyentin üstündə kvadrat ləkə kimi
                 görünməsin deyə qarışdırılır. */
              className="-my-1 size-[88px] shrink-0 object-contain mix-blend-multiply"
            />
          </div>

          {/* Nəticə — dəvətin nə verdiyi */}
          <div className="mt-3 flex items-stretch rounded-2xl bg-white/70 py-3 backdrop-blur-sm">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`flex-1 px-2 text-center ${
                  i > 0 ? "border-l border-ink-200" : ""
                }`}
              >
                <p className="text-lg font-bold leading-none text-ink-900">
                  {s.value}
                </p>
                <p className="mt-1.5 text-[10px] leading-tight text-ink-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Link və hərəkətlər */}
        <div className="p-4">
          <button
            type="button"
            onClick={async () => {
              if (await copyCode(link)) setNote(t("referral.linkCopied"));
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-ink-100 px-3 py-2.5 text-left transition active:scale-[0.99]"
          >
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-ink-700">
              {link}
            </span>
            <CopyIcon className="size-4 shrink-0 text-ink-400" />
          </button>

          <div className="mt-2.5 flex gap-2">
            <button
              type="button"
              onClick={onShare}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-semibold text-white transition active:scale-[0.98]"
            >
              <ShareGlyph />
              {t("referral.share")}
            </button>
            <button
              type="button"
              onClick={() => setQrOpen(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl border border-ink-200 px-4 text-sm font-semibold text-ink-900 transition active:scale-[0.98]"
            >
              <QrIcon className="size-5" />
              QR
            </button>
          </div>

          {note && (
            <p className="rise mt-2.5 text-center text-xs font-medium text-mint-600">
              {note}
            </p>
          )}
        </div>
      </div>

      {/* QR vərəqi — dost telefonu ilə oxuyur */}
      <Sheet
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        title={t("referral.qrTitle")}
      >
        <p className="text-center text-xs leading-relaxed text-ink-500">
          {t("referral.qrHint")}
        </p>
        <div className="mx-auto mt-4 grid size-56 place-items-center rounded-3xl border border-ink-200 bg-white p-3">
          {qr ? (
            <Image src={qr} alt={t("referral.qrTitle")} width={512} height={512} unoptimized className="size-full" />
          ) : (
            <span className="text-xs text-ink-400">…</span>
          )}
        </div>
        <p className="mt-4 text-center font-mono text-sm font-semibold tracking-widest text-ink-900">
          {share.code}
        </p>
      </Sheet>
    </>
  );
}

function ShareGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[18px]"
      aria-hidden
    >
      <circle cx="18" cy="5.5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="18.5" r="2.5" />
      <path d="M8.2 10.8 15.8 6.7M8.2 13.2l7.6 4.1" />
    </svg>
  );
}
