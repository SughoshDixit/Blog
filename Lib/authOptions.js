import CredentialsProvider from "next-auth/providers/credentials";

const allowedEmail = (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase();
const allowedPassword = process.env.EDITOR_PASSWORD || "dev-password";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/writer/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        if (email === allowedEmail && password === allowedPassword) {
          return {
            id: email,
            name: "Sughosh P Dixit",
            email,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.email) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
  },
};

