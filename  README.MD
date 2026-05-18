# GigFlow ⚡ Full-Stack Lead Management Hub

GigFlow is a lightweight, high-performance Lead Management application built on a completely split full-stack architecture. It pairs a secure Node.js, Express, and MongoDB backend with a type-safe, responsive React frontend powered by the cutting-edge Tailwind CSS v4 compiler. 

The system implements strict Role-Based Access Control (RBAC), server-side paginated queries, multi-parameter text and category filtering, and real-time frontend analytics processing blocks.

---

## 🏗️ System Architecture & Data Flow

The platform separates concerns across three decoupled layers to optimize data handling and maintain strict boundary controls.

### 1. Database Layer (MongoDB)
Data shapes are explicitly defined using Mongoose schemas across two primary collections:
* **`users`**: Manages credential payloads (`name`, `email`), salted `password` hashes, and access tiers (`Admin` | `Manager`).
* **`leads`**: Tracks lifecycle pipeline records (`name`, `email`), status state machines (`New`, `Contacted`, `Qualified`, `Lost`), and acquisition sources (`Website`, `Instagram`, `Referral`).

### 2. Backend API Layer (Node.js + Express + TS)
Acts as the secure coordinator for data validation, token evaluation, and optimized query assembly:
* **Authentication Pipeline**: Authenticates login requests against database hashes and signs cryptographic JSON Web Tokens (JWT).
* **Role Shielding Middleware**: Decodes and verifies inbound JWT headers on the fly. Administrative routes (such as `DELETE /api/leads/:id`) are hard-gated using strict role evaluation logic.
* **Query Builder**: Intercepts URL request variables to handle text searching, categorical filtering, and offset pagination math natively on the database server before delivering arrays to the wire.

### 3. Frontend UI Layer (React + TS + Tailwind v4)
A reactive, zero-runtime dashboard styled through native CSS compilation:
* **Session Guarding**: Constantly evaluates stateful authentication parameters to dynamically mount route layouts and store active tokens safely inside `localStorage`.
* **State Synchronization**: Implements isolated data-fetching hooks that wrap network request cycles, protecting components against race conditions and cascading UI re-renders.

---

## 📁 Repository Structure

```text
gigflow/
├── client/                 # React Frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/     # Modulated UI Layouts (Login, Analytics Dashboard)
│   │   ├── services/       # Type-Safe Fetch Wrapper Layer (Token Injection)
│   │   ├── types/          # Strict Global TypeScript Interfaces (index.ts)
│   │   ├── index.css       # Tailwind CSS v4 Root Entry (`@import "tailwindcss"`)
│   │   └── main.tsx        # React DOM Bootstrapper
│   └── tsconfig.json       # Frontend Compiler Directives (`verbatimModuleSyntax`)
│
└── server/                 # Express Backend (Node.js + TypeScript)
    ├── src/
    │   ├── config/         # MongoDB Driver Setup & Life Cycle Event Hooks
    │   ├── middleware/     # JWT Interceptors & RBAC Validation Guards
    │   ├── models/         # Database Schema System Blueprints
    │   └── routes/         # Unified REST Endpoints Mapping Matrix
    └── tsconfig.json       # Backend Environment Typings Configuration
```

---

---

## 🔌 API Endpoints Documentation

All requests to the backend must clear the base route framework: `http://localhost:8080/api`

### 🔑 Authentication Module
* **`POST /auth/register`** - Registers a new user mapping profile.
  * *Request Body*: `{ "name": "Name", "email": "user@test.com", "password": "password", "role": "Manager" }`
* **`POST /auth/login`** - Authenticates credentials and issues a cryptographic session token.
  * *Request Body*: `{ "email": "user@test.com", "password": "password" }`
  * *Response*: `{ "success": true, "token": "JWT_STRING_HERE", "role": "Admin" }`

### 📈 Leads Management Module (JWT Shielded)
* **`GET /leads`** - Fetches paginated sales records (Supports search query parameters `?page=1&limit=10&search=...&status=...&source=...`).
  * *Headers*: `Authorization: Bearer <token>`
* **`POST /leads`** - Creates a fresh pipeline entry.
  * *Headers*: `Authorization: Bearer <token>`
  * *Request Body*: `{ "name": "Lead Name", "email": "lead@email.com", "status": "New", "source": "Website" }`
* **`PUT /leads/:id`** - Mutates an existing lead status inline.
  * *Headers*: `Authorization: Bearer <token>`
  * *Request Body*: `{ "status": "Contacted" }`
* **`DELETE /leads/:id`** - **[ADMIN ONLY]** Deletes a lead record permanently.
  * *Headers*: `Authorization: Bearer <token>`

## ⚡ Local Setup & Deployment

Follow these sequential steps to get the full-stack infrastructure spinning locally on your machine from scratch.

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Community Server running locally on port 27017

---

## 🛠️ Backend Environment Setup

Open your terminal, enter the server context, and install the modules:

```bash
cd server
npm install
```

Create a local environment file named `.env` right in the `server/` root:

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/gigflow
JWT_SECRET=YourSuperSecureImmutableCompilationSecretKey
```

Launch the server under compilation watch mode:

```bash
npm run dev
```

The terminal will confirm:

```text
🚀 Server listening on port 8080
```

---

## 🎨 Frontend Environment Setup

Open a separate terminal tab, move into the client folder, and trigger initialization:

```bash
cd client
npm install
```

Spin up the Vite engine:

```bash
npm run dev
```

The application will boot instantly onto:

```text
http://localhost:5173/
```

---

## 🔑 Pre-Registered Credentials for Review

To evaluate the Role-Based Access Control (RBAC) shielding parameters out of the box, you can authenticate using these two test profiles:

### 1. Admin Account (Full CRUD Privileges)

```text
Email: aaryan.nanda@gigflow.com
Password: SecurePassword123
```

#### Privileges
- Can view data metrics
- Run filters
- Add new entries
- Modify pipeline states inline
- Drop records permanently

---

### 2. Manager Account (Restricted Access)

```text
Email: manager@gigflow.com
Password: SecurePassword123
```

#### Privileges
- Can read records
- Apply filter metrics
- Create entries
- Clicking the Delete button will be blocked by the server, flashing a strict authorization warning

---

## 🚀 Version Control & Repository Synchronization

To commit progress updates or deploy the completed ecosystem safely to your remote GitHub profile, execute this sequence from your absolute project root folder:

```bash
# Stage all updated structural tracks across both layers
git add .

# Log the master deployment save-state commit
git commit -m "feat: finalize full-stack application with rbacs, metrics, and clean documentation"

# Stream the local data blocks live to the cloud stream
git push origin main
```




