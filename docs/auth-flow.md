# Fluxo de Autenticação - Strak Social

## Visão Geral

O sistema de autenticação do Strak Social utiliza a biblioteca **Better Auth** integrada com **Drizzle ORM** e **PostgreSQL**. O sistema implementa autenticação baseada em email/senha com gerenciamento de sessões e cookies HTTP-only para segurança.

## Arquitetura do Sistema

### Componentes Principais

1. **Backend (API Node.js)**
   - Better Auth para gerenciamento de autenticação
   - Drizzle ORM para persistência de dados
   - PostgreSQL como banco de dados
   - Cookies HTTP-only para sessões

2. **Frontend (React + Vite)**
   - React Hook Form para formulários
   - TanStack Query para gerenciamento de estado
   - Zod para validação de schemas
   - Axios para requisições HTTP

## Estrutura do Banco de Dados

### Tabelas de Autenticação

#### 1. `users` (Schema: strak_social)
```sql
CREATE TABLE "strak_social"."users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL UNIQUE,
  "name" text NOT NULL,
  "email_verified" boolean DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

**Propósito**: Armazena dados básicos dos usuários
- **id**: Identificador único (UUID)
- **email**: Email único do usuário
- **name**: Nome completo
- **email_verified**: Status de verificação (não implementado ainda)
- **created_at/updated_at**: Timestamps automáticos

#### 2. `sessions` (Schema: strak_social)
```sql
CREATE TABLE "strak_social"."sessions" (
  "id" text PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "expires_at" timestamp NOT NULL,
  "token" text NOT NULL UNIQUE,
  "ip_address" text,
  "user_agent" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

**Propósito**: Gerencia sessões ativas dos usuários
- **id**: ID da sessão
- **user_id**: Referência ao usuário
- **expires_at**: Data de expiração (7 dias por padrão)
- **token**: Token único da sessão (usado no cookie)
- **ip_address**: IP do usuário (para segurança)
- **user_agent**: Navegador/dispositivo do usuário

#### 3. `accounts` (Schema: strak_social)
```sql
CREATE TABLE "strak_social"."accounts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "account_id" text NOT NULL,
  "provider_id" text NOT NULL,
  "access_token" text,
  "refresh_token" text,
  "id_token" text,
  "access_token_expires_at" timestamp,
  "refresh_token_expires_at" timestamp,
  "scope" text,
  "password" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
```

**Propósito**: Suporte a provedores OAuth e armazenamento de senhas
- **user_id**: Referência ao usuário
- **account_id**: ID da conta no provedor externo
- **provider_id**: Tipo de provedor (email, google, github, etc.)
- **password**: Hash da senha (para autenticação email/senha)
- **access_token/refresh_token**: Tokens OAuth
- **scope**: Permissões OAuth

## Configuração do Better Auth

### Arquivo: `api/src/auth/config.ts`

```typescript
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
      generateId: uuidv4, // Gera UUIDs para IDs
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Desabilitado por enquanto
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // Atualiza a cada 24h
  },
  trustedOrigins: [
    'http://localhost:5173', // Frontend dev
    'http://localhost:8000'  // Frontend prod
  ],
});
```

## Fluxos de Autenticação

### 1. Registro de Usuário (Sign Up)

#### Frontend → Backend
```typescript
// Frontend: src/pages/auth/SignUp.tsx
const signUpMutation = useMutation({
  mutationFn: signUpApi,
  onSuccess: (data) => {
    console.log("User created successfully:", data)
  }
});
```

#### API Call
```typescript
// Frontend: src/api/auth.ts
export const signUpApi = async (data: SignUpFormData): Promise<ApiResponse> => {
  const response = await api.post<ApiResponse>('/auth/sign-up', {
    email: data.email,
    password: data.password,
    name: data.name,
  })
  return response.data
}
```

#### Backend Processing
```typescript
// Backend: api/src/routes/auth.ts
router.post('/sign-up', async (req, res) => {
  try {
    const validatedData = signUpSchema.parse(req.body); // Validação Zod
    
    const result = await auth.api.signUpEmail({
      body: validatedData,
    });
    
    res.status(201).json({ 
      message: 'User created successfully',
      user: result.user 
    });
  } catch (error) {
    // Tratamento de erros
  }
});
```

#### Validação Frontend
```typescript
// Frontend: src/schemas/auth.ts
export const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain...')
})
```

#### Validação Backend
```typescript
// Backend: api/src/schemas/auth.ts
export const signUpSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
});
```

### 2. Login (Sign In)

#### Fluxo de Login
1. **Frontend** envia credenciais via POST `/auth/sign-in`
2. **Backend** valida dados com Zod
3. **Better Auth** verifica credenciais no banco
4. **Sistema** cria nova sessão na tabela `sessions`
5. **Cookie HTTP-only** é definido com o token da sessão
6. **Frontend** recebe dados do usuário (sem token - fica no cookie)

#### Cookie Configuration
```typescript
res.cookie('better-auth.session_token', result.token, {
  httpOnly: true, // Não acessível via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS em produção
  sameSite: 'lax', // Proteção CSRF
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
});
```

### 3. Verificação de Sessão

#### Endpoint: GET `/auth/session`
```typescript
router.get('/session', async (req, res) => {
  const sessionToken = req.cookies['better-auth.session_token'];
  
  if (!sessionToken) {
    return res.status(401).json({ error: 'No active session' });
  }

  const result = await auth.api.getSession({
    headers: new Headers({
      'cookie': `better-auth.session_token=${sessionToken}`,
    }),
  });

  res.json({ user: result.user });
});
```

### 4. Logout

#### Fluxo de Logout
1. **Frontend** faz POST `/auth/sign-out`
2. **Backend** extrai token do cookie
3. **Better Auth** invalida a sessão no banco
4. **Cookie** é removido do navegador

## Segurança

### Medidas Implementadas

1. **Cookies HTTP-only**: Tokens não acessíveis via JavaScript
2. **Validação Dupla**: Frontend (Zod) + Backend (Zod)
3. **CORS Configurado**: Apenas origens confiáveis
4. **Sessões com Expiração**: 7 dias com renovação automática
5. **Hash de Senhas**: Gerenciado pelo Better Auth
6. **SameSite Cookies**: Proteção contra CSRF

### Configurações de Segurança

```typescript
// CORS Configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8000'],
  credentials: true, // Permite cookies
}));

// Cookie Security
httpOnly: true,
secure: process.env.NODE_ENV === 'production',
sameSite: 'lax'
```

## Endpoints da API

### Autenticação

| Método | Endpoint | Descrição | Parâmetros |
|--------|----------|-----------|------------|
| POST | `/auth/sign-up` | Registro de usuário | `{email, password, name}` |
| POST | `/auth/sign-in` | Login | `{email, password}` |
| POST | `/auth/sign-out` | Logout | Cookie session_token |
| GET | `/auth/session` | Verificar sessão | Cookie session_token |

### Better Auth Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/sign-up/email` | Registro via Better Auth |
| POST | `/api/auth/sign-in/email` | Login via Better Auth |
| POST | `/api/auth/sign-out` | Logout via Better Auth |
| GET | `/api/auth/session` | Sessão via Better Auth |

## Fluxo de Dados

### 1. Registro
```
Frontend Form → Zod Validation → API Call → Backend Validation → Better Auth → Database
```

### 2. Login
```
Frontend Form → API Call → Better Auth → Database → Session Creation → Cookie Set → User Data
```

### 3. Verificação de Sessão
```
Frontend Request → Cookie Extraction → Better Auth → Database → User Data
```

## Tratamento de Erros

### Frontend
```typescript
try {
  const response = await signUpApi(data);
} catch (error: any) {
  if (error.response?.data?.details) {
    // Erros de validação
    const validationErrors = error.response.data.details
      .map(detail => detail.message).join(', ');
    throw new Error(`Validation error: ${validationErrors}`);
  }
  
  if (error.response?.data?.error) {
    // Erros da API
    throw new Error(error.response.data.error);
  }
  
  throw new Error('Network error');
}
```

### Backend
```typescript
try {
  const validatedData = signUpSchema.parse(req.body);
  const result = await auth.api.signUpEmail({ body: validatedData });
  res.status(201).json({ message: 'User created successfully', user: result.user });
} catch (error: any) {
  if (error.name === 'ZodError') {
    return res.status(400).json({ error: 'Invalid data', details: error.errors });
  }
  
  if (error.message) {
    return res.status(400).json({ error: error.message });
  }
  
  res.status(500).json({ error: 'Internal server error' });
}
```

## Configurações de Ambiente

### Variáveis Necessárias
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:8002/strak_social
PORT=3001
NODE_ENV=development
BETTER_AUTH_SECRET=seu_secret_aqui
BETTER_AUTH_URL=http://localhost:8001
```

## Próximos Passos

1. **Verificação de Email**: Implementar `requireEmailVerification: true`
2. **OAuth Providers**: Adicionar Google, GitHub, etc.
3. **Password Reset**: Implementar recuperação de senha
4. **Rate Limiting**: Proteção contra ataques de força bruta
5. **Audit Logs**: Log de atividades de autenticação
6. **2FA**: Autenticação de dois fatores

## Troubleshooting

### Problemas Comuns

1. **Cookie não enviado**: Verificar CORS `credentials: true`
2. **Sessão expirada**: Verificar `expiresIn` e `updateAge`
3. **Validação falha**: Comparar schemas frontend/backend
4. **Database connection**: Verificar `DATABASE_URL`

### Logs Úteis

```typescript
// Adicionar logs para debug
console.log('Session token:', req.cookies['better-auth.session_token']);
console.log('User data:', result.user);
console.log('Validation errors:', error.errors);
```
