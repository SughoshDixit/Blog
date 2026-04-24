import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL, siteOgImageUrl } from "../Lib/siteConfig";
import { FiGithub, FiExternalLink, FiStar, FiGitBranch, FiClock, FiZap, FiTrendingUp } from "react-icons/fi";
import { FaLaptopCode } from "react-icons/fa";

const GITHUB_USERNAME = "SughoshDixit";
const MAX_REPOS = 36;

const LINKEDIN_ACHIEVEMENTS = [
  "ML4AML Product Owner at Oracle",
  "Hackathon Champion (multiple wins, including Top 15 at Rakathon)",
  "Generative AI practitioner (LoRA + production workflow focus)",
  "M.Tech in Data Science & Engineering, BITS Pilani",
];

async function fetchAllRepos(username) {
  const perPage = 100;
  let page = 1;
  const repos = [];

  while (true) {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "SughoshBlog-PortfolioSync",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const batch = await response.json();
    repos.push(...batch);

    if (batch.length < perPage) break;
    page += 1;
  }

  return repos;
}

function truncateWords(text, maxWords = 50) {
  const words = (text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  if (words.length <= maxWords) return words.join(" ");
  return `${words.slice(0, maxWords).join(" ")}...`;
}

async function fetchRepoReadmeSnippet(username, repoName) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      {
        headers: {
          Accept: "application/vnd.github.raw+json",
          "User-Agent": "SughoshBlog-PortfolioSync",
        },
      }
    );
    if (!response.ok) return "";
    const raw = await response.text();
    const normalized = raw
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/`[^`]*`/g, " ")
      .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
      .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
      .replace(/^#{1,6}\s+/gm, " ")
      .replace(/[>*_~\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return truncateWords(normalized, 50);
  } catch (_) {
    return "";
  }
}

async function fetchRecentPushStats(username) {
  const perPage = 100;
  const maxPages = 3;
  let page = 1;
  let pushEvents = 0;
  let commitCount = 0;
  let oldestTimestamp = null;
  let newestTimestamp = null;

  while (page <= maxPages) {
    const response = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=${perPage}&page=${page}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "SughoshBlog-PortfolioSync",
        },
      }
    );
    if (!response.ok) break;
    const events = await response.json();
    if (!Array.isArray(events) || events.length === 0) break;

    for (const event of events) {
      const createdAt = event?.created_at || null;
      if (createdAt) {
        if (!newestTimestamp) newestTimestamp = createdAt;
        oldestTimestamp = createdAt;
      }
      if (event?.type === "PushEvent") {
        pushEvents += 1;
        commitCount += Array.isArray(event?.payload?.commits) ? event.payload.commits.length : 0;
      }
    }

    if (events.length < perPage) break;
    page += 1;
  }

  return {
    pushEvents,
    commitCount,
    newestTimestamp,
    oldestTimestamp,
  };
}

export const getStaticProps = async () => {
  const allTopics = getProminentTopics();
  let repositories = [];
  let portfolioSyncError = null;
  let activityStats = {
    pushEvents: 0,
    commitCount: 0,
    newestTimestamp: null,
    oldestTimestamp: null,
  };

  try {
    const repos = await fetchAllRepos(GITHUB_USERNAME);
    const repoList = repos
      .filter((repo) => !repo.private)
      .slice(0, MAX_REPOS);

    const enriched = await Promise.all(
      repoList.map(async (repo) => {
        const readmeSnippet = await fetchRepoReadmeSnippet(GITHUB_USERNAME, repo.name);
        return {
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
          description: repo.description || "",
          readmeSnippet,
      language: repo.language || "Not specified",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      updatedAt: repo.updated_at,
      htmlUrl: repo.html_url,
      homepage: repo.homepage || "",
      topics: Array.isArray(repo.topics) ? repo.topics : [],
      archived: Boolean(repo.archived),
      fork: Boolean(repo.fork),
        };
      })
    );

    repositories = enriched.map((repo) => ({
      ...repo,
      summary: repo.description || repo.readmeSnippet || "Summary unavailable for this repository.",
    }));

    activityStats = await fetchRecentPushStats(GITHUB_USERNAME);
  } catch (error) {
    portfolioSyncError = error.message;
  }

  return {
    props: {
      topics: allTopics || [],
      repositories,
      portfolioSyncError,
      activityStats,
    },
    revalidate: 60 * 60 * 6,
  };
};

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

function Projects({ topics, repositories, portfolioSyncError, activityStats }) {
  const totalStars = repositories.reduce((sum, repo) => sum + repo.stars, 0);
  const totalForks = repositories.reduce((sum, repo) => sum + repo.forks, 0);
  const topStarred = [...repositories]
    .sort((a, b) => b.stars - a.stars || b.forks - a.forks)
    .slice(0, 6);
  const recentlyUpdated = [...repositories]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);
  const languageMap = repositories.reduce((acc, repo) => {
    const key = repo.language || "Other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const languageBreakdown = Object.entries(languageMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);
  const maxLanguageCount = languageBreakdown.length > 0 ? languageBreakdown[0][1] : 1;
  const topicCloud = Array.from(
    new Set(
      repositories.flatMap((repo) => repo.topics || [])
    )
  ).slice(0, 18);
  const activityWindow =
    activityStats?.newestTimestamp && activityStats?.oldestTimestamp
      ? `${new Date(activityStats.newestTimestamp).toLocaleDateString("en-IN")} - ${new Date(
          activityStats.oldestTimestamp
        ).toLocaleDateString("en-IN")}`
      : "Recent public activity window";

  return (
    <div className="min-h-screen relative bg-[#F9F8F6] dark:bg-[#161513] transition-colors duration-300">
      <Head>
        <title>Portfolio & Projects — Sughosh Dixit</title>
        <meta
          name="description"
          content="GitHub-backed portfolio of projects by Sughosh Dixit across data science, AI, engineering, and research."
        />
        <link rel="canonical" href={`${SITE_URL}/projects`} />
      </Head>

      <Navbar topics={topics} />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#C74634]/10 border border-[#C74634]/20 text-[#C74634] mb-6">
              <FaLaptopCode className="text-lg" />
              <span className="text-sm font-semibold tracking-wide uppercase">Portfolio</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-6 tracking-tight" style={CHARTER}>
              Projects, synced from GitHub.
            </h1>
            <p className="text-lg md:text-xl text-[#6E6B68] dark:text-[#B8B4B0] max-w-3xl mx-auto leading-relaxed">
              This page automatically pulls every public repository from{" "}
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C74634] hover:text-[#A73A2C] font-semibold"
              >
                @{GITHUB_USERNAME}
              </a>
              , so new work shows up here without manual updates.
            </p>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <div className="rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#8f846f] dark:text-[#9f988d]">Repositories</p>
              <p className="text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mt-2">{repositories.length}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#8f846f] dark:text-[#9f988d]">Total Stars</p>
              <p className="text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mt-2">{totalStars}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#8f846f] dark:text-[#9f988d]">Total Forks</p>
              <p className="text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mt-2">{totalForks}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#8f846f] dark:text-[#9f988d]">Push Events</p>
              <p className="text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mt-2">{activityStats?.pushEvents || 0}</p>
            </div>
            <div className="rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-[#8f846f] dark:text-[#9f988d]">Commits in Pushes</p>
              <p className="text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mt-2">{activityStats?.commitCount || 0}</p>
              <p className="text-[10px] mt-1 text-[#8f846f] dark:text-[#9f988d]">{activityWindow}</p>
            </div>
          </div>

          {portfolioSyncError && (
            <div className="mb-8 rounded-2xl border border-[#E9C5BF] bg-[#FFF3F1] text-[#8B2F24] p-4">
              Unable to sync latest repositories from GitHub right now ({portfolioSyncError}). Showing last successful cached build data.
            </div>
          )}

          {/* GitHub Widgets */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10">
            <section className="xl:col-span-2 rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiTrendingUp className="text-[#C74634]" />
                <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2]" style={CHARTER}>
                  Top starred repositories
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topStarred.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] px-4 py-3 hover:border-[#C74634]/50 transition-colors"
                  >
                    <p className="font-semibold text-[#161513] dark:text-[#F5F4F2]">{repo.name}</p>
                    <p className="text-xs text-[#7f735f] dark:text-[#9f988d] mt-1 line-clamp-2">{repo.summary}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
                      <span className="inline-flex items-center gap-1"><FiStar /> {repo.stars}</span>
                      <span className="inline-flex items-center gap-1"><FiGitBranch /> {repo.forks}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-6">
              <div className="flex items-center gap-2 mb-4">
                <FiZap className="text-[#C74634]" />
                <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2]" style={CHARTER}>
                  Language mix
                </h3>
              </div>
              <div className="space-y-3">
                {languageBreakdown.map(([language, count]) => (
                  <div key={language}>
                    <div className="flex items-center justify-between text-xs mb-1 text-[#6E6B68] dark:text-[#B8B4B0]">
                      <span>{language}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EFE8DC] dark:bg-[#3D3A36] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C74634] to-[#E8572A]"
                        style={{ width: `${Math.max(8, (count / maxLanguageCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <section className="rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-6">
              <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
                Recently updated
              </h3>
              <div className="space-y-2">
                {recentlyUpdated.map((repo) => (
                  <a
                    key={repo.id}
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-[#F6F2EC] dark:hover:bg-[#201E1C] transition-colors"
                  >
                    <span className="text-sm text-[#161513] dark:text-[#F5F4F2]">{repo.name}</span>
                    <span className="text-xs text-[#7f735f] dark:text-[#9f988d]">{new Date(repo.updatedAt).toLocaleDateString("en-IN")}</span>
                  </a>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-6">
              <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
                Topic cloud
              </h3>
              <div className="flex flex-wrap gap-2">
                {topicCloud.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 text-xs rounded-full bg-[#F7EFE6] dark:bg-[#3D3A36] text-[#5c5140] dark:text-[#D6D1CA] border border-[#E0DDD9] dark:border-[#4A453F]"
                  >
                    {topic}
                  </span>
                ))}
                {topicCloud.length === 0 && (
                  <p className="text-sm text-[#7f735f] dark:text-[#9f988d]">No repository topics detected yet.</p>
                )}
              </div>
            </section>
          </div>

          <div className="mb-10 rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-6">
            <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
              Highlights from LinkedIn profile
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {LINKEDIN_ACHIEVEMENTS.map((item) => (
                <p
                  key={item}
                  className="text-sm rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] px-4 py-3 text-[#4f4636] dark:text-[#D6D1CA]"
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Projects List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repositories.map((repo) => (
              <article
                key={repo.id}
                className="rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2]" style={CHARTER}>
                    {repo.name}
                  </h2>
                  {repo.archived && (
                    <span className="text-xs px-2 py-1 rounded-full bg-[#EEE4D5] dark:bg-[#3D3A36] text-[#6E6B68] dark:text-[#B8B4B0]">
                      Archived
                    </span>
                  )}
                </div>

                <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] mt-3 leading-relaxed min-h-[52px]">
                  {repo.summary}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-[#F7EFE6] dark:bg-[#3D3A36] text-[#5c5140] dark:text-[#D6D1CA]">
                    {repo.language}
                  </span>
                  {repo.fork && (
                    <span className="px-3 py-1 text-xs rounded-full bg-[#EDF3FF] dark:bg-[#223047] text-[#325D9C] dark:text-[#9AB7E5]">
                      Fork
                    </span>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                  <span className="inline-flex items-center gap-1.5">
                    <FiStar className="w-4 h-4" /> {repo.stars}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FiGitBranch className="w-4 h-4" /> {repo.forks}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <FiClock className="w-4 h-4" /> {new Date(repo.updatedAt).toLocaleDateString("en-IN")}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={repo.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C74634] text-white text-sm font-medium hover:bg-[#A73A2C] transition-colors"
                  >
                    <FiGithub /> Source
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] text-sm font-medium text-[#161513] dark:text-[#F5F4F2] hover:bg-[#F5F2ED] dark:hover:bg-[#3D3A36]"
                    >
                      Live <FiExternalLink />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-32 p-12 text-center rounded-3xl bg-gradient-to-br from-[#161513] to-[#2C2A27] text-white border border-[#3D3A36] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-[#C74634]/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={CHARTER}>Have a Data Problem to Solve?</h2>
              <p className="text-lg text-[#B8B4B0] max-w-2xl mx-auto mb-8">
                I'm always open to discussing new challenges, consulting opportunities, or potential collaborations. Let's architect a solution.
              </p>
              <a href="/consulting" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#161513] font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all">
                Work With Me <FiExternalLink />
              </a>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Projects;
