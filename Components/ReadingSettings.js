import { useState, useEffect } from 'react';
import { FaFont, FaEye, FaKeyboard } from 'react-icons/fa';
import { HiAdjustments } from 'react-icons/hi';

function ReadingSettings({ articleRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(21); // Default from CSS
  const [lineHeight, setLineHeight] = useState(1.58);
  const [focusMode, setFocusMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load saved preferences
    const savedFontSize = localStorage.getItem('readingFontSize');
    const savedLineHeight = localStorage.getItem('readingLineHeight');
    const savedFocusMode = localStorage.getItem('readingFocusMode');
    
    if (savedFontSize) setFontSize(parseFloat(savedFontSize));
    if (savedLineHeight) setLineHeight(parseFloat(savedLineHeight));
    if (savedFocusMode === 'true') setFocusMode(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !articleRef?.current) return;
    
    const article = articleRef.current;
    
    // Apply font size
    article.style.fontSize = `${fontSize}px`;
    localStorage.setItem('readingFontSize', fontSize.toString());
    
    // Apply line height
    article.style.lineHeight = lineHeight.toString();
    localStorage.setItem('readingLineHeight', lineHeight.toString());
    
    // Apply focus mode
    if (focusMode) {
      document.body.classList.add('focus-mode');
      localStorage.setItem('readingFocusMode', 'true');
    } else {
      document.body.classList.remove('focus-mode');
      localStorage.setItem('readingFocusMode', 'false');
    }
  }, [fontSize, lineHeight, focusMode, isMounted, articleRef]);

  if (!isMounted) return null;

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        title="Reading Settings"
        aria-label="Open Reading Settings"
      >
        <HiAdjustments className="text-lg sm:text-xl" />
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div 
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-[280px] sm:w-[320px]"
          style={{ 
            bottom: 'calc(4rem + 60px)', // Position above buttons
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
              <FaFont />
              Reading Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4 text-sm">
            {/* Font Size */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Font Size: {fontSize}px
              </label>
              <input
                type="range"
                min="16"
                max="28"
                step="1"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Small</span>
                <span>Large</span>
              </div>
            </div>

            {/* Line Height */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Line Height: {lineHeight.toFixed(2)}
              </label>
              <input
                type="range"
                min="1.2"
                max="2.0"
                step="0.1"
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Tight</span>
                <span>Spacious</span>
              </div>
            </div>

            {/* Focus Mode */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FaEye />
                Focus Mode
              </label>
              <button
                onClick={() => setFocusMode(!focusMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  focusMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle Focus Mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    focusMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setFontSize(21);
                setLineHeight(1.58);
                setFocusMode(false);
              }}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors text-sm"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ReadingSettings;

