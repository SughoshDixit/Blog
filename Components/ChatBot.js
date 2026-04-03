import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const QUICK_ACTIONS = [
  { label: "Who is Sughosh?", intent: "about" },
  { label: "Best posts to start", intent: "start" },
  { label: "30-Day DS Challenge", intent: "ds-challenge" },
  { label: "Browse topics", intent: "topics" },
  { label: "Football posts", intent: "search", query: "football Liverpool" },
  { label: "Contact", intent: "contact" },
];

const RESPONSES = {
  greeting: {
    text: "Hey! I'm Sughosh's blog assistant. I can help you find posts, learn about topics, or navigate the site. What are you looking for?",
    actions: QUICK_ACTIONS.slice(0, 4),
  },
  about: {
    text: "Sughosh Dixit is a Data Scientist at Oracle (Financial Crime & Compliance), BITS Pilani alum, footballer, singer, and writer. He writes about data science, personal stories, Vedic studies, football, and life in India.",
    actions: [
      { label: "Read full bio", intent: "link", url: "/about" },
      { label: "Start Here guide", intent: "link", url: "/start-here" },
    ],
  },
  start: {
    text: "The Start Here page has a curated guide to the best posts across every topic — data science, personal essays, culture, and football. It's the best place to begin.",
    actions: [
      { label: "Open Start Here", intent: "link", url: "/start-here" },
      { label: "30-Day DS Challenge", intent: "ds-challenge" },
    ],
  },
  "ds-challenge": {
    text: "The 30-Day Data Science Challenge is Sughosh's flagship series — 30 posts covering nonparametric statistics, robust methods, fuzzy logic, and sampling theory. 6 pillars, 100+ formulas, zero prerequisites.",
    actions: [
      { label: "View Learning Path", intent: "link", url: "/learning-path" },
      { label: "Start Day 1", intent: "link", url: "/blogs/day-1-boolean-logic-to-numbers-and-as-min-or-as-max" },
    ],
  },
  topics: {
    text: "The blog covers several topics: Data Science, Personal essays, Vedic Studies, Civilization, Football, Books, and more. Which one interests you?",
    actions: [
      { label: "Data Science", intent: "search", query: "data science" },
      { label: "Personal", intent: "topic-link", topic: "Personal" },
      { label: "Vedic Studies", intent: "topic-link", topic: "Vedic Studies" },
      { label: "Civilization", intent: "topic-link", topic: "Civilization" },
    ],
  },
  contact: {
    text: "You can reach Sughosh on LinkedIn, Twitter, GitHub, or YouTube. For direct contact, email sughoshdixit@gmail.com.",
    actions: [
      { label: "LinkedIn", intent: "external", url: "https://www.linkedin.com/in/sughosh-dixit/" },
      { label: "Twitter", intent: "external", url: "https://twitter.com/PSughosh" },
      { label: "YouTube", intent: "external", url: "https://www.youtube.com/@sughoshdixit" },
    ],
  },
  fallback: {
    text: "I'm not sure about that, but I can search the blog for you. Here are some things I can help with:",
    actions: QUICK_ACTIONS.slice(0, 4),
  },
};

function BotMessage({ text, actions, onAction }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[#C74634] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-[10px] font-bold tracking-tight">SD</span>
      </div>
      <div className="space-y-3 min-w-0 flex-1">
        <p className="text-sm text-[#161513] dark:text-[#F5F4F2] leading-relaxed">{text}</p>
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => onAction(action)}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-[#C74634] dark:text-[#E8572A] hover:bg-[#C74634]/5 dark:hover:bg-[#E8572A]/10 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end">
      <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-[#C74634] text-white text-sm max-w-[80%]">
        {text}
      </div>
    </div>
  );
}

function SearchResults({ results, onAction }) {
  if (!results.length) {
    return (
      <BotMessage
        text="No posts found for that search. Try different keywords or browse by topic."
        actions={[{ label: "Browse topics", intent: "topics" }]}
        onAction={onAction}
      />
    );
  }
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[#C74634] flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-white text-[10px] font-bold tracking-tight">SD</span>
      </div>
      <div className="space-y-2 min-w-0 flex-1">
        <p className="text-sm text-[#161513] dark:text-[#F5F4F2]">
          Found {results.length} post{results.length > 1 ? "s" : ""}:
        </p>
        {results.slice(0, 5).map((r) => (
          <a
            key={r.id}
            href={`/blogs/${r.id}`}
            className="block p-3 rounded-xl border border-[#E0DDD9] dark:border-[#3D3A36] hover:border-[#C74634] dark:hover:border-[#E8572A] transition-colors"
          >
            <p className="text-sm font-semibold text-[#161513] dark:text-[#F5F4F2] leading-snug mb-1" style={CHARTER}>
              {r.title}
            </p>
            <div className="flex items-center gap-2 text-xs text-[#6E6B68] dark:text-[#B8B4B0]">
              {r.topic && <span>{r.topic}</span>}
              {r.readTime && <span>&middot; {r.readTime}</span>}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const addBotMessage = useCallback((response) => {
    setMessages((prev) => [...prev, { type: "bot", ...response }]);
  }, []);

  const addSearchResults = useCallback((results) => {
    setMessages((prev) => [...prev, { type: "search", results }]);
  }, []);

  const doSearch = useCallback(async (query) => {
    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        addSearchResults(data.results || []);
      } else {
        addBotMessage(RESPONSES.fallback);
      }
    } catch {
      addBotMessage({ text: "Sorry, search isn't available right now. Try browsing the site directly.", actions: [] });
    }
    setSearching(false);
  }, [addSearchResults, addBotMessage]);

  const handleAction = useCallback((action) => {
    if (action.intent === "link") {
      router.push(action.url);
      setOpen(false);
    } else if (action.intent === "external") {
      window.open(action.url, "_blank", "noopener,noreferrer");
    } else if (action.intent === "topic-link") {
      router.push(`/topic/${action.topic}`);
      setOpen(false);
    } else if (action.intent === "search") {
      setMessages((prev) => [...prev, { type: "user", text: action.query }]);
      doSearch(action.query);
    } else if (RESPONSES[action.intent]) {
      addBotMessage(RESPONSES[action.intent]);
    } else {
      addBotMessage(RESPONSES.fallback);
    }
  }, [router, doSearch, addBotMessage]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (messages.length === 0) {
      addBotMessage(RESPONSES.greeting);
    }
  }, [messages.length, addBotMessage]);

  const detectIntent = useCallback((text) => {
    const lower = text.toLowerCase();
    if (/who\s*(is|are)\s*(you|sughosh)|about\s*(sughosh|you|him)/i.test(lower)) return "about";
    if (/start|begin|new\s*here|where\s*(do|should)\s*i/i.test(lower)) return "start";
    if (/30.?day|ds\s*challenge|data\s*science\s*challenge|learning\s*path/i.test(lower)) return "ds-challenge";
    if (/topic|categor|what\s*(do|does)\s*(you|he)\s*write/i.test(lower)) return "topics";
    if (/contact|email|reach|connect|social/i.test(lower)) return "contact";
    return null;
  }, []);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { type: "user", text }]);

    const intent = detectIntent(text);
    if (intent && RESPONSES[intent]) {
      addBotMessage(RESPONSES[intent]);
    } else {
      doSearch(text);
    }
  }, [input, detectIntent, addBotMessage, doSearch]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#C74634] text-white shadow-lg shadow-[#C74634]/30 hover:shadow-[#C74634]/50 hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] rounded-2xl border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#C74634] flex items-center justify-center">
                <span className="text-white text-xs font-bold tracking-tight">SD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#161513] dark:text-[#F5F4F2]">Blog Assistant</p>
                <p className="text-xs text-[#6E6B68] dark:text-[#B8B4B0]">Ask me anything about the blog</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-[#6E6B68] dark:text-[#B8B4B0] hover:bg-[#E0DDD9] dark:hover:bg-[#3D3A36] transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
            {messages.map((msg, i) => {
              if (msg.type === "user") return <UserMessage key={i} text={msg.text} />;
              if (msg.type === "search") return <SearchResults key={i} results={msg.results} onAction={handleAction} />;
              return <BotMessage key={i} text={msg.text} actions={msg.actions} onAction={handleAction} />;
            })}
            {searching && (
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded-full bg-[#C74634] flex items-center justify-center shrink-0">
                  <span className="text-white text-[10px] font-bold tracking-tight">SD</span>
                </div>
                <div className="flex items-center gap-1 pt-2">
                  <span className="w-2 h-2 rounded-full bg-[#C74634] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#C74634] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-[#C74634] animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-[#E0DDD9] dark:border-[#3D3A36] bg-[#FAF8F6] dark:bg-[#201E1C]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search posts or ask a question..."
                className="flex-1 px-4 py-2.5 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#2C2A27] text-sm text-[#161513] dark:text-[#F5F4F2] placeholder:text-[#B8B4B0] focus:outline-none focus:border-[#C74634]"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-full bg-[#C74634] text-white disabled:opacity-40 hover:bg-[#A73A2C] transition-colors"
                aria-label="Send"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
