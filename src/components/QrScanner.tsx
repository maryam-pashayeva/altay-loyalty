"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { FlashIcon, FlashOffIcon } from "@/components/Icons";

/**
 * Kamera ilə QR skaneri. Mount olan kimi kamera avtomatik açılır (əlavə düymə
 * yoxdur). Terminaldakı QR oxunanda `onResult` çağırılır. Cihaz dəstəkləyirsə
 * fənər (torch) düyməsi göstərilir.
 */
export function QrScanner({ onResult }: { onResult: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [status, setStatus] = useState<"starting" | "scanning" | "denied">(
    "starting",
  );
  const [torch, setTorch] = useState({ available: false, on: false });

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    let stream: MediaStream | null = null;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    function cleanup() {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
    }

    function tick() {
      if (cancelled) return;
      const video = videoRef.current;
      if (video && ctx && video.readyState >= video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const { data, width, height } = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );
        const found = jsQR(data, width, height, {
          inversionAttempts: "dontInvert",
        });
        if (found?.data) {
          cleanup();
          onResult(found.data);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    }

    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        const track = s.getVideoTracks()[0];
        trackRef.current = track;
        const caps = track.getCapabilities?.() as
          | { torch?: boolean }
          | undefined;
        if (caps?.torch) setTorch({ available: true, on: false });

        const video = videoRef.current;
        if (!video) return;
        video.srcObject = s;
        void video.play();
        setStatus("scanning");
        raf = requestAnimationFrame(tick);
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });

    return cleanup;
  }, [onResult]);

  async function toggleTorch() {
    const track = trackRef.current;
    if (!track) return;
    const next = !torch.on;
    try {
      await track.applyConstraints({
        advanced: [{ torch: next } as MediaTrackConstraintSet],
      });
      setTorch((t) => ({ ...t, on: next }));
    } catch {
      // cihaz fənəri dəstəkləmir
    }
  }

  if (status === "denied") {
    return (
      <div className="grid aspect-square w-full place-items-center rounded-3xl bg-ink-100 p-6 text-center">
        <p className="text-sm font-semibold text-ink-900">
          Kameraya icazə verilmədi
          <span className="mt-1 block text-xs font-normal leading-relaxed text-ink-500">
            Skan üçün brauzer parametrlərindən kameraya icazə verin. Alternativ
            olaraq aşağıdan kodu əllə daxil edə bilərsiniz.
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-ink-950">
      <video
        ref={videoRef}
        playsInline
        muted
        className="size-full object-cover"
      />

      {/* Skan çərçivəsi */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="relative size-3/5">
          <span className="absolute left-0 top-0 size-8 rounded-tl-xl border-l-4 border-t-4 border-white" />
          <span className="absolute right-0 top-0 size-8 rounded-tr-xl border-r-4 border-t-4 border-white" />
          <span className="absolute bottom-0 left-0 size-8 rounded-bl-xl border-b-4 border-l-4 border-white" />
          <span className="absolute bottom-0 right-0 size-8 rounded-br-xl border-b-4 border-r-4 border-white" />
        </div>
      </div>

      {status === "starting" && (
        <div className="absolute inset-0 grid place-items-center bg-ink-950/60 text-sm text-white/80">
          Kamera açılır…
        </div>
      )}

      {torch.available && status === "scanning" && (
        <button
          type="button"
          onClick={toggleTorch}
          aria-label="Fənər"
          className={`absolute bottom-4 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full backdrop-blur transition ${
            torch.on ? "bg-white text-ink-900" : "bg-white/20 text-white"
          }`}
        >
          {torch.on ? (
            <FlashIcon className="size-6" />
          ) : (
            <FlashOffIcon className="size-6" />
          )}
        </button>
      )}
    </div>
  );
}
