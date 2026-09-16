// Altaywash Loyalty — domen tipləri.
// Bu tiplər ERP tərəfindəki cavab formatı ilə uzlaşdırılmalıdır.

export type Lang = "az" | "ru" | "en";

export type TierCode = "bronze" | "silver" | "gold" | "platinum";

export interface Tier {
  code: TierCode;
  name: string;
  /** Hər yumada qazanılan bonus faizi, məs. 5 => 5% */
  cashbackPercent: number;
  /**
   * Bu səviyyəyə çatmaq üçün cari ildə lazım olan yuma sayı.
   * Səviyyə QƏSDƏN məbləğlə yox, yuma sayı ilə ölçülür — xidmət qiyməti
   * dəyişəndə eşiklər pozulmasın və müştəri üçün aydın olsun.
   */
  washesRequired: number;
}

export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  /** Kartın/müştərinin unikal kodu — QR-da bu kod oxunur */
  cardNumber: string;
  tier: TierCode;
  /** Doğum günü (ISO tarix, məs. "1995-04-12") — doğum günü hədiyyəsi üçün */
  birthDate?: string;
  /** Bonus balansı (AZN) */
  bonusBalance: number;
  /** Depozit/paket balansı (AZN) — daxili uçot üçün */
  walletBalance: number;
  /** Alınmış paketlərdən qalan yuma sayı — müştəriyə bu göstərilir */
  washesLeft: number;
  /** Ardıcıl yuma seriyası — hədəfə çatanda pulsuz yuma */
  washStreak: { current: number; goal: number };
  /** Cari ildə tamamlanmış yuma sayı — səviyyə hesablaması bundan asılıdır */
  yearlyWashes: number;
  vehicles: Vehicle[];
  /** Ödəniş kartları — terminalda ödəniş üçün (tokenləşdirilmiş) */
  cards: SavedCard[];
  createdAt: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  /** Kuza tipi qiymətə təsir edir */
  bodyType: "sedan" | "suv" | "minivan" | "pickup";
}

/**
 * Yadda saxlanmış ödəniş kartı — YALNIZ göstərici (tokenləşdirilmiş) məlumat.
 * Tam kart nömrəsi (PAN) və CVV heç vaxt saxlanmır; real ERP-də provayder
 * tokeni saxlanılır.
 */
export interface SavedCard {
  id: string;
  brand: "visa" | "mastercard" | "other";
  /** Kartın son 4 rəqəmi (göstərmək üçün) */
  last4: string;
  expMonth: number;
  expYear: number;
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

/**
 * Terminaldakı statik QR — yalnız terminalı eyniləşdirir (filial/terminal
 * DB-dən). Məbləğ və kart tətbiqdə seçilir, sonra `payTerminal` çağırılır.
 */
export interface TerminalScan {
  kind: "terminal";
  terminalId: string;
  terminalName: string;
  branchName: string;
}

/**
 * Xidmət sonu QR — operator yumanı bitirəndə çek/ekran üzərində göstərilən
 * birdəfəlik QR. Ödəniş APARILMIR; müştəri yalnız qazandığı bonusu hesabına
 * yazır (`confirmWash`). Məbləğ artıq kassada ödənilmiş xidmətin qiymətidir.
 */
export interface WashScan {
  kind: "wash";
  /** Birdəfəlik əməliyyat kodu — eyni QR iki dəfə bonus vermir */
  washId: string;
  serviceName: string;
  branchName: string;
  /** Ödənilmiş xidmətin məbləği (AZN) — bonus bundan hesablanır */
  amount: number;
  vehiclePlate?: string;
}

export type ScanResult = TerminalScan | WashScan;
