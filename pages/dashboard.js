import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getProminentTopics } from "../Lib/Data";
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
  const allTopics = getProminentTopics();
  
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
  const cardShell = "bg-white dark:bg-[#2C2A27] rounded-2xl shadow-sm p-6 border border-[#E0DDD9] dark:border-[#3D3A36]";
  const metricShell = "bg-white dark:bg-[#2C2A27] rounded-2xl shadow-sm p-6 border border-[#E0DDD9] dark:border-[#3D3A36]";
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
  const todayLabel = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  // Process blog dates for consistency histogram
  const consistencyData = useMemo(() => {
    // Filter for posts from November 2025 onwards (30-Day Challenge start)
    const challengeStartDate = new Date('2025-11-01');
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    const publishedBlogs = blogs.filter(blog => {
      if (!blog.data.isPublished || !blog.data.Date) return false;
      const postDate = new Date(blog.data.Date);
      return postDate >= challengeStartDate;
    });
    
    // Get date counts and blog titles per date
    const dateCounts = {};
    const dateTitles = {};
    const monthCounts = {};
    
    publishedBlogs.forEach(blog => {
      const date = new Date(blog.data.Date);
      if (!isNaN(date.getTime())) {
        // For daily view
        const dateStr = date.toISOString().split('T')[0];
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        if (!dateTitles[dateStr]) dateTitles[dateStr] = [];
        dateTitles[dateStr].push(blog.data.Title);
        
        // For monthly view
        const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthCounts[monthStr] = (monthCounts[monthStr] || 0) + 1;
      }
    });
    
    // Generate all dates from November 1, 2025 to TODAY (not just last post)
    let allDates = [];
    let dailyData = [];
    let dailyTitles = [];
    let maxStreak = 0;
    let currentStreak = 0;
    let tempStreak = 0;
    
    const startDate = new Date(challengeStartDate);
    const endDate = today;
    
    // Generate all dates from start to today
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      allDates.push(dateStr);
      const count = dateCounts[dateStr] || 0;
      dailyData.push(count);
      dailyTitles.push(dateTitles[dateStr] || []);
      
      // Calculate max streak
      if (count > 0) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    // Calculate current streak from today backwards
    currentStreak = 0;
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i] > 0) {
        currentStreak++;
      } else {
        break;
      }
    }
    
    // Format daily labels with weekday
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyLabels = allDates.map((d) => {
      const date = new Date(d);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    
    // Generate all months from Nov 2025 to current month
    const allMonths = [];
    const allMonthData = [];
    let monthDate = new Date(challengeStartDate);
    while (monthDate <= today) {
      const monthStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      allMonths.push(monthStr);
      allMonthData.push(monthCounts[monthStr] || 0);
      monthDate.setMonth(monthDate.getMonth() + 1);
    }
    
    const monthLabels = allMonths.map(m => {
      const [year, month] = m.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    
    // Calculate stats
    const postingDays = Object.keys(dateCounts).length;
    const totalDays = allDates.length;
    const consistencyRate = totalDays > 0 ? Math.round((postingDays / totalDays) * 100) : 0;
    const missedDays = totalDays - postingDays;
    const avgPostsPerWeek = totalDays >= 7 ? ((publishedBlogs.length / totalDays) * 7).toFixed(1) : publishedBlogs.length;
    
    return {
      dateCounts,
      dateTitles,
      allDates,
      dailyLabels,
      dailyData,
      dailyTitles,
      monthLabels,
      monthData: allMonthData,
      totalPosts: publishedBlogs.length,
      postingDays,
      totalDays,
      missedDays,
      consistencyRate,
      maxStreak,
      currentStreak,
      avgPostsPerWeek,
      dateRange: {
        start: challengeStartDate.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      }
    };
  }, [blogs]);

  // Download chart as image
  const downloadChart = () => {
    try {
      // Find the canvas element inside the chart container
      const chartContainer = document.getElementById('consistency-chart-container');
      if (!chartContainer) {
        alert('Chart not found. Please try again.');
        return;
      }
      
      const canvas = chartContainer.querySelector('canvas');
      if (!canvas) {
        alert('Canvas not found. Please try again.');
        return;
      }
      
      // Create download link
      const link = document.createElement('a');
      link.download = `30-day-challenge-${viewMode}-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed: ' + error.message);
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
        backgroundColor: 'rgba(199, 70, 52, 0.8)',
        borderColor: 'rgba(199, 70, 52, 1)',
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
        backgroundColor: 'rgba(199, 70, 52, 0.8)',
        borderColor: 'rgba(199, 70, 52, 1)',
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
          'rgba(199,70,52,0.85)',
          'rgba(232,87,42,0.85)',
          'rgba(13,110,95,0.85)',
          'rgba(212,160,23,0.85)',
          'rgba(109,40,217,0.85)',
        ],
        borderColor: [
          'rgba(199,70,52,1)',
          'rgba(232,87,42,1)',
          'rgba(13,110,95,1)',
          'rgba(212,160,23,1)',
          'rgba(109,40,217,1)',
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
          ? `🔥 ${consistencyData.maxStreak}-Day Streak Achieved!`
          : `${consistencyData.totalPosts} Posts Published`,
        font: {
          size: 16,
          weight: 'bold',
        },
        color: '#374151',
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 14,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: function(context) {
            if (viewMode === 'daily') {
              const idx = context[0].dataIndex;
              const dateStr = consistencyData.allDates[idx];
              const dayNum = idx + 1;
              return `Day ${dayNum} — ${new Date(dateStr).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}`;
            }
            return context[0].label;
          },
          label: function(context) {
            const val = context.parsed.y;
            if (viewMode === 'daily') {
              const idx = context.dataIndex;
              const titles = consistencyData.dailyTitles[idx] || [];
              if (val === 0) return '❌ No post published';
              const lines = [`✅ ${val} post${val !== 1 ? 's' : ''} published:`];
              titles.forEach(t => {
                const shortTitle = t.length > 40 ? t.substring(0, 40) + '...' : t;
                lines.push(`  • ${shortTitle}`);
              });
              return lines;
            }
            if (val === 0) return '❌ No posts this month';
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
      <div className="min-h-screen relative bg-[#FAF8F6] dark:bg-[#201E1C]">
        <Navbar topics={topics} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C74634]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard — Sughosh Dixit</title>
        <meta name="description" content="Analytics dashboard for blog performance, topics, and readership" />
      </Head>

      <div className="min-h-screen relative bg-[#FAF8F6] dark:bg-[#201E1C] transition-all duration-300">
        <Navbar topics={topics} />

        {/* Hero section */}
        <div className="pt-24 pb-10 bg-[#FAF8F6] dark:bg-[#201E1C] border-b border-[#E0DDD9] dark:border-[#3D3A36]">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#161513] dark:text-[#F5F4F2]" style={{fontFamily: 'Charter, Georgia, serif'}}>
              Creator Dashboard
            </h1>
            <p className="text-[#6E6B68] dark:text-[#B8B4B0] mt-2">
              A compact cockpit for publishing momentum, audience response, and topic performance.
            </p>
            <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-full bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
              Updated view: {todayLabel}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href="/start-here" className="pro-chip inline-flex items-center px-4 py-2 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm text-[#4f4636] dark:text-[#F5F4F2]">
                Reader journey
              </a>
              <a href="/learning-path" className="pro-chip inline-flex items-center px-4 py-2 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm text-[#4f4636] dark:text-[#F5F4F2]">
                30-Day challenge
              </a>
              <a href="/savarkar-documentary" className="pro-chip inline-flex items-center px-4 py-2 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm text-[#4f4636] dark:text-[#F5F4F2]">
                Featured documentary
              </a>
            </div>
          </div>
        </div>

        <div className="py-8 px-4 md:px-8 mx-auto max-w-7xl">
          <div className="mb-8 rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-5 md:p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-2">
              At A Glance
            </p>
            <p className="text-[#5e5645] dark:text-[#B8B4B0] leading-relaxed">
              Use this page to monitor the writing engine: how often you publish, what topics are landing, and which essays are carrying audience attention.
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={metricShell}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#FDF3F1] dark:bg-[#3D2A28]">
                  <FiBookOpen className="h-6 w-6 text-[#C74634]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#6E6B68] dark:text-[#B8B4B0]">Total Blogs</p>
                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-[#161513] dark:text-[#F5F4F2]">
                    {analytics.blogStats.length}
                  </p>
                </div>
              </div>
            </div>

            <div className={metricShell}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#FDF3F1] dark:bg-[#3D2A28]">
                  <FiEye className="h-6 w-6 text-[#C74634]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#6E6B68] dark:text-[#B8B4B0]">Total Reads</p>
                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-[#161513] dark:text-[#F5F4F2]">
                    {analytics.totalVisits}
                  </p>
                </div>
              </div>
            </div>

            <div className={metricShell}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#FDF3F1] dark:bg-[#3D2A28]">
                  <FiCheckCircle className="h-6 w-6 text-[#C74634]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#6E6B68] dark:text-[#B8B4B0]">Your Reads</p>
                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-[#161513] dark:text-[#F5F4F2]">
                    {personalStats.readCount}
                  </p>
                </div>
              </div>
            </div>

            <div className={metricShell}>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-[#FDF3F1] dark:bg-[#3D2A28]">
                  <FiClock className="h-6 w-6 text-[#C74634]" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[#6E6B68] dark:text-[#B8B4B0]">Avg. Read Time</p>
                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-[#161513] dark:text-[#F5F4F2]">
                    {analytics.avgReadTime} min
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className={cardShell}>
              <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4">
                Topic Performance (Visits vs Count)
              </h3>
              <Bar data={topicChartData} options={chartOptions} />
            </div>

            <div className={cardShell}>
              <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4">
                Content Distribution
              </h3>
              <Doughnut data={topicDoughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Per-Post Visits */}
          <div className={`${cardShell} mb-8`}>
            <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4">
              Top 10 Most Read Articles
            </h3>
            <Bar data={perPostChartData} options={chartOptions} />
          </div>

          {/* Posting Consistency Histogram */}
          <div className={`${cardShell} mb-8`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] flex items-center gap-2">
                  <FiCalendar className="h-5 w-5 text-emerald-500" />
                  30-Day Challenge Consistency
                  <span className="text-xs font-normal text-[#6E6B68] dark:text-[#B8B4B0]">(Nov 2025+)</span>
                </h3>
                <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] mt-1">
                  {viewMode === 'daily'
                    ? 'Day-by-day posting streak for the Data Science Challenge'
                    : 'Monthly overview of challenge progress'}
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
                        : 'text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#161513] dark:hover:text-[#F5F4F2]'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setViewMode('monthly')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      viewMode === 'monthly'
                        ? 'bg-white dark:bg-gray-600 text-emerald-600 dark:text-emerald-400 shadow-sm'
                        : 'text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#161513] dark:hover:text-[#F5F4F2]'
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center border border-emerald-100 dark:border-emerald-800/30">
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {consistencyData.totalPosts}
                </div>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-1 font-medium">Total Posts</div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center border border-blue-100 dark:border-blue-800/30">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {consistencyData.postingDays}<span className="text-lg text-blue-400 dark:text-blue-500">/{consistencyData.totalDays}</span>
                </div>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-1 font-medium">Days Posted</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center border border-purple-100 dark:border-purple-800/30">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {consistencyData.consistencyRate}%
                </div>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-1 font-medium">Consistency Rate</div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center border border-amber-100 dark:border-amber-800/30">
                <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                  {consistencyData.maxStreak} 🔥
                </div>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-1 font-medium">Best Streak</div>
              </div>
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl p-4 text-center border border-rose-100 dark:border-rose-800/30">
                <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                  {consistencyData.currentStreak}
                </div>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-1 font-medium">Current Streak</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-600/30">
                <div className="text-3xl font-bold text-[#6E6B68] dark:text-[#B8B4B0]">
                  {consistencyData.missedDays}
                </div>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] mt-1 font-medium">Missed Days</div>
              </div>
            </div>

            {/* Legend for Daily View */}
            {viewMode === 'daily' && (
              <div className="flex items-center justify-center gap-6 mb-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500"></div>
                  <span className="text-[#6E6B68] dark:text-[#B8B4B0]">Posted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-300"></div>
                  <span className="text-[#6E6B68] dark:text-[#B8B4B0]">Missed</span>
                </div>
              </div>
            )}

            {/* Main Histogram Chart */}
            <div id="consistency-chart-container" className={viewMode === 'daily' ? 'h-96' : 'h-80'}>
              <Bar
                ref={consistencyChartRef}
                data={consistencyChartData}
                options={consistencyChartOptions}
              />
            </div>

            {/* Date Range Info */}
            {consistencyData.dateRange && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <div className="text-[#6E6B68] dark:text-[#B8B4B0]">
                    <span className="font-semibold text-[#161513] dark:text-[#F5F4F2]">Challenge Period:</span>{' '}
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {new Date(consistencyData.dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {' → '}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {new Date(consistencyData.dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                      {consistencyData.totalDays} total days
                    </span>
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full font-medium">
                      ~{consistencyData.avgPostsPerWeek} posts/week
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Top Blogs */}
          <div className="bg-white dark:bg-[#2C2A27] rounded-lg shadow-md p-6 border border-[#E0DDD9] dark:border-[#3D3A36] mb-8">
            <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4">
              Most Popular Content
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E0DDD9] dark:divide-[#3D3A36]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider">
                      Blog Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider">
                      Reads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider">
                      Length
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#2C2A27] divide-y divide-[#E0DDD9] dark:divide-[#3D3A36]">
                  {topBlogs.map((blog, index) => (
                    <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-[#FDF3F1] dark:bg-[#3D2A28] flex items-center justify-center">
                              <span className="text-sm font-medium text-[#C74634]">
                                {index + 1}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-[#161513] dark:text-[#F5F4F2]">
                              {blog.title}
                            </div>
                            <div className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                              by {blog.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#FDF3F1] text-[#C74634] dark:bg-[#3D2A28] dark:text-[#E8572A]">
                          {blog.topic}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161513] dark:text-[#F5F4F2]">
                        <div className="flex items-center">
                          <FiEye className="h-4 w-4 text-[#C74634] mr-1" />
                          {blog.visits}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                        {blog.readTime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Topic Stats */}
          <div className="bg-white dark:bg-[#2C2A27] rounded-lg shadow-md p-6 border border-[#E0DDD9] dark:border-[#3D3A36]">
            <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4">
              Topic Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(analytics.topicStats).map(([topic, stats]) => (
                <div key={topic} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-[#161513] dark:text-[#F5F4F2] mb-2">{topic}</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6E6B68] dark:text-[#B8B4B0]">Blogs:</span>
                      <span className="font-medium text-[#161513] dark:text-[#F5F4F2]">{stats.blogs}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6E6B68] dark:text-[#B8B4B0]">Total Reads:</span>
                      <span className="font-medium text-[#161513] dark:text-[#F5F4F2]">{stats.visits}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Table - Admin only */}
          {isAdmin && (
          <div className="bg-white dark:bg-[#2C2A27] rounded-lg shadow-md p-6 border border-[#E0DDD9] dark:border-[#3D3A36] mt-8">
            <h3 className="text-lg font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4">
              Recent Users
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E0DDD9] dark:divide-[#3D3A36]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th onClick={() => setUsersSort(s => ({ key: "name", dir: s.key === "name" && s.dir === "asc" ? "desc" : "asc" }))} className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider cursor-pointer">User</th>
                    <th onClick={() => setUsersSort(s => ({ key: "email", dir: s.key === "email" && s.dir === "asc" ? "desc" : "asc" }))} className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider cursor-pointer">Email</th>
                    <th onClick={() => setUsersSort(s => ({ key: "lastSeen", dir: s.key === "lastSeen" && s.dir === "asc" ? "desc" : "asc" }))} className="px-6 py-3 text-left text-xs font-medium text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider cursor-pointer">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#2C2A27] divide-y divide-[#E0DDD9] dark:divide-[#3D3A36]">
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
                            <div className="text-sm font-medium text-[#161513] dark:text-[#F5F4F2]">{u.name || 'Anonymous'}</div>
                            <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">{u.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#161513] dark:text-[#F5F4F2]">{u.email || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6E6B68] dark:text-[#B8B4B0]">{u.lastSeen ? (u.lastSeen._seconds ? new Date(u.lastSeen._seconds * 1000).toDateString() : new Date(u.lastSeen).toDateString()) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-4">
                <button className="px-3 py-1 text-sm rounded border border-[#E0DDD9] dark:border-[#3D3A36] disabled:opacity-50" disabled={usersPage===0} onClick={()=>setUsersPage(p=>Math.max(0,p-1))}>Previous</button>
                <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">Page {usersPage+1} / {Math.max(1, Math.ceil(analytics.users.length / pageSize))}</div>
                <button className="px-3 py-1 text-sm rounded border border-[#E0DDD9] dark:border-[#3D3A36] disabled:opacity-50" disabled={(usersPage+1)*pageSize >= analytics.users.length} onClick={()=>setUsersPage(p=>p+1)}>Next</button>
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
