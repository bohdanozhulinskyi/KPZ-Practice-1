# Project

This repository contains:
- Backend: FastAPI API with JWT authentication (register/login + user profile + stats)
- Frontend: React (Vite) consuming the backend API

## Run with Docker

```bash
docker compose up --build
```

Backend health check: `http://localhost:8000/health`  
Frontend: `http://localhost:5173`

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/me` (requires `Authorization: Bearer <token>`)
- `GET /api/stats` (requires `Authorization: Bearer <token>`)

