import type {
  Branch,
  Campaign,
  Customer,
  Tier,
  Transaction,
  WashPackage,
} from "@/lib/types";

/** Eşiklər cari ildə edilmiş yuma sayıdır (məbləğ deyil). */
export const TIERS: Record<string, Tier> = {
  bronze: { code: "bronze", name: "Bronze", cashbackPercent: 2, washesRequired: 0 },
  silver: { code: "silver", name: "Silver", cashbackPercent: 3, washesRequired: 10 },
  gold: { code: "gold", name: "Gold", cashbackPercent: 5, washesRequired: 25 },
  platinum: {
    code: "platinum",
    name: "Platinum",
    cashbackPercent: 8,
    washesRequired: 60,
  },
};

export const mockCustomer: Customer = {
  id: "cus_1041",
  fullName: "Elvin Əsədov",
  phone: "+994 50 123 45 67",
  cardNumber: "AW-1041-8827",
  tier: "gold",
  bonusBalance: 42.5,
  walletBalance: 85,
  washesLeft: 3,
  washStreak: { current: 3, goal: 5 },
  yearlyWashes: 28,
  createdAt: "2024-03-12T09:00:00Z",
  vehicles: [
    { id: "veh_1", plate: "10-AA-334", model: "Toyota Camry", bodyType: "sedan" },
    { id: "veh_2", plate: "77-BB-901", model: "Hyundai Tucson", bodyType: "suv" },
  ],
  cards: [
    { id: "card_1", brand: "visa", last4: "4021", expMonth: 8, expYear: 27 },
  ],
};

/* Demo tarixləri "indi"yə nisbətən qurulur ki, ana səhifədəki "cari ay"
   bölməsi vaxt keçdikcə boş qalmasın. İlk iki əməliyyat həmişə cari aya düşür. */
const NOW = new Date();

/** Cari ayın içində bir tarix (gələcəyə keçməsin deyə sıxılıb). */
function thisMonth(dayOffset: number, h: number, min: number) {
  const day = Math.max(1, NOW.getDate() - dayOffset);
  return new Date(NOW.getFullYear(), NOW.getMonth(), day, h, min).toISOString();
}

/** k ay əvvələ aid tarix (il sərhədini avtomatik keçir). */
function monthsAgo(k: number, day: number, h: number, min: number) {
  return new Date(NOW.getFullYear(), NOW.getMonth() - k, day, h, min).toISOString();
}

export const mockTransactions: Transaction[] = [
  {
    id: "trx_9012",
    kind: "wash",
    title: "Kompleks yuma",
    branchName: "Altaywash Xətai",
    amount: -25,
    bonusDelta: 1.25,
    vehiclePlate: "10-AA-334",
    createdAt: thisMonth(0, 14, 20),
  },
  {
    id: "trx_9008",
    kind: "bonus_earned",
    title: "Qeydiyyat bonusu",
    branchName: "Altaywash",
    amount: 0,
    bonusDelta: 50,
    createdAt: thisMonth(4, 10, 5),
  },
  {
    id: "trx_8991",
    kind: "bonus_spent",
    title: "Bonusla ödəniş — Salon təmizliyi",
    branchName: "Altaywash Nərimanov",
    amount: 0,
    bonusDelta: -15,
    vehiclePlate: "77-BB-901",
    createdAt: monthsAgo(1, 28, 17, 40),
  },
  {
    id: "trx_8964",
    kind: "wash",
    title: "Sürətli yuma",
    branchName: "Altaywash Xətai",
    amount: -12,
    bonusDelta: 0.6,
    vehiclePlate: "10-AA-334",
    createdAt: monthsAgo(1, 21, 9, 15),
  },
  {
    id: "trx_8930",
    kind: "wash",
    title: "Kompleks yuma + mum",
    branchName: "Altaywash Yasamal",
    amount: -38,
    bonusDelta: 1.9,
    vehiclePlate: "77-BB-901",
    createdAt: monthsAgo(2, 14, 12, 50),
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp_3",
    title: "Dostunu dəvət et — 10 AZN",
    description:
      "Dəvət etdiyin dost ilk yumasını etdikdə hər ikinizin balansına 10 AZN bonus əlavə olunur.",
    badge: "10 ₼",
    validUntil: "2026-11-30T23:59:59Z",
    ctaLabel: "Dostunu dəvət et",
    share: { code: "ALTAY-ELVIN10" },
  },
];

export const mockPackages: WashPackage[] = [
  {
    id: "pkg_5",
    name: "Start paketi",
    description: "5 kompleks yuma — bir ay ərzində istifadə",
    washCount: 5,
    price: 110,
    savings: 15,
  },
  {
    id: "pkg_10",
    name: "Optimal paket",
    description: "10 kompleks yuma — üç ay ərzində istifadə",
    washCount: 10,
    price: 200,
    savings: 50,
    popular: true,
  },
  {
    id: "pkg_20",
    name: "Premium paket",
    description: "20 kompleks yuma + 2 salon təmizliyi",
    washCount: 20,
    price: 370,
    savings: 130,
  },
];

export const mockBranches: Branch[] = [
  {
    id: "br_1",
    name: "Altaywash Xətai",
    address: "Xətai r., Babək pr. 45",
    phone: "+994 12 555 10 01",
    workingHours: "09:00 – 21:00",
    lat: 40.3833,
    lng: 49.8781,
  },
  {
    id: "br_2",
    name: "Altaywash Nərimanov",
    address: "Nərimanov r., Ə.Səlimzadə küç. 12",
    phone: "+994 12 555 10 02",
    workingHours: "08:00 – 22:00",
    lat: 40.4045,
    lng: 49.8642,
  },
  {
    id: "br_3",
    name: "Altaywash Yasamal",
    address: "Yasamal r., İnşaatçılar pr. 78",
    phone: "+994 12 555 10 03",
    workingHours: "09:00 – 20:00",
    lat: 40.3776,
    lng: 49.8129,
  },
];
