import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiBell, FiBellOff } from "react-icons/fi";
import { db as clientDb } from "../Firebase/Firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function NotificationBell() {
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const user = useSelector((state) => state.user);

  // Check browser support on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator) {
      setSupported(true);
    }
  }, []);

  // Check existing subscription when user changes
  useEffect(() => {
    if (!supported || !user?.uid) return;

    getDoc(doc(clientDb, "fcm_tokens", user.uid))
      .then((snap) => {
        setSubscribed(snap.exists());
      })
      .catch(() => {
        setSubscribed(false);
      });
  }, [user, supported]);

  const subscribe = async () => {
    if (!user?.uid) return;
    setLoading(true);

    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setLoading(false);
        return;
      }

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
    } catch (err) {
      console.error("FCM unsubscribe error:", err);
    }
    setLoading(false);
  };

  // Don't render if browser doesn't support notifications or user isn't signed in
  if (!supported || !user?.uid) return null;

  return (
    <button
      onClick={subscribed ? unsubscribe : subscribe}
      disabled={loading}
      className={`relative p-2 transition-colors disabled:opacity-50 ${
        subscribed
          ? "text-[#C74634] dark:text-[#E8572A]"
          : "text-[#6E6B68] hover:text-[#C74634] dark:text-[#B8B4B0] dark:hover:text-[#E8572A]"
      }`}
      title={subscribed ? "Disable notifications" : "Get notified of new posts"}
      aria-label={subscribed ? "Disable notifications" : "Enable notifications"}
    >
      {subscribed ? (
        <>
          <FiBell className="text-xl" />
          {/* Active indicator dot */}
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C74634] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C74634]"></span>
          </span>
        </>
      ) : (
        <FiBellOff className="text-xl" />
      )}
    </button>
  );
}
