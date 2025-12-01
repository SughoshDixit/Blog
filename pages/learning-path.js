import Head from "next/head";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { useState, useEffect } from "react";
import { 
  FiCheck, 
  FiLock, 
  FiPlay, 
  FiClock, 
  FiAward,
  FiTarget,
  FiTrendingUp,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();
  
  // Filter only DS (Data Science) posts and sort by day number
  const dsBlogs = allBlogs
    .filter((blog) => blog?.data?.Title?.startsWith("Day"))
    .map((blog) => ({
      data: blog.data,
      readTime: blog.readTime,
    }))
    .sort((a, b) => {
      const dayA = parseInt(a.data.Title.match(/Day (\d+)/)?.[1] || 0);
      const dayB = parseInt(b.data.Title.match(/Day (\d+)/)?.[1] || 0);
      return dayA - dayB;
    });
  
  return {
    props: {
      blogs: dsBlogs,
      topics: allTopics || [],
    },
  };
};

// Module definitions with day ranges and descriptions
const MODULES = [
  {
    id: "foundations",
    title: "Foundations of Fuzzy Logic",
    subtitle: "Days 1-5",
    description: "Master the transition from Boolean to graded truth. Learn t-norms, t-conorms, and build interpretable fuzzy rule systems.",
    icon: "🧮",
    color: "from-violet-500 to-purple-600",
    darkColor: "from-violet-600 to-purple-700",
    bgLight: "bg-violet-50",
    bgDark: "dark:bg-violet-950/30",
    borderLight: "border-violet-200",
    borderDark: "dark:border-violet-800",
    days: [1, 2, 3, 4, 5],
    skills: ["Boolean Logic", "T-norms", "Fuzzy Sets", "Rule Aggregation", "Defuzzification"]
  },
  {
    id: "probability",
    title: "Probability & Distributions",
    subtitle: "Days 6-10",
    description: "Deep dive into probability theory, Bayes' theorem, and the distributions that power statistical inference.",
    icon: "📊",
    color: "from-blue-500 to-cyan-600",
    darkColor: "from-blue-600 to-cyan-700",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-950/30",
    borderLight: "border-blue-200",
    borderDark: "dark:border-blue-800",
    days: [6, 7, 8, 9, 10],
    skills: ["Bayes' Theorem", "Prior/Posterior", "Binomial", "Normal Distribution", "CLT"]
  },
  {
    id: "thresholds",
    title: "Thresholds & Decision Theory",
    subtitle: "Days 11-15",
    description: "Learn to draw optimal decision boundaries using ROC curves, PR curves, and percentile-based thresholds.",
    icon: "🎯",
    color: "from-emerald-500 to-teal-600",
    darkColor: "from-emerald-600 to-teal-700",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-950/30",
    borderLight: "border-emerald-200",
    borderDark: "dark:border-emerald-800",
    days: [11, 12, 13, 14, 15],
    skills: ["ROC Curves", "PR Curves", "F1 Score", "Threshold Optimization", "Percentiles"]
  },
  {
    id: "sampling",
    title: "Sampling & Uncertainty",
    subtitle: "Days 16-20",
    description: "Master sampling strategies, confidence intervals, and hypothesis testing for robust statistical inference.",
    icon: "🎲",
    color: "from-amber-500 to-orange-600",
    darkColor: "from-amber-600 to-orange-700",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-950/30",
    borderLight: "border-amber-200",
    borderDark: "dark:border-amber-800",
    days: [16, 17, 18, 19, 20],
    skills: ["Stratified Sampling", "Confidence Intervals", "Hypothesis Testing", "Power Analysis", "Bootstrap"]
  },
  {
    id: "advanced",
    title: "Advanced Calibration",
    subtitle: "Days 21-25",
    description: "Explore cost-sensitive learning, multi-tier thresholds, and advanced calibration techniques.",
    icon: "⚙️",
    color: "from-rose-500 to-pink-600",
    darkColor: "from-rose-600 to-pink-700",
    bgLight: "bg-rose-50",
    bgDark: "dark:bg-rose-950/30",
    borderLight: "border-rose-200",
    borderDark: "dark:border-rose-800",
    days: [21, 22, 23, 24, 25],
    skills: ["Cost-Sensitive Learning", "Multi-tier Thresholds", "Calibration", "Ensemble Methods", "Feature Engineering"]
  },
  {
    id: "synthesis",
    title: "Synthesis & Application",
    subtitle: "Days 26-30",
    description: "Bring it all together with audit plans, monitoring frameworks, and the complete decision blueprint.",
    icon: "🏗️",
    color: "from-indigo-500 to-blue-600",
    darkColor: "from-indigo-600 to-blue-700",
    bgLight: "bg-indigo-50",
    bgDark: "dark:bg-indigo-950/30",
    borderLight: "border-indigo-200",
    borderDark: "dark:border-indigo-800",
    days: [26, 27, 28, 29, 30],
    skills: ["Monitoring", "Audit Plans", "Production Systems", "End-to-End Pipeline", "Blueprint"]
  }
];

export default function LearningPath({ blogs, topics }) {
  const [completedDays, setCompletedDays] = useState([]);
  const [expandedModules, setExpandedModules] = useState({});
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Load reading history from localStorage
    const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
    const completedSlugs = history.map(h => h.slug);
    
    // Map completed slugs to day numbers
    const completed = blogs
      .filter(blog => completedSlugs.includes(generateSlug(blog.data.Title)))
      .map(blog => parseInt(blog.data.Title.match(/Day (\d+)/)?.[1] || 0))
      .filter(day => day > 0);
    
    setCompletedDays(completed);
    
    // Expand the first incomplete module by default
    const firstIncomplete = MODULES.find(m => 
      !m.days.every(day => completed.includes(day))
    );
    if (firstIncomplete) {
      setExpandedModules({ [firstIncomplete.id]: true });
    }
  }, [blogs]);
  
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };
  
  const getModuleProgress = (module) => {
    const completedInModule = module.days.filter(day => completedDays.includes(day)).length;
    return {
      completed: completedInModule,
      total: module.days.length,
      percentage: Math.round((completedInModule / module.days.length) * 100)
    };
  };
  
  const getBlogByDay = (day) => {
    return blogs.find(blog => {
      const match = blog.data.Title.match(/Day (\d+)/);
      return match && parseInt(match[1]) === day;
    });
  };
  
  const totalProgress = {
    completed: completedDays.length,
    total: 30,
    percentage: Math.round((completedDays.length / 30) * 100)
  };
  
  const estimatedTime = blogs.reduce((acc, blog) => {
    const minutes = parseInt(blog.readTime?.text?.match(/(\d+)/)?.[1] || 0);
    return acc + minutes;
  }, 0);

  return (
    <>
      <Head>
        <title>30-Day Data Science Challenge | Learning Path</title>
        <meta name="description" content="A structured learning path through 30 days of mathematical foundations for data science and decision frameworks." />
      </Head>
      
      <Navbar topics={topics} />
      
      <main className="min-h-screen bg-[#f7f5f2] dark:bg-[#050810] pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-violet-500/20 to-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-blue-500/15 to-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4"></div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24">
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-100 to-purple-100 dark:from-violet-900/40 dark:to-purple-900/40 border border-violet-200 dark:border-violet-700">
                <span className="text-2xl">🎓</span>
                <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">Structured Learning Path</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
              30-Day Data Science
              <span className="block mt-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Mathematical Foundations
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
              Master the mathematics behind robust decision frameworks. From Boolean logic to production-ready audit plans, 
              each module builds on the last to create a complete toolkit.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-3xl font-bold text-violet-600 dark:text-violet-400 mb-1">30</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Lessons</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">6</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Modules</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{estimatedTime}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 text-center">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">{mounted ? totalProgress.percentage : 0}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Progress Overview */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Progress</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {mounted ? `${totalProgress.completed} of ${totalProgress.total} lessons completed` : "Loading..."}
                  </p>
                </div>
              </div>
              {mounted && totalProgress.completed === 30 && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full">
                  <FiAward className="w-5 h-5 text-white" />
                  <span className="text-sm font-bold text-white">Challenge Complete!</span>
                </div>
              )}
            </div>
            
            {/* Progress Bar */}
            <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: mounted ? `${totalProgress.percentage}%` : '0%' }}
              />
              {/* Module markers */}
              {[5, 10, 15, 20, 25].map((day) => (
                <div 
                  key={day}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/50 dark:bg-gray-600"
                  style={{ left: `${(day / 30) * 100}%` }}
                />
              ))}
            </div>
            
            {/* Module Labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Foundations</span>
              <span>Probability</span>
              <span>Thresholds</span>
              <span>Sampling</span>
              <span>Advanced</span>
              <span>Synthesis</span>
            </div>
          </div>
        </section>
        
        {/* Modules */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8" style={{fontFamily: 'Charter, Georgia, serif'}}>
            Learning Modules
          </h2>
          
          <div className="space-y-4">
            {MODULES.map((module, index) => {
              const progress = getModuleProgress(module);
              const isExpanded = expandedModules[module.id];
              const isCompleted = progress.completed === progress.total;
              const isLocked = index > 0 && getModuleProgress(MODULES[index - 1]).completed < MODULES[index - 1].days.length * 0.5;
              
              return (
                <div 
                  key={module.id}
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800' 
                      : `${module.bgLight} ${module.bgDark} ${module.borderLight} ${module.borderDark}`
                  }`}
                >
                  {/* Module Header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {isCompleted ? <FiCheck className="w-7 h-7 text-white" /> : module.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {module.title}
                          </h3>
                          {isCompleted && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full">
                              Complete
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {module.subtitle} • {module.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {/* Progress Circle */}
                      <div className="relative w-12 h-12">
                        <svg className="w-12 h-12 transform -rotate-90">
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-200 dark:text-gray-700"
                          />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${progress.percentage * 1.256} 125.6`}
                            className={isCompleted ? "text-emerald-500" : "text-violet-500"}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-300">
                          {mounted ? `${progress.completed}/${progress.total}` : "-"}
                        </span>
                      </div>
                      
                      {isExpanded ? (
                        <FiChevronUp className="w-6 h-6 text-gray-400" />
                      ) : (
                        <FiChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  {/* Module Content (Expanded) */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-gray-200/50 dark:border-gray-700/50">
                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 py-4">
                        {module.skills.map((skill) => (
                          <span 
                            key={skill}
                            className="px-3 py-1 text-xs font-medium bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Lessons List */}
                      <div className="space-y-2">
                        {module.days.map((day) => {
                          const blog = getBlogByDay(day);
                          if (!blog) return null;
                          
                          const isRead = completedDays.includes(day);
                          const slug = generateSlug(blog.data.Title);
                          const readTime = blog.readTime?.text || "5 min read";
                          
                          return (
                            <Link href={`/blogs/${slug}`} key={day}>
                              <a className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                                isRead 
                                  ? 'bg-emerald-100/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' 
                                  : 'bg-white/50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'
                              }`}>
                                {/* Status Icon */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isRead 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                }`}>
                                  {isRead ? <FiCheck className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h4 className={`font-medium truncate ${
                                    isRead 
                                      ? 'text-emerald-800 dark:text-emerald-300' 
                                      : 'text-gray-900 dark:text-white'
                                  }`}>
                                    {blog.data.Title}
                                  </h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                                    {blog.data.Abstract}
                                  </p>
                                </div>
                                
                                {/* Meta */}
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <FiClock className="w-4 h-4" />
                                  <span>{readTime}</span>
                                </div>
                              </a>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{fontFamily: 'Charter, Georgia, serif'}}>
              Ready to Master Data Science Math?
            </h2>
            <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
              Start with Day 1 and work your way through. Each lesson builds on the previous, 
              creating a solid foundation for robust decision-making.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {blogs.length > 0 && (
                <Link href={`/blogs/${generateSlug(blogs[0].data.Title)}`}>
                  <a className="inline-flex items-center gap-2 px-8 py-4 bg-white text-violet-700 font-semibold rounded-full hover:bg-violet-50 transition-colors shadow-lg">
                    <FiPlay className="w-5 h-5" />
                    Start Day 1
                  </a>
                </Link>
              )}
              <Link href="/topic/Data%20Science">
                <a className="inline-flex items-center gap-2 px-8 py-4 bg-violet-500/30 text-white font-semibold rounded-full hover:bg-violet-500/40 transition-colors border border-white/20">
                  <FiBookOpen className="w-5 h-5" />
                  Browse All Posts
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}

