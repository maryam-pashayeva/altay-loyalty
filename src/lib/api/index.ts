import type {
  Branch,
  Campaign,
  Customer,
  SavedCard,
  ScanResult,
  Session,
  Transaction,
  Vehicle,
  WashPackage,
  WashScan,
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

/**
 * Test/demo üçün xidmət sonu QR formatı:
 *   ALTAY:WASH:<məbləğ>[:<xidmət adı>[:<filial>]]
 * Məsələn:  ALTAY:WASH:25         → 25 ₼-lik "Kompleks yuma"
 *           ALTAY:WASH:38:Mum     → 38 ₼-lik "Mum"
 * Format uyğun gəlmirsə null qaytarır (deməli terminal QR-ıdır).
 */
function parseWashCode(raw: string): WashScan | null {
  const m = /^ALTAY:WASH:([\d.,]+)(?::([^:]*))?(?::([^:]*))?$/i.exec(raw);
  if (!m) return null;

  const amount = Number(m[1].replace(",", "."));
  if (!Number.isFinite(amount) || amount <= 0) return null;

  return {
    kind: "wash",
    // Hər skanda yeni id — mock-da təkrar yoxlanışı serverdə olduğu üçün
    washId: `wash_${Date.now()}`,
    serviceName: m[2]?.trim() || "Kompleks yuma",
    branchName: m[3]?.trim() || "Altaywash Xətai",
    amount: Math.round(amount * 100) / 100,
  };
}

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
  async signUp(
    phone: string,
    fullName: string,
    birthDate?: string,
  ): Promise<Session> {
    if (USE_MOCK) {
      await delay(500);
      const digits = phone.replace(/\D/g, "");
      const registry = readRegistry();
      registry[digits] = fullName;
      writeRegistry(registry);
      // Tamamilə təmiz hesab — demo müştərinin maşınları/kartı/tarixi miras
      // qalmasın deyə mockCustomer YAYILMIR, sahələr açıq şəkildə qurulur.
      const now = Date.now();
      const session: Session = {
        token: "mock-token",
        customer: {
          id: `cus_${now}`,
          fullName,
          phone,
          ...(birthDate ? { birthDate } : {}),
          cardNumber: `AW-${String(now).slice(-4)}-${String(
            Math.floor(Math.random() * 9000) + 1000,
          )}`,
          tier: "bronze",
          bonusBalance: 0,
          walletBalance: 0,
          washesLeft: 0,
          washStreak: { current: 0, goal: 5 },
          yearlyWashes: 0,
          vehicles: [],
          cards: [],
          createdAt: new Date(now).toISOString(),
        },
      };
      setToken(session.token);
      return session;
    }
    const session = await request<Session>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ phone, fullName, birthDate }),
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
   * Oxunan QR-ın NƏ olduğunu təyin edir. İki tip var:
   *  • terminal QR-ı  → tətbiqdə məbləğ seçilir və kartla ödənilir
   *  • xidmət sonu QR-ı → ödəniş yoxdur, yalnız qazanılan bonus yazılır
   * Tipi həmişə ERP qaytarır — tətbiq QR-ın məzmununa güvənmir.
   */
  async resolveScan(code: string): Promise<ScanResult> {
    if (USE_MOCK) {
      await delay(700);
      const raw = code.trim();
      if (raw.length < 4) {
        throw new Error("QR kod tanınmadı. Yenidən cəhd edin.");
      }

      // Mock rejimdə tip QR mətnindən oxunur ki, test QR-ları ilə hər iki
      // axını yoxlamaq mümkün olsun. Real ERP-də bu qərarı server verir.
      const wash = parseWashCode(raw);
      if (wash) return wash;

      return {
        kind: "terminal",
        terminalId: "term_12",
        terminalName: "Terminal 3",
        branchName: "Altaywash Xətai",
      };
    }
    return request(`/scan/resolve?code=${encodeURIComponent(code)}`);
  },

  /**
   * Xidmət sonu QR-ının təsdiqi — bonusu müştərinin hesabına yazır.
   * Ödəniş aparmır; `washId` birdəfəlikdir, təkrar çağırışda ERP rədd edir.
   */
  async confirmWash(washId: string): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(600);
      return { ok: true };
    }
    return request(`/washes/${washId}/confirm`, { method: "POST" });
  },

  /**
   * Terminala kartla ödəniş — terminal balansı bu qədər artır, müştəri
   * loyallıq bonusu qazanır. Kart yalnız `cardId` (tokeni) ilə göstərilir;
   * tam kart nömrəsi/CVV heç vaxt göndərilmir.
   */
  async payTerminal(
    terminalId: string,
    amount: number,
    cardId: string,
  ): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(700);
      return { ok: true };
    }
    return request(`/terminals/${terminalId}/pay`, {
      method: "POST",
      body: JSON.stringify({ amount, cardId }),
    });
  },

  /**
   * Kart əlavə edir. Real ERP-də kart provayderin PCI-uyğun sahələrində daxil
   * olunur və geri yalnız token + son 4 rəqəm gəlir. Mock: göndərilən göstərici
   * məlumatdan (brend + son 4 + tarix) tokenləşdirilmiş kart qaytarır — tam
   * nömrə və CVV saxlanmır.
   */
  async addCard(card: Omit<SavedCard, "id">): Promise<SavedCard> {
    if (USE_MOCK) {
      await delay(500);
      return { ...card, id: `card_${Date.now()}` };
    }
    return request("/me/cards", {
      method: "POST",
      body: JSON.stringify(card),
    });
  },

  /** Saxlanmış kartı silir (token provayder tərəfində ləğv olunur). */
  async removeCard(id: string): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(300);
      return { ok: true };
    }
    return request(`/me/cards/${id}`, { method: "DELETE" });
  },

  /** Profil sahələrini yeniləyir (məs. doğum günü) */
  async updateProfile(
    partial: Pick<Customer, "birthDate">,
  ): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(400);
      return { ok: true };
    }
    return request("/me", {
      method: "PATCH",
      body: JSON.stringify(partial),
    });
  },

  /**
   * Daxili balansın kartla artırılması — paket almaq üçün istifadə olunur.
   * Kart yalnız tokeni (`cardId`) ilə göstərilir.
   */
  async topUpWallet(
    amount: number,
    cardId: string,
  ): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(700);
      return { ok: true };
    }
    return request("/me/wallet/topup", {
      method: "POST",
      body: JSON.stringify({ amount, cardId }),
    });
  },

  /** Qaraja yeni avtomobil əlavə edir */
  async addVehicle(vehicle: Omit<Vehicle, "id">): Promise<Vehicle> {
    if (USE_MOCK) {
      await delay(400);
      return { ...vehicle, id: `veh_${Date.now()}` };
    }
    return request("/me/vehicles", {
      method: "POST",
      body: JSON.stringify(vehicle),
    });
  },

  /** Qarajdan avtomobili silir */
  async removeVehicle(id: string): Promise<{ ok: true }> {
    if (USE_MOCK) {
      await delay(300);
      return { ok: true };
    }
    return request(`/me/vehicles/${id}`, { method: "DELETE" });
  },

};

export { USE_MOCK };
