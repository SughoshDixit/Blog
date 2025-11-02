import Head from "next/head";
import { useRouter } from "next/router";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getAllBlogPosts, getAllTopics } from "../Lib/Data";
import { generateSlug } from "../Lib/utils";
import { useState, useEffect } from "react";
import { 
  FiTrendingUp, 
  FiHeart, 
  FiMessageCircle, 
  FiBookOpen, 
  FiBarChart2,
  FiUsers,
  FiCalendar
} from "react-icons/fi";
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

// Dynamically import charts to avoid SSR issues with Next 12
const Bar = dynamic(() => import('react-chartjs-2').then(m => m.Bar), { ssr: false });
const Doughnut = dynamic(() => import('react-chartjs-2').then(m => m.Doughnut), { ssr: false });

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

export const getStaticProps = () => {
  const allBlogs = getAllBlogPosts();
  const allTopics = getAllTopics();
  return {
    props: {
      blogs: allBlogs,
      topics: allTopics,
    },
  };
};

export default function Dashboard({ blogs, topics }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalLikes: 0,
    totalComments: 0,
    totalUsers: 0,
    totalVisits: 0,
    perPostVisits: {},
    topicStats: {},
    blogStats: [],
    monthlyStats: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [usersSort, setUsersSort] = useState({ key: "lastSeen", dir: "desc" });
  const [usersPage, setUsersPage] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const user = raw ? JSON.parse(raw) : null;
      setIsAdmin(!!(user && user.email === "sughoshpdixit@gmail.com"));
    } catch (e) {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const publishedBlogs = blogs.filter(blog => blog.data.isPublished);
        const blogStats = [];
        let totalLikes = 0;
        let totalComments = 0;
        const topicStats = {};
        const monthlyStats = {};

        // Fetch aggregate users and visits
        try {
          const visitsSnap = await fetch('/api/visits/summary').then(r=>r.json()).catch(()=>({ total: 0, perPost: {} }));
          analytics.totalVisits = visitsSnap.total || 0;
          analytics.perPostVisits = visitsSnap.perPost || {};
          if (isAdmin) {
            const usersSnap = await fetch('/api/users/list').then(r=>r.json()).catch(()=>({ total: 0, users: [] }));
            analytics.totalUsers = usersSnap.total || 0;
            analytics.users = usersSnap.users || [];
          } else {
            analytics.totalUsers = 0;
            analytics.users = [];
          }
        } catch {}

        // Process each blog
        for (const blog of publishedBlogs) {
          const blogId = generateSlug(blog.data.Title);
          
          try {
            // Fetch likes
            const likesResponse = await fetch(`/api/likes/${blogId}`);
            const likesData = await likesResponse.json();
            const blogLikes = likesData.totalLikes || 0;
            totalLikes += blogLikes;

            // Fetch comments
            const commentsResponse = await fetch(`/api/comments/${blogId}`);
            const commentsData = await commentsResponse.json();
            const blogComments = commentsData.comments?.length || 0;
            totalComments += blogComments;

            // Track topic stats
            const topic = blog.data.Topic || 'Uncategorized';
            if (!topicStats[topic]) {
              topicStats[topic] = { blogs: 0, likes: 0, comments: 0 };
            }
            topicStats[topic].blogs += 1;
            topicStats[topic].likes += blogLikes;
            topicStats[topic].comments += blogComments;

            // Track monthly stats (using blog creation date or current date)
            const date = new Date();
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlyStats[monthKey]) {
              monthlyStats[monthKey] = { blogs: 0, likes: 0, comments: 0 };
            }
            monthlyStats[monthKey].blogs += 1;
            monthlyStats[monthKey].likes += blogLikes;
            monthlyStats[monthKey].comments += blogComments;

            blogStats.push({
              id: blogId,
              title: blog.data.Title,
              topic: topic,
              likes: blogLikes,
              comments: blogComments,
              readTime: blog.readTime?.text || 'Unknown',
              author: blog.data.Author,
              tags: blog.data.Tags?.split(' ').filter(Boolean) || []
            });
          } catch (error) {
            console.error(`Error fetching data for blog ${blogId}:`, error);
            // Add blog with zero stats if API fails
            const topic = blog.data.Topic || 'Uncategorized';
            if (!topicStats[topic]) {
              topicStats[topic] = { blogs: 0, likes: 0, comments: 0 };
            }
            topicStats[topic].blogs += 1;

            blogStats.push({
              id: blogId,
              title: blog.data.Title,
              topic: topic,
              likes: 0,
              comments: 0,
              readTime: blog.readTime?.text || 'Unknown',
              author: blog.data.Author,
              tags: blog.data.Tags?.split(' ').filter(Boolean) || []
            });
          }
        }

        // Sort blog stats by likes
        blogStats.sort((a, b) => b.likes - a.likes);

        setAnalytics({
          totalLikes,
          totalComments,
          totalUsers: analytics.totalUsers || 0,
          totalVisits: analytics.totalVisits || 0,
          perPostVisits: analytics.perPostVisits || {},
          topicStats,
          blogStats,
          monthlyStats,
          users: analytics.users || []
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [blogs, isAdmin]);

  const topTopics = Object.entries(analytics.topicStats)
    .sort(([,a], [,b]) => (b.likes + b.comments) - (a.likes + a.comments))
    .slice(0, 5);

  const topBlogs = analytics.blogStats.slice(0, 5);

  // Chart data
  const perPostLabels = analytics.blogStats.map(b => b.title);
  const perPostData = analytics.blogStats.map(b => analytics.perPostVisits[b.id] || 0);
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
        label: 'Blogs',
        data: topTopics.map(([, stats]) => stats.blogs),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      {
        label: 'Likes',
        data: topTopics.map(([, stats]) => stats.likes),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Comments',
        data: topTopics.map(([, stats]) => stats.comments),
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
        <meta name="description" content="Analytics dashboard for blog performance, topics, likes, and comments" />
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
                Track your blog performance, engagement metrics, and user insights in real-time.
              </p>
            </div>
          </div>
        </div>
        
        <div className="py-8 px-4 md:px-8 mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Blog Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Insights into your blog performance, topics, and engagement
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
                <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                  <FiHeart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Likes</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.totalLikes}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <FiMessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Comments</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.totalComments}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <FiBarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Topics Covered</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {Object.keys(analytics.topicStats).length}
                  </p>
                </div>
              </div>
            </div>

            {isAdmin && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                    <FiUsers className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                      {analytics.totalUsers}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <FiTrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visits</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {analytics.totalVisits}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Topic Performance
              </h3>
              <Bar data={topicChartData} options={chartOptions} />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Topic Distribution
              </h3>
              <Doughnut data={topicDoughnutData} options={doughnutOptions} />
            </div>
          </div>

          {/* Per-Post Visits */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Visits by Blog Post
            </h3>
            <Bar data={perPostChartData} options={chartOptions} />
          </div>

          {/* Top Blogs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performing Blogs
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
                      Likes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Comments
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Read Time
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
                          <FiHeart className="h-4 w-4 text-red-500 mr-1" />
                          {blog.likes}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <FiMessageCircle className="h-4 w-4 text-green-500 mr-1" />
                          {blog.comments}
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
              Topic Statistics
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
                      <span className="text-gray-600 dark:text-gray-400">Likes:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.likes}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Comments:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{stats.comments}</span>
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
