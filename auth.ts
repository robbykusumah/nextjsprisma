import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import prisma from "@/prisma/client"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        // Use raw query to avoid adapter issues
        const users = await prisma.$queryRaw<Array<{id: string, email: string, name: string | null, password: string | null, role: string}>>`
          SELECT id, email, name, password, role FROM "User" WHERE email = ${email} LIMIT 1
        `

        const user = users[0]

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // When user first logs in, 'user' object is available - store role
      if (user) {
        token.id = user.id
        token.role = (user as any).role
      }
      // If role is missing from token, fetch from DB using raw query
      if (!token.role && token.email) {
        try {
          const users = await prisma.$queryRaw<Array<{role: string}>>`
            SELECT role FROM "User" WHERE email = ${token.email} LIMIT 1
          `
          if (users[0]) {
            token.role = users[0].role
          }
        } catch (e) {
          console.error("Failed to fetch role from DB:", e)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id as string
        session.user.role = token.role as any
      }
      return session
    },
  },
})
