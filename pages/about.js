import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import Image from "next/image";
import {
  FaLaptop, FaTwitter, FaGithub, FaLinkedin, FaYoutube,
  FaDownload, FaCode, FaBriefcase, FaFutbol, FaChartLine,
} from "react-icons/fa";
import {
  FiAward, FiCpu, FiBookOpen, FiArrowRight,
} from "react-icons/fi";
import { getProminentTopics } from "../Lib/Data";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return { props: { topics: allTopics } };
};

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const achievements = [
  {
    icon: <FiCpu className="text-white text-xl" />,
    gradient: "from-[#C74634] to-[#E8572A]",
    title: "ML4AML Product Owner",
    desc: "Leading ML product development at Oracle",
  },
  {
    icon: <FiAward className="text-white text-xl" />,
    gradient: "from-[#C74634] to-[#E8572A]",
    title: "Hackathon Champion",
    desc: "Multiple wins including Top 15 @ Rakathon",
  },
  {
    icon: <FaCode className="text-white text-xl" />,
    gradient: "from-[#C74634] to-[#E8572A]",
    title: "Generative AI Expert",
    desc: "Trained LoRA models, ComfyUI workflows",
  },
  {
    icon: <FiBookOpen className="text-white text-xl" />,
    gradient: "from-[#C74634] to-[#E8572A]",
    title: "BITS Pilani Masters",
    desc: "M.Tech in Data Science & Engineering",
  },
];

const skills = [
  { name: "Machine Learning & AI", pct: 95 },
  { name: "Python & Data Science", pct: 92 },
  { name: "Full-Stack Development", pct: 85 },
  { name: "Cloud & DevOps", pct: 80 },
];

const socials = [
  { href: "https://twitter.com/PSughosh", icon: <FaTwitter />, bg: "bg-[#1DA1F2]" },
  { href: "https://github.com/SughoshDixit", icon: <FaGithub />, bg: "bg-[#333] dark:bg-[#555]" },
  { href: "https://www.linkedin.com/in/sughosh-dixit/", icon: <FaLinkedin />, bg: "bg-[#0A66C2]" },
  { href: "https://www.youtube.com/@sughoshdixit", icon: <FaYoutube />, bg: "bg-[#FF0000]" },
];

function About({ topics }) {
  return (
    <div className="min-h-screen relative bg-[#FAF8F6] dark:bg-[#201E1C]">
      <Head>
        <title>About — Sughosh Dixit</title>
        <meta
          name="description"
          content="Data Scientist at Oracle, BITS Pilani. Writing about data science, personal stories, Vedic studies, football, and life in India."
        />
        <link rel="canonical" href="https://sughoshdixit.com/about" />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://sughoshdixit.com/about" />
        <meta property="og:title" content="About — Sughosh Dixit" />
        <meta property="og:description" content="Data Scientist at Oracle, BITS Pilani. Writing about data science, personal stories, Vedic studies, football, and life in India." />
        <meta property="og:image" content="https://sughoshdixit.com/og/social-share.jpg" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="About — Sughosh Dixit" />
        <meta property="twitter:description" content="Data Scientist at Oracle, BITS Pilani. Writing about data science, personal stories, Vedic studies, football, and life in India." />
        <meta property="twitter:image" content="https://sughoshdixit.com/og/social-share.jpg" />
      </Head>

      <Navbar topics={topics} />

      {/* Hero */}
      <section className="relative overflow-hidden rw-hero">
        <div className="rw-blob rw-blob-1" aria-hidden="true" />
        <div className="rw-blob rw-blob-2" aria-hidden="true" />
        <div className="rw-dots" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-[#C74634]/40 rounded-full blur-2xl" />
            <img
              src="/about.jpeg"
              className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full border-4 border-white/20 shadow-2xl object-cover"
              alt="Sughosh Dixit"
            />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" style={CHARTER}>
            Sughosh Dixit
          </h1>

          <p className="text-xl sm:text-2xl text-[#B8E0D8] mb-4 font-light">
            Data Scientist &middot; Writer &middot; Liverpool Fan
          </p>

          <p className="text-lg text-[#B8E0D8]/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Building intelligent systems at Oracle by day; writing long-form essays by night —
            rigorous data science, personal stories, Vedic studies, cinema, and the beautiful game.
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { label: "30+ DS Articles", color: "text-[#F5E4D3]" },
              { label: "Oracle", color: "text-[#F5E4D3]" },
              { label: "BITS Pilani", color: "text-[#F5E4D3]" },
            ].map(({ label, color }) => (
              <span key={label} className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-sm">
                <span className={`${color} font-semibold`}>{label}</span>
              </span>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://sughoshdixit.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C74634] text-white font-semibold shadow-lg shadow-[#C74634]/30 hover:shadow-[#C74634]/50 hover:scale-105 transition-all duration-300"
            >
              <FaLaptop />
              View Portfolio
            </a>
            <a
              href="/Sughosh_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <FaDownload />
              Download Resume
            </a>
          </div>
        </div>
      </section>

      {/* Two Worlds */}
      <section className="py-20 bg-[#FAF8F6] dark:bg-[#201E1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
              Many Threads, One Voice
            </h2>
            <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] max-w-2xl mx-auto">
              Deep technical series alongside family, dharma, cinema, and football — all of it honest, long-form, and mine.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#C74634]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C74634] to-[#E8572A] flex items-center justify-center">
                    <FaChartLine className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2]">Data Science</h3>
                    <p className="text-[#C74634] font-medium text-sm">The Analytical Mind</p>
                  </div>
                </div>
                <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-6 leading-relaxed">
                  From <strong>Boolean logic</strong> to <strong>fuzzy membership functions</strong>, I explore the mathematical foundations that power modern AI.
                  My 30-Day Challenge covers nonparametric statistics, robust methods, and real-world audit applications.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[#FAF8F6] dark:bg-[#201E1C]">
                    <div className="text-2xl font-bold text-[#C74634]">30</div>
                    <div className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">Day Challenge</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F6] dark:bg-[#201E1C]">
                    <div className="text-2xl font-bold text-[#C74634]">6</div>
                    <div className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">Core Pillars</div>
                  </div>
                </div>
                <a
                  href="/learning-path"
                  className="inline-flex items-center gap-2 text-[#C74634] font-semibold hover:gap-3 transition-all"
                >
                  Start the DS Challenge
                  <FiArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-[#2d6a4f]/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-3xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] shadow-lg hover:shadow-xl transition-all duration-500">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2d6a4f] to-[#40916c] flex items-center justify-center">
                    <FaFutbol className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2]">Football</h3>
                    <p className="text-[#2d6a4f] font-medium text-sm">The Beautiful Game</p>
                  </div>
                </div>
                <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-6 leading-relaxed">
                  Inspired by <strong>Jurgen Klopp&apos;s</strong> &ldquo;Heavy Metal Football&rdquo; and <strong>Steven Gerrard&apos;s</strong> leadership. I write about why Football teaches us about life, resilience, and unity.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-xl bg-[#FAF8F6] dark:bg-[#201E1C]">
                    <div className="text-2xl font-bold text-[#2d6a4f]">LFC</div>
                    <div className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">Supporter</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#FAF8F6] dark:bg-[#201E1C]">
                    <div className="text-2xl font-bold text-[#2d6a4f]">YNWA</div>
                    <div className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">Midfielder</div>
                  </div>
                </div>
                <a
                  href="/blogs/why-support-liverpool-f.c-the-beautiful-game-vs-the-lazy-game"
                  className="inline-flex items-center gap-2 text-[#2d6a4f] font-semibold hover:gap-3 transition-all"
                >
                  Read My Manifesto
                  <FiArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube */}
      <section className="py-20 border-y border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
              Watch &amp; Learn
            </h2>
            <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] max-w-2xl mx-auto">
              From tech tutorials to football highlights — subscribe for a mix of knowledge and entertainment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { src: "https://www.youtube.com/embed/rrbSLCis0QY?si=07qJavu89OD2cLfg", title: "Channel Introduction", desc: "Get to know what this channel is all about" },
              { src: "https://www.youtube.com/embed/vX5sqN4Wl78?si=I_UpIrEyLFOlDl-c", title: "Football Skills", desc: "Watch me in action on the football pitch" },
            ].map(({ src, title, desc }) => (
              <div key={title} className="rounded-2xl overflow-hidden border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C]">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={src}
                    title={`Sughosh Dixit - ${title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#161513] dark:text-[#F5F4F2] mb-1">{title}</h3>
                  <p className="text-[#6E6B68] dark:text-[#B8B4B0] text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@sughoshdixit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg shadow-red-600/30"
            >
              <FaYoutube className="text-xl" />
              Subscribe to Channel
            </a>
          </div>
        </div>
      </section>

      {/* Professional Journey */}
      <section className="py-20 bg-[#FAF8F6] dark:bg-[#201E1C]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
              Professional Journey
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { co: "Oracle", role: "Data Scientist", desc: "Leading ML4AML product development, building scalable data science solutions for enterprise anti-money laundering systems.", current: true, color: "from-[#C74634] to-[#E8572A]", letter: "O", letterBg: "bg-red-100 dark:bg-red-900/30", letterColor: "text-red-600" },
              { co: "Oracle", role: "Cloud Consultant", desc: "Provided cloud architecture guidance and implemented Oracle Cloud solutions for enterprise clients.", current: false, color: "from-[#C74634] to-[#E8572A]", letter: "O", letterBg: "bg-red-100 dark:bg-red-900/30", letterColor: "text-red-600" },
              { co: "Siemens", role: "Full Stack Developer", desc: "Built end-to-end web applications and digital solutions for industrial automation clients.", current: false, color: "from-teal-400 to-cyan-500", letter: "S", letterBg: "bg-teal-100 dark:bg-teal-900/30", letterColor: "text-teal-600" },
            ].map(({ co, role, desc, current, color, letter, letterBg, letterColor }) => (
              <div key={`${co}-${role}`} className="relative">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color} rounded-t-xl`} />
                <div className="p-8 rounded-xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] shadow-lg hover:shadow-xl transition-all">
                  <div className={`w-14 h-14 mb-6 rounded-xl ${letterBg} flex items-center justify-center`}>
                    <span className={`${letterColor} font-bold text-xl`}>{letter}</span>
                  </div>
                  {current && (
                    <div className="inline-block px-3 py-1 rounded-full bg-[#C74634]/10 text-[#C74634] text-xs font-semibold mb-4">
                      CURRENT
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-2">{role}</h3>
                  <p className="text-[#C74634] dark:text-[#E8572A] font-medium mb-4">{co}</p>
                  <p className="text-[#6E6B68] dark:text-[#B8B4B0] text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Achievements */}
      <section className="py-20 border-y border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-8" style={CHARTER}>
                Technical Arsenal
              </h2>
              <div className="space-y-6">
                {skills.map(({ name, pct }) => (
                  <div key={name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-[#161513] dark:text-[#F5F4F2] font-medium text-sm">{name}</span>
                      <span className="text-[#C74634] text-sm font-semibold">{pct}%</span>
                    </div>
                    <div className="h-2 bg-[#E0DDD9] dark:bg-[#3D3A36] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C74634] to-[#E8572A] rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-8" style={CHARTER}>
                Key Achievements
              </h2>
              <div className="space-y-4">
                {achievements.map(({ icon, gradient, title, desc }) => (
                  <div key={title} className="p-4 rounded-xl bg-[#FAF8F6] dark:bg-[#201E1C] border border-[#E0DDD9] dark:border-[#3D3A36] hover:shadow-md transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}>
                        {icon}
                      </div>
                      <div>
                        <h3 className="text-[#161513] dark:text-[#F5F4F2] font-semibold">{title}</h3>
                        <p className="text-[#6E6B68] dark:text-[#B8B4B0] text-sm">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-20 bg-[#FAF8F6] dark:bg-[#201E1C]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-6" style={CHARTER}>
            Let&apos;s Connect
          </h2>
          <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] mb-10 max-w-2xl mx-auto">
            Whether you want to discuss data science, collaborate on a project, or just talk football — I&apos;m always happy to connect.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            {socials.map(({ href, icon, bg }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-13 h-13 p-3.5 rounded-full ${bg} flex items-center justify-center text-white text-xl hover:scale-110 transition-transform shadow-lg`}
              >
                {icon}
              </a>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#2C2A27] dark:to-[#2C2A27] border border-amber-200 dark:border-[#3D3A36]">
            <p className="text-xl text-amber-900 dark:text-amber-200 font-serif italic">
              &ldquo;Namaste — The divine in me honors the divine in you&rdquo;
            </p>
            <p className="text-amber-700 dark:text-[#B8B4B0] mt-3 text-sm">
              Thank you for visiting. May your data always be clean and your models always converge.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;
