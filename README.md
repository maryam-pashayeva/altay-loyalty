# Altaywash Loyalty — Mobil Web App

Altaywash müştəriləri üçün mobil-first loyallıq tətbiqi (PWA). Bonus balansı,
QR loyallıq kartı, kampaniyalar, yuma paketləri, əməliyyat tarixçəsi və filiallar.

## Texnologiya

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (dizayn tokenləri `src/app/globals.css` içindədir)
- `qrcode` — kart QR-ının generasiyası
- PWA manifest (`public/manifest.webmanifest`) — telefonda "ana ekrana əlavə et"

## İşə salma

```bash
npm install
npm run dev
```

http://localhost:3000 → `/login` səhifəsinə yönləndirir.
**Demo rejimdə OTP kodu: `1234`** (istənilən 9 rəqəmli nömrə ilə).

## ERP inteqrasiyası

Tətbiq `NEXT_PUBLIC_ERP_API_URL` təyin olunmayıbsa **mock data** ilə işləyir.
Real ERP qoşmaq üçün:

1. `.env.local` yaradın:
   ```
   NEXT_PUBLIC_ERP_API_URL=https://erp.altaywash.az/api/loyalty
   ```
2. `src/lib/api/index.ts` içindəki yol adlarını ERP-nin real endpoint-ləri ilə
   uzlaşdırın. Hazırda gözlənilən müqavilə:

   | Metod | Endpoint | Cavab |
   |---|---|---|
   | `POST` | `/auth/otp` | `{ sent: true }` |
   | `POST` | `/auth/verify` | `Session` (`token` + `customer`) |
   | `GET` | `/me` | `Customer` |
   | `GET` | `/me/transactions` | `Transaction[]` |
   | `GET` | `/campaigns` | `Campaign[]` |
   | `GET` | `/packages` | `WashPackage[]` |
   | `GET` | `/branches` | `Branch[]` |
   | `POST` | `/orders` | `{ redirectUrl?: string }` |

   Cavab tipləri: [`src/lib/types.ts`](src/lib/types.ts).
   Autentifikasiya: `Authorization: Bearer <token>` (bax `src/lib/api/client.ts`).

Kod dəyişikliyi yalnız bu iki fayla toxunur — UI qatı ERP-dən asılı deyil.

## Struktur

```
src/
  app/
    login/            OTP ilə giriş (2 addım)
    (app)/            Autentifikasiya tələb edən bölmə (AuthGuard + BottomNav)
      page.tsx        Ana səhifə — balans, səviyyə, kampaniyalar, son əməliyyatlar
      qr/             Kassada oxudulan QR loyallıq kartı
      campaigns/      Aktiv kampaniyalar
      history/        Filtrli əməliyyat tarixçəsi
      packages/       Yuma paketləri və alış
      branches/       Filiallar, zəng və marşrut
      profile/        Profil, avtomobillər, çıxış
  components/         UI komponentləri (BottomNav, BalanceCard, QrCard, ...)
  lib/
    api/              ERP qatı — client.ts, index.ts (fasad), mock-data.ts
    session.tsx       Sessiya konteksti (token localStorage-da)
    types.ts          Domen tipləri
    tier.ts           Səviyyə (Silver/Gold/Platinum) hesablaması
    format.ts         Məbləğ, tarix və telefon formatı
```

## Loyallıq qaydaları (hazırkı fərz)

| Səviyyə | İllik xərc | Bonus |
|---|---|---|
| Silver | 0 ₼-dən | 3% |
| Gold | 300 ₼-dən | 5% |
| Platinum | 800 ₼-dən | 8% |

Bu hədlər `src/lib/api/mock-data.ts` içindəki `TIERS`-də saxlanılır və ERP-dən
gələn dəyərlərlə əvəzlənməlidir.

## Növbəti addımlar

- Real ERP endpoint-lərinin qoşulması və müqavilənin dəqiqləşdirilməsi
- Ödəniş provayderi (paket alışı) inteqrasiyası
- Push bildirişlər (kampaniya, yuma hazır olduqda)
- Onlayn növbə/rezervasiya bölməsi
