import { useState } from "react";
import { FiMail, FiCheck } from "react-icons/fi";

function NewsletterForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic email validation on client side
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus({ type: "error", message: "Please enter a valid email address" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "loading", message: "Signing up..." });

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success !== false) {
        setStatus({ 
          type: "success", 
          message: data.message || "Successfully signed up! Check your email for a confirmation message." 
        });
        setEmail("");
      } else {
        setStatus({ 
          type: "error", 
          message: data.error || "Something went wrong. Please try again." 
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus({ 
        type: "error", 
        message: "Network error. Please check your connection and try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (compact) {
    return (
      <div className="bg-[#f0e9dd] dark:bg-[#1f2a44] rounded-lg p-4 border border-[#e6dfd3] dark:border-[#25304a]">
        <div className="flex items-center gap-2 mb-2">
          <FiMail className="text-[#C74634] dark:text-[#26c281]" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          Sign me up for weekly digest
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status.type !== "idle") setStatus({ type: "idle", message: "" });
            }}
            placeholder="your@email.com"
            required
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#e6dfd3] dark:border-[#25304a] bg-white dark:bg-[#0d1424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#C74634] dark:focus:ring-[#26c281]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#C74634] dark:bg-[#26c281] text-white hover:bg-[#A73A2C] dark:hover:bg-[#1ea869] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "..." : "Sign Up"}
          </button>
        </form>
        {status.message && (
          <p className={`text-xs mt-2 ${
            status.type === "success" 
              ? "text-redwood-500 dark:text-redwood-500 font-medium" 
              : status.type === "error"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-600 dark:text-gray-400"
          }`}>
            {status.message}
          </p>
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
              Weekly Digest
            </h3>
          </div>
        </div>
        <p className="text-[#B8B4B0] mb-6 leading-relaxed">
          Join 1,000+ readers. Get the top essays on data, ideas, and civilization every Sunday.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status.type !== "idle") setStatus({ type: "idle", message: "" });
            }}
            placeholder="your@email.com"
            required
            className="w-full px-5 py-4 rounded-xl border border-[#3D3A36] bg-[#161513]/50 text-white placeholder-[#6E6B68] focus:outline-none focus:border-[#C74634] focus:ring-1 focus:ring-[#C74634] transition-all"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-5 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-[#C74634] to-[#E8572A] text-white hover:from-[#A73A2C] hover:to-[#C74634] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#C74634]/20 hover:shadow-[#C74634]/40 hover:-translate-y-0.5"
          >
            {status.type === "success" ? (
              <>
                <FiCheck />
                Signed Up!
              </>
            ) : (
              <>
                {isSubmitting ? "Signing up..." : "Sign Me Up"}
              </>
            )}
          </button>
          {status.message && (
            <p className={`text-sm ${
              status.type === "success" 
                ? "text-[#26c281] font-medium" 
                : "text-[#F29A8A]"
            }`}>
              {status.message}
            </p>
          )}
        </form>
        <p className="text-xs text-[#6E6B68] mt-5">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}

export default NewsletterForm;

