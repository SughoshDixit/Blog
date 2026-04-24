import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Head from "next/head";
import { getProminentTopics } from "../Lib/Data";
import { SITE_URL } from "../Lib/siteConfig";
import { FiClock, FiTag, FiBookOpen } from "react-icons/fi";
import { FaSeedling } from "react-icons/fa";

export const getStaticProps = () => {
  const allTopics = getProminentTopics();
  return { props: { topics: allTopics } };
};

const CHARTER = { fontFamily: "Charter, Georgia, serif" };

const notes = [
  {
    id: "3",
    date: "April 24, 2026",
    title: "Understanding Rotary Position Embeddings (RoPE)",
    category: "LLM Architecture",
    content: "Was diving deep into the Llama 3 architecture today. Unlike absolute or relative position embeddings, RoPE rotates the token embeddings in the complex plane based on their position. This allows the model to naturally capture relative distances while preserving absolute position info. The math is elegant—using Euler's formula to inject positional info via rotation matrices. Explains why newer models extrapolate to longer context windows so much better.",
    tags: ["LLMs", "Math", "Attention"]
  },
  {
    id: "2",
    date: "April 18, 2026",
    title: "Pandas query() is vastly underused",
    category: "Data Engineering",
    content: "Just a quick TIL. Instead of writing `df[(df['age'] > 30) & (df['department'] == 'Sales')]`, you can just write `df.query('age > 30 and department == \"Sales\"')`. It's cleaner, easier to read, and behind the scenes it evaluates using NumExpr which makes it significantly faster for large DataFrames because it avoids creating intermediate boolean arrays.",
    tags: ["Python", "Pandas", "Performance"]
  },
  {
    id: "1",
    date: "April 10, 2026",
    title: "The 'Paper Review' Habit",
    category: "Continuous Learning",
    content: "Starting a new habit today: reading one AI research paper a week and writing a 3-bullet summary here in the digital garden. The field is moving too fast to rely solely on YouTube summaries or Twitter threads. First up next week: \"Attention Is All You Need\" (re-reading the classic to solidify my intuition on QKV matrices).",
    tags: ["Habits", "Research"]
  }
];

function DigitalGarden({ topics }) {
  return (
    <div className="min-h-screen relative bg-[#F9F8F6] dark:bg-[#161513] transition-colors duration-300">
      <Head>
        <title>Digital Garden — Sughosh Dixit</title>
        <meta
          name="description"
          content="A collection of rough notes, Today-I-Learned (TIL) snippets, and continuous learning logs."
        />
        <link rel="canonical" href={`${SITE_URL}/garden`} />
      </Head>

      <Navbar topics={topics} />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="mb-16 border-b border-[#E0DDD9] dark:border-[#3D3A36] pb-12">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#2d6a4f]/10 border border-[#2d6a4f]/20 text-[#2d6a4f] mb-6">
              <FaSeedling className="text-lg" />
              <span className="text-sm font-semibold tracking-wide uppercase">Digital Garden</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-6 tracking-tight" style={CHARTER}>
              Learning in Public.
            </h1>
            <p className="text-lg text-[#6E6B68] dark:text-[#B8B4B0] leading-relaxed">
              Not everything needs to be a polished, 3,000-word essay. This is my digital garden—a place for raw notes, code snippets, paper summaries, and half-baked ideas. It grows over time.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-[#E0DDD9] dark:border-[#3D3A36] pl-8 md:pl-12 space-y-16">
            {notes.map((note) => (
              <div key={note.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1 w-5 h-5 rounded-full bg-white dark:bg-[#161513] border-4 border-[#2d6a4f] group-hover:scale-125 transition-transform duration-300"></div>
                
                {/* Content Card */}
                <div className="bg-white dark:bg-[#2C2A27] rounded-2xl p-6 md:p-8 border border-[#E0DDD9] dark:border-[#3D3A36] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
                    <div className="flex items-center gap-1.5 font-medium text-[#2d6a4f]">
                      <FiBookOpen />
                      {note.category}
                    </div>
                    <span>&middot;</span>
                    <div className="flex items-center gap-1.5">
                      <FiClock />
                      {note.date}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-[#161513] dark:text-[#F5F4F2] mb-4" style={CHARTER}>
                    {note.title}
                  </h2>
                  
                  <div className="prose dark:prose-invert max-w-none text-[#6E6B68] dark:text-[#B8B4B0] mb-6 leading-relaxed">
                    <p>{note.content}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-[#3D3A36] text-gray-700 dark:text-gray-300">
                        <FiTag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default DigitalGarden;
