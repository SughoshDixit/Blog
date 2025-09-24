import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { FaLaptop, FaTwitter, FaGithub, FaLinkedin, FaYoutube, FaDownload, FaCode, FaDatabase, FaGraduationCap, FaBriefcase } from "react-icons/fa";
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
    <div className="min-h-screen relative bg-white dark:bg-gray-900">
      <Navbar topics={topics} />
      
      {/* Medium-style hero section */}
      <div className="pt-20 pb-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="mb-8">
              <img src="/about.jpeg" className="w-24 h-24 rounded-full mx-auto mb-6" alt="Sughosh Dixit" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6" style={{fontFamily: 'Charter, Georgia, serif'}}>
              Hi, Namaste Sughosh here 🙏
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Data Scientist at Oracle | Data Science Enthusiast | Masters in Data Science & Engineering | BITS Pilani
            </p>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Consider me your go-to person for building any kind of applications, capable of single-handedly building cool Data Science applications. 
              I'm passionate about leveraging technology to solve real-world problems and sharing knowledge through content creation. 
              When I'm not coding, you'll find me on the football pitch! ⚽🔥
            </p>
          </div>
        </div>
      </div>

      {/* Medium-style quick links */}
      <div className="max-w-4xl mx-auto px-6 mb-16">
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://sughoshdixit.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="medium-button"
          >
            Portfolio
          </a>
          <a
            href="https://github.com/SughoshDixit"
            target="_blank"
            rel="noopener noreferrer"
            className="medium-button-outline"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sughosh-dixit/"
            target="_blank"
            rel="noopener noreferrer"
            className="medium-button-outline"
          >
            LinkedIn
          </a>
          <a
            href="https://www.youtube.com/@sughoshdixit"
            target="_blank"
            rel="noopener noreferrer"
            className="medium-button-outline"
          >
            YouTube
          </a>
          <a
            href="/Sughosh_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="medium-button-outline"
          >
            Resume
          </a>
        </div>
      </div>

      {/* YouTube Channel Section */}
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl p-8 mb-12">
        <div className="text-center">
          <FaYoutube className="text-red-600 text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My YouTube Channel</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            I create content about Data Science, Technology, and Personal Growth. Check out my channel intro!
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            {/* YouTube Video Embed */}
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/rrbSLCis0QY?si=07qJavu89OD2cLfg"
                title="Sughosh Dixit - YouTube Channel Intro"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://youtu.be/rrbSLCis0QY?si=07qJavu89OD2cLfg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
              >
                <FaYoutube />
                <span>Watch on YouTube</span>
              </a>
              <a
                href="https://www.youtube.com/@sughoshdixit"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
              >
                <FaYoutube />
                <span>Subscribe to Channel</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Football Skills Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-8 mb-12">
        <div className="text-center">
          <div className="text-4xl mb-4">⚽🔥</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Football Skills & Passion</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            When I'm not coding or analyzing data, you'll find me on the football pitch! ⚽ Check out my skills and passion for the beautiful game! 🏆
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
            {/* Football Skills Video Embed */}
            <div className="aspect-video rounded-lg overflow-hidden mb-4">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/vX5sqN4Wl78?si=I_UpIrEyLFOlDl-c"
                title="Sughosh Dixit - Football Skills"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://youtu.be/vX5sqN4Wl78?si=I_UpIrEyLFOlDl-c"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
              >
                <span>⚽</span>
                <span>Watch Football Skills</span>
              </a>
              <a
                href="https://www.youtube.com/@sughoshdixit"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2 transition-colors"
              >
                <FaYoutube />
                <span>More Videos</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Experience */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          <FaBriefcase className="inline mr-3 text-indigo-600" />
          Professional Experience
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Oracle - Data Scientist */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/1200px-Oracle_logo.svg.png" 
                  alt="Oracle Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-sm">O</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Data Scientist</h3>
                <p className="text-red-600 dark:text-red-400 font-medium">Oracle</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Current Role</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Leading data science initiatives and building scalable ML solutions for enterprise clients. 
              Specializing in advanced analytics, machine learning implementations, and data-driven insights.
            </p>
          </div>

          {/* Oracle - Cloud Consultant */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-4">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Oracle_logo.svg/1200px-Oracle_logo.svg.png" 
                  alt="Oracle Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-sm">O</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cloud Consultant</h3>
                <p className="text-red-600 dark:text-red-400 font-medium">Oracle</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Previous Role</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Providing cloud architecture guidance and implementing Oracle Cloud solutions. 
              Helping enterprises migrate to cloud platforms and optimize their infrastructure.
            </p>
          </div>

          {/* Siemens - Full Stack Developer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                <img 
                  src="/images/siemens.jfif" 
                  alt="Siemens Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                  <span className="text-white font-bold text-sm">S</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Full Stack Developer</h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium">Siemens</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Previous Role</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Developed end-to-end web applications and digital solutions for industrial clients. 
              Built scalable systems using modern web technologies and cloud platforms.
            </p>
          </div>
        </div>
      </div>

      {/* Key Achievements */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          🏆 Key Achievements
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">ML4AML Product Owner</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Leading ML product development at Oracle</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hackathon Champion</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Multiple hackathon wins and top placements</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Generative AI Expert</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Trained LoRA models and AI content creation</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎓</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Academic Excellence</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Masters from BITS Pilani with strong GPA</p>
          </div>
        </div>
      </div>

      {/* Project Highlights */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          <FaCode className="inline mr-3 text-indigo-600" />
          Project Highlights
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">OpenCV-based JPEG to STL Rendering</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Top 15 @ Rakathon</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">OpenCV</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">3D Rendering</span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">Computer Vision</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Solution to render 3D shapes from JPEG images into STL file format using contour detection and geometric classification.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Generative AI Personal Dataset & LoRA Training</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">AI Content Creation</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded text-xs">LoRA</span>
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">ComfyUI</span>
              <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-xs">HuggingFace</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Created personal dataset and trained LoRA models for high-fidelity image generation using ComfyUI workflows.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Video Activity Recognition</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">89.58% Accuracy</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">CNN</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Deep Learning</span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">Computer Vision</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Implemented video activity recognition using Convolutional Neural Networks with high accuracy for real-world applications.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Algorithmic Trading with KiteConnect</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">Fintech Solution</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Python</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">API</span>
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">Trading</span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              Comprehensive algorithmic trading solution using Zerodha's KiteConnect API for automated trading and profit optimization.
            </p>
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          <FaGraduationCap className="inline mr-3 text-indigo-600" />
          Education
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mr-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Birla_Institute_of_Technology_and_Science%2C_Pilani_logo.svg/1200px-Birla_Institute_of_Technology_and_Science%2C_Pilani_logo.svg.png" 
                alt="BITS Pilani Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center" style={{display: 'none'}}>
                <FaGraduationCap className="text-white text-sm" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Masters in Data Science & Engineering</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">BITS Pilani</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced studies in data science, machine learning, and engineering principles. 
            Focus on practical applications and real-world problem solving.
          </p>
        </div>
      </div>

      {/* Skills & Expertise */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          <FaCode className="inline mr-3 text-indigo-600" />
          Skills & Expertise
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <FaDatabase className="text-4xl text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Data Science</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Machine Learning, Statistical Analysis, Data Visualization, Big Data Processing
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <FaCode className="text-4xl text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Full-Stack Development</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              React, Next.js, Node.js, Python, JavaScript, Web Applications
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
            <FaBriefcase className="text-4xl text-indigo-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Enterprise Solutions</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Oracle Technologies, Cloud Computing, Database Management, System Architecture
            </p>
          </div>
        </div>
      </div>

      {/* GitHub Projects */}
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          <FaGithub className="inline mr-3 text-indigo-600" />
          Featured GitHub Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FaGithub className="text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Personal Blog</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              A full-stack blog built with Next.js, featuring content management, analytics, and modern UI/UX.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">Next.js</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">Tailwind</span>
            </div>
            <a
              href="https://github.com/SughoshDixit/Blog"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center"
            >
              <FaGithub className="mr-2" />
              View Repository
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FaLaptop className="text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Portfolio Website</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Professional portfolio showcasing projects, skills, and experience with responsive design.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">HTML/CSS</span>
              <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded text-xs">JavaScript</span>
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Responsive</span>
            </div>
            <a
              href="https://sughoshdixit.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center"
            >
              <FaLaptop className="mr-2" />
              Visit Portfolio
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <FaCode className="text-gray-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Science Projects</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Collection of machine learning projects, data analysis, and AI implementations.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">Python</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">ML</span>
              <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded text-xs">AI</span>
            </div>
            <a
              href="https://github.com/SughoshDixit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center"
            >
              <FaGithub className="mr-2" />
              View All Projects
            </a>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Let's Connect</h2>
          <div className="flex justify-center space-x-4">
            <a
              href="https://twitter.com/PSughosh"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-colors"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              href="https://github.com/SughoshDixit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition-colors"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              href="https://www.linkedin.com/in/sughosh-dixit/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
            >
              <FaLinkedin className="text-xl" />
            </a>
            <a
              href="https://www.youtube.com/@sughoshdixit"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors"
            >
              <FaYoutube className="text-xl" />
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default about;