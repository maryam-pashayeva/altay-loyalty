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
import type { Customer, Transaction, Vehicle } from "@/lib/types";

interface SessionValue {
  customer: Customer | null;
  loading: boolean;
  /** Hazırda seçili (aktiv) avtomobil — skan/əməliyyat bu maşına yazılır */
  activeVehicle: Vehicle | null;
  setActiveVehicleId: (id: string) => void;
  /** Balans və s. sahələri lokal (optimistik) yeniləyir */
  updateCustomer: (partial: Partial<Customer>) => void;
  /** Əməliyyat tarixçəsi — bütün səhifələr bu vahid siyahını oxuyur */
  transactions: Transaction[] | null;
  /** Yeni əməliyyatı tarixçənin başına yazır (ödəniş, bonus, balans, paket) */
  addTransaction: (trx: Omit<Transaction, "id" | "createdAt">) => void;
  signIn: (customer: Customer) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const router = useRouter();

  const applyCustomer = useCallback((next: Customer | null) => {
    setCustomer(next);
    setActiveVehicleId(next?.vehicles[0]?.id ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      applyCustomer(null);
      setTransactions(null);
      setLoading(false);
      return;
    }
    try {
      const [profile, history] = await Promise.all([
        api.getProfile(),
        api.getTransactions(),
      ]);
      applyCustomer(profile);
      setTransactions(history);
    } catch {
      setToken(null);
      applyCustomer(null);
      setTransactions(null);
    } finally {
      setLoading(false);
    }
  }, [applyCustomer]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  const signIn = useCallback(
    (next: Customer) => {
      applyCustomer(next);
      setLoading(false);
      // Giriş ardınca tarixçə çəkilir; uğursuz olsa boş siyahı qalır.
      void api
        .getTransactions()
        .then(setTransactions)
        .catch(() => setTransactions([]));
    },
    [applyCustomer],
  );

  const signOut = useCallback(() => {
    setToken(null);
    applyCustomer(null);
    setTransactions(null);
    // AuthGuard sessiyasız istifadəçini onsuz da /welcome-ə yönləndirir; eyni
    // hədəfə keçirik ki, iki yönləndirmə yarışmasın (əvvəl /login "ölü" idi).
    router.replace("/welcome");
  }, [router, applyCustomer]);

  const updateCustomer = useCallback((partial: Partial<Customer>) => {
    setCustomer((c) => (c ? { ...c, ...partial } : c));
  }, []);

  const addTransaction = useCallback(
    (trx: Omit<Transaction, "id" | "createdAt">) => {
      const entry: Transaction = {
        ...trx,
        id: `trx_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setTransactions((list) => [entry, ...(list ?? [])]);
    },
    [],
  );

  const activeVehicle = useMemo(
    () =>
      customer?.vehicles.find((v) => v.id === activeVehicleId) ??
      customer?.vehicles[0] ??
      null,
    [customer, activeVehicleId],
  );

  const value = useMemo(
    () => ({
      customer,
      loading,
      activeVehicle,
      setActiveVehicleId,
      updateCustomer,
      transactions,
      addTransaction,
      signIn,
      signOut,
      refresh,
    }),
    [
      customer,
      loading,
      activeVehicle,
      updateCustomer,
      transactions,
      addTransaction,
      signIn,
      signOut,
      refresh,
    ],
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
