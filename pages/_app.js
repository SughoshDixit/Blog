import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "../Redux/store";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function PageProgressBar({ loading }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 9999,
        pointerEvents: "none",
        transform: loading ? "scaleX(0.85)" : "scaleX(0)",
        transformOrigin: "left center",
        opacity: loading ? 1 : 0,
        background: "linear-gradient(90deg, #C74634, #E8572A, #C74634)",
        transition: loading
          ? "transform 0.4s ease, opacity 0.1s"
          : "transform 0.3s ease, opacity 0.4s 0.1s",
        backgroundSize: "200% 100%",
        animation: loading ? "page-load-shimmer 1.2s linear infinite" : "none",
      }}
    />
  );
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleEnd = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router.events]);

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider attribute="class">
          <PageProgressBar loading={loading} />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
