"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatPhone, phoneDigits } from "@/lib/format";
import { useSession } from "@/lib/session";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn } = useSession();
  const router = useRouter();

  const digits = phoneDigits(phone);

  async function login() {
    setError(null);
    setBusy(true);
    try {
      const session = await api.login(`+994${digits}`);
      signIn(session.customer);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xəta baş verdi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col justify-between px-6 pb-10 pt-16">
      <div>
        <div className="grid size-16 place-items-center rounded-3xl bg-aqua-500/12">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon.svg" alt="" className="size-10" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">
          Altaywash Loyalty
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          Nömrənizi daxil edin və hesabınıza daxil olun.
        </p>

        <div className="mt-8 space-y-3">
          <input
            inputMode="tel"
            autoFocus
            placeholder="+994 __ ___ __ __"
            value={formatPhone(phone)}
            onChange={(e) => setPhone(e.target.value)}
            className="h-14 w-full rounded-2xl bg-ink-100 px-4 text-lg tracking-wide outline-none ring-1 ring-ink-200 focus:ring-aqua-500"
          />

          {error && <p className="px-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={login} disabled={digits.length !== 9 || busy}>
          {busy ? "Daxil olunur…" : "Daxil ol"}
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-ink-400">
          Davam etməklə istifadə şərtləri və məxfilik siyasəti ilə razılaşırsınız.
        </p>
      </div>
    </main>
  );
}
