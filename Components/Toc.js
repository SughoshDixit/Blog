import React, { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

function Toc({ headings }) {
  const [active, setActive] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

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

  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <nav className="sticky top-24 toc-container p-4 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div 
        className="toc-header flex items-center justify-between cursor-pointer mb-3"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Table of Contents</p>
        {isCollapsed ? (
          <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <FiChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </div>
      
      {!isCollapsed && (
        <ul className="toc-list space-y-1">
          {headings.map((heading, index) => (
            <li
              key={heading.uid || index}
              className={`toc-item level-${heading.level} ${
                heading.id === active ? "active" : ""
              } cursor-pointer text-sm py-1 px-2 rounded transition-colors ${
                heading.level === 2 
                  ? "font-medium text-gray-700 dark:text-gray-300" 
                  : "text-gray-600 dark:text-gray-400 ml-4"
              } ${
                heading.id === active 
                  ? "bg-[#1a8917]/10 dark:bg-[#26c281]/20 text-[#1a8917] dark:text-[#26c281] font-semibold" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={() => scrollToHeading(heading.id)}
            >
              {heading.text}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}

export default Toc;
