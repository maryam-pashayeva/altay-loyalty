"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { AltayLogo } from "@/components/AltayLogo";

const slides = [
  {
    image: "/onboarding/slide-1-wash.png",
    title: "Xoş gəldin, Altay!",
    text: "Hər yumada xal qazan, xalları növbəti yumada endirimə çevir.",
  },
  {
    image: "/onboarding/slide-2-scan.png",
    title: "QR-ı skan et",
    text: "Terminaldakı QR kodu telefonunla oxu — xalın avtomatik hesabına yazılsın.",
  },
  {
    image: "/onboarding/slide-3-reward.png",
    title: "Xallarını hədiyyəyə çevir",
    text: "Kifayət qədər xal topladıqda pulsuz yuma və ya endirim qazanırsan.",
  },
];

export default function WelcomePage() {
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
            {slides.map(({ image, title, text }) => (
              <section key={title} className="w-full shrink-0 px-1 text-center">
                {/* Şəkillərin fonu ağdır; səhifə fonu da ağ olduğu üçün
                    heç bir görünən kənar/qutu yaranmır. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={title}
                  className="mx-auto aspect-square w-full max-w-[19rem] object-contain"
                />
                <h1 className="mt-8 text-2xl font-bold tracking-tight text-ink-900">
                  {title}
                </h1>
                <p className="mx-auto mt-2 max-w-[19rem] text-sm leading-relaxed text-ink-500">
                  {text}
                </p>
              </section>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="mt-7 flex items-center justify-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.title}
              type="button"
              aria-label={`Slayd ${idx + 1}`}
              onClick={() => setI(idx)}
              className={`h-2 rounded-full transition-all ${
                i === idx ? "w-6 bg-blue-600" : "w-2 bg-ink-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <ButtonLink href="/login">Daxil ol</ButtonLink>
        <p className="text-center text-sm text-ink-500">
          Hesabınız yoxdur?{" "}
          <Link href="/login" className="font-semibold text-blue-600">
            Qeydiyyatdan keçin
          </Link>
        </p>
      </div>
    </main>
  );
}
