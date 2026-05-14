# DentalCare Project - Agent Instructions

## Project Structure

```
dental-care/
├── frontend/          # Next.js 16.2.6 app (port 3000)
│   └── src/
│       ├── app/       # Pages: admin/, dentist/, user/, login/, register/
│       ├── components/# UI: Navbar, Button, Card, Modal, Input, Badge
│       ├── context/   # AuthContext.tsx
│       └── lib/      # api.ts, utils.ts
└── backend/           # Express API (port 3001)
    └── src/
        ├── routes/    # auth.js, users.js, appointments.js, treatments.js
        ├── controllers/
        └── middleware/# auth.js
```

## Running the Project

```bash
# Backend (terminal 1)
cd backend && npm run dev

# Frontend (terminal 2)
cd frontend && npm run dev
```

- Backend API: `http://localhost:3001`
- Frontend: `http://localhost:3000`
- API URL env: `NEXT_PUBLIC_API_URL`

## Database

- SQLite: `backend/prisma/dev.db`
- Schema: `backend/prisma/schema.prisma`
- Commands:
  - `npm run db:push` - Push schema changes
  - `npm run db:seed` - Seed initial data

## User Roles

- `SUPERADMIN` - Full access, manages users/treatments
- `DENTIST` - Dashboard, manages appointments
- `USER` - Book appointments, view own history

## Clinic Hours (hardcoded)

- Mon-Fri: 09:00 - 18:00
- Sat: 09:00 - 14:00
- Sun: Closed (availability returns empty)

## Key Files

- `src/lib/api.ts` - All API calls to backend
- `src/context/AuthContext.tsx` - Auth state management
- `backend/src/routes/*.js` - API endpoints with auth middleware
- `backend/src/middleware/auth.js` - JWT verify + role check

## Next.js 16 Quirks

- Uses Turbopack by default with `next dev`
- App Router only (no pages/ directory)
- Server components default, use 'use client' for interactivity
- Route handlers in `app/api/*/route.ts`

## Important Conventions

- All interactive elements need `cursor-pointer` class
- Use `max-w-7xl mx-auto` for container widths
- Prisma: delete users with appointments requires `onDelete: Cascade` on relations
- Timestamps stored as UTC strings, front-end uses `toLocalDateString()`

## E2E Testing with Playwright

```bash
# Asegúrate de que el backend esté corriendo primero
cd backend && npm run dev

# En otra terminal, ejecutar los tests E2E
cd frontend && npm run test:e2e

# O con interfaz visual
npm run test:e2e:ui

# Ver reporte HTML
npm run test:e2e:report
```

Tests cubrimos:
- Landing page carga sin errores críticos
- Página de registro carga correctamente
- Página de login carga correctamente
- Login funciona con credenciales válidas
- Registro crea cuenta y redirige al dashboard