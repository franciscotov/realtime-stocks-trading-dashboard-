import {
  disableFcmTokenRegistration,
  ensureFcmTokenRegistered,
  hasStoredFcmToken,
} from "@/lib/firebaseClient";
import {
  PUSH_NOTIFICATION_STATUS,
  type PushNotificationStatus,
} from "@/config/notifications";
const THROTTLE_MS = 60_000;
const STORAGE_PREFIX = "stock-alert-last-notification:";

export function getPushNotificationStatus(): PushNotificationStatus {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return PUSH_NOTIFICATION_STATUS.UNSUPPORTED;
  }

  if (Notification.permission === "denied") {
    return PUSH_NOTIFICATION_STATUS.BLOCKED;
  }

  if (Notification.permission === "granted" && hasStoredFcmToken()) {
    return PUSH_NOTIFICATION_STATUS.ENABLED;
  }

  return PUSH_NOTIFICATION_STATUS.DISABLED;
}

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return PUSH_NOTIFICATION_STATUS.UNSUPPORTED;
  }

  let permission = Notification.permission;
  if (Notification.permission === "default") {
    permission = await Notification.requestPermission();
  }
  
  if (permission === "granted") {
    await ensureFcmTokenRegistered();
  }

  return getPushNotificationStatus();
}

export async function disablePushNotifications() {
  await disableFcmTokenRegistration();
  return getPushNotificationStatus();
}

export function canNotifyForSymbol(symbol: string) {
  if (typeof window === "undefined") {
    return false;
  }

  const key = `${STORAGE_PREFIX}${symbol}`;
  const last = Number(window.localStorage.getItem(key) ?? "0");
  return Date.now() - last >= THROTTLE_MS;
}

export function markNotified(symbol: string) {
  if (typeof window === "undefined") {
    return;
  }

  const key = `${STORAGE_PREFIX}${symbol}`;
  window.localStorage.setItem(key, String(Date.now()));
}

export function notifyPriceDrop(symbol: string, currentPrice: number, alertPrice: number) {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  if (!canNotifyForSymbol(symbol)) {
    return;
  }

  markNotified(symbol);

  void fetch("/api/notifications/stock-drop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      symbol,
      currentPrice,
      alertPrice,
    }),
  });
}
