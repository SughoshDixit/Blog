import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL, siteOgImageUrl } from "../Lib/siteConfig";
import { FiArrowRight, FiGithub, FiExternalLink, FiBarChart2, FiCpu, FiDatabase } from "react-icons/fi";
import { FaLaptopCode } from "react-icons/fa";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return { props: { topics: allTopics } };
};

const CHARTER = { fontFamily: "Charter, Georgia, serif" };
const SECTION_TITLE = "text-3xl sm:text-4xl md:text-5xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4";
const SECTION_COPY = "text-base md:text-lg text-[#6E6B68] dark:text-[#B8B4B0] max-w-2xl mx-auto leading-relaxed";

const projects = [
  {
    id: "customer-churn-ml",
    title: "Predictive Customer Churn Ecosystem",
    category: "Machine Learning / Business Value",
    icon: <FiBarChart2 className="w-8 h-8 text-[#C74634]" />,
    abstract: "Designed an end-to-end predictive model using XGBoost to identify at-risk enterprise clients. Translated statistical probability into actionable retention strategies, reducing churn by 14% in Q3.",
    tech: ["Python", "XGBoost", "FastAPI", "Docker", "Pandas"],
    github: "https://github.com/SughoshDixit",
    live: "#",
    metrics: [
      { label: "Accuracy", value: "94%" },
      { label: "Retention Lift", value: "+14%" },
      { label: "Inference Time", value: "45ms" }
    ]
  },
  {
    id: "llm-finetuning",
    title: "Custom LLM Fine-Tuning for Legal Docs",
    category: "Generative AI / NLP",
    icon: <FiCpu className="w-8 h-8 text-[#2d6a4f]" />,
    abstract: "Fine-tuned Llama-3 8B using LoRA on a proprietary dataset of Indian legal contracts. Deployed the model using vLLM to act as an automated drafting assistant, drastically cutting down paralegal review hours.",
    tech: ["PyTorch", "HuggingFace", "LoRA", "vLLM", "AWS EC2"],
    github: "https://github.com/SughoshDixit",
    live: "#",
    metrics: [
      { label: "Params Trained", value: "8B" },
      { label: "Cost Savings", value: "$4k/mo" },
      { label: "Latency", value: "1.2s" }
    ]
  },
  {
    id: "aml-pipeline",
    title: "Real-Time AML Transaction Pipeline",
    category: "Data Engineering / Streaming",
    icon: <FiDatabase className="w-8 h-8 text-[#0A66C2]" />,
    abstract: "Built a robust streaming architecture using Apache Kafka to ingest and score financial transactions for Anti-Money Laundering (AML) flags in real-time, handling over 10k events per second.",
    tech: ["Apache Kafka", "PySpark", "Oracle Cloud", "Redis"],
    github: "https://github.com/SughoshDixit",
    live: "#",
    metrics: [
      { label: "Throughput", value: "10k/sec" },
      { label: "Uptime", value: "99.99%" },
      { label: "Data Processed", value: "2TB/day" }
    ]
  }
];

function Projects({ topics }) {
  return (
    <div className="min-h-screen relative bg-[#F9F8F6] dark:bg-[#161513] transition-colors duration-300">
      <Head>
        <title>Portfolio & Projects — Sughosh Dixit</title>
        <meta
          name="description"
          content="Deep-dive data science and machine learning projects showcasing real-world business impact."
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
              Proving the Value of Data.
            </h1>
            <p className="text-lg md:text-xl text-[#6E6B68] dark:text-[#B8B4B0] max-w-3xl mx-auto leading-relaxed">
              A collection of deep-dive case studies. I don't just build models in notebooks; I engineer end-to-end solutions that solve concrete business problems and deploy them into production.
            </p>
          </div>

          {/* Projects List */}
          <div className="space-y-16 md:space-y-24">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-20 items-center`}
              >
                {/* Project Visual/Metrics Placeholder */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] shadow-xl p-8 flex flex-col justify-between group">
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 dark:to-white/5 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#161513] border border-gray-100 dark:border-[#3D3A36] shadow-sm">
                        {project.icon}
                      </div>
                      <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-400"></span>
                        <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                        <span className="w-3 h-3 rounded-full bg-green-400"></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 relative z-10">
                      {project.metrics.map((m, i) => (
                        <div key={i} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-[#161513] border border-gray-100 dark:border-[#3D3A36]">
                          <div className="text-xl md:text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-1">{m.value}</div>
                          <div className="text-xs text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-wider">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Info */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="text-sm font-semibold tracking-widest uppercase text-[#C74634]">
                    {project.category}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] leading-tight" style={CHARTER}>
                    {project.title}
                  </h2>
                  <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
                    {project.abstract}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tech.map((tech) => (
                      <span key={tech} className="px-3 py-1 text-sm rounded-full bg-[#E0DDD9]/50 dark:bg-[#3D3A36]/50 text-[#161513] dark:text-[#B8B4B0] border border-[#E0DDD9] dark:border-[#3D3A36]">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <a 
                      href={project.live}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C74634] text-white font-medium hover:bg-[#A73A2C] transition-colors shadow-lg shadow-[#C74634]/20"
                    >
                      Read Case Study <FiArrowRight />
                    </a>
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#2C2A27] text-[#161513] dark:text-[#F5F4F2] font-medium border border-[#E0DDD9] dark:border-[#3D3A36] hover:bg-gray-50 dark:hover:bg-[#3D3A36] transition-colors"
                    >
                      <FiGithub /> Source
                    </a>
                  </div>
                </div>
              </div>
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
