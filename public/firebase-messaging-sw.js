/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js",
);

async function initializeMessaging() {
  try {
    const response = await fetch("/api/firebase/messaging-config", {
      cache: "no-store",
    });

    if (!response.ok) {
      return;
    }

    const config = await response.json();
    const isConfigValid = Boolean(
      config?.apiKey &&
        config?.authDomain &&
        config?.projectId &&
        config?.storageBucket &&
        config?.messagingSenderId &&
        config?.appId,
    );

    if (!isConfigValid) {
      return;
    }

    firebase.initializeApp(config);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title || "Stock Alert";
      const body = payload.notification?.body || "Price alert triggered";

      self.registration.showNotification(title, {
        body,
        icon: "/favicon.ico",
      });
    });
  } catch {
    // No-op: keep service worker alive if config endpoint is unavailable.
  }
}

void initializeMessaging();
