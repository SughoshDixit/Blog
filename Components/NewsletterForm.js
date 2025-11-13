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
          <FiMail className="text-[#1a8917] dark:text-[#26c281]" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          Sign me up for weekly digest
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-3 py-2 text-sm rounded-lg border border-[#e6dfd3] dark:border-[#25304a] bg-white dark:bg-[#0d1424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1a8917] dark:focus:ring-[#26c281]"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#1a8917] dark:bg-[#26c281] text-white hover:bg-[#0f730c] dark:hover:bg-[#1ea869] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "..." : "Sign Up"}
          </button>
        </form>
        {status.message && (
          <p className={`text-xs mt-2 ${
            status.type === "success" 
              ? "text-green-600 dark:text-green-400 font-medium" 
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
    <div className="bg-gradient-to-br from-[#f0e9dd] to-[#e6dfd3] dark:from-[#1f2a44] dark:to-[#25304a] rounded-xl p-6 border border-[#e6dfd3] dark:border-[#25304a]">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-[#1a8917] dark:bg-[#26c281] rounded-lg">
          <FiMail className="text-white text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Digest</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">Sign me up for weekly digest</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-3 rounded-lg border border-[#e6dfd3] dark:border-[#25304a] bg-white dark:bg-[#0d1424] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1a8917] dark:focus:ring-[#26c281]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-4 py-3 text-sm font-medium rounded-lg bg-[#1a8917] dark:bg-[#26c281] text-white hover:bg-[#0f730c] dark:hover:bg-[#1ea869] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {status.type === "success" ? (
            <>
              <FiCheck />
              Signed Up!
            </>
          ) : (
            <>
              {isSubmitting ? "Signing up..." : "Sign Me Up for Weekly Digest"}
            </>
          )}
        </button>
        {status.message && (
          <p className={`text-sm ${
            status.type === "success" 
              ? "text-green-600 dark:text-green-400 font-medium" 
              : "text-red-600 dark:text-red-400"
          }`}>
            {status.message}
          </p>
        )}
      </form>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
        Get a weekly email with all new posts. Unsubscribe anytime.
      </p>
    </div>
  );
}

export default NewsletterForm;

