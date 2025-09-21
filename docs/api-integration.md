# API Integration Guide

## Backend API Structure
- **Base URL**: `http://localhost:8001/api`
- **Express Routes**: `http://localhost:8001/auth`
- **Authentication**: Better Auth with email/password
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas on both frontend and backend

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login  
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

## Data Mapping

### SignUp Request
**Frontend Schema** (SignUpFormData):
```typescript
{
  username: string  // 3-20 chars, alphanumeric + underscore
  email: string     // valid email format
  password: string  // 8+ chars, mixed case + number
}
```

**API Schema** (SignUpInput):
```typescript
{
  name: string      // maps from username
  email: string     // same as frontend
  password: string  // same as frontend
}
```

## Error Handling
- **400**: Validation errors (ZodError)
- **401**: Authentication errors
- **500**: Server errors

## Better Auth Configuration
- Email verification: Disabled
- Session expiry: 7 days
- Trusted origins: localhost:3000, localhost:8000
