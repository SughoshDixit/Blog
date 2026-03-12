import { useEffect } from "react";

/**
 * useScrollReveal
 * Adds the `revealed` class to any element that has a `reveal`, `reveal-left`,
 * `reveal-right`, or `reveal-scale` class once it enters the viewport.
 */
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const selector = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
    const elements = document.querySelectorAll(selector);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
