self.addEventListener("install", (event) => {
  console.log("Service Worker Installed");
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker Activated");
});

// Push Notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || "New Message", {
      body: data.body || "You have a new message",
      icon: data.icon || "/logo.png",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("/") 
  );
});