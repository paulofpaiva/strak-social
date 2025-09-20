# Development Setup

## Dependencies Installed
- **react-hook-form** - Form management
- **@hookform/resolvers** - Zod integration for forms
- **zod** - Schema validation
- **@tanstack/react-query** - API state management
- **axios** - HTTP client

## Project Structure
```
src/
├── components/ui/          # shadcn/ui components
├── pages/
│   ├── auth/              # Authentication pages
│   └── landing/           # Landing page components
├── lib/                   # Utilities and configurations
├── schemas/               # Zod validation schemas
└── hooks/                 # Custom React hooks
```

## Key Files
- `src/main.tsx` - App entry point with QueryClient setup
- `src/lib/query-client.ts` - React Query configuration
- `src/schemas/auth.ts` - Authentication validation schemas

## Theme Configuration
- Dark theme is applied globally
- All components should follow the dark theme pattern
- Use consistent color classes throughout the app
