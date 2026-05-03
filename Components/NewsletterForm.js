import { FiMail, FiArrowRight } from "react-icons/fi";

function NewsletterForm({ compact = false }) {
  const email = "sughoshpdixit@gmail.com";
  const mailtoLink = `mailto:${email}`;

  if (compact) {
    return (
      <div className="bg-[#f0e9dd] dark:bg-[#1f2a44] rounded-lg p-4 border border-[#e6dfd3] dark:border-[#25304a]">
        <div className="flex items-center gap-2 mb-2">
          <FiMail className="text-[#C74634] dark:text-[#26c281]" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Get in Touch</h3>
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3">
          Have questions or want to collaborate?
        </p>
        <a
          href={mailtoLink}
          className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg bg-[#C74634] dark:bg-[#26c281] text-white hover:bg-[#A73A2C] dark:hover:bg-[#1ea869] transition-colors gap-2"
        >
          Send Email
        </a>
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
              Get in Touch
            </h3>
          </div>
        </div>
        <p className="text-[#B8B4B0] mb-8 leading-relaxed text-lg">
          Whether you have a question about my work, want to discuss a project, or just want to say hi, my inbox is always open.
        </p>
        
        <a
          href={mailtoLink}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-[#C74634] to-[#E8572A] text-white hover:from-[#A73A2C] hover:to-[#C74634] transition-all duration-300 shadow-lg shadow-[#C74634]/20 hover:shadow-[#C74634]/40 hover:-translate-y-0.5"
        >
          Send me an email
          <FiArrowRight />
        </a>
        
        <p className="text-xs text-[#6E6B68] mt-6">
          I usually respond within 24-48 hours.
        </p>
      </div>
    </div>
  );
}

export default NewsletterForm;

