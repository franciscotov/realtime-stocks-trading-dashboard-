import { initializeApp, getApps, getApp } from "firebase/app";
import {
  deleteToken,
  getMessaging,
  getToken,
  isSupported,
} from "firebase/messaging";
import {
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_VAPID_KEY,
} from "@/config/env";

const TOKEN_STORAGE_KEY = "fcm-token";

const hasFirebaseConfig = Boolean(
  FIREBASE_API_KEY &&
    FIREBASE_AUTH_DOMAIN &&
    FIREBASE_PROJECT_ID &&
    FIREBASE_STORAGE_BUCKET &&
    FIREBASE_MESSAGING_SENDER_ID &&
    FIREBASE_APP_ID &&
    FIREBASE_VAPID_KEY,
);

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

const app = hasFirebaseConfig
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

async function registerTokenOnServer(token: string) {
  await fetch("/api/notifications/register-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

async function unregisterTokenOnServer(token: string) {
  await fetch("/api/notifications/unregister-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export function hasStoredFcmToken(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem(TOKEN_STORAGE_KEY));
}

export async function ensureFcmTokenRegistered(): Promise<string | null> {
  if (typeof window === "undefined" || !app || !hasFirebaseConfig) {
    return null;
  }

  if (!(await isSupported())) {
    return null;
  }

  const serviceWorkerRegistration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const messaging = getMessaging(app);
  const token = await getToken(messaging, {
    vapidKey: FIREBASE_VAPID_KEY,
    serviceWorkerRegistration,
  });
  if (!token) {
    return null;
  }

  const previous = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (previous !== token) {
    await registerTokenOnServer(token);
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  return token;
}

export async function disableFcmTokenRegistration(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);

  if (app && hasFirebaseConfig && (await isSupported())) {
    const messaging = getMessaging(app);
    try {
      await deleteToken(messaging);
    } catch {
      // Ignore client token cleanup failures and continue server/local cleanup.
    }
  }

  if (storedToken) {
    try {
      await unregisterTokenOnServer(storedToken);
    } catch {
      // Ignore API failures and still clear local state to reflect disabled intent.
    }
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    return true;
  }

  return false;
}
