import { useEffect } from "react";

/**
 * useScrollReveal
 * Adds the `revealed` class to any element that has a `reveal`, `reveal-left`,
 * `reveal-right`, or `reveal-scale` class once it enters the viewport.
 *
 * Uses requestAnimationFrame to ensure the DOM is painted before observing,
 * and immediately reveals any elements already visible in the viewport.
 */
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    // Use rAF to wait until after the browser has painted so elements
    // are guaranteed to have a layout rect the observer can measure.
    const rafId = requestAnimationFrame(() => {
      const selector =
        ".reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed), .reveal-scale:not(.revealed)";
      const elements = document.querySelectorAll(selector);

      if (!elements.length) return;

      // If IntersectionObserver is not available, reveal everything immediately
      if (typeof IntersectionObserver === "undefined") {
        elements.forEach((el) => el.classList.add("revealed"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
      );

      elements.forEach((el) => {
        // Immediately reveal elements already in the viewport
        const rect = el.getBoundingClientRect();
        if (
          rect.top < window.innerHeight + 20 &&
          rect.bottom > 0
        ) {
          el.classList.add("revealed");
        } else {
          observer.observe(el);
        }
      });

      // Store observer reference for cleanup
      observerRef = observer;
    });

    let observerRef = null;

    return () => {
      cancelAnimationFrame(rafId);
      if (observerRef) observerRef.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
