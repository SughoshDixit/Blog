import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-[#C74634] text-white shadow-2xl transition-all duration-300 transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-50 pointer-events-none"
      } hover:bg-[#A73A2C] hover:scale-110 active:scale-95`}
      aria-label="Back to top"
    >
      <FiArrowUp className="w-6 h-6" />
    </button>
  );
};

export default BackToTop;
