// lib/auth.ts
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import prisma from './prismadb';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: true,  // ✅ This allows users to set role during registration
      },
    },
  },
  session: {
    updateAge: 60 * 60 * 24,       // refresh every 24 hours
    expiresIn: 60 * 60 * 24 * 7,   // expire session after 7 days
  },
});