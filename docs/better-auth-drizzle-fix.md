# Better Auth + Drizzle Adapter Fix

## Problem
Error: `[# Drizzle Adapter]: The model "user" was not found in the schema object`

## Root Cause
The Better Auth Drizzle adapter expects specific table names:
- `user` (singular)
- `session` (singular) 
- `account` (singular)

But the configuration was using:
- `users` (plural)
- `sessions` (plural)
- `accounts` (plural)

## Solution
Updated `api/src/auth/config.ts`:

```typescript
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: users,        // Map 'users' table to 'user' key
      session: sessions,  // Map 'sessions' table to 'session' key
      account: accounts,  // Map 'accounts' table to 'account' key
    },
    usePlural: false,
  }),
  // ... rest of config
});
```

## Database Schema
The tables are defined in `strak_social` schema:
- `strak_social.users`
- `strak_social.sessions` 
- `strak_social.accounts`

## Migration Status
- Migrations should be applied to create the tables
- Use `npm run db:migrate` in the api folder

## Testing
After this fix, the sign-up endpoint should work correctly with the Better Auth integration.
