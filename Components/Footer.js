import { SiTwitter, SiGithub, SiInstagram } from "react-icons/si";
import { FiLinkedin } from "react-icons/fi";
import NewsletterForm from "./NewsletterForm";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-[#E0DDD9] dark:border-[#3D3A36] bg-white dark:bg-[#201E1C]">
      {/* Redwood divider accent */}
      <div className="h-[3px] bg-gradient-to-r from-[#C74634] via-[#E8572A] to-[#C74634]" />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#C74634] flex items-center justify-center shadow-md shadow-[#C74634]/20">
                <span className="text-white font-bold text-xs tracking-tight">SD</span>
              </div>
              <span className="text-lg font-bold text-[#161513] dark:text-[#F5F4F2]" style={{fontFamily: 'Charter, Georgia, serif'}}>
                Sughosh Dixit
              </span>
            </div>
            <p className="text-[#6E6B68] dark:text-[#B8B4B0] text-sm mb-6 max-w-sm leading-relaxed">
              Data science, personal essays, Vedic studies, football, and life in India — long-form writing by Sughosh Dixit.
            </p>
            {/* Social icons */}
            <div className="flex space-x-3">
              {[
                { href: "https://twitter.com/PSughosh", icon: <SiTwitter className="w-4 h-4" />, label: "Twitter" },
                { href: "https://github.com/SughoshDixit", icon: <SiGithub className="w-4 h-4" />, label: "GitHub" },
                { href: "https://www.instagram.com/sughoshdixit/", icon: <SiInstagram className="w-4 h-4" />, label: "Instagram" },
                { href: "https://www.linkedin.com/in/sughosh-dixit/", icon: <FiLinkedin className="w-4 h-4" />, label: "LinkedIn" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  rel="noopener noreferrer"
                  target="_blank"
                  data-tooltip={label}
                  className="w-9 h-9 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] flex items-center justify-center text-[#6E6B68] dark:text-[#B8B4B0] hover:border-[#C74634] hover:text-[#C74634] hover:bg-[#FDF3F1] dark:hover:bg-[#2C2A27] dark:hover:border-[#C74634] dark:hover:text-[#E8572A] transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-widest mb-5">Explore</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/start-here", label: "Start Here" },
                { href: "/about", label: "About" },
                { href: "/learning-path", label: "30-Day Challenge" },
                { href: "/archive", label: "Archive" },
                { href: "/dashboard", label: "Dashboard" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors link-underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect + Newsletter */}
          <div>
            <h3 className="text-xs font-semibold text-[#6E6B68] dark:text-[#B8B4B0] uppercase tracking-widest mb-5">Connect</h3>
            <ul className="space-y-3 text-sm mb-6">
              {[
                { href: "https://sughoshdixit.github.io/", label: "Portfolio", external: true },
                { href: "https://www.youtube.com/@sughoshdixit", label: "YouTube", external: true },
                { href: "mailto:sughoshdixit@gmail.com", label: "Contact", external: false },
              ].map(({ href, label, external }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors link-underline"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <NewsletterForm compact={true} />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#E0DDD9] dark:border-[#3D3A36] mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#6E6B68] dark:text-[#B8B4B0]">
            © {year} Sughosh Dixit. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="/api/feed" className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors">
              RSS Feed
            </a>
            <a href="/api/sitemap" className="text-sm text-[#6E6B68] dark:text-[#B8B4B0] hover:text-[#C74634] dark:hover:text-[#E8572A] transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
