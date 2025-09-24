import React, { useEffect, useState } from "react";

function Toc({ headings }) {
  const [active, setActive] = useState("");

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setActive(headingId);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(heading => ({
        id: heading.id,
        element: document.getElementById(heading.id)
      })).filter(item => item.element);

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const { id, element } = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <nav className="sticky top-24 overflow-auto max-h-[70vh] p-2 rounded-md bg-white/70 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-700">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">On this page</p>
      <ul className="pr-2">
        {headings.map((heading, index) => (
          <li
            key={heading.uid}
            className="mt-3 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            style={{
              paddingLeft: heading.level === 3 ? "1rem" : "",
              color: heading.id === active ? "#6366f1" : "",
            }}
            onClick={() => scrollToHeading(heading.id)}
          >
            {heading.text}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Toc;
