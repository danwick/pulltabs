import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { sql } from './db';

// User type from database
interface DbUser {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  phone: string | null;
  role: string;
  email_verified: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        if (!sql) {
          throw new Error('Database not configured');
        }

        // Find user by email
        const users = await sql`
          SELECT id, email, password_hash, name, phone, role, email_verified
          FROM users
          WHERE email = ${credentials.email.toLowerCase()}
        ` as DbUser[];

        if (users.length === 0) {
          throw new Error('Invalid email or password');
        }

        const user = users[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!passwordMatch) {
          throw new Error('Invalid email or password');
        }

        // Update last login
        await sql`
          UPDATE users SET last_login_at = NOW() WHERE id = ${user.id}
        `;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/operator/login',
    error: '/operator/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

// Helper to hash passwords
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper to create a new user
export async function createUser(
  email: string,
  password: string,
  name?: string,
  phone?: string
): Promise<{ id: number; email: string } | null> {
  if (!sql) {
    throw new Error('Database not configured');
  }

  const passwordHash = await hashPassword(password);

  try {
    const result = await sql`
      INSERT INTO users (email, password_hash, name, phone)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${name || null}, ${phone || null})
      RETURNING id, email
    `;
    return result[0] as { id: number; email: string };
  } catch (error: unknown) {
    // Check for unique constraint violation
    if (error instanceof Error && error.message.includes('unique')) {
      return null;
    }
    throw error;
  }
}

// Helper to get user by email
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  if (!sql) {
    return null;
  }

  const users = await sql`
    SELECT id, email, password_hash, name, phone, role, email_verified
    FROM users
    WHERE email = ${email.toLowerCase()}
  ` as DbUser[];

  return users[0] || null;
}
