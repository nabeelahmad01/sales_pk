import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User, { IUser } from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        isAdmin: { label: 'Is Admin', type: 'text' },
        isBrand: { label: 'Is Brand', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }

        // Check if admin login
        if (credentials.isAdmin === 'true') {
          const adminEmail = process.env.ADMIN_EMAIL;
          const adminPassword = process.env.ADMIN_PASSWORD;

          if (credentials.email === adminEmail && credentials.password === adminPassword) {
            return {
              id: 'admin',
              email: adminEmail,
              name: 'Admin',
              role: 'admin',
            };
          }
          throw new Error('Invalid admin credentials');
        }

        await dbConnect();

        // Check if brand login
        if (credentials.isBrand === 'true') {
          const Brand = (await import('@/models/Brand')).default;
          const brand = await Brand.findOne({ email: credentials.email });
          
          if (!brand) {
            throw new Error('No brand found with this email');
          }

          if (brand.status === 'pending') {
            throw new Error('Your brand is pending approval. Please wait for admin approval.');
          }

          if (brand.status === 'rejected') {
            throw new Error('Your brand registration was rejected.');
          }

          if (!brand.password) {
            throw new Error('Password not set for this brand');
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, brand.password);
          
          if (!isPasswordValid) {
            throw new Error('Invalid password');
          }

          return {
            id: brand._id.toString(),
            email: brand.email,
            name: brand.name,
            role: 'brand',
            brandId: brand._id.toString(),
          };
        }

        // Regular user login
        const user = await User.findOne({ email: credentials.email });
        
        if (!user) {
          throw new Error('No user found with this email');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account }) {
      // Handle Google sign-in - create user if not exists
      if (account?.provider === 'google') {
        await dbConnect();
        
        const existingUser = await User.findOne({ email: user.email });
        
        if (!existingUser) {
          // Create new user from Google account
          await User.create({
            name: user.name,
            email: user.email,
            password: '', // No password for Google users
            role: 'user',
            favorites: [],
          } as Partial<IUser>);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'user';
        token.id = user.id;
        // Include brandId for brand users
        if ((user as any).brandId) {
          token.brandId = (user as any).brandId;
        }
      }
      // For Google sign-in, fetch user from DB to get role
      if (account?.provider === 'google' && token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser._id.toString();
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        // Include brandId for brand users
        if (token.brandId) {
          (session.user as any).brandId = token.brandId;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
