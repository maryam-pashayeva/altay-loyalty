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

export const api = {
  /** Telefon nömrəsi ilə giriş edir və sessiya qaytarır */
  async login(phone: string): Promise<Session> {
    if (USE_MOCK) {
      await delay();
      const session: Session = {
        token: "mock-token",
        customer: { ...mockCustomer, phone },
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
};

export { USE_MOCK };
