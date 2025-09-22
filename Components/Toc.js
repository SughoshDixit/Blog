import React, { useEffect, useState } from "react";
import Link from "next/link";

function Toc({ headings }) {
  const [active, setActive] = useState("");

  return (
    <nav className="sticky top-24 overflow-auto max-h-[70vh] p-2 rounded-md bg-white/70 dark:bg-gray-900/50 backdrop-blur border border-gray-200 dark:border-gray-700">
      <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">On this page</p>
      <ul className="pr-2">
        {headings.map((heading, index) => (
          <li
            key={heading.uid}
            className="mt-3 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            style={{
              paddingLeft: heading.level === 3 ? "1rem" : "",
              color: heading.id === active ? "#6366f1" : "",
            }}
            onClick={(e) => {
              setActive(heading.id);
            }}
          >
            <Link href={`#${heading.id}`}>{heading.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Toc;
