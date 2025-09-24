import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiClock, FiTag, FiUser } from 'react-icons/fi';
import Link from 'next/link';

function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      
      // Save to recent searches
      if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
        const newRecent = [searchQuery.trim(), ...recentSearches].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <FiSearch className="text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search articles, topics, tags..."
              className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Searching...</p>
            </div>
          )}

          {!loading && query && results.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
                </h3>
              </div>
              <div className="space-y-3">
                {results.map((result) => (
                  <Link key={result.id} href={`/blogs/${result.id}`}>
                    <a 
                      className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      onClick={onClose}
                    >
                      <div className="flex items-start space-x-3">
                        {result.headerImage && (
                          <img
                            src={result.headerImage}
                            alt={result.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {result.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
                            {result.abstract}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <FiUser className="w-3 h-3" />
                              <span>{result.author}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiClock className="w-3 h-3" />
                              <span>{result.readTime}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiTag className="w-3 h-3" />
                              <span>{result.topic}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try searching with different keywords or check your spelling.
              </p>
            </div>
          )}

          {!loading && !query && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Recent searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <FiClock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700 dark:text-gray-300">{search}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && !query && recentSearches.length === 0 && (
            <div className="p-8 text-center">
              <FiSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Search articles
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Start typing to search through all blog posts, topics, and tags.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;
