import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { BiTerminal } from "react-icons/bi";
import { HiSun, HiMoon } from "react-icons/hi";
import { CgUserlane } from "react-icons/cg";
import { AiOutlineGoogle } from "react-icons/ai";
import { FiBarChart2, FiSearch, FiHome, FiBookmark, FiUser, FiList, FiTrendingUp, FiX } from "react-icons/fi";
import { auth, provider } from "../Firebase/Firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { IoLogOutOutline } from "react-icons/io5";
import { SiCodefactor } from "react-icons/si";
import { IoMdArrowDropdown } from "react-icons/io";
import Alert from "./Alert";
import SearchModal from "./SearchModal";
import { useDispatch } from "react-redux";

function Navbar({ topics }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [viewAlert, setViewAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setIsMounted(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "STORE_USER", payload: user });
      setLogin(true);
      setIsAdmin(user.email === "sughoshpdixit@gmail.com");
    }
  }, []);

  // Add body class when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [sidebarOpen]);

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    if (isMounted) {
      setTheme(theme === "light" ? "dark" : "light");
    }
  };
  const handelSignOut = () => {
    signOut(auth)
      .then((res) => {
        setLogin(false);
        localStorage.removeItem("user");
        dispatch({ type: "REMOVE_USER" });
        setViewAlert(true);
        setAlertMessage("Hope to see you again !!");
        setTimeout(() => {
          setViewAlert(false);
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handelSignIn = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const userObj = {
          name: res.user.displayName,
          photo: res.user.photoURL,
          token: res.user.accessToken,
          uid: res.user.uid,
          email: res.user.email,
        };

        localStorage.setItem("user", JSON.stringify(userObj));
        dispatch({ type: "STORE_USER", payload: userObj });
        setIsAdmin(userObj.email === "sughoshpdixit@gmail.com");

        // best-effort upsert user to backend
        fetch('/api/users/upsert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userObj),
        }).catch(() => {});

        setLogin(true);
        setViewAlert(true);
        setAlertMessage(`Hello ${res.user.displayName}`);
        setTimeout(() => {
          setViewAlert(false);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Alert show={viewAlert} type="success" message={alertMessage} />
      
      {/* Desktop Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f7f5f2]/90 dark:bg-[#0b1220]/90 border-b border-[#e6dfd3] dark:border-[#141b2c] backdrop-blur-xl desktop-nav">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/">
              <a className="flex items-center space-x-3 text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center font-semibold">
                  S
                </div>
                <span className="text-xl font-bold tracking-tight" style={{fontFamily: 'Charter, Georgia, serif'}}>Sughosh's Chronicles</span>
              </a>
            </Link>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8 desktop-search">
            <div className="relative">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 bg-white/80 dark:bg-[#111a2e] rounded-full text-[#716857] dark:text-[#c1c9e5] hover:bg-white dark:hover:bg-[#18243c] transition-colors border border-[#e6dfd3] dark:border-[#1c2a45] shadow-sm"
                title="Search articles (Ctrl+K)"
              >
                <div className="flex items-center space-x-2">
                  <FiSearch className="w-4 h-4" />
                  <span className="text-sm">Search</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 dark:text-gray-400 rounded">
                  ⌘K
                </kbd>
              </button>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-6 text-sm text-[#645b4a] dark:text-[#d5dcf3]">
              <Link href="/dashboard">
                <a className="hover:text-[#1a8917] transition-colors">Write</a>
              </Link>
              <a
                href="https://sughoshdixit.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1a8917] transition-colors"
              >
                Our story
              </a>
              <Link href="/ai-gallery">
                <a className="hover:text-[#1a8917] transition-colors">Labs</a>
              </Link>
            </div>
            <button
              className="p-2 text-[#716857] hover:text-gray-900 dark:text-[#c8d0ec] dark:hover:text-white transition-colors"
              onClick={toggleTheme}
              title={isMounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isMounted && theme === "dark" ? (
                <HiSun className="text-xl" />
              ) : (
                <HiMoon className="text-xl" />
              )}
            </button>

            {isLogin ? (
              <div className="flex items-center space-x-2">
                <img 
                  src="/about.jpeg" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full"
                />
                <button
                  className="medium-button-outline text-sm"
                  onClick={handelSignOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                className="medium-button text-sm"
                onClick={handelSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f7f5f2]/95 dark:bg-[#0b1220]/90 border-b border-[#e6dfd3] dark:border-[#141b2c] backdrop-blur-xl mobile-nav">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <Link href="/">
              <a className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 flex items-center justify-center text-sm font-semibold">
                  S
                </div>
                <span className="text-lg font-bold" style={{fontFamily: 'Charter, Georgia, serif'}}>Sughosh's Chronicles</span>
              </a>
            </Link>
          </div>

          {/* Right side - Search and Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-[#d5dcf3] dark:hover:text-white transition-colors mobile-search"
              title="Search articles"
            >
              <FiSearch className="w-5 h-5" />
            </button>

            <button
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-[#c8d0ec] dark:hover:text-white transition-colors"
              onClick={toggleTheme}
              title={isMounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isMounted && theme === "dark" ? (
                <HiSun className="text-lg" />
              ) : (
                <HiMoon className="text-lg" />
              )}
            </button>

            {isLogin ? (
              <div className="flex items-center space-x-2">
                <img 
                  src="/about.jpeg" 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full"
                />
                <button
                  className="medium-button-outline text-xs px-3 py-1"
                  onClick={handelSignOut}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button 
                className="medium-button text-xs px-3 py-1"
                onClick={handelSignIn}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className={`fixed left-0 top-0 h-full w-80 mobile-sidebar bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          {/* Close button */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-2 mb-8">
            <Link href="/">
              <a className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiHome className="w-5 h-5" />
                <span>Home</span>
              </a>
            </Link>
            
            <Link href="/ai-gallery">
              <a className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiBookmark className="w-5 h-5" />
                <span>AI Gallery</span>
              </a>
            </Link>
            
            <Link href="/about">
              <a className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiUser className="w-5 h-5" />
                <span>About</span>
              </a>
            </Link>
            
            <Link href="/key">
              <a className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiList className="w-5 h-5" />
                <span>Key Terms</span>
              </a>
            </Link>
            
            <Link href="/dashboard">
              <a className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <FiTrendingUp className="w-5 h-5" />
                <span>Dashboard</span>
                {isAdmin && (
                  <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">Admin</span>
                )}
              </a>
            </Link>
            
            <a 
              href="https://sughoshdixit.github.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <FiList className="w-5 h-5" />
              <span>Portfolio</span>
            </a>
          </nav>

          {/* Topics Section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Topics</h3>
            <div className="space-y-1">
              {topics.map((topic) => (
                <Link href={`/topic/${topic}`} key={topic}>
                  <a className="block px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    {topic}
                  </a>
                </Link>
              ))}
            </div>
          </div>

          {/* Following Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Following</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-sm">AI Content</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">T</span>
                </div>
                <span className="text-sm">Tech Insights</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">D</span>
                </div>
                <span className="text-sm">Data Science</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <span className="text-sm">Machine Learning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Search Modal */}
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />
    </>
  );
}

export default Navbar;
