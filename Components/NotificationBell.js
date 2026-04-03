import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiBell, FiBellOff } from "react-icons/fi";
import { db as clientDb } from "../Firebase/Firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function NotificationBell() {
  const [permission, setPermission] = useState("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    setPermission(Notification.permission);

    if (user?.uid && Notification.permission === "granted") {
      getDoc(doc(clientDb, "fcm_tokens", user.uid))
        .then((snap) => { if (snap.exists()) setSubscribed(true); })
        .catch(() => {});
    }
  }, [user]);

  const subscribe = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") { setLoading(false); return; }

      const { getMessaging, getToken } = await import("firebase/messaging");
      const messaging = getMessaging();

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js"),
      });

      if (token) {
        await setDoc(doc(clientDb, "fcm_tokens", user.uid), {
          token,
          uid: user.uid,
          name: user.name || "",
          createdAt: new Date().toISOString(),
        });
        setSubscribed(true);
      }
    } catch (err) {
      console.error("FCM subscribe error:", err);
    }
    setLoading(false);
  };

  const unsubscribe = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      await deleteDoc(doc(clientDb, "fcm_tokens", user.uid));
      setSubscribed(false);
    } catch {}
    setLoading(false);
  };

  if (typeof window === "undefined" || !("Notification" in window)) return null;
  if (!user?.uid) return null;

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className="p-2 text-[#6E6B68] hover:text-[#C74634] dark:text-[#B8B4B0] dark:hover:text-[#E8572A] transition-colors disabled:opacity-50"
      title={subscribed ? "Disable notifications" : "Get notified of new posts"}
    >
      {subscribed ? <FiBell className="text-[#C74634] text-xl" /> : <FiBellOff className="text-xl" />}
    </button>
  );
}
