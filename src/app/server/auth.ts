import { Environments, Languages, Pages, Routes, UserRole } from "@/constants/enums";
import { LanguageType } from "@/i18n.config";
import { DefaultSession, User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { login } from "./_actions/auth";
import { JWT } from "next-auth/jwt";

/* =====================
   Module Declarations
===================== */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & {
      id?: string;
      name?: string;
      email?: string;
      role?: UserRole;
      image?: string;
      phone?: string;
      country?: string;
      city?: string;
      postalCode?: string;
      streetAddress?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<User> {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  }
}

/* =====================
   Auth Options
===================== */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@email.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) throw new Error("No credentials provided");

        const response = await login(credentials, Languages.ENGLISH as LanguageType);

        if (response.status === 200 && response.user) {
          return response.user;
        }

        throw new Error(
          JSON.stringify({
            validationError: response.error,
            responseError: response.message,
          })
        );
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.email) return token;

      const user = await prisma.user.findUnique({
        where: { email: token.email },
      });

      if (!user) return token;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        image: user.image,
        phone: user.phone,
        country: user.country,
        city: user.city,
        postalCode: user.postalCode,
        streetAddress: user.streetAddress,
      };
    },
    session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          name: token.name,
          email: token.email,
          role: token.role,
          image: token.image as string,
          phone: token.phone as string,
          country: token.country as string,
          city: token.city as string,
          postalCode: token.postalCode as string,
          streetAddress: token.streetAddress as string,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    updateAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: `/${Routes.AUTH}/${Pages.LOGIN}`,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === Environments.DEV,
};
