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
import type { Customer, Vehicle } from "@/lib/types";

interface SessionValue {
  customer: Customer | null;
  loading: boolean;
  /** Hazırda seçili (aktiv) avtomobil — skan/əməliyyat bu maşına yazılır */
  activeVehicle: Vehicle | null;
  setActiveVehicleId: (id: string) => void;
  /** Balans və s. sahələri lokal (optimistik) yeniləyir */
  updateCustomer: (partial: Partial<Customer>) => void;
  signIn: (customer: Customer) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVehicleId, setActiveVehicleId] = useState<string | null>(null);
  const router = useRouter();

  const applyCustomer = useCallback((next: Customer | null) => {
    setCustomer(next);
    setActiveVehicleId(next?.vehicles[0]?.id ?? null);
  }, []);

  const refresh = useCallback(async () => {
    if (!getToken()) {
      applyCustomer(null);
      setLoading(false);
      return;
    }
    try {
      applyCustomer(await api.getProfile());
    } catch {
      setToken(null);
      applyCustomer(null);
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
    },
    [applyCustomer],
  );

  const signOut = useCallback(() => {
    setToken(null);
    applyCustomer(null);
    router.replace("/login");
  }, [router, applyCustomer]);

  const updateCustomer = useCallback((partial: Partial<Customer>) => {
    setCustomer((c) => (c ? { ...c, ...partial } : c));
  }, []);

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
      signIn,
      signOut,
      refresh,
    }),
    [
      customer,
      loading,
      activeVehicle,
      updateCustomer,
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
