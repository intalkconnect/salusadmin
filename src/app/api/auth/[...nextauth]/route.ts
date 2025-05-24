import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password', placeholder: '123456' },
      },
      async authorize(credentials) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };

        // 🔒 Lógica de autenticação simples (mock)
        if (username === 'admin' && password === '123456') {
          return { id: '1', name: 'Admin', email: 'admin@example.com', role: 'admin' };
        }

        if (username === 'client' && password === '123456') {
          return { id: '2', name: 'Client', email: 'client@example.com', role: 'client' };
        }

        return null; // ❌ Login inválido
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
