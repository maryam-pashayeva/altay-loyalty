// Altaywash Loyalty — domen tipləri.
// Bu tiplər ERP tərəfindəki cavab formatı ilə uzlaşdırılmalıdır.

export type TierCode = "silver" | "gold" | "platinum";

export interface Tier {
  code: TierCode;
  name: string;
  /** Hər yumada qazanılan bonus faizi, məs. 5 => 5% */
  cashbackPercent: number;
  /** Bu səviyyəyə çatmaq üçün lazım olan illik xərc (AZN) */
  threshold: number;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  /** Kartın/müştərinin unikal kodu — QR-da bu kod oxunur */
  cardNumber: string;
  tier: TierCode;
  /** Bonus balansı (AZN) */
  bonusBalance: number;
  /** Depozit/paket balansı (AZN) — daxili uçot üçün */
  walletBalance: number;
  /** Alınmış paketlərdən qalan yuma sayı — müştəriyə bu göstərilir */
  washesLeft: number;
  /** Cari il ərzində xərclənən məbləğ — səviyyə hesablaması üçün */
  yearlySpend: number;
  vehicles: Vehicle[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  /** Kuza tipi qiymətə təsir edir */
  bodyType: "sedan" | "suv" | "minivan" | "pickup";
}

export type TransactionKind = "wash" | "topup" | "bonus_earned" | "bonus_spent";

export interface Transaction {
  id: string;
  kind: TransactionKind;
  title: string;
  branchName: string;
  /** Müsbət = balansa əlavə, mənfi = balansdan çıxım */
  amount: number;
  bonusDelta: number;
  vehiclePlate?: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  badge?: string;
  validUntil: string;
  /** Detal pəncərəsindəki hərəkət düyməsinin adı, məs. "İndi vaxt təyin et" */
  ctaLabel?: string;
  /** Möhür-kart tipli kampaniya üçün irəliləyiş (məs. 5+1) */
  stamps?: { done: number; total: number };
  /** Dəvət/referral kampaniyası — paylaşılacaq kod */
  share?: { code: string };
}

export interface WashPackage {
  id: string;
  name: string;
  description: string;
  /** Paketə daxil olan yuma sayı */
  washCount: number;
  price: number;
  /** Adi qiymətlə müqayisədə qənaət (AZN) */
  savings: number;
  popular?: boolean;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  lat: number;
  lng: number;
}

export interface Session {
  token: string;
  customer: Customer;
}
