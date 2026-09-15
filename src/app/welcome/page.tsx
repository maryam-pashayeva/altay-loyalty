"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/Button";
import { AltayLogo } from "@/components/AltayLogo";

const slides = [
  {
    id: "slide1",
    image: "/onboarding/slide-1-wash.png",
    titleKey: "welcome.slide1.title",
    textKey: "welcome.slide1.text",
  },
  {
    id: "slide2",
    image: "/onboarding/slide-2-scan.png",
    titleKey: "welcome.slide2.title",
    textKey: "welcome.slide2.text",
  },
  {
    id: "slide3",
    image: "/onboarding/slide-3-reward.png",
    titleKey: "welcome.slide3.title",
    textKey: "welcome.slide3.text",
  },
];

export default function WelcomePage() {
  const { t } = useT();
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (dx < -40) setI((v) => Math.min(v + 1, slides.length - 1));
    else if (dx > 40) setI((v) => Math.max(v - 1, 0));
    startX.current = null;
  }

  return (
    <main className="flex min-h-dvh flex-col bg-white px-6 pb-10 pt-10">
      <AltayLogo className="h-7 text-ink-900" />

      <div className="flex flex-1 flex-col justify-center">
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {slides.map(({ id, image, titleKey, textKey }) => (
              <section key={id} className="w-full shrink-0 px-1 text-center">
                {/* Şəkillərin fonu ağdır; səhifə fonu da ağ olduğu üçün
                    heç bir görünən kənar/qutu yaranmır. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={t(titleKey)}
                  className="mx-auto aspect-square w-full max-w-[19rem] object-contain"
                />
                <h1 className="mt-8 text-2xl font-bold tracking-tight text-ink-900">
                  {t(titleKey)}
                </h1>
                <p className="mx-auto mt-2 max-w-[19rem] text-sm leading-relaxed text-ink-500">
                  {t(textKey)}
                </p>
              </section>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-7 flex items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              aria-label={t("welcome.slideAria", { n: idx + 1 })}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-blue-600" : "w-2 bg-ink-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <ButtonLink href="/login">{t("welcome.signIn")}</ButtonLink>
        <p className="text-center text-sm text-ink-500">
          {t("welcome.noAccount")}{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            {t("welcome.register")}
          </Link>
        </p>
      </div>
    </main>
  );
}
