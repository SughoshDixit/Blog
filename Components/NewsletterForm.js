import { useState } from "react";
import { FiMail, FiArrowRight, FiCheckCircle, FiAlertCircle, FiLoader } from "react-icons/fi";

function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState("general");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailToSubmit = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailToSubmit)) {
      setStatus({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "loading", message: "Signing you up..." });

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToSubmit,
          track: track,
          sourcePage: window.location.pathname,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "Subscribed successfully! Check your inbox.",
        });
        setEmail("");
      } else {
        setStatus({
          type: "error",
          message: data.error || "Unable to subscribe right now. Please try again.",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error. Please try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const tracks = [
    { value: "general", label: "All updates" },
    { value: "data-science-ai", label: "Data Science & AI" },
    { value: "football", label: "Football" },
    { value: "history-civilization", label: "Civilization" }
  ];

  if (compact) {
    return (
      <div className="bg-[#FFFaf3] dark:bg-[#2C2A27] rounded-xl p-6 border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-[#C74634]/10 rounded-lg">
            <FiMail className="text-[#C74634] dark:text-[#E8572A] text-lg" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white" style={{ fontFamily: "Charter, Georgia, serif" }}>
            Join the Newsletter
          </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
          Get notified when new deep dives and essays are published. No spam.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            disabled={isSubmitting || status.type === "success"}
            className="w-full px-4 py-2.5 bg-white dark:bg-[#1A1816] border border-[#E0DDD9] dark:border-[#3D3A36] rounded-lg text-sm focus:ring-2 focus:ring-[#C74634] focus:border-[#C74634] outline-none transition-all dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSubmitting || status.type === "success"}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-lg bg-[#C74634] dark:bg-[#E8572A] text-white hover:bg-[#A73A2C] dark:hover:bg-[#C74634] transition-colors gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <FiLoader className="animate-spin" /> : "Subscribe"}
          </button>
        </form>
        
        {status.message && (
          <div className={`mt-3 text-xs flex items-center gap-1.5 ${status.type === "error" ? "text-red-500" : status.type === "success" ? "text-green-600 dark:text-green-400" : "text-gray-500"}`}>
            {status.type === "error" ? <FiAlertCircle /> : status.type === "success" ? <FiCheckCircle /> : null}
            {status.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1816] to-[#2C2A27] text-white rounded-3xl p-8 border border-[#3D3A36] shadow-xl">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-gradient-to-br from-[#C74634]/30 to-[#E8572A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-5">
          <div className="p-3 bg-[#C74634]/20 rounded-xl border border-[#C74634]/30">
            <FiMail className="text-[#E8572A] text-xl" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-white" style={{ fontFamily: "Charter, Georgia, serif" }}>
              Sughosh's Dispatch
            </h3>
          </div>
        </div>
        <p className="text-[#B8B4B0] mb-6 leading-relaxed text-base">
          Essays on data science, history, and football. Join the community to get the latest long-form articles straight to your inbox.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="sr-only">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              disabled={isSubmitting || status.type === "success"}
              className="w-full px-5 py-3.5 bg-black/40 border border-[#3D3A36] rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-[#E8572A] focus:border-[#E8572A] outline-none transition-all disabled:opacity-50"
            />
          </div>
          
          <div>
             <select
               value={track}
               onChange={(e) => setTrack(e.target.value)}
               disabled={isSubmitting || status.type === "success"}
               className="w-full px-5 py-3.5 bg-black/40 border border-[#3D3A36] rounded-xl text-white focus:ring-2 focus:ring-[#E8572A] focus:border-[#E8572A] outline-none transition-all disabled:opacity-50 appearance-none"
             >
               {tracks.map(t => <option key={t.value} value={t.value} className="bg-[#2C2A27]">{t.label}</option>)}
             </select>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || status.type === "success"}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-[#C74634] to-[#E8572A] text-white hover:from-[#A73A2C] hover:to-[#C74634] transition-all duration-300 shadow-lg shadow-[#C74634]/20 hover:shadow-[#C74634]/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><FiLoader className="animate-spin" /> Subscribing...</span>
            ) : status.type === "success" ? (
              <span className="flex items-center gap-2"><FiCheckCircle /> Subscribed</span>
            ) : (
              <span className="flex items-center gap-2">Subscribe <FiArrowRight /></span>
            )}
          </button>
        </form>
        
        {status.message && (
          <div className={`mt-4 text-sm flex items-start gap-2 ${status.type === "error" ? "text-red-400" : status.type === "success" ? "text-green-400" : "text-gray-400"}`}>
            <div className="mt-0.5">
              {status.type === "error" ? <FiAlertCircle /> : status.type === "success" ? <FiCheckCircle /> : null}
            </div>
            <span>{status.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsletterForm;

