import type {
  Branch,
  Campaign,
  Customer,
  Session,
  Transaction,
  WashPackage,
} from "@/lib/types";
import { request, setToken } from "./client";
import {
  mockBranches,
  mockCampaigns,
  mockCustomer,
  mockPackages,
  mockTransactions,
} from "./mock-data";

/**
 * NEXT_PUBLIC_ERP_API_URL təyin olunmayıbsa tətbiq mock rejimdə işləyir.
 * Real ERP qoşulanda .env.local-da URL-i yazmaq kifayətdir.
 */
const USE_MOCK = !process.env.NEXT_PUBLIC_ERP_API_URL;

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

/* --- Mock rejim üçün lokal müştəri reyestri ---
   Real ERP qoşulanda bu hissə istifadə olunmur. */
const REGISTRY_KEY = "altaywash.customers";

function readRegistry(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(REGISTRY_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeRegistry(map: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REGISTRY_KEY, JSON.stringify(map));
}

/** Demo üçün öncədən qeydiyyatlı nömrə (köhnə müştəri) */
const SEEDED_PHONE = mockCustomer.phone.replace(/\D/g, "");

export const api = {
  /** Nömrənin sistemdə mövcud olub-olmadığını yoxlayır.
   *  Yenidirsə ad-soyad tələb olunacaq, köhnədirsə yalnız telefon kifayətdir. */
  async checkCustomer(phone: string): Promise<{ exists: boolean }> {
    if (USE_MOCK) {
      await delay(300);
      const digits = phone.replace(/\D/g, "");
      const exists =
        digits === SEEDED_PHONE || digits in readRegistry();
      return { exists };
    }
    return request("/auth/check", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
  },

  /** Köhnə müştəri — yalnız telefon nömrəsi ilə giriş */
  async signIn(phone: string): Promise<Session> {
    if (USE_MOCK) {
      await delay();
      const digits = phone.replace(/\D/g, "");
      const savedName = readRegistry()[digits];
      const session: Session = {
        token: "mock-token",
        customer: {
          ...mockCustomer,
          phone,
          ...(savedName ? { fullName: savedName } : {}),
        },
      };
      setToken(session.token);
      return session;
    }
    const session = await request<Session>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ phone }),
    });
    setToken(session.token);
    return session;
  },

  /** Yeni müştəri — ad-soyad və telefon nömrəsi ilə qeydiyyat */
  async signUp(phone: string, fullName: string): Promise<Session> {
    if (USE_MOCK) {
      await delay(500);
      const digits = phone.replace(/\D/g, "");
      const registry = readRegistry();
      registry[digits] = fullName;
      writeRegistry(registry);
      const session: Session = {
        token: "mock-token",
        customer: {
          ...mockCustomer,
          phone,
          fullName,
          // Yeni müştəri sıfır balansla başlayır
          bonusBalance: 0,
          walletBalance: 0,
          washesLeft: 0,
          yearlySpend: 0,
          tier: "silver",
        },
      };
      setToken(session.token);
      return session;
    }
    const session = await request<Session>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ phone, fullName }),
    });
    setToken(session.token);
    return session;
  },

  async getProfile(): Promise<Customer> {
    if (USE_MOCK) {
      await delay(200);
      return mockCustomer;
    }
    return request("/me");
  },

  async getTransactions(): Promise<Transaction[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockTransactions;
    }
    return request("/me/transactions");
  },

  async getCampaigns(): Promise<Campaign[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockCampaigns;
    }
    return request("/campaigns");
  },

  async getPackages(): Promise<WashPackage[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockPackages;
    }
    return request("/packages");
  },

  async getBranches(): Promise<Branch[]> {
    if (USE_MOCK) {
      await delay(200);
      return mockBranches;
    }
    return request("/branches");
  },

  /** Paket alışı — real inteqrasiyada ödəniş provayderinə yönləndirmə qaytarır */
  async purchasePackage(packageId: string): Promise<{ redirectUrl?: string }> {
    if (USE_MOCK) {
      await delay(600);
      return {};
    }
    return request("/orders", {
      method: "POST",
      body: JSON.stringify({ packageId }),
    });
  },

  /**
   * Terminalın QR kodu oxunduqda çağırılır — ERP həmin terminalı/əməliyyatı
   * tapıb müştərinin hesabına xal yazır və nəticəni qaytarır.
   */
  async scanTerminal(
    code: string,
    vehiclePlate?: string,
  ): Promise<{
    points: number;
    title: string;
    branchName: string;
    vehiclePlate?: string;
  }> {
    if (USE_MOCK) {
      await delay(700);
      if (!code || code.trim().length < 4) {
        throw new Error("QR kod tanınmadı. Yenidən cəhd edin.");
      }
      return {
        points: 5,
        title: "Kompleks yuma",
        branchName: "Altaywash Xətai",
        vehiclePlate,
      };
    }
    return request("/scan", {
      method: "POST",
      body: JSON.stringify({ code, vehiclePlate }),
    });
  },
};

export { USE_MOCK };
