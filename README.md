# SolarSafe ☀️

> **CSC105 Hackathon 2025 · Group 6 · Theme: Apocalypse**

A UV safety companion app for a post-apocalyptic world where ozone depletion has pushed solar radiation to lethal levels. SolarSafe tells you exactly how long you can be outside, what gear to wear, and when to schedule your day — all backed by real skin biology and UV science.

---

## Features

| Feature | Description |
|---|---|
| **Sun Safety Calculator** | Computes your personalized safe outdoor time from skin type, UV index, and protection gear (SPF/UPF ratings feed directly into the formula) |
| **UV Day Planner** | Clickable UV timeline — pick a time slot and duration (15 min / 30 min / 1 hr), or let the auto-scheduler place activities in the safest available window |
| **Product Recommendation** | Filterable UV gear inventory (hats, sunglasses, sunscreen, umbrella, UV jacket) with select/unselect and one-click navigation to the calculator |
| **Equipment Recommendations** | Per-activity protective gear suggestions shown as real products from the inventory |
| **Countdown Timer** | Starts from your calculated safe time with warnings at 10, 5, and 1 minute remaining |
| **Admin Dashboard** | Update hourly UV forecasts per day, manage product inventory (add, edit, toggle active, delete, image upload) |
| **Authentication** | JWT-based login/signup — admin account is seeded only, never self-registerable |

---

## Tech Stack

**Frontend** — React 18 + TypeScript · Vite · Tailwind CSS

**Backend** — Node.js + Express · TypeScript · Prisma ORM · SQLite

**Auth** — JWT (7-day expiry) · bcrypt (10 salt rounds)

---

## Project Structure

```
SolarSafe/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Prisma schema (source of truth)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── admin/             # UV forecast + product CRUD (admin only)
│   │   │   ├── auth/              # JWT signup/signin/change-password
│   │   │   ├── calculate/         # Safe time formula + protection config
│   │   │   ├── planner/           # UV planner + activity scheduling
│   │   │   └── productRecommend/  # Product catalog API
│   │   ├── db.ts                  # Prisma client
│   │   ├── routers.ts             # Root API router
│   │   ├── seed.ts                # Database seed script
│   │   └── index.ts               # Express entry point
│   └── .env                       # Environment variables
└── frontend/solar-safe/
    ├── public/                    # Favicon, logo, background
    └── src/
        ├── components/            # AppLayout (sidebar nav)
        ├── contexts/              # AuthContext (JWT + localStorage)
        └── modules/
            ├── Admin/             # Admin dashboard page
            ├── Planner/           # UV planner page + components
            ├── ProductRecommend/  # Product store page + components
            ├── auth/              # Login, Signup, Settings pages
            └── calculate/         # Sun safety calculator page + components
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Clone & install

```bash
git clone <repo-url>
cd SolarSafe

# Backend
cd backend && npm install

# Frontend
cd ../frontend/solar-safe && npm install
```

### 2. Configure environment

The backend ships with a working `.env`. No changes needed for local development:

```
# backend/.env
DATABASE_URL="file:./dev.db"
ALLOW_ORIGIN=http://localhost:5173
PORT=3000
```

Optionally set a custom `JWT_SECRET`:

```
JWT_SECRET="your-secret-here"
```

### 3. Set up the database

```bash
cd backend

# Push schema to SQLite and generate Prisma client
npx prisma db push
npx prisma generate

# Seed with products, UV data, and demo accounts
npm run seed
```

### 4. Run

Open two terminals:

```bash
# Terminal 1 — backend (port 3000)
cd backend && npm run dev

# Terminal 2 — frontend (port 5173)
cd frontend/solar-safe && npm run dev
```

Open **http://localhost:5173**

---

## Demo Accounts

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin1234` |
| User | `demo` | `demo1234` |
| User | `alice` | `alice123` |

> Admin accounts can only be created via `npm run seed`. The signup page always creates user-level accounts.

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register (user role only) |
| POST | `/api/auth/signin` | — | Login, returns JWT |
| PUT | `/api/auth/change-password` | JWT | Change password |
| GET | `/api/planner/uv-today` | — | Today's hourly UV data |
| GET | `/api/planner/activities` | — | Today's scheduled activities |
| POST | `/api/planner/activities` | — | Add activity (auto or manual schedule) |
| PATCH | `/api/planner/activities/:id` | — | Rename activity |
| DELETE | `/api/planner/activities/:id` | — | Remove activity |
| POST | `/api/calculation` | — | Compute safe outdoor minutes |
| PUT | `/api/calculation/:id` | — | Update calculation |
| GET | `/api/product-recommendations` | — | List active products (filterable) |
| GET | `/api/admin/uv/:date` | Admin | Get UV data for a date |
| PUT | `/api/admin/uv/:date` | Admin | Update UV forecast for a date |
| GET | `/api/admin/products` | Admin | List all products (incl. inactive) |
| POST | `/api/admin/products` | Admin | Create product |
| PUT | `/api/admin/products/:id` | Admin | Update product |
| PATCH | `/api/admin/products/:id/active` | Admin | Toggle active/inactive |
| DELETE | `/api/admin/products/:id` | Admin | Delete product |
| POST | `/api/admin/upload` | Admin | Upload product image |

---

## The Safe Time Formula

```
baseMinutes     = (SKIN_FACTOR × 133.33) / uvIndex
protectionScore = (SPF contribution × 0.25)
                + (UPF contribution × 0.35)
                + (hat factor      × 0.10)
                + (umbrella factor × 0.20)
                + (glass factor    × 0.10)
safeMinutes     = round(baseMinutes × (1 + protectionScore / 100))
```

Skin factors (Fitzpatrick scale): I → 1.0 · II → 1.5 · III → 2.0 · IV → 3.0 · V → 5.0 · VI → 6.5

---

## Database Schema

```
User          — id, username (unique), password (bcrypt), role
Product       — id, name, category, price, protectionScore, imageUrl, description, active
Day           — id (YYYY-MM-DD), date
UVData        — hour (0–23), uvIndex, level, dayId  [unique: dayId+hour]
Activity      — id (UUID), name, dayId, recommendedStart, recommendedEnd, durationMinutes, reason
Calculation   — skinType, outdoorTime, protectionItems (JSON), protectionScore, safeOutdoorMinutes
```

---

## Useful Commands

```bash
# Re-seed the database (wipes all data)
cd backend && npm run seed

# Regenerate Prisma client after schema changes
cd backend && npx prisma generate

# Push schema changes to the database
cd backend && npx prisma db push

# Open Prisma Studio (visual DB browser)
cd backend && npx prisma studio
```
