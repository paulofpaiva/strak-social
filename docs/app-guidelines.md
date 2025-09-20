# App Guidelines

## Language
- **All text content must be in English**
- Error messages, labels, buttons, and UI text should be in English
- Comments in code can be in Portuguese, but user-facing content must be English

## Theme
- **Dark theme throughout the entire application**
- Primary background: `bg-black`
- Secondary backgrounds: `bg-gray-900`, `bg-gray-800`
- Text colors: `text-white`, `text-gray-400`
- Accent colors: White buttons with black text

## Design Patterns
- Use shadcn/ui components consistently
- Maintain consistent spacing and typography
- Cards should have dark backgrounds with subtle borders
- Forms should follow the dark theme pattern

## API Integration
- Use React Query for all API calls
- Implement proper error handling
- Follow RESTful conventions
- Validate data with Zod schemas

## File Structure
- Keep components organized in feature-based folders
- Use barrel exports (index.ts) for clean imports
- Separate schemas, types, and utilities appropriately
