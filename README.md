# Todo App — Backend API

MERN task management backend (Express + MongoDB) with JWT authentication.

## Prerequisites

- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas URI)

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
npm run start:dev
```

Server defaults to `http://localhost:8000`.

## Environment variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` or `production` |
| `PORT` | API port (default `8000`) |
| `BASE_URL` | MongoDB connection string |
| `CLIENT_URL` | Frontend origin for CORS |
| `JWT_ACCESS_TOKEN_SECRET` | Access token secret |
| `JWT_ACCESS_TOKEN_EXPIRES_IN` | e.g. `1d` |
| `JWT_REFRESH_TOKEN_SECRET` | Refresh token secret |
| `JWT_REFRESH_TOKEN_EXPIRES_IN` | e.g. `7d` |

## Project structure

```
app.js                 # Entry point
database.js            # MongoDB connection
controllers/           # Thin HTTP handlers (functions)
middlewares/           # Auth + error handling
models/                # Mongoose schemas
repositories/          # OOP data access (BaseRepository + domain)
routes/                # Route definitions
services/              # OOP business logic classes
utils/                 # Validation, JWT, password helpers
```

## API endpoints

### Health
- `GET /api/v1/health`

### Auth
- `POST /api/v1/auth/register` — `{ name, email, password, passwordConfirm }`
- `POST /api/v1/auth/login` — `{ email, password }` → access + refresh tokens
- `POST /api/v1/auth/refresh` — `{ refreshToken }` → new access token

### Users (Bearer token required)
- `GET /api/v1/users/me`

### Tasks / Todos (Bearer token required)
- `GET /api/v1/todos?search=&status=&priority=&page=&limit=`
- `POST /api/v1/todos` — `{ title, description, status?, priority, dueDate }`
- `GET /api/v1/todos/:id`
- `PATCH /api/v1/todos/:id`
- `DELETE /api/v1/todos/:id`

**Statuses:** `To Do` | `In Progress` | `Done`  
**Priorities:** `Low` | `Medium` | `High`

Each user can only access their own tasks.

## Implemented backend features

- User registration & login
- JWT access + refresh tokens
- bcrypt password hashing
- Protected routes + ownership checks
- Task CRUD with title, description, status, priority, due date
- Search by title
- Filter by status and priority
- Pagination
- Joi request validation
- Clear error responses

## Tools / libraries used

Express, Mongoose, Joi, bcryptjs, jsonwebtoken, cors, dotenv, morgan, cookie-parser. AI-assisted development used for scaffolding and review.
