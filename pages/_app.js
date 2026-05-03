import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "next-themes";
import { Provider } from "react-redux";
import { store } from "../Redux/store";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaFutbol } from "react-icons/fa";

const ChatBot = dynamic(() => import("../Components/ChatBot"), { ssr: false });

function FootballSplashScreen({ isVisible }) {
  const [render, setRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) setRender(true);
  }, [isVisible]);

  const onAnimationEnd = () => {
    if (!isVisible) setRender(false);
  };

  if (!render) return null;

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#161513] transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={onAnimationEnd}
    >
      <div className="animate-bounce mb-2">
        <FaFutbol className="text-white text-6xl animate-[spin_2s_linear_infinite] drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
      </div>
      <div className="w-16 h-2 bg-white/10 rounded-[50%] blur-sm mx-auto mb-8 animate-pulse"></div>
      <h2 className="text-lg font-semibold tracking-[0.2em] text-[#B8E0D8] uppercase animate-pulse">
        Kicking off...
      </h2>
    </div>
  );
}

const ROUTE_LOADER_CONFIG = [
  {
    match: (url) => url === "/" || url === "",
    type: "ripple",
    title: "Entering Home...",
    subtitle: "Connecting to the network",
  },
  {
    match: (url) => url.startsWith("/football"),
    type: "football-goal",
    title: "Kicking off...",
    subtitle: "Final third run in progress",
  },
  {
    match: (url) => url.startsWith("/dashboard"),
    type: "data-pulse",
    title: "Analyzing Data...",
    subtitle: "Crunching the latest signals",
  },
  {
    match: (url) => url.startsWith("/projects"),
    type: "data-pulse",
    title: "Building Projects...",
    subtitle: "Assembling components",
  },
  {
    match: (url) => url.startsWith("/blogs/") || url.startsWith("/archive") || url.startsWith("/topic/"),
    type: "book",
    title: "Opening Story...",
    subtitle: "Flipping through the archives",
  },
  {
    match: (url) => url.startsWith("/garden"),
    type: "garden",
    title: "Entering the Garden...",
    subtitle: "Nurturing digital seeds",
  },
  {
    match: (url) => url.startsWith("/ai-gallery") || url.startsWith("/learning-path"),
    type: "atom",
    title: "Generating Vision...",
    subtitle: "Synthesizing patterns",
  },
  {
    match: (url) => url.startsWith("/consulting") || url.startsWith("/about"),
    type: "atom",
    title: "Expert Strategy...",
    subtitle: "Preparing professional view",
  },
  {
    match: () => true,
    type: "ripple",
    title: "Loading...",
    subtitle: "Preparing your next page",
  },
];

function getLoaderConfig(url) {
  return ROUTE_LOADER_CONFIG.find((entry) => entry.match(url)) || ROUTE_LOADER_CONFIG[ROUTE_LOADER_CONFIG.length - 1];
}

function RouteSplashScreen({ isVisible, loaderConfig }) {
  const [render, setRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) setRender(true);
  }, [isVisible]);

  const onTransitionEnd = () => {
    if (!isVisible) setRender(false);
  };

  if (!render) return null;

  const renderLoader = () => {
    switch (loaderConfig?.type) {
      case "football-goal":
        return (
          <div className="goal-loader-scene" aria-hidden="true">
            <div className="goal-loader-ground" />
            <div className="goal-loader-player">
              <span className="goal-loader-head" />
              <span className="goal-loader-body" />
              <span className="goal-loader-leg goal-loader-leg-back" />
              <span className="goal-loader-leg goal-loader-leg-front" />
            </div>
            <div className="goal-loader-ball" />
            <div className="goal-loader-goal">
              <span /> <span /> <span />
            </div>
          </div>
        );
      case "atom":
        return (
          <div className="atom-loader">
            <div className="atom-core" />
            <div className="atom-orbit"><div className="atom-electron" /></div>
            <div className="atom-orbit"><div className="atom-electron" /></div>
            <div className="atom-orbit"><div className="atom-electron" /></div>
          </div>
        );
      case "book":
        return (
          <div className="book-loader">
            <div className="book-page" />
            <div className="book-page" />
            <div className="book-page" />
          </div>
        );
      case "data-pulse":
        return (
          <div className="data-pulse-loader">
            <div className="data-bar" />
            <div className="data-bar" />
            <div className="data-bar" />
            <div className="data-bar" />
            <div className="data-bar" />
          </div>
        );
      case "garden":
        return (
          <div className="garden-loader">
            <div className="garden-stem">
              <div className="garden-leaf leaf-left" />
              <div className="garden-leaf leaf-right" />
            </div>
          </div>
        );
      case "ripple":
      default:
        return (
          <div className="ripple-loader">
            <div className="ripple-circle" />
            <div className="ripple-circle" />
          </div>
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-[#161513]/95 backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onTransitionEnd={onTransitionEnd}
    >
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        {renderLoader()}
      </div>

      <h2 className="mt-8 text-lg font-semibold tracking-[0.2em] text-[#B8E0D8] uppercase animate-pulse">
        {loaderConfig?.title || "Loading..."}
      </h2>
      <p className="mt-2 text-xs tracking-[0.14em] uppercase text-[#d0cbc4]">
        {loaderConfig?.subtitle || "Please wait"}
      </p>
    </div>
  );
}

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
  const [initialLoading, setInitialLoading] = useState(true);
  const [loaderConfig, setLoaderConfig] = useState(getLoaderConfig(router.asPath || "/"));

  useEffect(() => {
    // Splash screen timer
    const splashTimer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); // Increased slightly for better effect

    let loadStartTime = 0;
    const MIN_LOAD_TIME = 1200; // Minimum time in ms to show the loader

    const handleStart = (url) => {
      loadStartTime = Date.now();
      setLoaderConfig(getLoaderConfig(url));
      setLoading(true);
    };

    const handleEnd = () => {
      const elapsed = Date.now() - loadStartTime;
      const remaining = Math.max(0, MIN_LOAD_TIME - elapsed);
      
      setTimeout(() => {
        setLoading(false);
      }, remaining);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleEnd);
    router.events.on("routeChangeError", handleEnd);

    return () => {
      clearTimeout(splashTimer);
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleEnd);
      router.events.off("routeChangeError", handleEnd);
    };
  }, [router.events]);

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <ThemeProvider attribute="class">
          <FootballSplashScreen isVisible={initialLoading} />
          <RouteSplashScreen isVisible={loading} loaderConfig={loaderConfig} />
          <PageProgressBar loading={loading} />
          <Component {...pageProps} />
          <ChatBot />
          <Analytics />
        </ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}

export default MyApp;
