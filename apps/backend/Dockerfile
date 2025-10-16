FROM node:20-alpine as builder
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install || pnpm install || true

COPY . .
RUN npm run build

FROM node:20-alpine as runner
WORKDIR /app

COPY --from=builder /app/package.json ./
RUN npm install --omit=dev --production || npm install --omit=dev || true

COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/drizzle ./drizzle
COPY --from=builder /app/apps/backend/drizzle.config.ts ./drizzle.config.ts

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/index.js"]
