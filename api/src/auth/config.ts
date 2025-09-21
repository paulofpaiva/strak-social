import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/index.js';
import { users, sessions, accounts } from '../schemas/auth.js';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,
      session: sessions,
      account: accounts,
    },
    usePlural: false,
  }),
  advanced: {
    database: {
      generateId: uuidv4,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  trustedOrigins: [
    'http://localhost:5173',
    'http://localhost:8000'
  ],
});
