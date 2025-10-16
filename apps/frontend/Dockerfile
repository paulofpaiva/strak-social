FROM node:20-alpine as base
WORKDIR /app

COPY package.json package-lock.json* ./
COPY ../../package.json ./root-package.json

RUN --mount=type=cache,target=/root/.npm npm install --omit=dev || true

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app /app
EXPOSE 5173
ENV NODE_ENV=production
CMD ["npm", "run", "start"]
