import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import { FaLaptop, FaTwitter, FaGithub, FaLinkedin, FaYoutube, FaDownload, FaCode, FaDatabase, FaGraduationCap, FaBriefcase, FaFutbol, FaChartLine } from "react-icons/fa";
import { getAllTopics } from "../Lib/Data";

export const getStaticProps = () => {
  const allTopics = getAllTopics();
  return {
    props: {
      topics: allTopics,
    },
  };
};

function about({ topics }) {
  return (
    <div className="min-h-screen relative bg-[#f7f5f2] dark:bg-[#050810]">
      <Head>
        <title>About Sughosh Dixit - Data Scientist & Football Enthusiast</title>
        <meta name="description" content="Data Scientist at Oracle, Masters from BITS Pilani, and passionate footballer. Explore my journey through data, code, and the beautiful game." />
      </Head>
      
      <Navbar topics={topics} />
      
      {/* Immersive Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]"></div>
        
        {/* Floating orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e94560]/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#64ffda]/15 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#bd93f9]/10 rounded-full blur-[150px]"></div>
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 text-center">
          {/* Profile Image with glow */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#e94560] via-[#bd93f9] to-[#64ffda] rounded-full blur-xl opacity-50 animate-pulse"></div>
            <img 
              src="/about.jpeg" 
              className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white/20 shadow-2xl object-cover" 
              alt="Sughosh Dixit" 
            />
          </div>
          
          {/* Name with gradient */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
            <span className="bg-gradient-to-r from-white via-[#e0e0e0] to-[#a0a0a0] bg-clip-text text-transparent">
              Sughosh Dixit
            </span>
          </h1>
          
          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-[#a8b2d1] mb-4 font-light">
            <span className="text-[#64ffda]">Data Scientist</span> • <span className="text-[#ff6b6b]">Code Craftsman</span> • <span className="text-[#50fa7b]">Unapologetic Liverpool Fan</span>
          </p>
          
          <p className="text-lg text-[#8892b0] max-w-2xl mx-auto mb-8 leading-relaxed">
            Building intelligent systems at Oracle by day, dissecting the "Beautiful Game" by night. 
            I believe the best insights come from combining <span className="text-[#bd93f9]">rigorous mathematics</span> with the <span className="text-[#f1fa8c]">raw passion of football</span>.
          </p>
          
          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#64ffda] font-bold">30+</span>
              <span className="text-[#8892b0] ml-2">DS Articles</span>
            </div>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#ff6b6b] font-bold">Oracle</span>
              <span className="text-[#8892b0] ml-2">Data Scientist</span>
            </div>
            <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-[#bd93f9] font-bold">BITS</span>
              <span className="text-[#8892b0] ml-2">Pilani Masters</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://sughoshdixit.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#e94560] to-[#ff6b6b] text-white font-semibold shadow-lg shadow-[#e94560]/30 hover:shadow-[#e94560]/50 hover:scale-105 transition-all duration-300"
            >
              <FaLaptop />
              <span>View Portfolio</span>
            </a>
            <a
              href="/Sughosh_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <FaDownload />
              <span>Download Resume</span>
            </a>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Two Worlds Section */}
      <section className="relative py-20 bg-[#f7f5f2] dark:bg-[#050810]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{fontFamily: 'Charter, Georgia, serif'}}>
              Two Worlds, One Passion
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              My life revolves around two seemingly different worlds that share a common thread: the pursuit of excellence through pattern recognition and strategic thinking.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Data Science World */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e94560]/20 to-[#bd93f9]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-3xl bg-white dark:bg-[#0f1b31] border border-gray-200 dark:border-[#1b263d] shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#e94560] to-[#bd93f9] flex items-center justify-center">
                    <FaChartLine className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Data Science</h3>
                    <p className="text-[#e94560] font-medium">The Analytical Mind</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  From <strong>Boolean logic</strong> to <strong>fuzzy membership functions</strong>, I explore the mathematical foundations that power modern AI. 
                  My 30-Day Challenge covers nonparametric statistics, robust methods, and real-world audit applications.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#162338]">
                    <div className="text-2xl font-bold text-[#e94560]">30</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Day Challenge</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#162338]">
                    <div className="text-2xl font-bold text-[#bd93f9]">6</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Core Pillars</div>
                  </div>
                </div>
                
                <a
                  href="/blogs/day-1-boolean-logic-truth-tables-and-logical-operators"
                  className="inline-flex items-center gap-2 text-[#e94560] font-semibold hover:gap-3 transition-all"
                >
                  Start the DS Challenge
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Football World */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d6a4f]/20 to-[#40916c]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8 rounded-3xl bg-white dark:bg-[#0f1b31] border border-gray-200 dark:border-[#1b263d] shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#40916c] flex items-center justify-center">
                    <FaFutbol className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Football</h3>
                    <p className="text-[#2d6a4f] font-medium">The Beautiful Game</p>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                   Inspired by <strong>Jurgen Klopp's</strong> "Heavy Metal Football" and <strong>Steven Gerrard's</strong> leadership. I argue why Football is superior to the "Lazy Game" (Cricket) and how it teaches us about life, resilience, and unity.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#162338]">
                    <div className="text-2xl font-bold text-[#c9184a]">⚽</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Midfielder</div>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#162338]">
                    <div className="text-2xl font-bold text-[#2d6a4f]">LFC</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Supporter</div>
                  </div>
                </div>
                
                <a
                  href="/blogs/why-support-liverpool-fc-the-beautiful-game-vs-the-lazy-game"
                  className="inline-flex items-center gap-2 text-[#2d6a4f] font-semibold hover:gap-3 transition-all"
                >
                  Read My Manifesto
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Showcase */}
      <section className="py-20 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold mb-6">
              <FaYoutube />
              <span>YOUTUBE CHANNEL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{fontFamily: 'Charter, Georgia, serif'}}>
              Watch & Learn
            </h2>
            <p className="text-lg text-[#a8b2d1] max-w-2xl mx-auto">
              From tech tutorials to football highlights—subscribe for a mix of knowledge and entertainment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Channel Intro */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/rrbSLCis0QY?si=07qJavu89OD2cLfg"
                  title="Sughosh Dixit - YouTube Channel Intro"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Channel Introduction</h3>
                <p className="text-[#8892b0] text-sm">Get to know what this channel is all about!</p>
              </div>
            </div>
            
            {/* Football Skills */}
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/vX5sqN4Wl78?si=I_UpIrEyLFOlDl-c"
                  title="Sughosh Dixit - Football Skills"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">Football Skills</h3>
                <p className="text-[#8892b0] text-sm">Watch me in action on the football pitch! ⚽</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@sughoshdixit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/30"
            >
              <FaYoutube className="text-xl" />
              <span>Subscribe to Channel</span>
            </a>
          </div>
        </div>
      </section>

      {/* Professional Journey */}
      <section className="py-20 bg-[#f7f5f2] dark:bg-[#050810]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" style={{fontFamily: 'Charter, Georgia, serif'}}>
              <FaBriefcase className="inline mr-3 text-indigo-600" />
              Professional Journey
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Oracle - Data Scientist */}
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-xl"></div>
              <div className="p-8 rounded-xl bg-white dark:bg-[#0f1b31] border border-gray-200 dark:border-[#1b263d] shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 mb-6 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xl">O</span>
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold mb-4">
                  CURRENT
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Data Scientist</h3>
                <p className="text-red-600 dark:text-red-400 font-medium mb-4">Oracle</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Leading ML4AML product development, building scalable data science solutions for enterprise anti-money laundering systems.
                </p>
              </div>
            </div>
            
            {/* Oracle - Cloud Consultant */}
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-red-500 rounded-t-xl"></div>
              <div className="p-8 rounded-xl bg-white dark:bg-[#0f1b31] border border-gray-200 dark:border-[#1b263d] shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 mb-6 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-xl">O</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Cloud Consultant</h3>
                <p className="text-red-600 dark:text-red-400 font-medium mb-4">Oracle</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Provided cloud architecture guidance and implemented Oracle Cloud solutions for enterprise clients.
                </p>
              </div>
            </div>
            
            {/* Siemens */}
            <div className="relative group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-500 rounded-t-xl"></div>
              <div className="p-8 rounded-xl bg-white dark:bg-[#0f1b31] border border-gray-200 dark:border-[#1b263d] shadow-lg hover:shadow-xl transition-all">
                <div className="w-14 h-14 mb-6 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-xl">S</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Full Stack Developer</h3>
                <p className="text-teal-600 dark:text-teal-400 font-medium mb-4">Siemens</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Built end-to-end web applications and digital solutions for industrial automation clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Achievements */}
      <section className="py-20 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Skills */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8" style={{fontFamily: 'Charter, Georgia, serif'}}>
                <FaCode className="inline mr-3 text-[#64ffda]" />
                Technical Arsenal
              </h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Machine Learning & AI</span>
                    <span className="text-[#64ffda]">Expert</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#64ffda] to-[#50fa7b] rounded-full" style={{width: '95%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Python & Data Science</span>
                    <span className="text-[#bd93f9]">Expert</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#bd93f9] to-[#ff79c6] rounded-full" style={{width: '92%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Full-Stack Development</span>
                    <span className="text-[#ff6b6b]">Advanced</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#ff6b6b] to-[#f1fa8c] rounded-full" style={{width: '85%'}}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white font-medium">Cloud & DevOps</span>
                    <span className="text-[#8be9fd]">Advanced</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#8be9fd] to-[#64ffda] rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Achievements */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8" style={{fontFamily: 'Charter, Georgia, serif'}}>
                🏆 Key Achievements
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#64ffda] to-[#50fa7b] flex items-center justify-center text-xl">
                      🚀
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">ML4AML Product Owner</h3>
                      <p className="text-[#8892b0] text-sm">Leading ML product development at Oracle</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b6b] to-[#f1fa8c] flex items-center justify-center text-xl">
                      🏆
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Hackathon Champion</h3>
                      <p className="text-[#8892b0] text-sm">Multiple wins including Top 15 @ Rakathon</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#bd93f9] to-[#ff79c6] flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Generative AI Expert</h3>
                      <p className="text-[#8892b0] text-sm">Trained LoRA models, ComfyUI workflows</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8be9fd] to-[#64ffda] flex items-center justify-center text-xl">
                      🎓
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">BITS Pilani Masters</h3>
                      <p className="text-[#8892b0] text-sm">M.Tech in Data Science & Engineering</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-20 bg-[#f7f5f2] dark:bg-[#050810]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
            Let's Connect
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Whether you want to discuss data science, collaborate on a project, or just talk football—I'm always happy to connect!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://twitter.com/PSughosh"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#1DA1F2]/30"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="https://github.com/SughoshDixit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#333] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/sughosh-dixit/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#0A66C2] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#0A66C2]/30"
            >
              <FaLinkedin className="text-xl" />
            </a>
            <a
              href="https://www.youtube.com/@sughoshdixit"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-[#FF0000] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-[#FF0000]/30"
            >
              <FaYoutube className="text-xl" />
            </a>
          </div>
          
          {/* Namaste closing */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
            <div className="text-4xl mb-4">🙏</div>
            <p className="text-xl text-amber-900 dark:text-amber-200 font-serif italic">
              "Namaste — The divine in me honors the divine in you"
            </p>
            <p className="text-amber-700 dark:text-amber-300 mt-2">
              Thank you for visiting. May your data always be clean and your models always converge! 📊⚽
            </p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

export default about;
