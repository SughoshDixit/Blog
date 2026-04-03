import Head from "next/head";
import Link from "next/link";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page not found — Sughosh Dixit</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F6] dark:bg-[#201E1C] px-4">
        <div className="text-center max-w-lg">
          <p
            className="text-[120px] md:text-[160px] font-bold leading-none text-[#E0DDD9] dark:text-[#3D3A36] select-none"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            404
          </p>
          <h1
            className="text-2xl md:text-3xl font-semibold text-[#161513] dark:text-[#F5F4F2] -mt-4 mb-4"
            style={{ fontFamily: "Charter, Georgia, serif" }}
          >
            Page not found
          </h1>
          <p className="text-[#6E6B68] dark:text-[#B8B4B0] mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <a className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C74634] text-white font-semibold hover:bg-[#A73A2C] transition-colors shadow-sm">
                Back to home
              </a>
            </Link>
            <Link href="/about">
              <a className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#E0DDD9] dark:border-[#3D3A36] text-[#161513] dark:text-[#F5F4F2] font-semibold hover:bg-white dark:hover:bg-[#2C2A27] transition-colors">
                About me
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
