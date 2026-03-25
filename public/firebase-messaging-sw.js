/* eslint-disable no-undef */
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.11.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBoPIzqh_968EqkTgRU2UIWyzuF1ukjJTM",
  authDomain: "realtime-stocks-trading.firebaseapp.com",
  projectId: "realtime-stocks-trading",
  storageBucket: "realtime-stocks-trading.firebasestorage.app",
  messagingSenderId: "333155461052",
  appId: "1:333155461052:web:6071f5df8b72c1196b6db9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Stock Alert";
  const body = payload.notification?.body || "Price alert triggered";

  self.registration.showNotification(title, {
    body,
    icon: "/favicon.ico",
  });
});
