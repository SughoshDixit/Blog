import { useState } from "react";
import Head from "next/head";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL, siteOgImageUrl } from "../Lib/siteConfig";
import { FaTwitter, FaGithub, FaLinkedin, FaYoutube, FaEnvelope } from "react-icons/fa";
import { FiSend, FiCheckCircle } from "react-icons/fi";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return { props: { topics: allTopics } };
};

export default function ContactPage({ topics }) {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, sending, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Simulate sending email (since it's a static site, we mock the submission)
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  const title = "Contact — Sughosh Dixit";
  const description =
    "Get in touch with Sughosh Dixit for collaborations, data science consulting, or queries about Vedic studies and football.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={siteOgImageUrl()} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={siteOgImageUrl()} />
      </Head>

      <div className="min-h-screen bg-[#FAF8F6] dark:bg-[#201E1C] transition-colors duration-300">
        <Navbar topics={topics} />

        <main className="pt-28 pb-16 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
              <p className="text-xs uppercase tracking-[0.2em] text-[#9a8f75] dark:text-[#6E6B68] mb-3">
                Get in Touch
              </p>
              <h1
                className="text-4xl md:text-5xl font-semibold text-[#161513] dark:text-[#F5F4F2] mb-4"
                style={{ fontFamily: "Charter, Georgia, serif" }}
              >
                Contact
              </h1>
              <p className="text-[#5e5645] dark:text-[#B8B4B0] text-lg max-w-2xl leading-relaxed">
                Have a question about data science, want to discuss an article, or interested in collaborating? Drop me a message below or connect via socials.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Socials & Info (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 md:p-8 space-y-6">
                  <h2
                    className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2]"
                    style={{ fontFamily: "Charter, Georgia, serif" }}
                  >
                    Direct Contact
                  </h2>
                  
                  <div className="space-y-4">
                    <a
                      href="mailto:sughoshpdixit@gmail.com"
                      className="flex items-center gap-4 text-[#5e5645] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] flex items-center justify-center text-gray-500 group-hover:border-[#C74634] dark:group-hover:border-[#E8572A] transition-colors">
                        <FaEnvelope className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs text-[#9a8f75] dark:text-[#6E6B68] uppercase tracking-wider">Email</p>
                        <p className="text-sm font-medium">sughoshpdixit@gmail.com</p>
                      </div>
                    </a>
                  </div>

                  <hr className="border-[#E0DDD9] dark:border-[#3D3A36]" />

                  <h3 className="text-sm font-semibold text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-widest">
                    Social Channels
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { href: "https://www.linkedin.com/in/sughosh-dixit/", label: "LinkedIn", icon: <FaLinkedin className="text-[#0A66C2]" /> },
                      { href: "https://twitter.com/PSughosh", label: "Twitter", icon: <FaTwitter className="text-[#1DA1F2]" /> },
                      { href: "https://github.com/SughoshDixit", label: "GitHub", icon: <FaGithub className="text-gray-900 dark:text-gray-100" /> },
                      { href: "https://www.youtube.com/@sughoshdixit", label: "YouTube", icon: <FaYoutube className="text-[#FF0000]" /> },
                    ].map(({ href, label, icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] hover:border-[#C74634] dark:hover:border-[#E8572A] hover:bg-[#FDF3F1]/30 dark:hover:bg-[#201E1C]/40 transition-all text-sm font-medium text-[#5e5645] dark:text-[#B8B4B0]"
                      >
                        {icon}
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] p-6 md:p-8">
                  {status === "success" ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-2 animate-pulse">
                        <FiCheckCircle className="w-8 h-8" />
                      </div>
                      <h3
                        className="text-2xl font-semibold text-[#161513] dark:text-[#F5F4F2]"
                        style={{ fontFamily: "Charter, Georgia, serif" }}
                      >
                        Message Sent!
                      </h3>
                      <p className="text-[#5e5645] dark:text-[#B8B4B0] max-w-sm mx-auto leading-relaxed">
                        Thank you for reaching out. Your message has been received, and I will get back to you as soon as possible.
                      </p>
                      <button
                        onClick={() => setStatus("idle")}
                        className="mt-6 px-6 py-2.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-sm font-medium hover:border-[#C74634] dark:hover:border-[#E8572A] transition-colors"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0]">
                            Your Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Alex Mercer"
                            className="w-full px-4 py-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] text-sm focus:outline-none focus:border-[#C74634] dark:focus:border-[#E8572A] text-[#161513] dark:text-[#F5F4F2] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0]">
                            Your Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="alex@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] text-sm focus:outline-none focus:border-[#C74634] dark:focus:border-[#E8572A] text-[#161513] dark:text-[#F5F4F2] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0]">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Inquiry about data science consulting"
                          className="w-full px-4 py-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] text-sm focus:outline-none focus:border-[#C74634] dark:focus:border-[#E8572A] text-[#161513] dark:text-[#F5F4F2] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-xs font-semibold uppercase tracking-wider text-[#6E6B68] dark:text-[#B8B4B0]">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={5}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Describe your project, question, or proposal..."
                          className="w-full px-4 py-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C] text-sm focus:outline-none focus:border-[#C74634] dark:focus:border-[#E8572A] text-[#161513] dark:text-[#F5F4F2] placeholder-[#B8B4B0] dark:placeholder-[#6E6B68] transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#C74634] text-white font-semibold shadow-lg shadow-[#C74634]/15 hover:bg-[#A73A2C] transition-all disabled:opacity-75 cursor-pointer"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <FiSend className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
