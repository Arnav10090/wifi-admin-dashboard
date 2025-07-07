import NextAuth, { AuthOptions, User as NextAuthUser } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
const { User } = require('@/models');
import bcrypt from 'bcryptjs';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials: Record<"username" | "password", string> | undefined) {
        if (!credentials) {
          return null;
        }
        const user = await User.findOne({ where: { username: credentials.username } });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return { 
            id: user.id, 
            name: user.username,
            roleId: (user as any).roleId 
          } as NextAuthUser;
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: NextAuthUser | null }) {
      if (user) {
        token.id = user.id;
        token.roleId = (user as any).roleId;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 