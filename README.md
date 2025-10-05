# Upload Widget Server 📤

[![FastifyJS](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A modern and efficient upload server built with Fastify, PostgreSQL, and Cloudflare R2 for storage.

## 🚀 Prerequisites

- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/) v18 or higher
- [![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/) and Docker Compose
- [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/) (or use the provided Docker container)

## 🛠️ Setup

1. 📥 Clone the repository
2. ⚙️ Create a `.env` file in the root directory with the following variables:

```env
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name

CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_cloudflare_access_key_id
CLOUDFLARE_SECRET_ACCESS_KEY=your_cloudflare_secret_key
CLOUFLARE_BUCKET=your_cloudflare_bucket
CLOUFLARE_PUBLIC_URL=your_cloudflare_public_url

DATABASE_URL="postgresql://your_postgres_user:your_postgres_password@localhost:5432/your_database_name"
```

## 🚀 Running the Application

### 🐳 Using Docker (recommended)

```bash
# Start all services
docker compose up -d
```

The server will be available at http://localhost:3000/docs

### 💻 Running Locally

1. 📦 Install dependencies:

```bash
pnpm install
```

2. Run database migrations:

```bash
pnpm db:migrate
```

3. Start the development server:

```bash
pnpm dev
```

The server will be available at http://localhost:3000

## 🧪 Running Tests

```bash
# Run tests once
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## 🏗️ Build

```bash
# Build the application
pnpm build

# Start the server
pnpm start
```
