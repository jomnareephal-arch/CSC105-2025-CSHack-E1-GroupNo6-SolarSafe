# SolarSafe — Complete Project Reference
### CSC105 Hackathon 2025 · Group 6 · Theme: Apocalypse

---

## Table of Contents

1. [Project Concept & Story](#1-project-concept--story)
2. [Why Users Should Use SolarSafe](#2-why-users-should-use-solarsafe)
3. [Impact & Real-World Relevance](#3-impact--real-world-relevance)
4. [How to Use the App — Getting Started Guide](#4-how-to-use-the-app--getting-started-guide)
5. [Glossary of Technical Terms](#5-glossary-of-technical-terms)
6. [Technology Stack & Why We Chose Each](#6-technology-stack--why-we-chose-each)
7. [System Architecture](#7-system-architecture)
8. [Database Schema & Design Decisions](#8-database-schema--design-decisions)
9. [Authentication System — Deep Dive](#9-authentication-system--deep-dive)
10. [Page-by-Page User Flow & Code Deep Dive](#10-page-by-page-user-flow--code-deep-dive)
    - [10.1 Login & Signup](#101-login--signup)
    - [10.2 Product Recommendation Page](#102-product-recommendation-page)
    - [10.3 Sun Safety Calculator Page](#103-sun-safety-calculator-page)
    - [10.4 Planner Page](#104-planner-page)
    - [10.5 Settings Page](#105-settings-page)
    - [10.6 Admin Dashboard](#106-admin-dashboard)
11. [UV Index System — Full Explanation](#11-uv-index-system--full-explanation)
12. [The Safe Time Formula — Full Breakdown](#12-the-safe-time-formula--full-breakdown)
13. [Activity Scheduling Algorithm — Full Breakdown](#13-activity-scheduling-algorithm--full-breakdown)
14. [Equipment Recommendation System](#14-equipment-recommendation-system)
15. [Cross-Page Product Integration](#15-cross-page-product-integration)
16. [Data Flow — How Everything Connects](#16-data-flow--how-everything-connects)
17. [API Reference Summary](#17-api-reference-summary)
18. [Design Decisions & Trade-offs](#18-design-decisions--trade-offs)
19. [Edge Cases & How the App Handles Them](#19-edge-cases--how-the-app-handles-them)
20. [Anticipated Pitch Q&A](#20-anticipated-pitch-qa)
21. [Future Improvements & Roadmap](#21-future-improvements--roadmap)
22. [Summary for Pitch](#22-summary-for-pitch)

---

## 1. Project Concept & Story

### The World of SolarSafe

Imagine a world — not far in the future — where climate change has accelerated catastrophically. The ozone layer, which filters 97–99% of the sun's ultraviolet radiation, has been severely depleted by decades of industrial pollution and atmospheric disruption. The result: UV radiation at ground level has surged to levels **4–5× higher than today's peak readings**.

In today's world, a sunny summer day might reach UV Index 11 (Extreme). In the SolarSafe world, noon UV regularly hits **52** — nearly five times that. Without the right knowledge, a person with fair skin could suffer serious UV damage in under **3 minutes** of unprotected midday exposure.

This is the apocalypse — not fire and explosions, but a silent, invisible radiation crisis that makes every outdoor trip a calculated risk.

**SolarSafe** is the survival tool for this world. It is a data-driven, personalized UV safety companion that answers the three most critical questions anyone in this world faces:

> *"How long can I stay outside right now?"*
> *"What protective gear do I need for my activities?"*
> *"When is the safest time to do what I need to do today?"*

### Three Core Features

| Feature | Page | Core Value |
|---|---|---|
| **Sun Safety Calculator** | Calculate | Tells you *exactly* how many minutes you can be outside, based on your skin, the time, and your gear |
| **Product Recommendation** | Product | Helps you find and compare UV-protective gear from the survival store |
| **UV Day Planner** | Planner | Automatically schedules your activities around the safest UV windows |

---

## 2. Why Users Should Use SolarSafe

### The Problem Without SolarSafe

Without this app, users in the apocalyptic UV world would:
- **Guess** how long they can be outside — and guess wrong
- **Not know** that 12:00 noon and 06:00 AM have nearly 3× different UV levels
- **Buy random products** without understanding their protection ratings or comparing options
- **Schedule outdoor activities by habit** (e.g., morning jog at 9am) without realizing UV=30 at that hour is already "High"
- Have **no warning system** to tell them their time is almost up

### The Value SolarSafe Delivers

**1. Personalization**
No two people are the same. A person with Type I skin (pale, fair) gets sunburned 6.5× faster than a Type VI person (very dark skin). SolarSafe accounts for this — giving each person their own numbers, not generic advice.

**2. Precision Over Guessing**
Instead of "apply sunscreen and you'll be fine," SolarSafe gives you: *"With your SPF 50 sunscreen + UV jacket, you have 6 minutes and 48 seconds before UV damage begins at 12:00."* That's actionable.

**3. Gear → Calculation Integration**
The app bridges shopping and safety. When you pick a specific product (e.g., a UV jacket rated UPF 50), that rating goes directly into your safe-time calculation. Your shopping choice has a real, measured impact on your survival time.

**4. Smart Scheduling**
You don't need to know what "UV 30 at 9am" means to stay safe. You just type "morning run" and the app places it at 6am (UV=20, safest slot). The algorithm works so you don't have to.

**5. Countdown Timer as a Safety Net**
The calculator doesn't just show a number — it gives you a live countdown timer with alerts at 10, 5, and 1 minute remaining. It's the difference between "I think I have time" and "I have exactly 2:14 left."

**6. Real-Time UV Updates**
Admins can update UV forecasts per hour, per day. If a solar flare or weather event changes UV levels, the data is updated and everyone's calculations and planner schedules reflect the real conditions.

---

## 3. Impact & Real-World Relevance

### In the Apocalypse Context

Within the SolarSafe world:

- **Prevents UV-related illness** — UV exposure causes cataracts, immune suppression, and DNA damage in skin cells long before visible burns appear. Knowing your limits prevents chronic damage.
- **Enables normal life** — people can still go outside, exercise, garden, and do chores — but safely, in the right windows.
- **Democratizes survival knowledge** — the formula involves skin biology, UV physics, and SPF chemistry. The app turns that complex science into a 3-tap interaction.
- **Supports community safety** — the Admin system lets a community manager (shelter leader, doctor) update UV forecasts and manage the survival gear inventory, keeping the whole community safe.

### In the Real World (Today)

The theme is fictional, but the **underlying science is real**:

- UV radiation is a leading cause of skin cancer worldwide. The WHO estimates UV exposure causes **1.5 million new skin cancer cases per year**.
- The Fitzpatrick skin type scale used in the app is the **actual medical classification** used by dermatologists.
- SPF, UPF, and the MED formula are **real protection standards** used by sunscreen manufacturers and UV researchers.
- Activity scheduling around UV peaks is **real public health advice** — health agencies recommend avoiding outdoor activity between 10am and 4pm.

SolarSafe makes this real science accessible, interactive, and actionable — wrapped in a compelling scenario.

---

## 4. How to Use the App — Getting Started Guide

### Step 1: Create an Account
1. Open the app → you see the Login page
2. Click **Sign up** (bottom of the screen)
3. Enter a username and password (minimum 6 characters)
4. You're in — the app remembers you across sessions

### Step 2: Browse the Survival Store (Product Recommendation)
1. The app opens on the **Product Recommendation** page by default
2. Browse categories using the tabs at the top: Hats, Sunglasses, Sunscreen, Umbrella, UV Jacket
3. Use the left sidebar to filter by:
   - **Price range**: Under 100฿ / 100–300฿ / Above 300฿
   - **Protection score**: drag the slider to set a minimum rating
4. Click **Select** on any product to add it to your loadout
5. You can select one product per category — your selections persist as you navigate the app

### Step 3: Calculate Your Safe Time
1. Click **Sun Safety Calculate** in the sidebar
2. Choose your **skin type** (I = very fair, VI = very dark)
3. Choose the **time** you plan to go outside (6am–6pm)
4. Select your **protection** — tap each gear icon to browse products, or tap **None** if you have no gear
5. Your **Safe Time** appears instantly and updates live as you change any input
6. Hit **▶ (Play)** to start the countdown timer — get warnings at 10, 5, and 1 minute remaining

### Step 4: Plan Your Day (Planner)
1. Click **Planner** in the sidebar
2. See the UV timeline at the top — 24 colored boxes showing today's hourly UV
3. Type an activity name (e.g., "morning jog", "grocery run", "garden") and press Enter or click **+ Add**
4. The app automatically schedules it at the safest available time
5. See the recommended protective gear for each activity (with actual products from the store)
6. Edit or delete activities using the pencil/trash icons on each row

### Step 5: Settings
- Click **Setting** to change your password or sign out

### For Admins Only
- An **Admin** nav item appears if your account has admin role
- Update UV Index forecasts per hour for any date
- Add, edit, activate/deactivate, or delete products in the inventory

---

## 5. Glossary of Technical Terms

This section explains every technical term used in the project — both the UV science and the software engineering concepts.

### UV & Safety Science Terms

**UV Index (UVI)**
A measurement of the strength of ultraviolet radiation from the sun at a specific time and place. Higher = more dangerous. The WHO scale goes 0–11+. In SolarSafe's apocalyptic world, values reach 52.

**UVA vs UVB**
- **UVA** (Ultraviolet A): longer wavelength, penetrates deeper into skin, causes aging and DNA damage. Passes through glass.
- **UVB** (Ultraviolet B): shorter wavelength, causes sunburn and is the primary cause of skin cancer. Blocked by most glass.
SPF mainly measures protection against UVB.

**MED (Minimal Erythemal Dose)**
The smallest amount of UV exposure that causes *just visible reddening* of the skin 24 hours after exposure. It is the biological threshold used in SolarSafe's safe time formula. MED varies by skin type — Type I has a much lower MED than Type VI.

**Fitzpatrick Scale**
A medical classification system (Types I–VI) that categorizes human skin based on its response to UV exposure. Developed by dermatologist Thomas B. Fitzpatrick in 1975. Used by dermatologists worldwide. SolarSafe uses it to determine the `SKIN_FACTOR` multiplier.

**SPF (Sun Protection Factor)**
A measure of how well a sunscreen protects against UVB radiation. SPF 50 means it takes 50× more UV to produce a sunburn compared to unprotected skin. Formula: `protection% = (1 - 1/SPF) × 100`. SPF 50 blocks 98% of UVB.

**UPF (Ultraviolet Protection Factor)**
The fabric equivalent of SPF — measures how much UV radiation a textile blocks. UPF 50 means only 1/50th of UV passes through the fabric. Applies to hats, jackets, and clothing.

**Ozone Layer**
A region of Earth's stratosphere that absorbs 97–99% of the sun's UV radiation. In the SolarSafe apocalypse, this layer has severely degraded, allowing dangerous levels of UV to reach the surface.

---

### Software & Web Terms

**Frontend**
The part of the app users see and interact with — the web pages, buttons, and visual components. Built with React. Runs in the user's browser.

**Backend**
The server-side code that processes data, runs calculations, and manages the database. Users don't see this directly. Built with Node.js + Express.

**API (Application Programming Interface)**
A set of URLs that the frontend calls to get or send data to the backend. For example, the frontend calls `POST /api/calculation` to ask the backend to calculate safe time.

**REST API**
A style of API where each URL represents a resource (e.g., `/api/products`) and HTTP methods define the action: GET (read), POST (create), PUT (update), DELETE (remove).

**HTTP Methods**
- `GET` — fetch data (read-only, safe to repeat)
- `POST` — create new data
- `PUT` — replace/update existing data
- `PATCH` — partially update existing data
- `DELETE` — remove data

**JSON (JavaScript Object Notation)**
The data format used between frontend and backend. Looks like: `{ "name": "morning jog", "startHour": 6 }`. Human-readable and lightweight.

**JWT (JSON Web Token)**
A secure, self-contained token that proves a user's identity. When you log in, the server creates a JWT containing your user ID, username, and role, digitally signs it, and sends it to you. You include it in all future requests. The server can verify it without checking the database every time.
Structure: `header.payload.signature` (three Base64 parts separated by dots).

**bcrypt**
A password hashing algorithm. It takes a plain-text password and produces a scrambled, one-way hash. You can't reverse the hash to get the password. `bcrypt.compare(input, hash)` checks if an input matches a stored hash without knowing the original password. 10 salt rounds means the hash is computed 2^10 = 1,024 times, making brute-force attacks slow.

**localStorage**
A browser feature that stores small amounts of data on the user's device. SolarSafe stores your JWT token, username, and role here so you stay logged in after closing and reopening the browser.

**React**
A JavaScript library for building user interfaces. The core idea: describe what the UI should look like for a given state, and React efficiently updates only the parts that changed when state changes.

**TypeScript**
A superset of JavaScript that adds static types. Instead of `let uv = 30`, you write `let uv: number = 30`. This catches bugs at compile time (before the code runs) and improves code reliability and editor autocomplete.

**useState / useEffect**
React hooks (special functions) for managing component behavior:
- `useState` — stores a value that, when changed, causes the component to re-render
- `useEffect` — runs code in response to lifecycle events (component mount, dependency changes, unmount)

**Prisma ORM (Object-Relational Mapper)**
A tool that lets you write database queries using TypeScript objects instead of raw SQL. Instead of `SELECT * FROM Product WHERE category = 'hats'`, you write `prisma.product.findMany({ where: { category: 'hats' } })`. Prisma translates this to SQL automatically.

**SQLite**
A file-based database that requires no separate server to run. The entire database is stored in a single `.db` file on disk. Perfect for development and small deployments. Used in SolarSafe because it needs zero setup.

**Zod**
A TypeScript validation library. Used on the backend to validate incoming request data. For example, it checks that the `name` field in an activity is a non-empty string before the code tries to use it.

**Tailwind CSS**
A CSS framework where you style elements by adding utility classes directly in HTML/JSX. Instead of writing a separate CSS file with `.button { background: orange; }`, you write `className="bg-orange-500"`. Every styling decision is visible directly in the component.

**Vite**
A modern build tool and development server for frontend projects. It starts extremely fast and uses "hot module replacement" — when you save a file, only the changed component updates in the browser without a full page reload.

**Axios**
A JavaScript library for making HTTP requests. Similar to the built-in `fetch` but with automatic JSON parsing and better error handling.

**CORS (Cross-Origin Resource Sharing)**
A browser security policy that blocks web pages from making requests to a different domain/port than the one serving the page. Since the frontend runs on port 5173 and backend on port 3000, CORS must be explicitly enabled on the backend.

**Proxy**
In development, Vite is configured to forward any `/api/*` request from port 5173 to port 3000. This makes CORS transparent during development — the browser thinks everything is on the same origin.

**UUID (Universally Unique Identifier)**
A 128-bit random string used as a unique ID. Example: `"550e8400-e29b-41d4-a716-446655440000"`. Activities in SolarSafe use UUIDs so they can be created across different sessions without ID conflicts.

**FormData**
A browser API for sending files (like images) over HTTP. Used in the Admin panel to upload product images — the file is packaged into a `multipart/form-data` request that the backend's `multer` middleware processes.

**Middleware**
A function that runs between receiving an HTTP request and sending a response. The `authMiddleware` in SolarSafe checks the JWT token on every protected route before the actual handler runs.

**Map (JavaScript)**
A key-value data structure. SolarSafe uses `Map<ProductCategory, Product>` to store one selected product per category. Unlike a plain object, a Map preserves insertion order and allows non-string keys.

**useRef**
A React hook that stores a value that persists across renders but does *not* trigger re-renders when changed. Used for the countdown timer's `setInterval` handle, so the interval can be cleared without causing re-renders.

---

## 6. Technology Stack & Why We Chose Each

### Frontend

| Technology | Why We Chose It |
|---|---|
| **React 18** | Industry standard for SPAs. Component model maps perfectly to our pages (Calculator, Planner, etc.). Large ecosystem. |
| **TypeScript** | Catches type errors at compile time — critical for the formula where passing a string instead of a number would break calculations silently. |
| **Vite** | Fastest frontend build tool available. Hot reload means we can see changes in <50ms during development. |
| **Tailwind CSS** | No CSS files to maintain. All styling in-component. The amber/orange color palette required only minimal customization. Responsive design via `md:` prefix. |
| **Axios** | Chosen for the Planner API because it provides cleaner base URL config (`axios.create({ baseURL: '/api' })`) than raw `fetch`. |

### Backend

| Technology | Why We Chose It |
|---|---|
| **Node.js + Express** | Same language as the frontend (JavaScript/TypeScript). Express is minimal — we write exactly the routes we need without framework overhead. |
| **TypeScript** | Shared types between frontend and backend means the `ProtectionComponent` type defined on the backend can be imported on the frontend, keeping them in sync. |
| **Prisma** | Auto-generates TypeScript types from the schema. Querying `prisma.product.findMany()` returns a typed `Product[]` — no manual type definitions needed. |
| **SQLite** | Zero configuration, single file, works everywhere. For a hackathon, this removes all database setup friction. |
| **bcryptjs** | Secure password hashing with adaptive cost (salt rounds). Even if the database is leaked, passwords can't be reversed. |
| **jsonwebtoken** | Stateless auth — the server doesn't need to store session data. Any server instance can verify any token using the shared secret. |
| **multer** | Simple file upload middleware. Handles multipart form data, saves files to disk, returns the filename. |
| **zod** | Schema-based validation with TypeScript inference. One schema definition gives you both runtime validation and TypeScript types. |

---

## 7. System Architecture

```
BROWSER (User's Device)
┌─────────────────────────────────────────────────────────────┐
│                    React App (port 5173)                      │
│                                                              │
│  AuthContext ──► isLoggedIn? ──► App.tsx ──► AppLayout       │
│                                    │                         │
│                    ┌───────────────┼───────────────┐         │
│                    ▼               ▼               ▼         │
│            ProductRecommend   CalculatePage   PlannerPage    │
│                    │               │               │         │
│                    └───────────────┼───────────────┘         │
│                          selectedProducts (shared)           │
│                                    │                         │
│                 ┌──────────────────┼──────────────┐          │
│                 ▼                  ▼              ▼           │
│           AdminPage          SettingPage    LoginPage         │
└──────────────────────────────┬──────────────────────────────┘
                                │  All requests go to /api/*
                                │  Vite proxies to port 3000
SERVER (Node.js process)
┌──────────────────────────────▼──────────────────────────────┐
│                   Express App (port 3000)                     │
│                                                              │
│  express.json() ──► CORS ──► /api router                     │
│                                │                             │
│    ┌───────────────────────────┼───────────────────────┐     │
│    ▼           ▼               ▼           ▼           ▼     │
│  /auth      /planner      /calculation  /product-   /admin   │
│  JWT auth   scheduling    safe time     recommend   products  │
│  bcrypt     algorithm     formula       catalog     UV data   │
│    │           │               │           │           │      │
│    └───────────┴───────────────┴───────────┴───────────┘     │
│                                │                             │
│                         Prisma ORM                           │
└──────────────────────────────┬──────────────────────────────┘
                                │  SQL queries
DATABASE (SQLite file)
┌──────────────────────────────▼──────────────────────────────┐
│  dev.db                                                      │
│  ┌──────┐  ┌────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │ User │  │  Day   │  │  UVData  │  │    Activity       │  │
│  └──────┘  └────────┘  └──────────┘  └───────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                            │
│  │ Calculation │  │   Product   │                            │
│  └─────────────┘  └─────────────┘                            │
└──────────────────────────────────────────────────────────────┘
```

### Request Lifecycle Example
When the user adds "morning jog" to the Planner:

```
1. User types "morning jog" → clicks + Add
2. React calls plannerApi.addActivity("morning jog")
3. Axios sends POST /api/planner/activities { name: "morning jog" }
4. Vite proxy forwards to Express on port 3000
5. Express router matches POST /planner/activities → addActivity controller
6. Zod validates { name: "morning jog" } ✓
7. Backend fetches today's UV data from SQLite
8. scheduleActivity("morning jog", uvData, usedHours) runs
   → "jog" keyword detected → preferLow = true
   → candidates filtered to low UV hours only
   → sorted by UV ascending → best = { hour: 6, uvIndex: 20 }
   → end = hour 7 is free → window = 06:00–08:00
9. prisma.activity.create({ name: "morning jog", start: 6, end: 8, reason: "..." })
10. Response: { activity: { id, name, startHour: 6, endHour: 8, peakUV: 20, reason }, equipment: {...} }
11. React state updates → ScheduleList re-renders with new activity
12. EquipmentPanel re-renders with Hat + Sunglasses recommendation
```

---

## 8. Database Schema & Design Decisions

### Complete Schema

```
┌─────────────────────────────────────────────┐
│  Day                                        │
│  id (PK)    : "2025-05-31"  (YYYY-MM-DD)   │
│  date       : "2025-05-31"                  │
│  createdAt  : DateTime                      │
│  updatedAt  : DateTime                      │
│       │ 1:many                              │
│       ├──────────────────────────────────   │
│       │                                     │
│  UVData                                     │
│  id (PK)    : auto-increment Int            │
│  hour       : 0–23                          │
│  uvIndex    : Int (0–100+)                  │
│  level      : "none|low|moderate|high|..."  │
│  dayId (FK) : → Day.id                      │
│  UNIQUE(dayId, hour)                        │
│       │ 1:many                              │
│  Activity                                   │
│  id (PK)         : UUID string              │
│  name            : String                   │
│  dayId (FK)      : → Day.id                 │
│  recommendedStart: Int? (hour 0–23)         │
│  recommendedEnd  : Int? (hour 0–23)         │
│  reason          : String?                  │
│  createdAt       : DateTime                 │
│  updatedAt       : DateTime                 │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  User                                       │
│  id (PK)   : auto-increment Int             │
│  username  : String (UNIQUE)                │
│  password  : String (bcrypt hash)           │
│  role      : "user" | "admin"               │
│  createdAt : DateTime                       │
│  updatedAt : DateTime                       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Calculation                                │
│  id                 : auto-increment Int    │
│  skinType           : "I"–"VI"              │
│  outdoorTime        : "06:00"–"18:00"       │
│  protectionItems    : String (JSON array)   │
│  protectionScore    : Float                 │
│  safeOutdoorMinutes : Float                 │
│  remainingSeconds   : Float? (timer state)  │
│  createdAt          : DateTime              │
│  updatedAt          : DateTime              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Product                                    │
│  id              : auto-increment Int       │
│  name            : String                   │
│  category        : "hats|sunglasses|..."    │
│  price           : Int (Thai Baht ฿)        │
│  protectionScore : Int (SPF/UPF/UV%)        │
│  imageUrl        : String?                  │
│  description     : String?                  │
│  active          : Int (0 or 1)             │
│  createdAt       : DateTime                 │
│  updatedAt       : DateTime                 │
└─────────────────────────────────────────────┘
```

### Why These Design Choices?

**Day as primary entity, keyed by date string**
Activities and UV data are both tied to a specific day. Using the date string (`"2025-05-31"`) directly as the primary key eliminates a join — looking up today's data is just `WHERE id = '2025-05-31'`.

**UV level stored as string alongside the index**
The numeric `uvIndex` is stored for calculations. The string `level` is stored for the scheduling algorithm's fast text comparisons (`d.level === "low"`). Both are needed; storing both avoids recomputing the level on every read.

**Activity times stored as hours, not timestamps**
Activities are scheduled within a day's UV window. Storing `recommendedStart: 6` (the hour integer) is simpler than a full timestamp and directly matches the `UVData.hour` values. The display formats it as `06:00`.

**Calculation stores `protectionItems` as a JSON string**
The set of selected gear items is variable-length and nested. SQLite doesn't support arrays natively. Serializing to JSON (`JSON.stringify(components)`) stores it as a string and `JSON.parse()` restores it on read.

**Product `active` managed via raw SQL**
The `active` column was added after the initial Prisma schema was created (a common iterative development pattern). It's managed via raw SQL `$queryRawUnsafe` rather than updating the schema and regenerating the Prisma client — a pragmatic hackathon shortcut.

---

## 9. Authentication System — Deep Dive

### What is Authentication?
Authentication is the process of verifying *who* a user is. In SolarSafe, every user has a username and password. When you log in, the system proves you are who you say you are, then gives you a token that acts like a digital ID card for future requests.

### JWT Explained

**What is a JWT?**
A JSON Web Token is a compact, URL-safe string with three parts separated by dots:
```
eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWxpY2UifQ  .  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
     HEADER                           PAYLOAD                                     SIGNATURE
```
- **Header**: algorithm used (HS256 = HMAC SHA-256)
- **Payload**: your data (`{ userId: 1, username: "alice", role: "user", exp: 1234567890 }`)
- **Signature**: the header + payload hashed with a secret key — proves the token wasn't tampered with

**Why JWTs instead of sessions?**
Traditional sessions store data on the server (e.g., in Redis). JWTs are *stateless* — the server doesn't store anything. The token itself contains all the info. This scales better: any server instance can verify any token using just the secret key.

### Password Hashing with bcrypt

**Why not store passwords as plain text?**
If the database is ever leaked, all user passwords are exposed. If users reuse passwords across apps, attackers can compromise their other accounts too.

**How bcrypt works:**
```
plain text: "mypassword123"
     ↓
bcrypt.hash("mypassword123", 10)
     ↓
"$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
```
1. Generates a random 128-bit **salt** (adds uniqueness so two users with the same password get different hashes)
2. Combines password + salt
3. Runs the hashing algorithm **2^10 = 1,024 times** (the "10 salt rounds")
4. Produces a 60-character string that *cannot* be reversed

**Verification** uses `bcrypt.compare(input, stored_hash)` — it doesn't decrypt; it re-hashes the input the same way and checks if the result matches.

### The Full Auth Flow

```
SIGNUP:
User → POST /auth/signup { username, password }
     → validate: username free? password ≥ 6 chars?
     → bcrypt.hash(password, 10) → hashed
     → INSERT INTO User (username, hashed, "user")
     → jwt.sign({ userId, username, role }, SECRET, { expiresIn: '7d' })
     → response: { token, username, role }
     → localStorage.setItem('ss_token', token)
     → React AuthContext updates → app renders

LOGIN:
User → POST /auth/signin { username, password }
     → SELECT user WHERE username = ?
     → bcrypt.compare(password, user.password)  ← no decryption, just re-hash
     → jwt.sign(...)
     → response: { token, username, role }

PROTECTED REQUEST (e.g., admin action):
User → PUT /api/admin/products/1
     → Authorization: Bearer eyJ...
     → authMiddleware:
         jwt.verify(token, SECRET) → { userId, username, role }
         req.role = "admin" ✓
     → adminMiddleware:
         req.role === "admin" ✓
     → handler runs

LOGOUT:
User → clicks Sign Out
     → localStorage.removeItem('ss_token', 'ss_username', 'ss_role')
     → React state: token = null, username = null
     → isLoggedIn = false → Login page renders
```

---

## 10. Page-by-Page User Flow & Code Deep Dive

---

### 10.1 Login & Signup

**Files:** `LoginPage.tsx`, `SignupPage.tsx`, `AuthContext.tsx`

**Visual Design:**
- Centered white card on warm `#FDF0E8` background
- Orange circle logo at the top (represents the sun in the apocalypse)
- Clean form with icon-prefixed inputs
- Show/hide password toggle (eye icon SVG)

**Navigation logic — no router library:**
```typescript
// App.tsx
const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");

if (!isLoggedIn) {
  if (authScreen === "signup") return <SignupPage onGoLogin={() => setAuthScreen("login")} />;
  return <LoginPage onGoSignup={() => setAuthScreen("signup")} />;
}
```
React state is used instead of a URL-based router (like React Router). Switching screens is just `setAuthScreen("signup")`. This avoids routing complexity for two simple screens.

**Form submission:**
```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()                           // prevent browser default form submission
  setError(''); setLoading(true)
  try {
    const res = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Login failed'); return }
    login(data.token, data.username, data.role ?? 'user')
    // AuthContext.login() → saves to localStorage → triggers re-render → app shows
  } catch {
    setError('Cannot connect to server')       // network failure
  } finally {
    setLoading(false)                          // always restore button
  }
}
```

**Error states handled:**
- Wrong password → `401 Invalid username or password`
- Username taken (signup) → `409 Username already taken`
- Password too short → `400 Password must be at least 6 characters`
- Server down → `Cannot connect to server` (from `catch`)

---

### 10.2 Product Recommendation Page

**Files:** `ProductRecommendPage.tsx`, `ProductCard.tsx`, `CategoryTabs.tsx`, `FilterSidebar.tsx`, `DailyTipCard.tsx`, `productRecommend.api.ts`

**Page layout:**
```
┌──────────────────────────────────────────────────────────┐
│  Product Recommendation              [← Back to Calculate]│
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Selected: Hat: X · Sunglasses: not selected · ...    │ │
│  └──────────────────────────────────────────────────────┘ │
│  [Hats] [Sunglasses] [Sunscreen] [Umbrella] [UV Jacket]    │
│  ┌───────────┐ ┌───────────────────────────────────────┐  │
│  │  Filter   │ │  Showing 8 items · Selected: X        │  │
│  │ Price     │ │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │  │
│  │ □ <100฿   │ │  │ Prod │ │ Prod │ │ Prod │ │ Prod │ │  │
│  │ □ 100-300 │ │  │  A   │ │  B   │ │  C   │ │  D   │ │  │
│  │ □ >300    │ │  └──────┘ └──────┘ └──────┘ └──────┘ │  │
│  │ Score: 40 │ └───────────────────────────────────────┘  │
│  │           │                                             │
│  │ Daily Tip │                                             │
│  │           │                                             │
│  │ All       │                                             │
│  │ Selections│                                             │
│  └───────────┘                                             │
└──────────────────────────────────────────────────────────┘
```

**Data fetching strategy:**
- Category filter → server-side (different API call per category tab)
- Price range + protection score → client-side (filtered in memory via `useMemo`)

Why split? Category changes what products exist. Price/score filters the subset. Fetching everything at once would load hundreds of products; fetching per-category keeps responses small and fast.

**useMemo for filtering:**
```typescript
const visibleProducts = useMemo(
  () => applyFilters(allProducts, filter),
  [allProducts, filter]
);
```
`useMemo` caches the filtered result. It only re-runs `applyFilters` when `allProducts` or `filter` changes — not on every render. This prevents unnecessary work.

**Product rating system by category:**
| Category | Rating Label | What It Measures | Example |
|---|---|---|---|
| Sunscreen | SPF | % UVB blocked. SPF 50 = 98% blocked | SPF 50 |
| Hats | UPF | % UV blocked by fabric. UPF 50 = 98% | UPF 50+ |
| UV Jacket | UPF | Same as hats | UPF 40 |
| Sunglasses | UV | % UV blocked by lens | UV 99 |
| Umbrella | UV | % UV blocked by canopy | UV 95 |

**Selection summary bar:**
Appears only when at least one product is selected. Shows all 5 category slots — selected products appear in orange, unselected show "Not selected" in gray. This gives a full-loadout overview at a glance.

**Daily tip rotation:**
```typescript
const TIPS = [5 tips...]
function getDailyTip(): string {
  return TIPS[new Date().getDate() % TIPS.length];
  // Day 1 → tip 1, Day 2 → tip 2, ... Day 6 → tip 1 again
}
```
Simple deterministic rotation based on day-of-month. No API needed. Always shows the same tip all day.

---

### 10.3 Sun Safety Calculator Page

**Files:** `CalculatePage.tsx`, `SkinTypeSelector.tsx`, `TimeSlotSelector.tsx`, `ProtectionSelector.tsx`, `SafeTimeDisplay.tsx`, `calculate.api.ts`, `calculate.controller.ts`

**Page layout:**
```
┌───────────────────────────────────────────────────────┐
│  Sun Safety Calculate                                  │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │ 1. Select Skin Type  │  │ 2. Select Time       │   │
│  │  ○ Type I  (fair)    │  │  06:00 – 06:59       │   │
│  │  ● Type II           │  │  07:00 – 07:59       │   │
│  │  ○ Type III          │  │  ● 12:00 – 12:59     │   │
│  │  ○ Type IV           │  │  13:00 – 13:59       │   │
│  │  ○ Type V            │  └──────────────────────┘   │
│  │  ○ Type VI           │  ┌──────────────────────┐   │
│  └──────────────────────┘  │ 3. Choose Protection │   │
│                             │  🚫None  🧴  🧥  🎩  ☂️ 🕶│
│                             └──────────────────────┘   │
│                             ┌──────────────────────┐   │
│                             │ Safe Time            │   │
│                             │      2 hr 34 mins    │   │
│                             │  00:02:34 ▶ ↺        │   │
│                             └──────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

**The Skin Type Selector — Fitzpatrick Scale:**

Each skin type button has a color swatch (from cream to dark brown) and description. The color swatch `backgroundColor` values are hardcoded hex colors that visually represent each skin tone:
```typescript
{ value: 'I',   color: '#f5e6d3' },  // pale cream
{ value: 'III', color: '#d4a574' },  // medium olive
{ value: 'VI',  color: '#4a2c17' },  // very dark brown
```

**The Time Slot Selector:**
13 time slots, 06:00–18:00. Displayed as ranges: "06:00 – 06:59", "07:00 – 07:59" etc. The selector has a fixed max-height with scroll so it doesn't dominate the page on small screens.

**Protection Selector — tap-to-shop flow:**
Each of the 5 protection items (🚫 None, 🧴 Sunscreen, 🧥 UV Jacket, 🎩 Hat, ☂️ Umbrella, 🕶️ Sunglasses) is a tappable card. When active (a product is selected), it shows:
- A ✓ badge
- The product's rating standard + value (e.g., "SPF 50")

When you tap one, it navigates to the Product page for that category. When you return, the card shows the chosen product's rating.

**Auto-calculation — reactive formula:**
The calculation re-runs automatically whenever any of these change: `skinType`, `timeSlot`, `selectedProducts`, `noneSelected`. The `useEffect` dependency array:
```typescript
useEffect(() => {
  const hasProtection = noneSelected || selectedProducts.size > 0
  if (!skinType || !timeSlot || !hasProtection) return  // needs all 3 inputs

  const protectionComponents = buildComponents(selectedProducts, protConfig)
  const payload = { skinType, outdoorTime: timeSlot, protectionComponents }

  const req = resultIdRef.current
    ? updateCalculation(resultIdRef.current, payload)   // update existing
    : createCalculation(payload)                        // create new record

  req.then(data => {
    resultIdRef.current = data.id;   // remember the ID for future updates
    applyMins(data.safeOutdoorMinutes)
  })
}, [skinType, timeSlot, selectedProducts, noneSelected, protConfig, showNotif])
```

`resultIdRef.current` persists the calculation ID across renders without causing re-renders. The first calculation creates a database record; all subsequent changes update that same record via `PUT`.

**Safe Time Display:**
Shows two values:
1. The calculated **safe time** as text ("2 hr 34 mins")
2. The **countdown timer** formatted as HH:MM:SS

The timer is driven by `setInterval` with 1-second ticks:
```typescript
timerRef.current = setInterval(() => {
  setSecs(prev => {
    const next = prev - 1
    if (next <= 0) { /* time up! */ return 0 }
    const mLeft = Math.floor(next / 60)
    // Only notify at exactly the minute mark (next % 60 === 0)
    if ([10, 5, 1].includes(mLeft) && next % 60 === 0) {
      showNotif(`⚠️ ${mLeft} minute${mLeft > 1 ? 's' : ''} remaining!`)
    }
    return next
  })
}, 1000)
```

When the timer hits zero, a toast notification fires: "⚠️ Time is up! Go inside now!" The timer goes red and pulses (`animate-pulse`) when ≤ 60 seconds remain.

---

### 10.4 Planner Page

**Files:** `PlannerPage.tsx`, `UVIndexRow.tsx`, `ScheduleList.tsx`, `EquipmentPanel.tsx`, `plannerApi.ts`, `planner.service.ts`

**Page layout:**
```
┌────────────────────────────────────────────────────────────────────┐
│  Planner                                                            │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Activity name...                              [+ Add]        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  UV INDEX — TODAY                                                   │
│  0–10 Low ■  11–20 Moderate ■  21–30 High ■  31–40 V.High ■  41+ ■ │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ...                 │
│  │00│ │01│ │06│ │07│ │08│ │09│ │10│ │11│ │12│ ...                  │
│  │ -│ │ -│ │20│ │23│ │26│ │30│ │34│ │37│ │52│ ...                  │
│  └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘ └──┘                     │
│  Schedule Activity                                                  │
│  ┌─────┐  morning jog              [UV 20]  [✏️] [🗑️]              │
│  │06:00│  Low UV periods are ideal  ← reason text                  │
│  │  -  │                                                            │
│  │08:00│                                                            │
│  └─────┘                                                            │
│  Recommended protective equipment                                   │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  morning jog  06:00–08:00  [UV 20 · Low]                     │  │
│  │  [🧢 SunHat Pro UPF30 · 250฿]  [🕶️ UVBlock 99UV · 180฿]      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

**UV Timeline — 24 boxes for 24 hours:**
The row renders all 24 hours. Night hours show a dash (`-`) instead of a number. Each box is `52px` wide on mobile, `68px` on desktop. The row overflows horizontally with `overflow-x-auto` — scrollable on mobile.

**Visibility change listener:**
```typescript
const onVisible = () => {
  if (document.visibilityState === "visible") fetchUV();
};
document.addEventListener("visibilitychange", onVisible);
```
This is the browser's Page Visibility API. When the user switches away (to update UV in Admin) and returns, this fires and the UV data refreshes automatically. No polling needed.

**Inline editing in ScheduleList:**
```typescript
const [editId, setEditId] = useState<string | null>(null);
const [editName, setEditName] = useState("");

// Click pencil → enter edit mode
onClick={() => { setEditId(act.id); setEditName(act.name); }}

// In render: show input if editing this row, else show name text
{editId === act.id ? (
  <input value={editName} onChange={...} onKeyDown={...} />
) : (
  <p>{act.name}</p>
)}
```
The edit is tracked in component state with `editId` (which row is being edited) and `editName` (what the user has typed). Pressing Enter or clicking Save calls `onUpdate(act.id, editName)` which fires `PATCH /api/planner/activities/:id`. This reschedules the activity from scratch using the new name.

**Equipment Panel — product lookup:**
On mount, fetches all products and builds a `Map<category, bestProduct>`:
```typescript
// For each category, keep only the highest-rated product
for (const p of products) {
  const existing = map.get(p.category);
  if (!existing || p.protectionScore > existing.protectionScore) {
    map.set(p.category, p);
  }
}
```
Then for each activity card, equipment items are resolved to actual products. If UV is Extreme (>40), ALL 5 categories are shown — one best product each.

---

### 10.5 Settings Page

**Files:** `SettingPage.tsx`, `auth.route.ts`

**Change password flow:**
1. User enters current password + new password (twice, for confirmation)
2. Frontend validates: `newPassword === confirmPassword` (before even calling the API)
3. `PUT /api/auth/change-password` with Bearer token
4. Backend: re-verifies the current password with bcrypt → hashes the new one → updates DB
5. The token remains valid — no re-login required

**Why verify current password on the backend too?**
The frontend check is just UX convenience. The backend *must* verify the current password because any attacker with access to the token could otherwise change the password. Defense in depth.

**Sign out:**
```typescript
function logout() {
  localStorage.removeItem('ss_token')
  localStorage.removeItem('ss_username')
  localStorage.removeItem('ss_role')
  setToken(null); setUsername(null); setRole(null)
}
```
Clears both localStorage (persistent) and React state (current session). `isLoggedIn` becomes false → App renders the Login page.

---

### 10.6 Admin Dashboard

**Files:** `AdminPage.tsx`, `admin.route.ts`

**Why a separate admin role?**
Ordinary users can read UV data and products. Admins can *write* them. The separation prevents users from modifying UV data (which affects everyone's safety calculations) or adding fraudulent products to the inventory.

**UV Update — what happens when Admin saves:**
1. Admin changes hour 12 from UV=52 to UV=65
2. `PUT /api/admin/uv/2025-05-31` → `{ uvData: [{hour: 12, uvIndex: 65}, ...] }`
3. Backend: check if Day row exists → create if not
4. For each hour: `INSERT ... ON CONFLICT ... DO UPDATE SET uvIndex = 65, level = 'very_high'`
5. The level is recomputed: `uvLevel(65)` = `'very_high'` (50–70)
6. Next time any user loads the Planner or Calculator for today, they get UV=65 at noon
7. Any new activity added to the Planner will be scheduled against the updated data

**Active toggle — why not just delete?**
Soft delete via `active = 0` means:
- The product is hidden from users but preserved in the database
- It can be re-activated later (e.g., seasonal item)
- Historical data (calculations that used this product) remains valid
- No FK constraint violations

**Image upload pipeline:**
```
User drags file → FileReader creates preview URL (browser-local)
  → FormData.append('image', file)
  → POST /api/admin/upload (with Authorization header)
  → multer saves file to backend/uploads/<timestamp>.<ext>
  → returns { url: "/uploads/1716100000.jpg" }
  → Express serves /uploads/* as static files
  → setForm({ imageUrl: "/uploads/1716100000.jpg" })
  → Product form now has the image URL
  → User submits form → product saved with imageUrl
```

---

## 11. UV Index System — Full Explanation

### Why is UV dangerous?

UV radiation damages DNA directly. When UV photons hit skin cells, they cause adjacent thymine bases in DNA to bond to each other (thymine dimers), which creates mutations. The body repairs most damage, but repeated exposure overwhelms repair mechanisms, leading to:
- **Short term**: sunburn (erythema), eye damage
- **Long term**: premature aging, cataracts, immune suppression, skin cancer

### In the SolarSafe world

The ozone layer normally absorbs 97–99% of UV radiation. In the SolarSafe apocalypse, ozone depletion has reduced this to perhaps 50–60%, meaning **2–4× more UV** reaches the surface. Combined with increased solar activity, UV index values of 20–52 are the new normal.

Real UV scale (today's world):
```
0–2: Low      3–5: Moderate     6–7: High
8–10: Very High     11+: Extreme
```

SolarSafe's apocalyptic scale:
```
0:    Night (no sun)
1–26: Low       (morning/evening, relatively safe)
27–35: Moderate  (early morning peak, take precautions)
36–49: High      (afternoon shoulder period)
50–70: Very High (approaching peak, dangerous)
71+:  Extreme   (peak conditions, potentially life-threatening)
```

### Sample UV curve for a typical day

```
UV Index
52 ┤                    ●
50 ┤                  ●   ●
47 ┤                        ●
37 ┤               ●
36 ┤                              ●
34 ┤             ●
30 ┤           ●
29 ┤                                 ●
26 ┤         ●
25 ┤                                    ●
23 ┤       ●
20 ┤     ●
 0 ┤●●●●●             ●●●●●●●
   └┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬┬─▶ Hour
    0  2  4  6  8  10 12 14 16 18 20 22
```

The curve is roughly a bell shape peaked at noon. UV=0 from midnight to 5am, rising from 6am, peaking at 12pm (UV=52), declining through the afternoon, back to 0 at 6pm.

### How UV data gets into the app

**Path 1 — Auto-generation (new day):**
When any user accesses the Planner and today has no data yet, `getOrCreateDay(todayId())` creates a Day row and fills it with the hardcoded baseline UV values from `SAMPLE_UV_BY_HOUR`. This happens on first access.

**Path 2 — Admin override:**
Admin sets custom UV values for any day. These overwrite the baseline. All users see the updated values immediately (next request).

**Path 3 — UV fallback in Calculator:**
If the database doesn't have today's UV data yet (edge case: Calculator used before Planner), the calculator uses `UV_INDEX_FALLBACK` — the same values as the baseline, hardcoded directly in `calculate.controller.ts`.

---

## 12. The Safe Time Formula — Full Breakdown

**File:** `calculate.controller.ts`

The formula answers: *"Given who I am (skin type) and what conditions I face (UV intensity) and what protection I have (gear) — exactly how many minutes can I be outside before UV damage begins?"*

### The Science Background

**Minimal Erythemal Dose (MED)**
The MED is the threshold UV dose (measured in J/m²) that causes the faintest visible redness 24 hours after exposure. It varies by skin type:

| Skin Type | Fitzpatrick Description | Approx. MED (real world) |
|---|---|---|
| Type I | Always burns, never tans | 200–300 J/m² |
| Type II | Burns easily, rarely tans | 300–450 J/m² |
| Type III | Burns mildly, tans slowly | 450–600 J/m² |
| Type IV | Burns minimally, tans well | 600–900 J/m² |
| Type V | Rarely burns, tans darkly | 900–1200 J/m² |
| Type VI | Never burns, deeply pigmented | 1200–1500 J/m² |

The relative ratios are approximately 1 : 1.5 : 2 : 3 : 5 : 6.5 — which is exactly the `SKIN_FACTOR` values in the code.

### Step-by-Step Formula

#### Step 1: Get the UV Index for the chosen time

```typescript
// From database or fallback
const uv = await getTodayUV(outdoorTime)   // e.g., uv = 37 for 11:00
```

#### Step 2: Calculate base safe time (unprotected)

```
baseMinutes = (SKIN_FACTOR × 133.33) / uvIndex
```

**Where does 133.33 come from?**
It is a normalization constant derived from the standard UV index reference. UV index 1 corresponds to approximately 25 mW/m² of erythemal UV energy. At UV=1, a Type I person (MED ≈ 200 J/m²) would take approximately 200/0.025 ≈ 8000 seconds ≈ 133 minutes to reach their MED.

`133.33 minutes × 1.0 (SKIN_FACTOR I) / 1 (UV=1) = 133.33 minutes`

**Examples with UV=37 (11am):**
```
Type I:   (1.0 × 133.33) / 37 = 3.60 minutes
Type II:  (1.5 × 133.33) / 37 = 5.41 minutes
Type III: (2.0 × 133.33) / 37 = 7.21 minutes
Type IV:  (3.0 × 133.33) / 37 = 10.8 minutes
Type V:   (5.0 × 133.33) / 37 = 18.0 minutes
Type VI:  (6.5 × 133.33) / 37 = 23.4 minutes
```

#### Step 3: Calculate Protection Factor (PF)

Each gear item contributes a percentage score to the overall Protection Factor:

```typescript
PF = (spf_contribution × 0.25)          // Sunscreen covers skin directly
   + (upf_contribution × 0.35)          // UV Jacket covers largest body area
   + (hat_factor × 0.10)                // Hat covers head/face
   + (umbrella_factor × 0.20)           // Umbrella provides overhead shade
   + (glass_factor × 0.10)              // Sunglasses protect eyes
```

**Weight rationale:**
| Item | Weight | Reasoning |
|---|---|---|
| UV Jacket | 35% | Covers torso + arms, the largest exposed skin surface area |
| Sunscreen | 25% | Covers all exposed skin directly, highly effective per unit area |
| Umbrella | 20% | Blocks direct overhead UV but not reflected/scattered UV |
| Hat | 10% | Covers small area (head/neck) but vital for eye/face protection |
| Sunglasses | 10% | Protects eyes specifically, doesn't reduce skin UV |

**How each item's protection score becomes a contribution:**

For SPF/UPF (sunscreen, jacket):
```
contribution = (1 - 1/value) × 100

SPF 10:  (1 - 1/10) × 100 = 90%    → 90 × 0.25 = 22.5 PF points
SPF 30:  (1 - 1/30) × 100 = 96.7%  → 96.7 × 0.25 = 24.2 PF points
SPF 50:  (1 - 1/50) × 100 = 98%    → 98 × 0.25 = 24.5 PF points
UPF 50:  (1 - 1/50) × 100 = 98%    → 98 × 0.35 = 34.3 PF points
```
This is why SPF 50 isn't much better than SPF 30 in absolute terms — both block >96% of UVB. But switching from SPF 30 to UPF 50 jacket adds 34 PF points instead of 24.

For hats, umbrellas, sunglasses (stored as UV blocking percentage directly):
```
hat_factor = 80  → 80 × 0.10 = 8 PF points
umbrella_factor = 95 → 95 × 0.20 = 19 PF points
glass_factor = 99 → 99 × 0.10 = 9.9 PF points
```

#### Step 4: Apply Protection to Base Time

```
safeMinutes = round(baseMinutes × (1 + PF / 100))
```

PF acts as a percentage *multiplier* on your safe time. PF=50 means you get 1.5× as long. PF=100 means 2× as long.

**Full worked example — Type II skin, UV=37 (11am), full gear:**

| Item | Value | Contribution |
|---|---|---|
| SPF 50 sunscreen | 50 | (1-1/50)×100×0.25 = 24.5 |
| UPF 50 UV jacket | 50 | (1-1/50)×100×0.35 = 34.3 |
| Hat factor 80 | 80 | 80×0.10 = 8.0 |
| Umbrella factor 95 | 95 | 95×0.20 = 19.0 |
| Sunglasses 99 | 99 | 99×0.10 = 9.9 |
| **Total PF** | | **= 95.7** |

```
Base time  = (1.5 × 133.33) / 37 = 5.41 minutes
Safe time  = round(5.41 × (1 + 95.7/100))
           = round(5.41 × 1.957)
           = round(10.59)
           = 11 minutes
```

Same person with NO protection at noon (UV=52):
```
Base time = (1.5 × 133.33) / 52 = 3.85 minutes
Safe time = round(3.85 × (1 + 0)) = 4 minutes
```

**That's why noon is deadly.** Even fair-skinned Type II people with full gear have only 11 minutes.

### The Countdown Timer

Once safe time is calculated:
1. `applyMins(safeOutdoorMinutes)` sets `secs = safeOutdoorMinutes × 60`
2. User presses ▶ → `setRunning(true)` → `setInterval` fires every 1000ms
3. Each tick: `secs -= 1`
4. At `secs = 600` (10 min): toast "⚠️ 10 minutes remaining!"
5. At `secs = 300` (5 min): toast "⚠️ 5 minutes remaining!"
6. At `secs = 60` (1 min): timer turns red + pulses, toast "⚠️ 1 minute remaining!"
7. At `secs = 0`: toast "⚠️ Time is up! Go inside now!", timer stops

The `setWarned` Set prevents duplicate notifications: once a warning is shown for "10 minutes", it's added to the Set and won't fire again.

---

## 13. Activity Scheduling Algorithm — Full Breakdown

**File:** `planner.service.ts`

The scheduler is the intelligence behind the Planner. It takes an activity name and picks the best available hour(s) for it based on current UV data.

### What "best" means

Different activities have different UV requirements:

| Activity type | UV preference | Reason |
|---|---|---|
| **Outdoor physical** (run, jog, exercise, bike, garden, walk, play, cycle) | Lowest UV possible | Body generates heat during exercise; sweating reduces sunscreen effectiveness; these activities keep you outside longer |
| **General** (cooking, studying, laundry, meeting) | Moderate UV (~28) | May need some natural light; not intensely physical; shorter duration |

### The Algorithm — Step by Step

**Input:**
- `name`: activity name (e.g., "morning jog")
- `uvData`: array of `{ hour, uvIndex, level }` for today
- `usedHours`: Set of hours already booked by other activities

**Step 1 — Classify activity**
```typescript
const n = name.toLowerCase()  // "morning jog"
const avoidSun = ["run","exercise","jog","garden","walk","bike","cycle","play"]
  .some((k) => n.includes(k))
// "morning jog" → includes "jog" → avoidSun = true
// → preferLow = true, avoidHigh = true
```

**Step 2 — Filter to daylight hours**
```typescript
const daylight = uvData.filter((d) => d.uvIndex > 0)
// Removes hours 0–5 and 18–23 (UV=0, nighttime)
// Keeps hours 6–17 (UV 20–52)
```

**Step 3 — Filter to free hours**
```typescript
let candidates = daylight.filter((d) => !usedHours.has(d.hour))
// If 6am is already booked (used by a previous activity), it's excluded
```

**Step 4 — If outdoor: prefer safe UV levels**
```typescript
if (avoidHigh) {
  const safe = candidates.filter(
    (d) => d.level === "low" || d.level === "moderate"
  )
  if (safe.length > 0) candidates = safe
  // If no safe hours are free, keeps all free candidates (better than nothing)
}
```

With default UV data, "low" hours are 6am, 7am, 8am (UV=20,23,26). "moderate" hours are 9am, 10am, 16am (UV=30,34,29). So candidates for an outdoor activity are `[6, 7, 8, 9, 10, 16, 17]`.

**Step 5 — Score and sort**
```typescript
function scoreHour(point, preferLow) {
  if (preferLow) return point.uvIndex           // ascending: lower UV = better score
  return Math.abs(point.uvIndex - 28)           // ascending: closer to UV=28 = better
}
candidates.sort((a, b) => scoreHour(a, preferLow) - scoreHour(b, preferLow))
// For jog: sorted by uvIndex ascending → [6(UV=20), 7(UV=23), 8(UV=26), ...]
const best = candidates[0]   // hour 6, UV=20
```

**Step 6 — Try to extend to 2 hours**
```typescript
const nextFree = uvData.find((d) => d.hour === best.hour + 1 && d.uvIndex > 0)
              && !usedHours.has(best.hour + 1)
// Hour 6 picked → is hour 7 free and daytime? Yes → end = 8 (2-hour window)
const end = nextFree ? best.hour + 2 : best.hour + 1
```

**Step 7 — Mark hours as used**
```typescript
usedHours.add(best.hour)           // hour 6 now used
if (end === best.hour + 2) usedHours.add(best.hour + 1)  // hour 7 now used
```
This `usedHours` Set is mutated in-place, so the next activity added in the same request won't double-book.

**Step 8 — Generate reason text**
```typescript
const reason = avoidHigh
  ? `Low UV periods are ideal for outdoor activities. (UV ${best.uvIndex})`
  : `The time with just the right amount of sunlight is ideal for... "${name}" (UV ${best.uvIndex})`
```

### Example: Adding 3 activities sequentially

Assume UV data: 06(20), 07(23), 08(26), 09(30), 10(34), 11(37), 12(52)

**Activity 1: "morning jog"** → outdoor → lowest UV
- Candidates: 06(20), 07(23), 08(26) (low), 09(30), 10(34), 16(29), 17(25) (moderate)
- Best: hour 6 (UV=20)
- Hour 7 free → window: 06:00–08:00
- Used hours: {6, 7}

**Activity 2: "grocery shopping"** → general → moderate UV
- Candidates (free): 08, 09, 10, 11, 12, 13, 14, 15, 16, 17
- Scored by `|UV - 28|`: 08(|26-28|=2), 09(|30-28|=2), ...
- Best: hour 8 or 9 (tied at score 2; 08 comes first in sorted array)
- Hour 9 free → window: 08:00–10:00
- Used hours: {6, 7, 8, 9}

**Activity 3: "evening walk"** → outdoor → lowest UV
- Candidates (free): 10, 11, 12, 13, 14, 15, 16, 17 (6,7,8,9 used)
- Outdoor filter: only low/moderate → 10(34=moderate), 16(29=moderate), 17(25=low)
- Best: 17 (UV=25, lowest of the three)
- Hour 18 is nighttime (UV=0) → window: 17:00–18:00 (1 hour only)
- Used hours: {6, 7, 8, 9, 17}

---

## 14. Equipment Recommendation System

**Files:** `uv.model.ts`, `EquipmentPanel.tsx`

### Two-level recommendation

**Level 1 — Backend (aggregate for whole day):**
Computes the *maximum* UV across all activities and returns one overall recommendation. This is what's stored in the `equipment` field returned by the planner API. Used to give a single "worst-case" gear list for the day.

**Level 2 — Frontend (per-activity):**
`EquipmentPanel` shows a recommendation card *for each individual activity*, based on that activity's `peakUV`. More useful than the aggregate because activities at different UV levels need different gear.

### Equipment thresholds

```
peakUV ≤ 0:   "No special equipment needed"
peakUV ≤ 10:  Hat, Sunglasses
peakUV ≤ 20:  Sunscreen SPF 30+, Hat, Sunglasses
peakUV ≤ 30:  Sunscreen SPF 50+, Hat, Sunglasses, UV-protective shirt
peakUV ≤ 40:  Sunscreen SPF 50+, Wide-brimmed hat, Sunglasses, Umbrella, UV clothing
peakUV > 40:  All types of protective equipment + ⚠️ Warning banner
```

### Equipment → Product category mapping

```
"Hat" / "Wide-brimmed hat"                → category: "hats"
"Sunglasses"                               → category: "sunglasses"
"Sunscreen SPF 30+" / "Sunscreen SPF 50+" → category: "sunscreen"
"Long-sleeved UV-protective shirt" / "UV-protective clothing" → category: "uv-jacket"
"UV-protective umbrella"                   → category: "umbrella"
"All types of protective equipment"        → ALL 5 categories
```

### Best product selection

```typescript
// Build bestByCategory map on component mount
const map = new Map<ProductCategory, Product>();
for (const p of products) {
  const existing = map.get(p.category);
  if (!existing || p.protectionScore > existing.protectionScore) {
    map.set(p.category, p);  // keep highest rated product per category
  }
}
```

The *highest protectionScore product* per category wins. This ensures the safest option from the inventory is always recommended for post-apocalyptic survival.

### Fallback behavior

If the inventory is empty for a category (e.g., no hats in stock), the component falls back to displaying an emoji chip with the equipment label. The UI degrades gracefully — never breaks.

---

## 15. Cross-Page Product Integration

### The Problem This Solves

Without integration, the user would need to:
1. Go to Products, note down "I selected SPF 50 sunscreen"
2. Manually go to Calculator, find the SPF 50 sunscreen option
3. Hope they remembered correctly

With integration, the app remembers your selection across pages automatically.

### How It's Implemented

**Shared state in `App.tsx`** (the top-level component — parent of all pages):
```typescript
// One product per category, shared across all pages
const [selectedProducts, setSelectedProducts] =
  useState<Map<ProductCategory, Product>>(new Map())
```

`Map<ProductCategory, Product>` means at most one product per category. Keys are `"hats"`, `"sunglasses"`, `"sunscreen"`, `"umbrella"`, `"uv-jacket"`.

**Selecting a product (any page → App):**
```typescript
// When user clicks Select in ProductRecommendPage
const handleSelectProduct = (product: Product) => {
  setSelectedProducts(prev => {
    const next = new Map(prev)    // copy (don't mutate)
    next.set(product.category, product)  // replace or add
    return next
  })
}
```

**Navigate from Calculator → Products for a specific category:**
```typescript
// User taps the "Sunscreen" tile in CalculatePage
function handleNavigateToProductForCategory(category: ProductCategory) {
  setProductPageInitialCategory(category)   // pre-open the Sunscreen tab
  setReturnToCalculate(true)                // show "← Back to Calculate" button
  setActiveNav("product")                   // switch page
}
```

**Navigate back from Products → Calculator:**
```typescript
// User clicks "← Back to Calculate"
function handleDoneSelectingProduct() {
  setReturnToCalculate(false)
  setProductPageInitialCategory(null)
  setActiveNav("calculate")       // switch back
}
```

The `selectedProducts` map persists the whole time. When the Calculator re-renders after navigation, the product the user just selected is already in the map, and the formula recalculates immediately.

**Use in EquipmentPanel (Planner):**
The EquipmentPanel independently fetches all products and picks the best per category. It doesn't use the shared `selectedProducts` map — it always shows the best from inventory regardless of what the user has "selected" for their calculator.

---

## 16. Data Flow — How Everything Connects

### Full data flow diagram

```
ADMIN sets UV data for today
  → PUT /api/admin/uv/2025-05-31
  → SQLite UVData updated for each hour

USER opens Planner
  → GET /api/planner/uv-today
  → Backend reads UVData from DB → returns 24 UV values
  → UVIndexRow renders colored timeline

USER adds "morning jog"
  → POST /api/planner/activities { name: "morning jog" }
  → Backend scheduleActivity("morning jog", uvData, usedHours)
    → keywords → avoidHigh, preferLow
    → candidates → safe hours
    → best hour = 6 (UV=20)
    → window = 06:00–08:00
  → prisma.activity.create(...)
  → Response: { activity: { start:6, end:8, peakUV:20, reason }, equipment }
  → ScheduleList re-renders: new row at 06:00–08:00
  → EquipmentPanel re-renders:
    → peakUV=20 → uvMeta(20) → "Moderate" level
    → items: ["Sunscreen SPF 30+", "Hat", "Sunglasses"]
    → lookup: sunscreen → bestByCategory.get("sunscreen") → product from DB
    → render ProductCard with image, name, SPF, price

USER opens Calculator
  → Selects Type II skin
  → Selects 12:00 time slot
  → GET UV from DB: UV=52 for hour 12
  → Selects SPF 50 sunscreen from Product page
    → product.protectionScore = 50 → component: { type:'sunscreen', spf:50 }
  → POST /api/calculation { skinType:'II', outdoorTime:'12:00', components:[...] }
  → calcSafeTime:
    → uv = 52
    → medBase = (1.5 × 133.33) / 52 = 3.85
    → pf = (1-1/50)×100×0.25 = 24.5
    → safeMinutes = round(3.85 × 1.245) = 5
  → Response: { safeOutdoorMinutes: 5 }
  → Display: "5 mins"
  → User starts timer: 00:05:00 → countdown
  → At 00:01:00: "⚠️ 1 minute remaining!"
  → At 00:00:00: "⚠️ Time is up! Go inside now!"
```

---

## 17. API Reference Summary

### Auth
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| POST | `/api/auth/signup` | `{ username, password, role? }` | `{ token, username, role }` |
| POST | `/api/auth/signin` | `{ username, password }` | `{ token, username, role }` |
| GET | `/api/auth/me` | — | `{ userId, username }` |
| PUT | `/api/auth/change-password` | `{ currentPassword, newPassword, confirmPassword }` | `{ message }` |

### Planner
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| GET | `/api/planner/uv-today` | — | `{ uvData: [{hour, uv, level}] }` |
| GET | `/api/planner/activities` | — | `{ activities, maxUV, equipment }` |
| POST | `/api/planner/activities` | `{ name }` | `{ activity, equipment }` |
| PATCH | `/api/planner/activities/:id` | `{ name }` | `{ activity, equipment }` |
| DELETE | `/api/planner/activities/:id` | — | `{ success, equipment }` |

### Calculator
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| POST | `/api/calculation` | `{ skinType, outdoorTime, protectionComponents }` | `{ id, safeOutdoorMinutes, protectionScore, ... }` |
| PUT | `/api/calculation/:id` | same as POST | same as POST |
| GET | `/api/calculation/:id` | — | full Calculation row |
| GET | `/api/config/protection` | — | `[{ type, label, icon, field }]` |

### Products
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| GET | `/api/product-recommendations` | `?category=hats` (optional) | `{ success, data: [products] }` |

### Admin (requires Admin JWT)
| Method | Endpoint | Body / Params | Response |
|---|---|---|---|
| GET | `/api/admin/uv/:date` | — | `{ uvData: [{hour, uvIndex, level}] }` |
| PUT | `/api/admin/uv/:date` | `{ uvData: [{hour, uvIndex}] }` | `{ success }` |
| GET | `/api/admin/products` | — | `{ products: [...all, including inactive] }` |
| POST | `/api/admin/products` | `{ name, category, price, protectionScore, imageUrl?, description? }` | `{ product }` |
| PUT | `/api/admin/products/:id` | same as POST | `{ product }` |
| PATCH | `/api/admin/products/:id/active` | `{ active: 0 or 1 }` | `{ success }` |
| DELETE | `/api/admin/products/:id` | — | `{ success }` |
| POST | `/api/admin/upload` | `FormData (image file)` | `{ url: "/uploads/..." }` |

---

## 18. Design Decisions & Trade-offs

### No URL routing library (React Router)

**Decision:** Use React `useState` to switch between pages instead of URL-based routing.

**Why:** For a hackathon app with 5 pages and no deep-linking requirement, React Router adds complexity (setup, `<BrowserRouter>`, route params) without benefit. State-based routing is simpler and faster to implement.

**Trade-off:** URLs don't change when navigating. Can't bookmark a specific page. Can't use browser back/forward buttons. Acceptable for a demo app.

### SQLite instead of PostgreSQL

**Decision:** Use SQLite (file-based) instead of a real database server.

**Why:** Zero configuration. No Docker, no `pg` connection string, no user management. The database is just a file. Perfect for hackathons.

**Trade-off:** SQLite doesn't support concurrent writes well. Not suitable for production at scale. Fine for demo with one or a few simultaneous users.

### Shared `selectedProducts` state at App level

**Decision:** Lift product selection state to `App.tsx` (the top-level component) rather than each page managing its own.

**Why:** Both `ProductRecommendPage` and `CalculatePage` need to read and write the same state. If each managed their own, they'd be out of sync. Lifting to `App.tsx` makes it the single source of truth.

**Trade-off:** `App.tsx` has more state to manage. Every page re-renders when `selectedProducts` changes (mitigated by React's reconciliation).

### Per-activity equipment in EquipmentPanel vs aggregate

**Decision:** Show equipment recommendations per activity (each activity gets its own card) rather than a single combined list.

**Why:** An activity at UV=20 (morning) and one at UV=37 (late morning) need different gear. A single combined list would always show the worst-case gear, even for the safe activity. Per-activity is more actionable.

**Trade-off:** More screen space. If you have 5 activities, you see 5 equipment cards. This is acceptable because the information is more useful.

### Activity scheduling without AI

**Decision:** Use a rule-based keyword algorithm instead of an LLM or ML model.

**Why:** Fast, deterministic, works offline, no API cost, easy to explain. For a hackathon, a rule-based system that works reliably is better than a complex model that might fail.

**Trade-off:** Limited vocabulary. "Hiking" isn't in the keyword list and would be treated as a general activity. Could be extended easily by adding keywords.

---

## 19. Edge Cases & How the App Handles Them

### "What if the database has no UV data for today?"
`getOrCreateDay(todayId())` creates the Day row on first access, auto-populating with baseline UV data. The Calculator additionally has `UV_INDEX_FALLBACK` hardcoded.

### "What if all daylight hours are already booked?"
`scheduleActivity` falls back from the `usedHours`-filtered list to all daylight hours. The activity gets scheduled even if it overlaps — the app doesn't refuse; it just picks the best remaining option and notes the UV level.

### "What if there are no products in the inventory?"
`EquipmentPanel` checks `product ? <ProductCard> : <chip>`. If `bestByCategory` is empty (no products), every equipment item renders as a plain emoji + text chip instead of a product card. No crash, graceful degradation.

### "What if the backend is down?"
The Planner falls back to `SAMPLE_UV` (hardcoded in `PlannerPage.tsx`) for the UV timeline. Activity operations show `"Failed to add activity. Is the backend running?"`. The Calculator shows `"⚠️ Cannot connect to server"`. Auth shows `"Cannot connect to server"`.

### "What if a user calculates without selecting any protection?"
The protection selector requires either a product selection or clicking **None** (which sets `noneSelected = true`). Until one of those is true AND skin type AND time slot are set, the calculation doesn't fire. `noneSelected` with empty `protectionComponents` → `PF = 0` → safe time = base time only.

### "What if two users add activities simultaneously?"
Each `addActivity` call fetches `usedHours` fresh from the database (`getOrCreateDay` → includes all existing activities). If User A's request is processed first, User B's subsequent request sees User A's hours as used and picks a different slot. SQLite's sequential writes enforce this naturally.

### "What if the admin enters UV=0 for noon?"
`scheduleActivity` filters `daylight = uvData.filter(d => d.uvIndex > 0)`. If UV=0 for noon, that hour is excluded from daylight candidates. It won't be scheduled into.

---

## 20. Anticipated Pitch Q&A

**Q: Why the apocalypse theme?**
A: The theme forced us to take UV safety seriously rather than treating it as a minor concern. In a normal world, you might ignore UV advice — "it's just sunscreen." In an apocalyptic world where you have 4 minutes at noon without protection, every feature of the app becomes critical. The theme makes the problem visceral and demonstrates the value of the solution clearly.

---

**Q: Is the UV formula scientifically accurate?**
A: Yes, within the app's scale. The formula is based on the Minimal Erythemal Dose (MED) concept, which is the actual method dermatologists and UV researchers use to quantify skin damage thresholds. The Fitzpatrick skin type multipliers (1.0, 1.5, 2.0, 3.0, 5.0, 6.5) are based on the approximate ratios of real-world MED values across skin types. The SPF formula `(1 - 1/SPF) × 100` is exactly how SPF is mathematically defined.

---

**Q: Why does SPF 50 only add a small amount of protection compared to SPF 30?**
A: This is a real phenomenon. SPF 30 blocks 96.7% of UVB; SPF 50 blocks 98%. The difference is only 1.3 percentage points. Meanwhile, a UPF 50 jacket adds 34 PF points vs SPF 50's 24.5 points — the jacket protects far more skin surface. This is why dermatologists say "SPF 30 is usually sufficient if reapplied" — the jump to SPF 50 gives diminishing returns.

---

**Q: How is the scheduling algorithm "smart"?**
A: It combines keyword classification, UV level filtering, hour availability, and a scoring function. The keyword list ("run", "jog", "exercise", "garden", "walk", "bike", "cycle", "play") covers the most common outdoor activities. The UV level filter prioritizes "low" and "moderate" windows for those activities. The scoring function `|UV - 28|` for general activities finds the most "normally lit" hour — not too bright (noon), not too dark (early dawn). It's rule-based AI (expert system) rather than machine learning.

---

**Q: Could a regular user fake being an admin?**
A: No. The `adminMiddleware` on the backend verifies the JWT token and checks `role === 'admin'`. Even if a user manually modified their `localStorage` to say `role: "admin"`, the JWT itself (signed by the server's secret key) still contains `role: "user"`. The token can't be forged without knowing the server's secret key. The frontend admin check is just UX (hiding the nav item); the real security is backend-enforced.

---

**Q: What happens to data between days?**
A: UV data and activities are tied to a specific `Day` record (keyed by `YYYY-MM-DD`). When a new day begins, the old day's data remains in the database but new requests use `todayId()`. Yesterday's activities don't appear in the Planner today — you start fresh each day. UV data for each day persists and can be looked up by date in the Admin panel.

---

**Q: Why is there no "loading" spinner when adding an activity?**
A: The `handleAdd` function in `PlannerPage.tsx` does set `setLoading(true)` while the API call is in flight. The Add button shows "..." and is disabled. The activity appears in the list after the API responds, which typically takes less than 100ms on localhost — making a spinner feel like flickering rather than feedback.

---

**Q: Can two people use the app at the same time?**
A: Yes. Each user's activities are scoped to today's Day record — but currently all users share the same Day. If User A and User B both add "morning jog", the second one will be scheduled to the next available slot (since hour 6 is now taken by User A). In a full production app, activities would be scoped per `userId`. This would be a straightforward schema change: add `userId` as a foreign key on the `Activity` table.

---

**Q: Why use TypeScript on both frontend and backend?**
A: Shared types. The `ProtectionComponent` type, the `SkinType` enum, the `TimeSlot` type — these are defined once and can be imported on both sides. When the backend response changes, TypeScript tells you everywhere in the frontend that needs to be updated. In a hackathon, where code changes fast, this prevents a whole class of bugs (wrong field name, wrong type).

---

**Q: How would this app work in real life (without the apocalypse)?**
A: Very similarly. You'd replace the hardcoded UV data with a real UV index API (like OpenUV, Tomorrow.io, or WHO data). The Fitzpatrick formula, SPF/UPF calculations, and scheduling algorithm all apply directly to real-world UV safety. The Admin panel would auto-import hourly UV forecasts instead of requiring manual entry. SolarSafe could genuinely be used as a beach/outdoor activities UV safety tool today.

---

**Q: What's the most technically impressive part of the project?**
A: The integration of three independent systems into one coherent experience: (1) a scientifically-grounded formula for safe time, (2) an algorithm that schedules activities around UV windows, and (3) an inventory system that recommends specific products for each situation — all linked together so that one action (selecting a product in the store) affects your calculation, your planner recommendations, and your equipment display simultaneously.

---

## 21. Future Improvements & Roadmap

### Short-term (next sprint)

| Feature | Description |
|---|---|
| **Per-user activities** | Add `userId` FK to `Activity` table. Each user sees only their own activities. |
| **Real UV API** | Replace `SAMPLE_UV_BY_HOUR` with a live API (OpenUV, Tomorrow.io). UV data becomes real geographic forecast. |
| **Activity library** | Expandable keyword list. Let users define custom activity types. |
| **Product reviews** | Add rating/review system to products — community trust signals. |

### Medium-term

| Feature | Description |
|---|---|
| **Push notifications** | Use Web Push API to send timer alerts even when app is closed. Critical for survival use case. |
| **Geolocation UV** | Use device GPS to fetch UV index for user's exact location and date. |
| **UV exposure history** | Track cumulative UV exposure per day. Warn when approaching weekly safe limits. |
| **Outfit builder** | Select full gear sets and save them as "loadouts" for repeated use. |

### Long-term / Visionary

| Feature | Description |
|---|---|
| **AI activity classifier** | Replace keyword matching with a small language model that understands activity descriptions naturally ("preparing soil in the garden" → outdoor, avoid high UV). |
| **Wearable integration** | Connect to UV sensor wristband. Real-time UV reading from the user's environment, not just forecast. |
| **Community UV reports** | Let users report actual UV conditions. Crowdsourced real-time UV map. |
| **Medical integration** | Allow dermatologist-set skin profiles. Import medication warnings (some drugs increase UV sensitivity). |

---

## 22. Summary for Pitch

### The Hook (30 seconds)

> *"In this world, going outside at noon without protection is like putting your hand on a hot stove. You have four minutes. SolarSafe tells you exactly how many minutes you have, what to wear, and when to go."*

### The Three Pillars

**1. CALCULATE — Know Your Limit**
Tell us your skin type and when you're going out. We run the science — MED formula, Fitzpatrick scale, SPF/UPF protection factors — and give you a countdown timer. Not a vague warning. An exact number. A live clock.

**2. EQUIP — Get the Right Gear**
Browse our survival inventory. Filter by protection score and price. Select your sunscreen, hat, jacket, sunglasses, umbrella. Every product you pick changes your safe time calculation in real time. There's no gap between "which product should I buy?" and "how much does it actually protect me?"

**3. PLAN — Work With the Sun, Not Against It**
Type in what you need to do today. Our scheduler reads the UV forecast and places your activities in the safest available windows automatically. "Morning jog" goes to 6am when UV is 20, not 11am when it's 37. Every activity card shows what gear to wear, backed by real products from the store.

### Technical Highlights

- **Full-stack TypeScript** — React frontend + Node.js/Express backend, shared types across both
- **Scientific formula** — MED-based safe time calculation with Fitzpatrick skin factors and weighted protection scores
- **Rule-based scheduling AI** — keyword classification + UV level filtering + availability scoring
- **JWT authentication** — stateless, 7-day tokens, bcrypt password hashing
- **Real-time Admin panel** — update UV forecasts per hour, manage product inventory live
- **Cross-page state** — product selection flows seamlessly from store → calculator → planner
- **Graceful degradation** — app works even if backend is unreachable (UV fallback data, empty state handling)

### The Numbers That Matter

| Scenario | Without App | With App |
|---|---|---|
| Fair skin at noon (UV=52) | Doesn't know time limit | Knows: 4 minutes max |
| With SPF 50 sunscreen + jacket | Guesses "I should be fine" | Knows: 11 minutes exactly |
| Scheduling a morning run | Goes at 10am (UV=34, High) | Goes at 6am (UV=20, Low) |
| Buying a sunscreen | Picks randomly | Compares SPF values, sees real safe-time impact |

### One-line pitch

> *"SolarSafe is the GPS for UV survival — it tells you exactly where you can go, for how long, and what you need to bring."*

---

*Full source code analysis · SolarSafe · CSC105 Hackathon 2025 · Group 6 · Theme: Apocalypse*
