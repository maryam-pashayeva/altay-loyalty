/** Demo bildirişləri — həm ana səhifədəki oxunmamış nişanı, həm də
 *  bildiriş vərəqi bu vahid mənbədən oxuyur. Mətnlər i18n açarları ilə verilir. */

export type NotificationTone = "mint" | "blue" | "amber";

export interface AppNotification {
  id: string;
  tone: NotificationTone;
  unread: boolean;
  titleKey: string;
  textKey: string;
  timeKey: string;
}

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    tone: "mint",
    unread: true,
    titleKey: "notif.n1.title",
    textKey: "notif.n1.text",
    timeKey: "notif.n1.time",
  },
  {
    id: "n2",
    tone: "blue",
    unread: true,
    titleKey: "notif.n2.title",
    textKey: "notif.n2.text",
    timeKey: "notif.n2.time",
  },
  {
    id: "n3",
    tone: "amber",
    unread: false,
    titleKey: "notif.n3.title",
    textKey: "notif.n3.text",
    timeKey: "notif.n3.time",
  },
];

/** Oxunmamış bildirişlərin sayı (nişanda göstərilir). */
export const UNREAD_NOTIFICATIONS = NOTIFICATIONS.filter(
  (n) => n.unread,
).length;
