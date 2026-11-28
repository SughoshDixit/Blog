import { useState, useEffect } from 'react';
import { FaFont, FaEye, FaKeyboard } from 'react-icons/fa';
import { HiAdjustments } from 'react-icons/hi';

function ReadingSettings({ articleRef, docked = false, externalOpen = false, onExternalClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(24);
  const [lineHeight, setLineHeight] = useState(1.78);
  const [hasCustomTypography, setHasCustomTypography] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [sepiaMode, setSepiaMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedFontSize = localStorage.getItem('readingFontSize');
    const savedLineHeight = localStorage.getItem('readingLineHeight');
    const savedFocusMode = localStorage.getItem('readingFocusMode');
    const savedSepiaMode = localStorage.getItem('readingSepiaMode');
    
    if (savedFontSize) {
      setFontSize(parseFloat(savedFontSize));
      setHasCustomTypography(true);
    }
    if (savedLineHeight) {
      setLineHeight(parseFloat(savedLineHeight));
      setHasCustomTypography(true);
    }
    if (savedFocusMode === 'true') setFocusMode(true);
    if (savedSepiaMode === 'true') setSepiaMode(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !articleRef?.current) return;
    
    const article = articleRef.current;

    if (hasCustomTypography) {
      article.style.setProperty('--article-font-size', `${fontSize}px`);
      article.style.setProperty('--article-line-height', lineHeight.toString());
      localStorage.setItem('readingFontSize', fontSize.toString());
      localStorage.setItem('readingLineHeight', lineHeight.toString());
    } else {
      article.style.removeProperty('--article-font-size');
      article.style.removeProperty('--article-line-height');
    }
    
    // Apply focus mode
    if (focusMode) {
      document.body.classList.add('focus-mode');
      localStorage.setItem('readingFocusMode', 'true');
    } else {
      document.body.classList.remove('focus-mode');
      localStorage.setItem('readingFocusMode', 'false');
    }

    if (sepiaMode) {
      document.body.classList.add('sepia-mode');
      localStorage.setItem('readingSepiaMode', 'true');
    } else {
      document.body.classList.remove('sepia-mode');
      localStorage.setItem('readingSepiaMode', 'false');
    }
  }, [fontSize, lineHeight, hasCustomTypography, focusMode, sepiaMode, isMounted, articleRef]);

  if (!isMounted) return null;

  const panelOpen = docked ? externalOpen : isOpen;
  const closePanel = () => {
    if (docked) {
      onExternalClose && onExternalClose();
    } else {
      setIsOpen(false);
    }
  };

  if (docked && !panelOpen) return null;

  return (
    <>
      {!docked && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 bg-gray-700 hover:bg-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
          title="Reading Settings"
          aria-label="Open Reading Settings"
        >
          <HiAdjustments className="text-lg sm:text-xl" />
        </button>
      )}

      {/* Settings Panel */}
      {panelOpen && (
        <div 
          className={`fixed ${docked ? "bottom-16 left-4 sm:bottom-20 sm:left-6" : "bottom-20 right-4 sm:bottom-24 sm:right-6"} z-40 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-[280px] sm:w-[320px]`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm flex items-center gap-2">
              <FaFont />
              Reading Settings
            </h3>
            <button
              onClick={closePanel}
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
                onChange={(e) => {
                  setHasCustomTypography(true);
                  setFontSize(parseInt(e.target.value));
                }}
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
                onChange={(e) => {
                  setHasCustomTypography(true);
                  setLineHeight(parseFloat(e.target.value));
                }}
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
                Distraction Free
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

            {/* Sepia mode */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <FaKeyboard />
                Sepia Mode
              </label>
              <button
                onClick={() => setSepiaMode(!sepiaMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  sepiaMode ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label="Toggle Sepia Mode"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sepiaMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setHasCustomTypography(false);
                setFontSize(24);
                setLineHeight(1.78);
                setFocusMode(false);
                setSepiaMode(false);
                localStorage.removeItem('readingFontSize');
                localStorage.removeItem('readingLineHeight');
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

