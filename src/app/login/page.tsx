"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { formatPhone, phoneDigits } from "@/lib/format";
import { useSession } from "@/lib/session";
import { AltayLogo } from "@/components/AltayLogo";
import { Button } from "@/components/ui/Button";

type Phase = "phone" | "register";

export default function LoginPage() {
  const [phase, setPhase] = useState<Phase>("phone");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { signIn } = useSession();
  const router = useRouter();

  const digits = phoneDigits(phone);

  async function continueWithPhone() {
    setError(null);
    setBusy(true);
    try {
      const full = `+994${digits}`;
      const { exists } = await api.checkCustomer(full);
      if (exists) {
        // Köhnə müştəri — yalnız telefon kifayətdir
        const session = await api.signIn(full);
        signIn(session.customer);
        router.replace("/");
      } else {
        // Yeni müştəri — ad-soyad tələb olunur
        setPhase("register");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xəta baş verdi");
    } finally {
      setBusy(false);
    }
  }

  async function register() {
    setError(null);
    setBusy(true);
    try {
      const session = await api.signUp(`+994${digits}`, fullName.trim());
      signIn(session.customer);
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Qeydiyyat alınmadı");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh flex-col justify-between px-6 pb-10 pt-14">
      <div>
        <AltayLogo className="h-7 text-ink-900" />

        <h1 className="mt-8 text-2xl font-bold tracking-tight text-ink-900">
          {phase === "phone" ? "Daxil ol" : "Qeydiyyat"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {phase === "phone"
            ? "Telefon nömrənlə davam et — parol yoxdur."
            : "Bu nömrə ilk dəfədir — adını yaz, kifayətdir."}
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-xs font-medium text-ink-500"
            >
              Telefon nömrəniz
            </label>
            <div className="flex items-center gap-2">
              <span className="grid h-14 shrink-0 place-items-center rounded-2xl bg-ink-100 px-3 text-sm font-medium text-ink-500 ring-1 ring-ink-200">
                🇦🇿 +994
              </span>
              <input
                id="phone"
                inputMode="tel"
                autoFocus={phase === "phone"}
                disabled={phase === "register"}
                placeholder="50 123 45 67"
                value={formatPhone(phone).replace("+994 ", "")}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 w-full rounded-2xl bg-ink-100 px-4 text-lg tracking-wide outline-none ring-1 ring-ink-200 focus:ring-blue-500 disabled:opacity-60"
              />
            </div>
          </div>

          {phase === "register" && (
            <div className="rise">
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-medium text-ink-500"
              >
                Ad, soyad
              </label>
              <input
                id="name"
                autoFocus
                placeholder="Rəşad Məmmədov"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-14 w-full rounded-2xl bg-ink-100 px-4 text-lg outline-none ring-1 ring-ink-200 focus:ring-blue-500"
              />
            </div>
          )}

          {error && <p className="px-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="space-y-3">
        {phase === "phone" ? (
          <Button
            onClick={continueWithPhone}
            disabled={digits.length !== 9 || busy}
          >
            {busy ? "Yoxlanılır…" : "Davam et"}
          </Button>
        ) : (
          <>
            <Button
              onClick={register}
              disabled={fullName.trim().length < 3 || busy}
            >
              {busy ? "Yaradılır…" : "Hesab yarat"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPhase("phone");
                setError(null);
              }}
            >
              Nömrəni dəyiş
            </Button>
          </>
        )}
        <p className="text-center text-[11px] leading-relaxed text-ink-400">
          Davam etməklə istifadə şərtləri və məxfilik siyasəti ilə razılaşırsınız.
        </p>
      </div>
    </main>
  );
}
