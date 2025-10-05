FROM node:20-alpine as base
WORKDIR /app

# Copia manifestos do frontend e raiz do monorepo para instalar deps
COPY package.json package-lock.json* ./
COPY ../../package.json ./root-package.json

# Instala dependências do app isoladamente (sem workspaces) para imagem leve
RUN --mount=type=cache,target=/root/.npm npm install --omit=dev || true

# Copia código e builda
COPY . .
RUN npm run build

# Runtime de preview
FROM node:20-alpine
WORKDIR /app
COPY --from=base /app /app
EXPOSE 5173
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
