import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { useState, useEffect, useRef, useMemo } from "react";
import { 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiBookOpen, 
  FiBarChart2,
  FiUsers,
  FiEye,
  FiDownload,
  FiCalendar
} from "react-icons/fi";
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues with Next 12
const Bar = dynamic(() => import('react-chartjs-2').then(m => m.Bar), { ssr: false });
const Doughnut = dynamic(() => import('react-chartjs-2').then(m => m.Doughnut), { ssr: false });

// Register Chart.js components only on client side
if (typeof window !== 'undefined') {
  const chartjs = require('chart.js');
  const ChartJS = chartjs.Chart;
  
  ChartJS.register(
    chartjs.CategoryScale,
    chartjs.LinearScale,
    chartjs.BarElement,
    chartjs.Title,
    chartjs.Tooltip,
    chartjs.Legend,
    chartjs.ArcElement,
    chartjs.PointElement,
    chartjs.LineElement,
  );
}

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();
  
  // Remove content from blogs to reduce page data size
  // Content is only needed on individual blog pages, not the dashboard listing
  const blogsWithoutContent = allBlogs
    .filter((blog) => blog && blog.data && blog.readTime)
    .map((blog) => ({
      data: blog.data,
      readTime: blog.readTime,
    }));
  
  return {
    props: {
      blogs: blogsWithoutContent,
      topics: allTopics || [],
    },
  };
};

export default function Dashboard({ blogs, topics }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalVisits: 0,
    avgReadTime: 0,
    totalWords: 0,
    totalUsers: 0,
    perPostVisits: {},
    topicStats: {},
    blogStats: [],
    users: []
  });
  const [personalStats, setPersonalStats] = useState({
    readCount: 0,
    streak: 0
  });
  const [loading, setLoading] = useState(true);
  const [usersSort, setUsersSort] = useState({ key: "lastSeen", dir: "desc" });
  const [usersPage, setUsersPage] = useState(0);
  const pageSize = 10;
  const consistencyChartRef = useRef(null);
  const [viewMode, setViewMode] = useState('daily'); // 'daily' or 'monthly'

  // Process blog dates for consistency histogram
  const consistencyData = useMemo(() => {
    const publishedBlogs = blogs.filter(blog => blog.data.isPublished && blog.data.Date);
    
    // Get date counts
    const dateCounts = {};
    const monthCounts = {};
    
    publishedBlogs.forEach(blog => {
      const date = new Date(blog.data.Date);
      if (!isNaN(date.getTime())) {
        // For daily view
        const dateStr = date.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        
        // For monthly view
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthCounts[monthStr] = (monthCounts[monthStr] || 0) + 1;
      }
    });
    
    // Sort dates chronologically for daily view
    const sortedDates = Object.keys(dateCounts).sort();
    
    // Generate all dates in range for the histogram (show gaps)
    let allDates = [];
    let dailyData = [];
    let streakCount = 0;
    let maxStreak = 0;
    let currentStreak = 0;
    
    if (sortedDates.length > 0) {
      const startDate = new Date(sortedDates[0]);
      const endDate = new Date(sortedDates[sortedDates.length - 1]);
      
      // Generate all dates from start to end
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        allDates.push(dateStr);
        const count = dateCounts[dateStr] || 0;
        dailyData.push(count);
        
        // Calculate streak
        if (count > 0) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }
      
      // Calculate current streak from the end
      currentStreak = 0;
      for (let i = dailyData.length - 1; i >= 0; i--) {
        if (dailyData[i] > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
      streakCount = currentStreak;
    }
    
    // Format daily labels (show day number or short date)
    const dailyLabels = allDates.map((d, i) => {
      const date = new Date(d);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    // Sort months chronologically for monthly view
    const sortedMonths = Object.keys(monthCounts).sort();
    const monthLabels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    const monthData = sortedMonths.map(m => monthCounts[m]);
    
    // Calculate posting days vs total days
    const postingDays = Object.keys(dateCounts).length;
    const totalDays = allDates.length;
    const consistencyRate = totalDays > 0 ? Math.round((postingDays / totalDays) * 100) : 0;
    
    return {
      dateCounts,
      allDates,
      dailyLabels,
      dailyData,
      monthLabels,
      monthData,
      totalPosts: publishedBlogs.length,
      postingDays,
      totalDays,
      consistencyRate,
      maxStreak,
      currentStreak: streakCount,
      dateRange: sortedDates.length > 0 ? {
        start: sortedDates[0],
        end: sortedDates[sortedDates.length - 1]
      } : null
    };
  }, [blogs]);

  // Download chart as image
  const downloadChart = () => {
    if (consistencyChartRef.current) {
      const canvas = consistencyChartRef.current.canvas;
      const link = document.createElement('a');
      link.download = `posting-consistency-${viewMode}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      setIsAdmin(!!(user && user.email === "sughoshpdixit@gmail.com"));
      
      // Load personal stats
      const history = JSON.parse(localStorage.getItem("readingHistory") || "[]");
      setPersonalStats({
        readCount: history.length,
        streak: 0 // simplified for now, logic is in ReadingStreak component
      });
    } catch (e) {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const publishedBlogs = blogs.filter(blog => blog.data.isPublished);
        const blogStats = [];
        const topicStats = {};
        let totalVisits = 0;
        let totalMinutes = 0;
        let totalWords = 0;
        let perPostVisits = {};

        // Fetch aggregate users and visits
        try {
          const visitsSnap = await fetch('/api/visits/summary').then(r=>r.json()).catch(()=>({ total: 0, perPost: {} }));
          totalVisits = visitsSnap.total || 0;
          perPostVisits = visitsSnap.perPost || {};
          
          if (isAdmin) {
            const usersSnap = await fetch('/api/users/list').then(r=>r.json()).catch(()=>({ total: 0, users: [] }));
            analytics.totalUsers = usersSnap.total || 0;
            analytics.users = usersSnap.users || [];
          }
        } catch (err) {
          console.error("Error fetching summary", err);
        }

        // Process each blog
        for (const blog of publishedBlogs) {
          const blogId = generateSlug(blog.data.Title);
          const visits = perPostVisits[blogId] || 0;
          const minutes = blog.readTime?.minutes || 0;
          const words = blog.readTime?.words || 0;
          
          totalMinutes += minutes;
          totalWords += words;

          // Track topic stats
          const topic = blog.data.Topic || 'Uncategorized';
          if (!topicStats[topic]) {
            topicStats[topic] = { blogs: 0, visits: 0 };
          }
          topicStats[topic].blogs += 1;
          topicStats[topic].visits += visits;

          blogStats.push({
            id: blogId,
            title: blog.data.Title,
            topic: topic,
            visits: visits,
            readTime: blog.readTime?.text || 'Unknown',
            minutes: minutes,
            author: blog.data.Author,
            tags: blog.data.Tags?.split(' ').filter(Boolean) || []
          });
        }

        // Sort blog stats by visits
        blogStats.sort((a, b) => b.visits - a.visits);

        const avgReadTime = publishedBlogs.length > 0 ? Math.round(totalMinutes / publishedBlogs.length) : 0;

        setAnalytics(prev => ({
          ...prev,
          totalVisits,
          perPostVisits,
          topicStats,
          blogStats,
          avgReadTime,
          totalWords,
          totalUsers: isAdmin ? prev.totalUsers : 0,
          users: isAdmin ? prev.users : []
        }));
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [blogs, isAdmin]);

  const topTopics = Object.entries(analytics.topicStats)
    .sort(([,a], [,b]) => b.visits - a.visits)
    .slice(0, 5);

  const topBlogs = analytics.blogStats.slice(0, 5);

  // Chart data
  const perPostLabels = analytics.blogStats.slice(0, 10).map(b => b.title.length > 20 ? b.title.substring(0, 20) + '...' : b.title);
  const perPostData = analytics.blogStats.slice(0, 10).map(b => b.visits);
  
  const perPostChartData = {
    labels: perPostLabels,
    datasets: [
      {
        label: 'Visits',
        data: perPostData,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const topicChartData = {
    labels: topTopics.map(([topic]) => topic),
    datasets: [
      {
        label: 'Visits',
        data: topTopics.map(([, stats]) => stats.visits),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Blogs',
        data: topTopics.map(([, stats]) => stats.blogs),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      }
    ]
  };

  const topicDoughnutData = {
    labels: topTopics.map(([topic]) => topic),
    datasets: [
      {
        data: topTopics.map(([, stats]) => stats.blogs),
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  // Consistency chart data - switches between daily and monthly
  const consistencyChartData = {
    labels: viewMode === 'daily' ? consistencyData.dailyLabels : consistencyData.monthLabels,
    datasets: [
      {
        label: 'Posts Published',
        data: viewMode === 'daily' ? consistencyData.dailyData : consistencyData.monthData,
        backgroundColor: viewMode === 'daily' 
          ? consistencyData.dailyData.map(v => v > 0 ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.3)')
          : 'rgba(16, 185, 129, 0.8)',
        borderColor: viewMode === 'daily'
          ? consistencyData.dailyData.map(v => v > 0 ? 'rgba(16, 185, 129, 1)' : 'rgba(239, 68, 68, 0.5)')
          : 'rgba(16, 185, 129, 1)',
        borderWidth: viewMode === 'daily' ? 1 : 2,
        borderRadius: viewMode === 'daily' ? 2 : 6,
        barThickness: viewMode === 'daily' ? 'flex' : 'flex',
        maxBarThickness: viewMode === 'daily' ? 20 : 50,
      },
    ],
  };

  const consistencyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: viewMode === 'daily' 
          ? `Daily Posting Consistency (${consistencyData.postingDays} of ${consistencyData.totalDays} days)`
          : 'Monthly Posting Overview',
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          title: function(context) {
            if (viewMode === 'daily') {
              const idx = context[0].dataIndex;
              const dateStr = consistencyData.allDates[idx];
              return new Date(dateStr).toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              });
            }
            return context[0].label;
          },
          label: function(context) {
            const val = context.parsed.y;
            if (val === 0) return '❌ No post';
            return `✅ ${val} post${val !== 1 ? 's' : ''} published`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: '#6B7280',
        },
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        title: {
          display: true,
          text: 'Posts',
          color: '#6B7280',
        },
        max: viewMode === 'daily' ? Math.max(2, Math.max(...(consistencyData.dailyData || [1])) + 1) : undefined,
      },
      x: {
        ticks: {
          color: '#6B7280',
          maxRotation: viewMode === 'daily' ? 90 : 45,
          minRotation: viewMode === 'daily' ? 90 : 45,
          font: {
            size: viewMode === 'daily' ? 9 : 11,
          },
          autoSkip: viewMode === 'daily',
          maxTicksLimit: viewMode === 'daily' ? 31 : undefined,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-white dark:bg-gray-900">
        <Navbar topics={topics} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Blog Analytics Dashboard</title>
        <meta name="description" content="Analytics dashboard for blog performance, topics, and readership" />
      </Head>

      <div className="min-h-screen relative bg-white dark:bg-gray-900 transition-all duration-300">
        <Navbar topics={topics} />
        
        {/* Medium-style hero section */}
        <div className="pt-20 pb-16 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
                Analytics Dashboard
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Track performance, readership trends, and topic distribution in real-time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-8 px-4 md:px-8 mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Key metrics across all published content
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <FiBookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Blogs</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.blogStats.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <FiEye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reads</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.totalVisits}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Reads</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {personalStats.readCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <FiClock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Read Time</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.avgReadTime} min
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Topic Performance (Visits vs Count)
              </h3>
              <Bar data={topicChartData} options={chartOptions} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Content Distribution
              </h3>
              <Doughnut data={topicDoughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Per-Post Visits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top 10 Most Read Articles
            </h3>
            <Bar data={perPostChartData} options={chartOptions} />
          </div>

          {/* Posting Consistency Histogram */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiCalendar className="h-5 w-5 text-emerald-500" />
                  30-Day Challenge Consistency
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {viewMode === 'daily' 
                    ? 'Day-by-day posting streak visualization' 
                    : 'Month-by-month posting overview'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('daily')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      viewMode === 'daily'
                        ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setViewMode('monthly')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      viewMode === 'monthly'
                        ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
                <button
                  onClick={downloadChart}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
                >
                  <FiDownload className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {consistencyData.totalPosts}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Posts</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {consistencyData.postingDays}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Posting Days</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {consistencyData.consistencyRate}%
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Consistency</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {consistencyData.maxStreak}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Best Streak 🔥</div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {consistencyData.currentStreak}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Current Streak</div>
              </div>
            </div>

            {/* Legend for Daily View */}
            {viewMode === 'daily' && (
              <div className="flex items-center justify-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Posted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-300"></div>
                  <span className="text-gray-600 dark:text-gray-400">Missed</span>
                </div>
              </div>
            )}

            {/* Main Histogram Chart */}
            <div className={viewMode === 'daily' ? 'h-96' : 'h-80'}>
              <Bar 
                ref={consistencyChartRef}
                data={consistencyChartData} 
                options={consistencyChartOptions} 
              />
            </div>

            {/* Date Range Info */}
            {consistencyData.dateRange && (
              <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                Tracking from{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(consistencyData.dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {' '}to{' '}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {new Date(consistencyData.dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {' '}({consistencyData.totalDays} days)
              </div>
            )}
          </div>

          {/* Top Blogs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Most Popular Content
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {topBlogs.map((blog, index) => (
                    <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                              <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {blog.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              by {blog.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                          {blog.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <FiEye className="h-4 w-4 text-blue-500 mr-1" />
                          {blog.visits}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {blog.readTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Topic Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Topic Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.topicStats).map(([topic, stats]) => (
                <div key={topic} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">{topic}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Blogs:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.blogs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Total Reads:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.visits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Table - Admin only */}
          {isAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Users
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th onClick={() => setUsersSort(s => ({ key: "name", dir: s.key === "name" && s.dir === "asc" ? "desc" : "asc" }))} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">User</th>
                    <th onClick={() => setUsersSort(s => ({ key: "email", dir: s.key === "email" && s.dir === "asc" ? "desc" : "asc" }))} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">Email</th>
                    <th onClick={() => setUsersSort(s => ({ key: "lastSeen", dir: s.key === "lastSeen" && s.dir === "asc" ? "desc" : "asc" }))} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {([...analytics.users]
                    .sort((a,b) => {
                      const dir = usersSort.dir === "asc" ? 1 : -1;
                      if (usersSort.key === "lastSeen") {
                        const av = a.lastSeen? (a.lastSeen._seconds? a.lastSeen._seconds*1000 : Date.parse(a.lastSeen) || 0): 0;
                        const bv = b.lastSeen? (b.lastSeen._seconds? b.lastSeen._seconds*1000 : Date.parse(b.lastSeen) || 0): 0;
                        return (av - bv) * dir;
                      }
                      const av = (a[usersSort.key] || "").toString().toLowerCase();
                      const bv = (b[usersSort.key] || "").toString().toLowerCase();
                      if (av < bv) return -1 * dir;
                      if (av > bv) return 1 * dir;
                      return 0;
                    })
                    .slice(usersPage*pageSize, usersPage*pageSize + pageSize)
                  ).map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <img src={u.photo || '/favicon.ico'} alt={u.name || 'User'} className="h-8 w-8 rounded-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name || 'Anonymous'}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{u.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{u.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.lastSeen ? (u.lastSeen._seconds ? new Date(u.lastSeen._seconds * 1000).toDateString() : new Date(u.lastSeen).toDateString()) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-4">
                <button className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50" disabled={usersPage===0} onClick={()=>setUsersPage(p=>Math.max(0,p-1))}>Previous</button>
                <div className="text-xs text-gray-600 dark:text-gray-400">Page {usersPage+1} / {Math.max(1, Math.ceil(analytics.users.length / pageSize))}</div>
                <button className="px-3 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 disabled:opacity-50" disabled={(usersPage+1)*pageSize >= analytics.users.length} onClick={()=>setUsersPage(p=>p+1)}>Next</button>
              </div>
            </div>
          </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
}
