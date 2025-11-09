import { getSession, signIn } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";

export default function WriterLogin() {
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email: formState.email,
      password: formState.password,
      callbackUrl: "/writer",
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else if (!result?.ok) {
      setError("Unable to sign in right now. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Writer Login • Sughosh&apos;s Chronicles</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2] dark:bg-[#050810] py-16 px-4">
        <div className="w-full max-w-md rounded-3xl border border-[#e6dfd3] dark:border-[#1b263d] bg-white dark:bg-[#101a2d] p-8 shadow-2xl">
          <h1 className="text-2xl font-semibold text-[#191919] dark:text-[#f6f7ff] mb-6" style={{ fontFamily: "Charter, Georgia, serif" }}>
            Writer Login
          </h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Email</label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5e5645] dark:text-[#aab4d1]">Password</label>
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-[#e6dfd3] focus:outline-none focus:border-[#1a8917] bg-white text-sm text-[#333] placeholder:text-[#b1a992] dark:bg-[#0d1424] dark:text-[#dadff7] dark:border-[#25304a] dark:placeholder:text-[#7783a8]"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full medium-button inline-flex items-center justify-center px-6 py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/writer",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
