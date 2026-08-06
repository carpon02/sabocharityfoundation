# Sabo Ibadan Youth Charity Foundation

A full-stack MERN application for managing donations, events, and volunteers for the Sabo Ibadan Youth Charity Foundation.

## Tech Stack

| Layer | Tech |
|-------|------|
| **Backend** | Node.js 20, Express, MongoDB (Atlas), Mongoose |
| **Frontend** | React 19, Vite, TailwindCSS 4, Redux Toolkit, Framer Motion |
| **Admin** | React 19, Vite, TailwindCSS 4, Redux Toolkit |
| **Payments** | Paystack |
| **Auth** | JWT + Google OAuth |
| **Media** | Cloudinary |
| **Monitoring** | Sentry |
| **CI/CD** | GitHub Actions → Docker Hub |

## Project Structure

```
Charity_Project/
├── Backend/           # Node.js + Express REST API    (port 5000)
├── frontend/          # React customer-facing app     (port 5173)
├── admin/             # React admin dashboard         (port 5174)
├── docker-compose.yml # Docker dev orchestration
├── Makefile           # Quick docker shortcuts
├── start-local.bat    # Windows: run all 3 without Docker
├── .env.example       # All environment variables
└── .github/workflows/ # CI/CD pipelines
```

---

## Getting Started

### Prerequisites

- **Node.js 20+** and **npm 9+**
- **MongoDB** — use [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier works)

### 1. Clone & Install

```bash
git clone https://github.com/carpon02/sabocharityfoundation.git
cd sabocharityfoundation

# Install dependencies for each service
cd Backend && npm install && cd ..
cd frontend && npm install && cd ..
cd admin && npm install && cd ..
```

### 2. Environment Setup

```bash
# Copy the example and fill in your values
cp .env.example .env
```

Each service also has its own `.env`:
- `Backend/.env` — MongoDB URI, JWT secret, Paystack keys, email config
- `frontend/.env` — `VITE_API_URL`, Sentry DSN, Google Client ID
- `admin/.env` — `VITE_API_URL`, Sentry DSN

> **Important:** Never commit `.env` files. The `.gitignore` already excludes them.

### 3. Run Locally

**Option A — Three terminals (recommended for development):**

```bash
# Terminal 1: Backend
cd Backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: Admin
cd admin && npm run dev
```

**Option B — Windows quick start:**

```bash
# Opens 3 separate terminal windows automatically
start-local.bat
```

### 4. Access

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Admin    | http://localhost:5174 |
| API      | http://localhost:5000/health |

---

## Available Scripts

### Backend (`cd Backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with hot-reload (nodemon) |
| `npm start` | Production start |
| `npm test` | Run all tests |
| `npm run test:unit` | Unit tests only |
| `npm run test:integration` | Integration tests only |
| `npm run lint` | Run ESLint |

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm test` | Run Vitest |
| `npm run lint` | Run ESLint |
| `npm run storybook` | Component storybook |

### Admin (`cd admin`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build |
| `npm test` | Run Vitest |
| `npm run lint` | Run ESLint |

---

## Environment Variables

See [`.env.example`](.env.example) for the complete list with descriptions.

Key variables you must set:

| Variable | Required For |
|----------|-------------|
| `MONGODB_URI` | Database connection |
| `JWT_SECRET` | Authentication |
| `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` | Payments |
| `CLOUDINARY_*` | Image uploads |
| `EMAIL_*` | Transactional emails |
| `GOOGLE_CLIENT_ID` | Google OAuth |

---

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run linting: `npm run lint` in the relevant directory
4. Open a pull request

---

## License

MIT
