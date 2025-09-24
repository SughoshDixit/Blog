import { SiTwitter, SiGithub, SiInstagram } from "react-icons/si";
import { FiLinkedin } from "react-icons/fi";

function Footer() {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Medium-style footer content */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-bold text-sm">S</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">Sughosh's Chronicles</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Stories and ideas for people who think differently.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/PSughosh"
                rel="noopener noreferrer"
                target="_blank"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <SiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/SughoshDixit"
                rel="noopener noreferrer"
                target="_blank"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/sughoshdixit/"
                rel="noopener noreferrer"
                target="_blank"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sughosh-dixit/"
                rel="noopener noreferrer"
                target="_blank"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">About</a></li>
              <li><a href="/ai-gallery" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">AI Gallery</a></li>
              <li><a href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Dashboard</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://sughoshdixit.github.io/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Portfolio</a></li>
              <li><a href="https://www.youtube.com/@sughoshdixit" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">YouTube</a></li>
              <li><a href="mailto:sughoshdixit@gmail.com" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {year} Sughosh Dixit. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Privacy</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Terms</a>
              <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Help</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
