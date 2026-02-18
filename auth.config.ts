import type { NextAuthConfig } from "next-auth"

// This config is used ONLY by middleware (Edge Runtime safe - no Prisma/Bcrypt)
export default {
  providers: [], // Providers are defined in auth.ts (Node.js runtime)
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isAuthRoute =
        nextUrl.pathname === "/login" ||
        nextUrl.pathname === "/register" ||
        nextUrl.pathname === "/reset-password"
      const isProductRoute = nextUrl.pathname.startsWith("/products")
      const isAdminRoute = nextUrl.pathname.startsWith("/admin")

      if (isAuthRoute) {
        // If already logged in, redirect away from login/register
        if (isLoggedIn) {
          return Response.redirect(new URL("/", nextUrl))
        }
        return true
      }

      if (isProductRoute || isAdminRoute) {
        // Must be logged in to access products or admin
        return isLoggedIn
      }

      return true
    },
  },
} satisfies NextAuthConfig
