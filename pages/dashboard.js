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

  // Process blog dates for consistency histogram
  const consistencyData = useMemo(() => {
    const publishedBlogs = blogs.filter(blog => blog.data.isPublished && blog.data.Date);
    
    // Get date counts
    const dateCounts = {};
    const monthCounts = {};
    const dayOfWeekCounts = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    publishedBlogs.forEach(blog => {
      const date = new Date(blog.data.Date);
      if (!isNaN(date.getTime())) {
        // For daily view
        const dateStr = date.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        
        // For monthly view
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthCounts[monthStr] = (monthCounts[monthStr] || 0) + 1;
        
        // For day of week
        const dayOfWeek = dayNames[date.getDay()];
        dayOfWeekCounts[dayOfWeek] += 1;
      }
    });
    
    // Sort months chronologically
    const sortedMonths = Object.keys(monthCounts).sort();
    const monthLabels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    const monthData = sortedMonths.map(m => monthCounts[m]);
    
    return {
      dateCounts,
      monthLabels,
      monthData,
      dayOfWeekCounts,
      totalPosts: publishedBlogs.length,
      dateRange: sortedMonths.length > 0 ? {
        start: sortedMonths[0],
        end: sortedMonths[sortedMonths.length - 1]
      } : null
    };
  }, [blogs]);

  // Download chart as image
  const downloadChart = () => {
    if (consistencyChartRef.current) {
      const canvas = consistencyChartRef.current.canvas;
      const link = document.createElement('a');
      link.download = `posting-consistency-${new Date().toISOString().split('T')[0]}.png`;
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

  // Consistency chart data
  const consistencyChartData = {
    labels: consistencyData.monthLabels,
    datasets: [
      {
        label: 'Posts Published',
        data: consistencyData.monthData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 'flex',
        maxBarThickness: 50,
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
        text: 'Monthly Posting Consistency',
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
          label: function(context) {
            return `${context.parsed.y} post${context.parsed.y !== 1 ? 's' : ''} published`;
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
          text: 'Number of Posts',
          color: '#6B7280',
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  // Day of week chart data
  const dayOfWeekChartData = {
    labels: Object.keys(consistencyData.dayOfWeekCounts),
    datasets: [
      {
        label: 'Posts by Day',
        data: Object.values(consistencyData.dayOfWeekCounts),
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(59, 130, 246, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(236, 72, 153, 0.7)',
          'rgba(107, 114, 128, 0.7)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 2,
      },
    ],
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <FiCalendar className="h-5 w-5 text-emerald-500" />
                  Posting Consistency
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Track your publishing rhythm over time
                </p>
              </div>
              <button
                onClick={downloadChart}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors shadow-sm"
              >
                <FiDownload className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {consistencyData.totalPosts}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total Posts</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {consistencyData.monthLabels.length}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Months</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {consistencyData.monthData.length > 0 ? Math.max(...consistencyData.monthData) : 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Best Month</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {consistencyData.monthData.length > 0 ? (consistencyData.totalPosts / consistencyData.monthLabels.length).toFixed(1) : 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg/Month</div>
              </div>
            </div>

            {/* Main Histogram Chart */}
            <div className="h-80 mb-8">
              <Bar 
                ref={consistencyChartRef}
                data={consistencyChartData} 
                options={consistencyChartOptions} 
              />
            </div>

            {/* Day of Week Distribution */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Posting by Day of Week
              </h4>
              <div className="grid grid-cols-7 gap-2">
                {Object.entries(consistencyData.dayOfWeekCounts).map(([day, count], index) => {
                  const maxCount = Math.max(...Object.values(consistencyData.dayOfWeekCounts), 1);
                  const intensity = count / maxCount;
                  const bgColors = [
                    'bg-red-500',
                    'bg-amber-500',
                    'bg-emerald-500',
                    'bg-blue-500',
                    'bg-purple-500',
                    'bg-pink-500',
                    'bg-gray-500',
                  ];
                  return (
                    <div key={day} className="text-center">
                      <div 
                        className={`h-16 rounded-lg flex items-end justify-center pb-1 transition-all ${bgColors[index]}`}
                        style={{ opacity: 0.3 + (intensity * 0.7) }}
                      >
                        <span className="text-white text-xs font-bold">{count}</span>
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 font-medium">{day}</div>
                    </div>
                  );
                })}
              </div>
            </div>
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
