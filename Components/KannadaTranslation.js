import { useState } from 'react';

function KannadaTranslation() {
  const [isHovered, setIsHovered] = useState(false);

  const handleTranslate = () => {
    // Get current page URL
    const currentUrl = window.location.href;
    // Open Google Translate with Kannada as target language
    const translateUrl = `https://translate.google.com/translate?sl=en&tl=kn&u=${encodeURIComponent(currentUrl)}`;
    window.open(translateUrl, '_blank');
  };

  return (
    <div className="my-4">
      <button
        onClick={handleTranslate}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200"
        aria-label="Translate to Kannada"
      >
        <span className="text-lg">🇮🇳</span>
        <div className="flex flex-col items-start">
          <span className="font-semibold">ಕನ್ನಡದಲ್ಲಿ ಓದಿ</span>
          <span className="text-xs opacity-90">Read in Kannada</span>
        </div>
        <svg 
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${isHovered ? 'translate-x-1' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </button>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
        Powered by Google Translate • ಗೂಗಲ್ ಅನುವಾದ
      </p>
    </div>
  );
}

export default KannadaTranslation;

