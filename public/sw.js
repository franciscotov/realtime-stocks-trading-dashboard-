self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  const payload = event.data.json();

  event.waitUntil(
    self.registration.showNotification(payload.title || "Stock Alert", {
      body: payload.body || "Price threshold reached.",
      icon: "/favicon.ico",
      badge: "/favicon.ico",
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
