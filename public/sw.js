self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "Novo alerta de preço!",
    icon: "/logo.png",
    badge: "/logo.png",
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
    tag: data.tag || "price-alert",
    requireInteraction: true,
  };

  event.waitUntil(self.registration.showNotification(data.title || "CortexAirlines", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
