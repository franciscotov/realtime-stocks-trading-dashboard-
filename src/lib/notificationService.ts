import { ensureFcmTokenRegistered } from "@/lib/firebaseClient";
const THROTTLE_MS = 60_000;
const STORAGE_PREFIX = "stock-alert-last-notification:";

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  let permission = Notification.permission;
  if (Notification.permission === "default") {
    permission = await Notification.requestPermission();
  }
  
  if (permission === "granted") {
    await ensureFcmTokenRegistered();
  }

  return permission;
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
