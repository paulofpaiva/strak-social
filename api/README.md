# Strak Social API

API Express com PostgreSQL, Drizzle ORM, Zod e Better Auth.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp env.example .env
```

3. Configure a URL do banco PostgreSQL no arquivo `.env`

4. Execute as migrações do banco:
```bash
npm run db:generate
npm run db:migrate
```

## Scripts

- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Inicia o servidor em produção
- `npm run db:generate` - Gera migrações do banco
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre o Drizzle Studio

## Rotas

### Autenticação

- `POST /auth/sign-up` - Registro de usuário
- `POST /auth/sign-in` - Login
- `POST /auth/sign-out` - Logout
- `GET /auth/session` - Obter sessão atual

### Geral

- `GET /` - Retorna "OK"

## Estrutura

```
src/
├── auth/
│   └── config.ts          # Configuração do Better Auth
├── db/
│   ├── index.ts           # Conexão com o banco
│   └── schema.ts          # Schema do Drizzle
├── routes/
│   └── auth.ts            # Rotas de autenticação
├── schemas/
│   └── auth.ts            # Schemas de validação Zod
└── index.ts               # Servidor principal
```
