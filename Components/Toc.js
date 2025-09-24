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
    <nav className="toc-container p-4 rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur border border-gray-200 dark:border-gray-700 shadow-sm">
      <div 
        className="toc-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Table of Contents</p>
        {isCollapsed ? (
          <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        ) : (
          <FiChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        )}
      </div>
      
      {!isCollapsed && (
        <ul className="toc-list">
          {headings.map((heading, index) => (
            <li
              key={heading.uid || index}
              className={`toc-item level-${heading.level} ${
                heading.id === active ? "active" : ""
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
