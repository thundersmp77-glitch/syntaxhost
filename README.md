# SyntaxHost (Full-Stack SaaS Hosting Platform)

SyntaxHost is a modular hosting website with authentication, plan management, order submissions, reviews, admin controls, dynamic links, currency switching, and Discord webhook notifications.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: SQLite + Prisma
- Auth: JWT

## Quick Start

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Admin default login:
- Email: `admin@syntaxhost.com`
- Temporary password: `Admin@12345`

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Set frontend API target if needed:
- `VITE_API_URL=http://localhost:4000/api`

## Feature Coverage
- User signup/login + admin login/logout
- CRUD hosting plans (VPS, VDS, MINECRAFT)
- Order flow with plan review + payment + screenshot upload
- Pending orders + admin approval/rejection
- Logged-in reviews + admin deletion
- Editable links stored in DB
- INR base with USD/EUR conversion + switcher
- Discord webhook ping on new order
- Dark themed UI (purple/blue/cyan)
