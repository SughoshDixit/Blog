import { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaStop, FaVolumeUp, FaTimes } from 'react-icons/fa';

function ReadAloud({ articleRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const utteranceRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      synthRef.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
        
        // Try to find a good default voice (prefer English, natural-sounding)
        if (!selectedVoice && availableVoices.length > 0) {
          const preferredVoice = availableVoices.find(
            voice => voice.lang.startsWith('en') && voice.name.includes('Natural')
          ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
          setSelectedVoice(preferredVoice);
        }
      };
      
      loadVoices();
      
      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      // Cleanup: stop any ongoing speech
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const extractTextFromArticle = () => {
    if (!articleRef?.current) return '';
    
    // Clone the article to avoid modifying the original
    const article = articleRef.current.cloneNode(true);
    
    // Remove script and style elements
    const scripts = article.querySelectorAll('script, style, noscript, iframe');
    scripts.forEach(el => el.remove());
    
    // Remove interactive elements that shouldn't be read
    const interactiveElements = article.querySelectorAll('button, a[href^="#"], .toc, nav');
    interactiveElements.forEach(el => el.remove());
    
    // Handle code blocks - replace with readable text
    const codeBlocks = article.querySelectorAll('pre code, code');
    codeBlocks.forEach(el => {
      const codeText = el.textContent || '';
      // For inline code, keep it but mark it
      if (el.parentElement?.tagName === 'PRE') {
        el.textContent = `Code block: ${codeText.substring(0, 100)}${codeText.length > 100 ? '...' : ''}`;
      } else {
        el.textContent = `code: ${codeText}`;
      }
    });
    
    // Remove pre tags but keep their content
    const preBlocks = article.querySelectorAll('pre');
    preBlocks.forEach(pre => {
      const text = pre.textContent || '';
      pre.replaceWith(document.createTextNode(`\n${text}\n`));
    });
    
    // Handle images - replace with alt text or caption
    const images = article.querySelectorAll('img');
    images.forEach(img => {
      const altText = img.alt || img.title || 'Image';
      const parent = img.parentElement;
      // Check if there's a caption nearby
      const caption = parent?.querySelector('figcaption, .caption')?.textContent;
      const imageText = caption ? `${altText}: ${caption}` : altText;
      img.replaceWith(document.createTextNode(`[${imageText}]`));
    });
    
    // Handle headings - add emphasis
    const headings = article.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      heading.textContent = `${'Section'.repeat(Math.min(level, 3))}: ${text}`;
    });
    
    // Handle lists - make them readable
    const lists = article.querySelectorAll('ul, ol');
    lists.forEach(list => {
      const items = list.querySelectorAll('li');
      items.forEach((item, index) => {
        const text = item.textContent || '';
        item.textContent = `Item ${index + 1}: ${text}`;
      });
    });
    
    // Handle blockquotes
    const blockquotes = article.querySelectorAll('blockquote');
    blockquotes.forEach(quote => {
      const text = quote.textContent || '';
      quote.textContent = `Quote: ${text}`;
    });
    
    // Get all text content
    let text = article.innerText || article.textContent || '';
    
    // Clean up the text
    text = text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newline
      .replace(/\[Code block\]/g, 'Code block') // Clean up code block markers
      .trim();
    
    // Add introduction
    if (text.length > 0) {
      text = `Reading article. ${text}`;
    }
    
    return text;
  };

  const startReading = () => {
    if (!isSupported) {
      alert('Your browser does not support text-to-speech. Please use a modern browser like Chrome, Edge, or Safari.');
      return;
    }

    if (synthRef.current.speaking) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    const text = extractTextFromArticle();
    
    if (!text) {
      alert('No text content found to read.');
      return;
    }

    setCurrentText(text);
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };
    
    utterance.onpause = () => {
      setIsPaused(true);
    };
    
    utterance.onresume = () => {
      setIsPaused(false);
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const pauseReading = () => {
    if (synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeReading = () => {
    if (synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const stopReading = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    }
  };

  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    setRate(newRate);
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate;
    }
  };

  const handlePitchChange = (e) => {
    const newPitch = parseFloat(e.target.value);
    setPitch(newPitch);
    if (utteranceRef.current) {
      utteranceRef.current.pitch = newPitch;
    }
  };

  const handleVoiceChange = (e) => {
    const voiceName = e.target.value;
    const voice = voices.find(v => v.name === voiceName);
    if (voice) {
      setSelectedVoice(voice);
      if (utteranceRef.current) {
        utteranceRef.current.voice = voice;
      }
    }
  };

  if (!isSupported) {
    return null; // Don't show button if not supported
  }

  // Floating button when collapsed
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 sm:p-4 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
        title="Read Aloud"
        aria-label="Open Read Aloud"
      >
        <FaVolumeUp className="text-lg sm:text-xl" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 max-w-sm w-[calc(100vw-2rem)] sm:w-[360px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaVolumeUp className="text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
            Read Aloud
          </h3>
        </div>
        <button
          onClick={() => {
            setIsExpanded(false);
            stopReading();
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          title="Close"
          aria-label="Close Read Aloud"
        >
          <FaTimes className="text-sm" />
        </button>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2 mb-3">
        {!isPlaying || isPaused ? (
          <button
            onClick={startReading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            title="Play"
          >
            <FaPlay className="text-xs" />
            <span>Play</span>
          </button>
        ) : (
          <button
            onClick={pauseReading}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm font-medium"
            title="Pause"
          >
            <FaPause className="text-xs" />
            <span>Pause</span>
          </button>
        )}
        
        <button
          onClick={stopReading}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
          title="Stop"
        >
          <FaStop className="text-xs" />
          <span>Stop</span>
        </button>
      </div>

      {/* Settings */}
      <div className="space-y-3 text-xs">
        {/* Speed Control */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Speed: {rate.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={handleRateChange}
            className="w-full"
          />
        </div>

        {/* Pitch Control */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-1">
            Pitch: {pitch.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={pitch}
            onChange={handlePitchChange}
            className="w-full"
          />
        </div>

        {/* Voice Selection */}
        {voices.length > 0 && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Voice:
            </label>
            <select
              value={selectedVoice?.name || ''}
              onChange={handleVoiceChange}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs"
              disabled={isPlaying}
            >
              {voices
                .filter(voice => voice.lang.startsWith('en'))
                .map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Status */}
      {isPlaying && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Reading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadAloud;

