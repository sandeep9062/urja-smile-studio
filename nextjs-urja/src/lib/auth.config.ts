import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword } from "./auth-utils";
import "./auth-types";

// These imports are only needed in the authorize callback, not in middleware
// We lazy-import them to avoid webpack bundling issues with node:path in middleware

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/admin-dashboard/login",
    error: "/admin-dashboard/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = user.id;
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.startsWith("/admin-dashboard");
      const isLoginPage = nextUrl.pathname === "/admin-dashboard/login";

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin-dashboard", nextUrl));
        }
        return true;
      }

      if (isAdminRoute) {
        if (!isLoggedIn) {
          return Response.redirect(new URL("/admin-dashboard/login", nextUrl));
        }

        const role = (auth?.user as any)?.role;
        const path = nextUrl.pathname;

        const rolePermissions: Record<string, string[]> = {
          owner: ["*"],
          doctor: [
            "/admin-dashboard",
            "/admin-dashboard/appointments",
            "/admin-dashboard/patients",
            "/admin-dashboard/doctors",
          ],
          front_desk: [
            "/admin-dashboard",
            "/admin-dashboard/appointments",
            "/admin-dashboard/patients",
            "/admin-dashboard/enquiries",
          ],
          editor: [
            "/admin-dashboard",
            "/admin-dashboard/blogs",
            "/admin-dashboard/gallery",
            "/admin-dashboard/testimonials",
            "/admin-dashboard/homepage",
            "/admin-dashboard/services",
          ],
        };

        if (role && role !== "owner") {
          const allowedPaths = rolePermissions[role] || [];
          const isAllowed = allowedPaths.some(
            (allowedPath) => path === allowedPath || path.startsWith(allowedPath + "/"),
          );
          if (!isAllowed) {
            return Response.redirect(new URL("/admin-dashboard", nextUrl));
          }
        }

        return true;
      }

      return true;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Dynamic import to avoid webpack bundling issues
        const { prisma } = await import("./prisma");

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            passwordHash: true,
            role: true,
            avatar: true,
            phone: true,
            isActive: true,
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isValid = await comparePassword(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        await prisma.activityLog.create({
          data: {
            userId: user.id,
            action: "Login",
            module: "Authentication",
            details: "Successful login via NextAuth",
            ipAddress: "unknown",
            userAgent: "",
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone,
        } as any;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  trustHost: true,
};