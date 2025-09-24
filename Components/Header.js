import { CgUserlane } from "react-icons/cg";

function Header({ topic, topicName, topicCount }) {
  return (
    <>
      {topic && (
        <div className="pt-24 px-12 mx-auto max-w-7xl">
          <div className="px-0.5 md:px-7 pt-6 mx-auto flex justify-between items-center">
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200">{topicName}</h3>

            <h4 className="text-xl">{topicCount} Articles</h4>
          </div>
        </div>
      )}

      {!topic && (
        <div className="pt-28 px-6 md:px-12 mx-auto max-w-7xl">
          <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 mb-6">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Welcome to my digital space</span>
              </div>
              
              <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-7xl dark:text-gray-50">
                <span className="block">Tech Insights</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                  & Innovation
                </span>
              </h1>
              
              <p className="mb-8 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Exploring the intersection of technology, data science, and human creativity. 
                Join me on a journey through code, algorithms, and the stories that shape our digital world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://sughoshdixit.github.io/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
                >
                  <CgUserlane className="mr-2" />
                  View Portfolio
                </a>
                <a 
                  href="#latest-posts" 
                  className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Explore Articles
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Science</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Insights into algorithms, ML, and data-driven decisions</p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tech Innovation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Latest trends in software development and emerging technologies</p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Creative Tech</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Where technology meets creativity and human expression</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
