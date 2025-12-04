# Hindustan Bills — Integrated Frontend + Backend

This repository contains the integrated frontend (React + Vite) and backend (Node + Express + MongoDB)
for the Hindustan Bills project.

## Structure
- `/frontend` — React app (Vite). Run with `npm install` and `npm run dev`.
- `/backend` — Node/Express API. Run with `npm install` and `npm run dev`.

## Setup (local)
1. Install Node.js (>=18) and npm.
2. Install MongoDB locally or use MongoDB Atlas.
3. Copy `.env.example` files to `.env` in each folder and fill in real values.

### Backend
```bash
cd backend
cp .env.example .env
# edit .env to set MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Server listens on `http://localhost:5000` by default.

### Frontend
```bash
cd frontend
cp .env.example .env
# edit .env if backend URL differs
npm install
npm run dev
```

The frontend uses `VITE_API_URL` to call the backend (defaults to `http://localhost:5000/api`).




