"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Lang, TierCode } from "@/lib/types";

export const LANGS: { value: Lang; label: string }[] = [
  { value: "az", label: "AZ" },
  { value: "ru", label: "RU" },
  { value: "en", label: "EN" },
];

const LANG_KEY = "altaywash.lang";

/** Bütün UI mətnləri — hər açar üçün üç dil bir yerdə saxlanılır ki, tərcümələr
 *  sinxron qalsın. Kataloq məlumatı (filial/kampaniya/paket adları) ERP-dən
 *  gəlir və burada tərcümə olunmur. */
const STRINGS: Record<string, Record<Lang, string>> = {
  // Ümumi
  "common.cancel": { az: "Ləğv et", ru: "Отмена", en: "Cancel" },
  "common.close": { az: "Bağla", ru: "Закрыть", en: "Close" },

  // Naviqasiya
  "nav.home": { az: "Ana səhifə", ru: "Главная", en: "Home" },
  "nav.branches": { az: "Filiallar", ru: "Филиалы", en: "Branches" },
  "nav.scan": { az: "Skan et", ru: "Сканировать", en: "Scan" },
  "nav.history": { az: "Tarixçə", ru: "История", en: "History" },
  "nav.profile": { az: "Profil", ru: "Профиль", en: "Profile" },

  // Giriş
  "login.title.phone": { az: "Daxil ol", ru: "Вход", en: "Sign in" },
  "login.title.register": {
    az: "Qeydiyyat",
    ru: "Регистрация",
    en: "Register",
  },
  "login.subtitle.phone": {
    az: "Telefon nömrənlə davam et — parol yoxdur.",
    ru: "Продолжите с номером телефона — без пароля.",
    en: "Continue with your phone number — no password.",
  },
  "login.subtitle.register": {
    az: "Bu nömrə ilk dəfədir — adını yaz, kifayətdir.",
    ru: "Этот номер впервые — просто укажите имя.",
    en: "This number is new — just enter your name.",
  },
  "login.phoneLabel": {
    az: "Telefon nömrəniz",
    ru: "Ваш номер телефона",
    en: "Your phone number",
  },
  "login.nameLabel": { az: "Ad, soyad", ru: "Имя, фамилия", en: "Full name" },
  "login.namePlaceholder": {
    az: "Rəşad Məmmədov",
    ru: "Иван Иванов",
    en: "John Smith",
  },
  "login.checking": { az: "Yoxlanılır…", ru: "Проверка…", en: "Checking…" },
  "login.continue": { az: "Davam et", ru: "Продолжить", en: "Continue" },
  "login.creating": { az: "Yaradılır…", ru: "Создание…", en: "Creating…" },
  "login.createAccount": {
    az: "Hesab yarat",
    ru: "Создать аккаунт",
    en: "Create account",
  },
  "login.changeNumber": {
    az: "Nömrəni dəyiş",
    ru: "Изменить номер",
    en: "Change number",
  },
  "login.terms": {
    az: "Davam etməklə istifadə şərtləri və məxfilik siyasəti ilə razılaşırsınız.",
    ru: "Продолжая, вы соглашаетесь с условиями использования и политикой конфиденциальности.",
    en: "By continuing, you agree to the terms of use and privacy policy.",
  },
  "login.error.generic": {
    az: "Xəta baş verdi",
    ru: "Произошла ошибка",
    en: "Something went wrong",
  },
  "login.error.register": {
    az: "Qeydiyyat alınmadı",
    ru: "Не удалось зарегистрироваться",
    en: "Registration failed",
  },

  // Qarşılama (onboarding)
  "welcome.slide1.title": {
    az: "Xoş gəldin, Altay!",
    ru: "Добро пожаловать, Altay!",
    en: "Welcome, Altay!",
  },
  "welcome.slide1.text": {
    az: "Hər yumada xal qazan, xalları növbəti yumada endirimə çevir.",
    ru: "Зарабатывайте баллы за каждую мойку и превращайте их в скидку на следующую.",
    en: "Earn points with every wash and turn them into a discount on your next one.",
  },
  "welcome.slide2.title": {
    az: "QR-ı skan et",
    ru: "Сканируйте QR",
    en: "Scan the QR",
  },
  "welcome.slide2.text": {
    az: "Terminaldakı QR kodu telefonunla oxu — xalın avtomatik hesabına yazılsın.",
    ru: "Отсканируйте QR-код на терминале — баллы начислятся автоматически.",
    en: "Scan the QR code on the terminal — your points are credited automatically.",
  },
  "welcome.slide3.title": {
    az: "Xallarını hədiyyəyə çevir",
    ru: "Обменивайте баллы на подарки",
    en: "Turn points into rewards",
  },
  "welcome.slide3.text": {
    az: "Kifayət qədər xal topladıqda pulsuz yuma və ya endirim qazanırsan.",
    ru: "Накопив достаточно баллов, получите бесплатную мойку или скидку.",
    en: "Collect enough points to get a free wash or a discount.",
  },
  "welcome.slideAria": { az: "Slayd {n}", ru: "Слайд {n}", en: "Slide {n}" },
  "welcome.next": { az: "Növbəti", ru: "Далее", en: "Next" },
  "welcome.skip": { az: "Keç", ru: "Пропустить", en: "Skip" },
  "welcome.signIn": { az: "Daxil ol", ru: "Войти", en: "Sign in" },
  "welcome.noAccount": {
    az: "Hesabınız yoxdur?",
    ru: "Нет аккаунта?",
    en: "No account?",
  },
  "welcome.register": {
    az: "Qeydiyyatdan keçin",
    ru: "Зарегистрируйтесь",
    en: "Sign up",
  },

  // Ana səhifə
  "home.greeting": {
    az: "Xoş gəldiniz",
    ru: "Добро пожаловать",
    en: "Welcome",
  },
  "home.notifications": {
    az: "Bildirişlər",
    ru: "Уведомления",
    en: "Notifications",
  },
  "home.campaigns": { az: "Kampaniyalar", ru: "Акции", en: "Offers" },
  "home.seeAll": { az: "Hamısı", ru: "Все", en: "See all" },
  "home.recent": {
    az: "Son əməliyyatlar",
    ru: "Последние операции",
    en: "Recent activity",
  },
  "home.noneThisMonth": {
    az: "Bu ay əməliyyat yoxdur.",
    ru: "В этом месяце операций нет.",
    en: "No activity this month.",
  },
  "home.allTransactions": {
    az: "Bütün əməliyyatlar",
    ru: "Все операции",
    en: "All transactions",
  },

  // Balans kartı
  "balance.title": {
    az: "Bonus balansı",
    ru: "Бонусный баланс",
    en: "Bonus balance",
  },
  "balance.toTier": {
    az: "{tier} səviyyəsinə",
    ru: "До уровня {tier}",
    en: "To {tier} level",
  },
  "balance.remaining": {
    az: "{amount} qalıb",
    ru: "осталось {amount}",
    en: "{amount} to go",
  },
  "balance.myPackage": { az: "Paketim", ru: "Мой пакет", en: "My package" },
  "balance.washesLeft": {
    az: "{n} yuma qalıb",
    ru: "осталось {n} моек",
    en: "{n} washes left",
  },
  "balance.noPackage": {
    az: "Aktiv paket yoxdur",
    ru: "Нет активного пакета",
    en: "No active package",
  },
  "balance.buyPackage": {
    az: "Paket al",
    ru: "Купить пакет",
    en: "Buy package",
  },

  // Seriya (streak)
  "streak.series": {
    az: "{n} yuma seriyası",
    ru: "Серия из {n} моек",
    en: "{n}-wash streak",
  },
  "streak.toFree": {
    az: "{n} yumaya pulsuz yuma",
    ru: "ещё {n} моек до бесплатной",
    en: "{n} washes to a free wash",
  },
  "streak.ready": {
    az: "Pulsuz yuma hazırdır!",
    ru: "Бесплатная мойка готова!",
    en: "Free wash is ready!",
  },

  // Filial qısayolu
  "branchesQuick.title": { az: "Filiallar", ru: "Филиалы", en: "Branches" },
  "branchesQuick.nearest": {
    az: "Ən yaxın: {name} · {km} km",
    ru: "Ближайший: {name} · {km} км",
    en: "Nearest: {name} · {km} km",
  },
  "branchesQuick.subtitle": {
    az: "Bütün filiallara və marşruta bax",
    ru: "Все филиалы и маршрут",
    en: "See all branches and directions",
  },

  // Kampaniyalar
  "campaigns.title": { az: "Kampaniyalar", ru: "Акции", en: "Offers" },
  "campaigns.subtitle": {
    az: "Aktiv təkliflər və endirimlər",
    ru: "Активные предложения и скидки",
    en: "Active offers and discounts",
  },
  "campaign.validUntilShort": {
    az: "{date}-dək",
    ru: "до {date}",
    en: "until {date}",
  },
  "campaign.validUntil": {
    az: "{date} tarixinədək keçərlidir",
    ru: "Действует до {date}",
    en: "Valid until {date}",
  },
  "campaign.stampsDone": {
    az: "{done}/{total} tamamlandı —",
    ru: "выполнено {done}/{total} —",
    en: "{done}/{total} completed —",
  },
  "campaign.stampsLeft": {
    az: "{n} yuma sonra hədiyyə",
    ru: "подарок через {n} моек",
    en: "a gift after {n} washes",
  },
  "campaign.inviteCode": {
    az: "Sizin dəvət kodunuz",
    ru: "Ваш пригласительный код",
    en: "Your invite code",
  },
  "campaign.invite": {
    az: "Dostunu dəvət et",
    ru: "Пригласи друга",
    en: "Invite a friend",
  },
  "campaign.participate": {
    az: "İştirak et",
    ru: "Участвовать",
    en: "Take part",
  },
  "campaign.done.copied": {
    az: "Dəvət linki kopyalandı — dostunla paylaş!",
    ru: "Ссылка-приглашение скопирована — поделись с другом!",
    en: "Invite link copied — share it with a friend!",
  },
  "campaign.done.shared": {
    az: "Paylaşıldı — təşəkkürlər!",
    ru: "Отправлено — спасибо!",
    en: "Shared — thank you!",
  },
  "campaign.done.booked": {
    az: "Uğurla qeydə alındı — tezliklə sizinlə əlaqə saxlanılacaq.",
    ru: "Успешно принято — мы скоро свяжемся с вами.",
    en: "Successfully registered — we'll contact you soon.",
  },
  "campaign.shareText": {
    az: "Altaywash-a qoşul, ilk yumanda hər ikimiz 10 ₼ qazanaq! Kodum: {code}",
    ru: "Присоединяйся к Altaywash — за первую мойку мы оба получим 10 ₼! Мой код: {code}",
    en: "Join Altaywash — on your first wash we both get 10 ₼! My code: {code}",
  },

  // QR skan
  "qr.title": {
    az: "Terminalı skan et",
    ru: "Сканировать терминал",
    en: "Scan the terminal",
  },
  "qr.subtitle": {
    az: "Terminalın ekranındakı QR kodu telefonunla oxut — sistem əməliyyatı özü tanıyacaq.",
    ru: "Отсканируйте QR-код на экране терминала — система сама определит операцию.",
    en: "Scan the QR code on the terminal screen — the system will recognize the operation.",
  },
  "qr.writeTo": {
    az: "Skan bu maşına yazılacaq:",
    ru: "Скан будет записан на этот автомобиль:",
    en: "The scan will be recorded for this car:",
  },
  "qr.change": { az: "Dəyiş", ru: "Изменить", en: "Change" },
  "qr.paying": { az: "Ödəniş edilir…", ru: "Оплата…", en: "Processing payment…" },
  "qr.checking": { az: "Yoxlanılır…", ru: "Проверка…", en: "Checking…" },
  "qr.cameraPaused": {
    az: "Kamera dayandırıldı",
    ru: "Камера приостановлена",
    en: "Camera paused",
  },
  "qr.retry": { az: "Təkrar cəhd", ru: "Повторить", en: "Try again" },
  "qr.confirmTitle": {
    az: "Ödənişi təsdiqləyin",
    ru: "Подтвердите оплату",
    en: "Confirm payment",
  },
  "qr.service": { az: "Xidmət", ru: "Услуга", en: "Service" },
  "qr.branch": { az: "Filial", ru: "Филиал", en: "Branch" },
  "qr.vehicle": { az: "Avtomobil", ru: "Автомобиль", en: "Car" },
  "qr.amount": {
    az: "Ödəniş məbləği",
    ru: "Сумма оплаты",
    en: "Payment amount",
  },
  "qr.fromBonus": {
    az: "Bonus balansınızdan çıxılacaq · Cari: {amount}",
    ru: "Спишется с бонусного баланса · Текущий: {amount}",
    en: "Will be deducted from your bonus balance · Current: {amount}",
  },
  "qr.confirmPay": {
    az: "Ödənişi təsdiqlə",
    ru: "Подтвердить оплату",
    en: "Confirm payment",
  },
  "qr.insufficient": {
    az: "Bonus balansı kifayət etmir.",
    ru: "Недостаточно бонусного баланса.",
    en: "Insufficient bonus balance.",
  },
  "qr.error.generic": {
    az: "Xəta baş verdi",
    ru: "Произошла ошибка",
    en: "Something went wrong",
  },
  "qr.error.pay": {
    az: "Ödəniş alınmadı",
    ru: "Оплата не прошла",
    en: "Payment failed",
  },

  // Skaner
  "scanner.denied.title": {
    az: "Kameraya icazə verilmədi",
    ru: "Доступ к камере не разрешён",
    en: "Camera access denied",
  },
  "scanner.denied.text": {
    az: "Skan üçün brauzer parametrlərindən kameraya icazə verin.",
    ru: "Разрешите доступ к камере в настройках браузера, чтобы сканировать.",
    en: "Allow camera access in your browser settings to scan.",
  },
  "scanner.starting": {
    az: "Kamera açılır…",
    ru: "Камера запускается…",
    en: "Starting camera…",
  },
  "scanner.torch": { az: "Fənər", ru: "Фонарик", en: "Flashlight" },

  // Skan nəticəsi
  "scanResult.earned": {
    az: "Bonus qazanıldı!",
    ru: "Бонус начислен!",
    en: "Bonus earned!",
  },
  "scanResult.paid": {
    az: "Ödəniş uğurlu!",
    ru: "Оплата успешна!",
    en: "Payment successful!",
  },
  "scanResult.newBalance": {
    az: "Yeni bonus balansı",
    ru: "Новый бонусный баланс",
    en: "New bonus balance",
  },
  "scanResult.earnedCta": { az: "Əla!", ru: "Отлично!", en: "Great!" },
  "scanResult.paidCta": { az: "Bitir", ru: "Готово", en: "Done" },

  // Paketlər
  "packages.title": { az: "Paketlər", ru: "Пакеты", en: "Packages" },
  "packages.subtitle": {
    az: "Əvvəlcədən al, hər yumada qənaət et",
    ru: "Купите заранее и экономьте на каждой мойке",
    en: "Buy ahead and save on every wash",
  },
  "packages.popular": {
    az: "Ən çox seçilən",
    ru: "Популярный",
    en: "Most popular",
  },
  "packages.savings": {
    az: "{amount} qənaət",
    ru: "экономия {amount}",
    en: "save {amount}",
  },
  "packages.bonusHint": {
    az: "Bu paketlə ~{amount} bonus qazanacaqsan",
    ru: "С этим пакетом вы получите ~{amount} бонусов",
    en: "You'll earn ~{amount} bonus with this package",
  },
  "packages.processing": {
    az: "Emal olunur…",
    ru: "Обработка…",
    en: "Processing…",
  },
  "packages.ordered": {
    az: "Sifariş qeydə alındı",
    ru: "Заказ принят",
    en: "Order placed",
  },
  "packages.buy": { az: "Paketi al", ru: "Купить пакет", en: "Buy package" },
  "packages.footer": {
    az: "Ödəniş ERP inteqrasiyası qoşulduqdan sonra bank səhifəsinə yönləndirmə ilə tamamlanacaq.",
    ru: "Оплата будет завершена переходом на страницу банка после подключения ERP-интеграции.",
    en: "Payment will be completed via redirect to the bank page once ERP integration is connected.",
  },

  // Terminalda ödəniş (skan → məbləğ → kart → ödə)
  "pay.title": { az: "Ödəniş", ru: "Оплата", en: "Payment" },
  "pay.terminal": { az: "Terminal", ru: "Терминал", en: "Terminal" },
  "pay.amount": { az: "Məbləğ", ru: "Сумма", en: "Amount" },
  "pay.card": { az: "Kart", ru: "Карта", en: "Card" },
  "pay.bonusHint": {
    az: "Hər 1 ₼-ə 1 bonus qazanırsınız",
    ru: "За каждый 1 ₼ вы получаете 1 бонус",
    en: "You earn 1 bonus for every 1 ₼",
  },
  "pay.noCards": {
    az: "Kart yoxdur — ödəniş üçün kart əlavə edin",
    ru: "Нет карт — добавьте карту для оплаты",
    en: "No cards — add a card to pay",
  },
  "pay.addCard": { az: "Kart əlavə et", ru: "Добавить карту", en: "Add card" },
  "pay.confirm": { az: "{amount} ödə", ru: "Оплатить {amount}", en: "Pay {amount}" },
  "pay.processing": { az: "Ödəniş edilir…", ru: "Оплата…", en: "Processing…" },
  "pay.error": {
    az: "Ödəniş alınmadı",
    ru: "Оплата не прошла",
    en: "Payment failed",
  },
  "pay.successTitle": {
    az: "Ödəniş uğurlu!",
    ru: "Оплата успешна!",
    en: "Payment successful!",
  },
  "pay.terminalCredited": {
    az: "Terminal balansı {amount} artırıldı",
    ru: "Баланс терминала пополнен на {amount}",
    en: "Terminal balance topped up by {amount}",
  },
  "pay.bonusEarned": {
    az: "+{bonus} bonus qazandınız",
    ru: "Вы получили +{bonus} бонус",
    en: "You earned +{bonus} bonus",
  },
  "pay.newBonus": {
    az: "Yeni bonus balansı",
    ru: "Новый бонусный баланс",
    en: "New bonus balance",
  },
  "pay.done": { az: "Əla!", ru: "Отлично!", en: "Great!" },

  // Kartlar (Profil → Mənim kartlarım)
  "cards.title": { az: "Mənim kartlarım", ru: "Мои карты", en: "My cards" },
  "cards.add": { az: "Kart əlavə et", ru: "Добавить карту", en: "Add card" },
  "cards.empty": {
    az: "Saxlanmış kart yoxdur",
    ru: "Нет сохранённых карт",
    en: "No saved cards",
  },
  "cards.expires": {
    az: "Bitmə {mm}/{yy}",
    ru: "До {mm}/{yy}",
    en: "Exp {mm}/{yy}",
  },
  "addCard.title": { az: "Yeni kart", ru: "Новая карта", en: "New card" },
  "addCard.number": {
    az: "Kart nömrəsi",
    ru: "Номер карты",
    en: "Card number",
  },
  "addCard.expiry": {
    az: "Bitmə tarixi",
    ru: "Срок действия",
    en: "Expiry date",
  },
  "addCard.cvv": { az: "CVV", ru: "CVV", en: "CVV" },
  "addCard.save": {
    az: "Kartı yadda saxla",
    ru: "Сохранить карту",
    en: "Save card",
  },
  "addCard.saving": {
    az: "Yadda saxlanılır…",
    ru: "Сохранение…",
    en: "Saving…",
  },
  "addCard.secureNote": {
    az: "Təhlükəsizlik üçün tam kart nömrəsi və CVV saxlanmır — yalnız brend, son 4 rəqəm və bitmə tarixi göstərilir.",
    ru: "В целях безопасности полный номер карты и CVV не сохраняются — хранятся только бренд, последние 4 цифры и срок.",
    en: "For security, the full card number and CVV are not stored — only the brand, last 4 digits and expiry are kept.",
  },

  // Tarixçə
  "history.title": { az: "Tarixçə", ru: "История", en: "History" },
  "history.subtitle": {
    az: "Bütün əməliyyatlarınız",
    ru: "Все ваши операции",
    en: "All your transactions",
  },
  "history.filter.all": { az: "Hamısı", ru: "Все", en: "All" },
  "history.filter.wash": { az: "Yumalar", ru: "Мойки", en: "Washes" },
  "history.filter.bonus": { az: "Bonuslar", ru: "Бонусы", en: "Bonuses" },
  "history.allCars": {
    az: "Bütün maşınlar",
    ru: "Все автомобили",
    en: "All cars",
  },
  "history.empty": {
    az: "Bu bölmədə hələ əməliyyat yoxdur.",
    ru: "В этом разделе пока нет операций.",
    en: "No transactions in this section yet.",
  },

  // Əməliyyat sətri
  "transaction.bonusSuffix": { az: "bonus", ru: "бонус", en: "bonus" },

  // Filiallar
  "branches.title": { az: "Filiallar", ru: "Филиалы", en: "Branches" },
  "branches.subtitle": {
    az: "Sizə ən yaxın Altaywash",
    ru: "Ближайший к вам Altaywash",
    en: "Your nearest Altaywash",
  },
  "branches.open": { az: "Açıqdır", ru: "Открыто", en: "Open" },
  "branches.closed": { az: "Bağlıdır", ru: "Закрыто", en: "Closed" },
  "branches.call": { az: "Zəng et", ru: "Позвонить", en: "Call" },
  "branches.route": { az: "Marşrut", ru: "Маршрут", en: "Directions" },

  // Profil
  "profile.title": { az: "Profil", ru: "Профиль", en: "Profile" },
  "profile.garage": { az: "Qaraj", ru: "Гараж", en: "Garage" },
  "profile.newCar": { az: "Yeni maşın", ru: "Новый авто", en: "New car" },
  "profile.delete": { az: "Sil", ru: "Удалить", en: "Delete" },
  "profile.language": { az: "Dil", ru: "Язык", en: "Language" },
  "profile.appLanguage": {
    az: "Tətbiq dili",
    ru: "Язык приложения",
    en: "App language",
  },
  "profile.notifSettings": {
    az: "Bildiriş parametrləri",
    ru: "Настройки уведомлений",
    en: "Notification settings",
  },
  "profile.notifCampaigns": {
    az: "Kampaniya bildirişləri",
    ru: "Уведомления об акциях",
    en: "Offer notifications",
  },
  "profile.notifCampaignsDesc": {
    az: "Yeni endirim və təkliflər barədə",
    ru: "О новых скидках и предложениях",
    en: "About new discounts and offers",
  },
  "profile.notifReminders": {
    az: "Yuma xatırlatması",
    ru: "Напоминание о мойке",
    en: "Wash reminder",
  },
  "profile.notifRemindersDesc": {
    az: "Uzun fasilədə yumanı xatırladırıq",
    ru: "Напомним о мойке после долгого перерыва",
    en: "We'll remind you to wash after a long break",
  },
  "profile.pushNote": {
    az: "Push bildirişlər ERP inteqrasiyasından sonra aktivləşəcək.",
    ru: "Push-уведомления будут активированы после ERP-интеграции.",
    en: "Push notifications will be enabled after ERP integration.",
  },
  "profile.memberSince": {
    az: "Üzv olma tarixi: {date}",
    ru: "Дата регистрации: {date}",
    en: "Member since: {date}",
  },
  "profile.signOut": { az: "Hesabdan çıx", ru: "Выйти", en: "Sign out" },
  "profile.tierLine": {
    az: "{tier} · {pct}% bonus",
    ru: "{tier} · {pct}% бонус",
    en: "{tier} · {pct}% bonus",
  },

  // Avtomobil əlavə etmə
  "addVehicle.title": {
    az: "Yeni avtomobil",
    ru: "Новый автомобиль",
    en: "New car",
  },
  "addVehicle.plateLabel": {
    az: "Dövlət nömrəsi",
    ru: "Гос. номер",
    en: "License plate",
  },
  "addVehicle.modelLabel": {
    az: "Marka və model",
    ru: "Марка и модель",
    en: "Make and model",
  },
  "addVehicle.bodyLabel": {
    az: "Kuza tipi",
    ru: "Тип кузова",
    en: "Body type",
  },
  "addVehicle.adding": {
    az: "Əlavə edilir…",
    ru: "Добавление…",
    en: "Adding…",
  },
  "addVehicle.submit": {
    az: "Avtomobili əlavə et",
    ru: "Добавить автомобиль",
    en: "Add car",
  },
  "body.sedan": { az: "Sedan", ru: "Седан", en: "Sedan" },
  "body.suv": { az: "SUV", ru: "Внедорожник", en: "SUV" },
  "body.minivan": { az: "Minivan", ru: "Минивэн", en: "Minivan" },
  "body.pickup": { az: "Pikap", ru: "Пикап", en: "Pickup" },

  // Aktiv avtomobil vərəqi
  "vehicleSheet.title": {
    az: "Aktiv avtomobil",
    ru: "Активный автомобиль",
    en: "Active car",
  },
  "vehicleSheet.note": {
    az: "QR skan edərkən xal seçilmiş avtomobilə yazılır.",
    ru: "При сканировании QR баллы записываются на выбранный автомобиль.",
    en: "When you scan, points are recorded for the selected car.",
  },

  // Səviyyə vərəqi
  "tier.title": {
    az: "Səviyyə və üstünlüklər",
    ru: "Уровень и привилегии",
    en: "Tier and benefits",
  },
  "tier.current": { az: "Cari", ru: "Текущий", en: "Current" },
  "tier.bonusBadge": {
    az: "{pct}% bonus",
    ru: "{pct}% бонус",
    en: "{pct}% bonus",
  },
  "tier.toTier": {
    az: "{tier} səviyyəsinə",
    ru: "До уровня {tier}",
    en: "To {tier} level",
  },
  "tier.startLevel": {
    az: "Başlanğıc səviyyə — hamı üçün açıqdır.",
    ru: "Начальный уровень — доступен всем.",
    en: "Starting level — open to everyone.",
  },
  "tier.unlockAt": {
    az: "İllik {amount} xərcdən sonra açılır.",
    ru: "Открывается после годовых трат {amount}.",
    en: "Unlocks after {amount} in annual spending.",
  },
  "tier.benefitsTitle": {
    az: "{tier} üstünlükləri",
    ru: "Привилегии {tier}",
    en: "{tier} benefits",
  },
  "tier.autoNote": {
    az: "Səviyyə cari ildəki ümumi xərcə görə avtomatik yenilənir.",
    ru: "Уровень обновляется автоматически по сумме трат за текущий год.",
    en: "Your tier updates automatically based on this year's total spending.",
  },

  // Bildirişlər
  "notifications.title": {
    az: "Bildirişlər",
    ru: "Уведомления",
    en: "Notifications",
  },
  "notif.n1.title": {
    az: "Xal qazandınız",
    ru: "Вы получили баллы",
    en: "You earned points",
  },
  "notif.n1.text": {
    az: "Kompleks yuma üçün +1.25 ₼ bonus hesabınıza yazıldı.",
    ru: "За комплексную мойку начислено +1.25 ₼ бонуса.",
    en: "+1.25 ₼ bonus was credited for a complex wash.",
  },
  "notif.n1.time": { az: "2 saat əvvəl", ru: "2 часа назад", en: "2 hours ago" },
  "notif.n2.title": {
    az: "Yeni kampaniya",
    ru: "Новая акция",
    en: "New offer",
  },
  "notif.n2.text": {
    az: "Həftəiçi 20% endirim başladı — indi yoxlayın.",
    ru: "Стартовала скидка 20% по будням — проверьте сейчас.",
    en: "A 20% weekday discount has started — check it now.",
  },
  "notif.n2.time": { az: "Dünən", ru: "Вчера", en: "Yesterday" },
  "notif.n3.title": {
    az: "Paketiniz azalır",
    ru: "Пакет заканчивается",
    en: "Your package is running low",
  },
  "notif.n3.text": {
    az: "Paketinizdə 3 yuma qaldı. Yeniləmək üçün toxunun.",
    ru: "В вашем пакете осталось 3 мойки. Нажмите, чтобы продлить.",
    en: "3 washes left in your package. Tap to renew.",
  },
  "notif.n3.time": { az: "3 gün əvvəl", ru: "3 дня назад", en: "3 days ago" },
};

/** Səviyyə üstünlükləri — modal pəncərədə göstərilir (dil üzrə). */
export const TIER_BENEFITS_I18N: Record<Lang, Record<TierCode, string[]>> = {
  az: {
    bronze: ["Hər yumada 2% bonus", "Kampaniyalara giriş"],
    silver: ["Hər yumada 3% bonus", "Doğum günündə hədiyyə"],
    gold: [
      "Hər yumada 5% bonus",
      "Növbədən kənar xidmət",
      "Aylıq xüsusi təkliflər",
    ],
    platinum: [
      "Hər yumada 8% bonus",
      "Prioritet xidmət",
      "Aylıq pulsuz salon təmizliyi",
    ],
  },
  ru: {
    bronze: ["2% бонус за каждую мойку", "Доступ к акциям"],
    silver: ["3% бонус за каждую мойку", "Подарок в день рождения"],
    gold: [
      "5% бонус за каждую мойку",
      "Обслуживание вне очереди",
      "Ежемесячные спецпредложения",
    ],
    platinum: [
      "8% бонус за каждую мойку",
      "Приоритетное обслуживание",
      "Ежемесячная бесплатная химчистка салона",
    ],
  },
  en: {
    bronze: ["2% bonus on every wash", "Access to offers"],
    silver: ["3% bonus on every wash", "Birthday gift"],
    gold: [
      "5% bonus on every wash",
      "Skip-the-queue service",
      "Monthly special offers",
    ],
    platinum: [
      "8% bonus on every wash",
      "Priority service",
      "Monthly free interior cleaning",
    ],
  },
};

type Vars = Record<string, string | number>;

function interpolate(template: string, vars?: Vars) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

export type TFn = (key: string, vars?: Vars) => string;

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: TFn;
}

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("az");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_KEY);
    } catch {}
    if (saved === "az" || saved === "ru" || saved === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const t = useCallback<TFn>(
    (key, vars) => {
      const entry = STRINGS[key];
      const template = entry ? (entry[lang] ?? entry.az) : key;
      return interpolate(template, vars);
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useT yalnız LanguageProvider daxilində işləyir");
  return ctx;
}
