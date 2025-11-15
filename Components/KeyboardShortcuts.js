import { useEffect, useState } from 'react';
import { FaKeyboard } from 'react-icons/fa';

function KeyboardShortcuts({ articleRef }) {
  const [showHelp, setShowHelp] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyPress = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable
      ) {
        return;
      }

      // Show help: ? key
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        setShowHelp(!showHelp);
      }

      // Scroll to top: Home key
      if (e.key === 'Home' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Scroll to bottom: End key
      if (e.key === 'End' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }

      // Focus search: Ctrl/Cmd + K (handled by Navbar, but we can add here too)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        // This is handled by Navbar component
        return;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isMounted, showHelp]);

  if (!isMounted) return null;

  const shortcuts = [
    { key: '?', description: 'Show/hide keyboard shortcuts' },
    { key: 'Home', description: 'Scroll to top' },
    { key: 'End', description: 'Scroll to bottom' },
    { key: 'Ctrl/Cmd + K', description: 'Open search' },
    { key: '↑ ↓', description: 'Navigate sections (with TOC)' },
  ];

  return (
    <>
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <FaKeyboard />
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {shortcuts.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <span className="text-gray-700 dark:text-gray-300 text-sm">
                    {shortcut.description}
                  </span>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs font-mono">
                    {shortcut.key}
                  </kbd>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default KeyboardShortcuts;

