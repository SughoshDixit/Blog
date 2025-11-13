import CredentialsProvider from "next-auth/providers/credentials";

const allowedEmail = (process.env.EDITOR_EMAIL || "sughoshpdixit@gmail.com").toLowerCase();
const allowedPassword = process.env.EDITOR_PASSWORD || "Chanakya";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/writer/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "Hsohgus",
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
      if (session?.user) {
        if (token?.email) {
          session.user.email = token.email;
        }
        // Ensure all user properties are defined (not undefined) for serialization
        session.user.image = session.user.image || null;
        session.user.name = session.user.name || null;
        session.user.email = session.user.email || null;
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

