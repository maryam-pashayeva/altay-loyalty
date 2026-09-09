"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getToken, setToken } from "@/lib/api/client";
import type { Customer } from "@/lib/types";

interface SessionValue {
  customer: Customer | null;
  loading: boolean;
  signIn: (customer: Customer) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refresh = useCallback(async () => {
    if (!getToken()) {
      setCustomer(null);
      setLoading(false);
      return;
    }
    try {
      setCustomer(await api.getProfile());
    } catch {
      setToken(null);
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Sessiyanın ilkin bərpası: localStorage-dakı token yalnız brauzerdə
    // oxunur, ona görə bu, effekt daxilində baş verməlidir.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const signIn = useCallback((next: Customer) => {
    setCustomer(next);
    setLoading(false);
  }, []);

  const signOut = useCallback(() => {
    setToken(null);
    setCustomer(null);
    router.replace("/login");
  }, [router]);

  const value = useMemo(
    () => ({ customer, loading, signIn, signOut, refresh }),
    [customer, loading, signIn, signOut, refresh],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession yalnız SessionProvider daxilində işləyir");
  return ctx;
}
