/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: self.__FIREBASE_CONFIG__?.apiKey || "",
  projectId: self.__FIREBASE_CONFIG__?.projectId || "",
  messagingSenderId: self.__FIREBASE_CONFIG__?.messagingSenderId || "",
  appId: self.__FIREBASE_CONFIG__?.appId || "",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon, url } = payload.notification || payload.data || {};
  self.registration.showNotification(title || "New post on SughoshDixit.com", {
    body: body || "A new article has been published!",
    icon: icon || "/favicon.svg",
    data: { url: url || "/" },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
