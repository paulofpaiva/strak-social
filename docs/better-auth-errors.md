# Better Auth Error Handling

## Error Types from Better Auth

Based on the API implementation, Better Auth can return the following error types:

### 1. Validation Errors (ZodError)
- **Status**: 400
- **Structure**:
```json
{
  "error": "Dados inválidos",
  "details": [
    {
      "message": "Email inválido",
      "path": ["email"],
      "code": "invalid_string"
    }
  ]
}
```

### 2. Better Auth Specific Errors
- **Status**: 400
- **Structure**:
```json
{
  "error": "User already exists with this email"
}
```

Common Better Auth errors:
- `User already exists with this email`
- `Invalid email or password`
- `Email verification required`
- `Password too weak`

### 3. Server Errors
- **Status**: 500
- **Structure**:
```json
{
  "error": "Erro interno do servidor"
}
```

## Frontend Error Handling

The frontend now handles these errors appropriately:

1. **Validation Errors**: Shows detailed validation messages
2. **Better Auth Errors**: Shows the specific error message
3. **Network Errors**: Shows connection error message
4. **Unknown Errors**: Shows generic error message

## Error Response Mapping

```typescript
// API Response Structure
interface ApiError {
  error: string
  details?: Array<{
    message: string
    path: string[]
    code: string
  }>
}
```
