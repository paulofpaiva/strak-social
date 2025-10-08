![Strak Logo](./assets/Strak_Logo.png)

# Strak Social

A modern social media platform where users can connect, share posts, interact with content, and build their online community.

## About

Strak Social is a feature-rich social networking application with posts, comments, likes, follow system, user profiles, and media sharing capabilities.

## Running with Docker

Docker Compose will set up all services including PostgreSQL.

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/strak-social.git
cd strak-social
```

2. **Start all services**

```bash
docker-compose up -d
```

This will start the frontend, backend, and PostgreSQL database.

3. **Run database migrations**

```bash
docker-compose exec backend pnpm db:migrate
```

4. **Configure Firebase Storage** (required for uploads)

Configure Firebase Storage credentials using environment variables:

- Copy the example environment file:
```bash
cp apps/backend/.env.example apps/backend/.env
```

- Get your Firebase service account key from Firebase Console
- Extract the values from your Firebase service account JSON file
- Update `apps/backend/.env` with your Firebase credentials (see `apps/backend/.env.example` for all required variables)

5. **Access the application**

Open your browser and go to: **http://localhost:5173**

---

