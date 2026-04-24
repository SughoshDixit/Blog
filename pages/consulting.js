import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL } from "../Lib/siteConfig";
import { FiCheckCircle, FiTrendingUp, FiTarget, FiBox, FiMail } from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return { props: { topics: allTopics } };
};

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const services = [
  {
    icon: <FiTarget className="w-8 h-8 text-[#C74634]" />,
    title: "Predictive Modeling & ML",
    desc: "End-to-end machine learning models built to solve your specific business bottlenecks. From customer churn prediction to dynamic pricing algorithms, I build models that directly impact your bottom line.",
    features: ["XGBoost / LightGBM", "Time-Series Forecasting", "Classification & Regression", "A/B Testing Frameworks"]
  },
  {
    icon: <FiBox className="w-8 h-8 text-[#C74634]" />,
    title: "LLM Integration & Generative AI",
    desc: "Don't just use ChatGPT wrappers. I help businesses fine-tune open-source models (Llama 3, Mistral) on proprietary data, build robust RAG (Retrieval-Augmented Generation) pipelines, and deploy secure AI agents.",
    features: ["LoRA Fine-Tuning", "RAG Pipelines", "Vector Databases", "Prompt Engineering"]
  },
  {
    icon: <FiTrendingUp className="w-8 h-8 text-[#C74634]" />,
    title: "MLOps & Cloud Architecture",
    desc: "A model in a Jupyter Notebook is useless. I architect scalable pipelines to deploy, monitor, and retrain your models automatically using industry-standard DevOps and Cloud infrastructure.",
    features: ["Model Deployment (FastAPI)", "Apache Kafka Streaming", "AWS / Oracle Cloud", "Model Drift Monitoring"]
  }
];

function Consulting({ topics }) {
  return (
    <div className="min-h-screen relative bg-[#F9F8F6] dark:bg-[#161513] transition-colors duration-300">
      <Head>
        <title>Consulting & Advisory — Sughosh Dixit</title>
        <meta
          name="description"
          content="Hire Sughosh Dixit for Machine Learning, Generative AI, and Data Architecture consulting."
        />
        <link rel="canonical" href={`${SITE_URL}/consulting`} />
      </Head>

      <Navbar topics={topics} />

      <main className="pt-32 pb-20">
        
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto px-4 md:px-8 text-center mb-24">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#C74634]/10 border border-[#C74634]/20 text-[#C74634] mb-8">
            <FaHandshake className="text-lg" />
            <span className="text-sm font-semibold tracking-wide uppercase">Work With Me</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-8 tracking-tight leading-tight" style={CHARTER}>
            Transform your data into <br className="hidden md:block"/> a strategic advantage.
          </h1>
          <p className="text-xl md:text-2xl text-[#6E6B68] dark:text-[#B8B4B0] max-w-3xl mx-auto leading-relaxed mb-12">
            I help forward-thinking companies architect, build, and deploy robust AI and Machine Learning solutions that solve complex business problems.
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C74634] text-white font-bold text-lg hover:bg-[#A73A2C] transition-all shadow-xl shadow-[#C74634]/30 hover:scale-105"
          >
            Book a Discovery Call
          </a>
        </section>

        {/* Services Section */}
        <section className="bg-white dark:bg-[#2C2A27] border-y border-[#E0DDD9] dark:border-[#3D3A36] py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
                Areas of Expertise
              </h2>
              <p className="text-[#6E6B68] dark:text-[#B8B4B0] max-w-2xl mx-auto">
                Comprehensive data solutions from raw ingestion to production-ready inference.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-[#F9F8F6] dark:bg-[#161513] border border-[#E0DDD9] dark:border-[#3D3A36] hover:shadow-lg transition-shadow">
                  <div className="p-4 rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] inline-block mb-6 shadow-sm">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
                    {service.title}
                  </h3>
                  <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-8 leading-relaxed">
                    {service.desc}
                  </p>
                  <ul className="space-y-3">
                    {service.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-sm font-medium text-[#161513] dark:text-[#F5F4F2]">
                        <FiCheckCircle className="text-[#C74634] shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Process */}
        <section className="py-24 max-w-5xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-12 text-center" style={CHARTER}>
            How We Work Together
          </h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-[#C74634] before:to-transparent">
            {[
              { step: "01", title: "Discovery & Audit", desc: "We start with a deep dive into your business goals, current data infrastructure, and identify the highest ROI opportunities for AI integration." },
              { step: "02", title: "Architecture & Prototyping", desc: "I design a robust, scalable architecture and build a rapid prototype to validate the technical feasibility and business value." },
              { step: "03", title: "Development & Deployment", desc: "Building the production-grade solution, integrating it with your existing stack, and deploying it securely to the cloud." },
              { step: "04", title: "Handoff & Training", desc: "Complete documentation, knowledge transfer to your internal team, and establishing monitoring protocols to ensure long-term success." }
            ].map((item, idx) => (
              <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-[#F9F8F6] dark:border-[#161513] bg-[#C74634] text-white font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md z-10">
                  {item.step}
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl bg-white dark:bg-[#2C2A27] border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-2">{item.title}</h3>
                  <p className="text-[#6E6B68] dark:text-[#B8B4B0]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="max-w-4xl mx-auto px-4 md:px-8 mt-12">
          <div className="p-12 text-center rounded-3xl bg-gradient-to-br from-[#1A1816] to-[#2C2A27] text-white border border-[#3D3A36] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 -mt-20 -ml-20 w-64 h-64 bg-[#C74634]/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <FiMail className="w-12 h-12 mx-auto text-[#C74634] mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6" style={CHARTER}>Ready to start?</h2>
              <p className="text-lg text-[#B8B4B0] max-w-xl mx-auto mb-10">
                Send me an email detailing your project requirements, timeline, and goals. I'll get back to you within 24 hours to schedule a call.
              </p>
              <a 
                href="mailto:sughoshpdixit@gmail.com?subject=Consulting%20Inquiry"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-[#161513] font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
              >
                sughoshpdixit@gmail.com
              </a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

export default Consulting;
