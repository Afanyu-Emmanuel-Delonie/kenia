# Kenia — Luxury Leather Goods Management System

> Handcrafted since 1947. Managed with precision since 2026.

Kenia is a full-stack web application that digitises the complete lifecycle of a luxury leather goods brand — from raw material procurement and artisan production tracking, through quality assurance and digital activation, to public store listings, customer orders, and inquiries.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Domain Model](#4-domain-model)
5. [API Reference](#5-api-reference)
6. [Security Model](#6-security-model)
7. [Prerequisites](#7-prerequisites)
8. [Local Development](#8-local-development)
9. [Docker Deployment](#9-docker-deployment)
10. [Render Deployment](#10-render-deployment)
11. [Environment Variables](#11-environment-variables)
12. [Project Structure](#12-project-structure)
13. [Design Patterns](#13-design-patterns)
14. [Coding Standards](#14-coding-standards)
15. [Database Seeding](#15-database-seeding)
16. [Git Workflow](#16-git-workflow)

---

## 1. Overview

### Problem
Luxury leather goods ateliers manage complex multi-stage production workflows across raw materials, skilled artisans, quality control, and customer-facing sales — typically tracked on paper or in disconnected spreadsheets. This creates traceability gaps, stock miscounts, and no digital record of a bag's provenance.

### Solution
Kenia provides a unified platform with two distinct surfaces:

| Surface | Audience | Purpose |
|---|---|---|
| **Public Landing + Store** | Customers | Browse listings, place orders, submit inquiries |
| **Artisan Dashboard** | Staff (Admin) | Manage materials, track production, QA, list products |

### Core Features

| Feature | Description |
|---|---|
| **Material Vault** | Track leather, hardware, and lining stock with low-stock alerts |
| **Production Pipeline** | Move bags through `CUTTING → STITCHING → HARDWARE → QA → ARCHIVE_READY` |
| **Digital Activation** | QA-approved bags receive an OTP; activation unlocks store listing |
| **Store Catalog** | Public-facing listings with price, currency, and availability toggle |
| **Order Management** | `PENDING → CONFIRMED → SHIPPED → DELIVERED` lifecycle |
| **Inquiry System** | Customer inquiries with WhatsApp and email reply shortcuts |
| **JWT Authentication** | Stateless token-based auth with BCrypt password hashing |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Network                        │
│                                                             │
│  ┌──────────────┐    HTTP/JSON    ┌──────────────────────┐  │
│  │   Frontend   │ ─────────────► │      Backend         │  │
│  │  React 19    │  /api/v1/*      │  Spring Boot         │  │
│  │  Vite 8      │                 │  Port 8084           │  │
│  │  Nginx 1.27  │                 │                      │  │
│  │  Port 80     │                 │  ┌────────────────┐  │  │
│  └──────────────┘                 │  │ JPA/Hibernate  │  │  │
│                                   │  └───────┬────────┘  │  │
│                                   └──────────┼───────────┘  │
│                                              │               │
│                                   ┌──────────▼───────────┐  │
│                                   │     PostgreSQL 16     │  │
│                                   │     Port 5432         │  │
│                                   └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

The Nginx container proxies all `/api/` requests to the backend, so the browser talks to one origin — eliminating CORS issues in production.

---

## 3. Technology Stack

### Backend

| Technology | Version | Role |
|---|---|---|
| Java | 21 LTS | Language |
| Spring Boot | 4.x | Application framework |
| Spring Security | 6.x | Authentication & authorisation |
| Spring Data JPA | 3.x | ORM / database abstraction |
| Hibernate | 6.x | JPA implementation |
| PostgreSQL | 16 | Relational database |
| JJWT | 0.12.x | JWT creation & validation |
| Lombok | latest | Boilerplate reduction |
| SpringDoc OpenAPI | 2.x | Swagger UI |
| Maven | 3.9 | Build tool |

### Frontend

| Technology | Version | Role |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Build tool & dev server |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Recharts | 3.x | Dashboard charts |
| Lucide React | 1.x | Icon library |

### Infrastructure

| Technology | Role |
|---|---|
| Docker | Containerisation |
| Docker Compose | Multi-container orchestration |
| Nginx 1.27 | Static file server + API reverse proxy |
| Render | Cloud hosting (backend + PostgreSQL + frontend) |

---

## 4. Domain Model

```
User
  id, email, password (BCrypt), fullName, role, enabled, createdAt

Material
  id, name, category, stockQuantity, unit, lowStockThreshold, unitCost, provenance

Product  ← Digital Twin
  id, sku (KRN-YYYY-NNN), name, atelierSite, currentStage,
  activated, activationOtp, qaPhotoPath, materialCost, createdAt, completedAt
  ├── StageLog[]        (stage, notes, signedAt, signedBy)
  └── OwnershipRecord[] (holderName, holderType, transferredAt)

StoreListing
  id, product (1:1), title, description, price, currency, imagePaths, available

Order
  id, reference (ORD-YYYY-NNNN), listing, customerName, customerEmail,
  customerPhone, deliveryMethod, deliveryAddress, totalAmount, currency,
  status (PENDING→DELIVERED), placedAt

Inquiry
  id, listing, senderName, senderEmail, senderPhone,
  message, reply, status (OPEN/CLOSED), submittedAt
```

**Relationships:**

| Source | Relationship | Target |
|---|---|---|
| `Product` | has many | `StageLog` |
| `Product` | has many | `OwnershipRecord` |
| `Product` | has one | `StoreListing` |
| `StoreListing` | has many | `Order` |
| `StoreListing` | has many | `Inquiry` |

---

## 5. API Reference

**Base URL (local):** `http://localhost:8084/api/v1`  
**Swagger UI:** `http://localhost:8084/api/v1/swagger-ui.html`

### Public Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new admin user |
| `POST` | `/auth/login` | Login, returns JWT |
| `GET` | `/store` | List available store listings |
| `GET` | `/store/{id}` | Get a single listing |
| `GET` | `/store/all` | List all listings (staff) |
| `POST` | `/orders` | Place a customer order |
| `GET` | `/orders/track/{reference}` | Track order by reference |
| `POST` | `/inquiries` | Submit a product inquiry |

### Protected Endpoints (JWT required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/dashboard/summary` | KPI summary |
| `GET/POST/DELETE` | `/products/**` | Manage products |
| `GET/POST/PATCH/DELETE` | `/materials/**` | Material vault |
| `GET/PATCH` | `/orders/**` | Order management |
| `GET/POST/DELETE` | `/inquiries/**` | Inquiry management |
| `POST/PUT/DELETE` | `/store/**` | Store listing management |

---

## 6. Security Model

| Concern | Implementation |
|---|---|
| Password storage | BCrypt (cost factor 10) |
| Authentication | Stateless JWT — no server-side sessions |
| Token signing | HMAC-SHA256 with configurable secret |
| Token expiry | Configurable via `JWT_EXPIRATION_MS` (default 24h) |
| CORS | Configured in `SecurityConfig` |
| SQL injection | Prevented by JPA parameterised queries |
| Secrets | Never in source — loaded from `.env` at runtime |
| Container security | Backend runs as non-root user inside container |
| Input validation | `@Valid` + Bean Validation on all DTOs |

---

## 7. Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Docker Desktop | 24.x | `docker --version` |
| Docker Compose | 2.x | `docker compose version` |
| Git | 2.x | `git --version` |
| Node.js (dev only) | 20 LTS | `node --version` |
| Java JDK (dev only) | 21 | `java --version` |

---

## 8. Local Development

### 1. Clone

```bash
git clone https://github.com/your-org/kenia.git
cd kenia
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env — set DB_PASSWORD and JWT_SECRET
```

### 3. Start the database

```bash
docker compose up db -d
```

### 4. Run the backend

```bash
cd backend/kenia
./mvnw spring-boot:run
# API: http://localhost:8084/api/v1
# Swagger: http://localhost:8084/api/v1/swagger-ui.html
```

### 5. Run the frontend

```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

---

## 9. Docker Deployment

### Build and run all services

```bash
cp .env.example .env
# Fill in DB_PASSWORD and JWT_SECRET

docker compose up --build
```

### Verify

| URL | Expected |
|---|---|
| `http://localhost` | Kenia landing page |
| `http://localhost/api/v1/store` | JSON array of listings |
| `http://localhost:8084/api/v1/swagger-ui.html` | Swagger UI |

### Useful commands

```bash
docker compose logs -f backend        # stream backend logs
docker compose logs -f frontend       # stream frontend logs
docker compose ps                     # list running containers
docker exec -it kenia_db psql -U postgres -d kenia
docker compose down                   # stop, keep volumes
docker compose down -v                # stop and delete volumes
```

---

## 10. Render Deployment

Render does not support Docker Compose directly. Deploy each service separately.

### Services to create

| Service | Type | Source |
|---|---|---|
| `kenia-db` | PostgreSQL (managed) | Render-managed |
| `kenia-backend` | Web Service (Docker) | `backend/kenia/Dockerfile` |
| `kenia-frontend` | Static Site | `frontend/` |

### Backend environment variables

| Key | Value |
|---|---|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://<host>:5432/<db>` |
| `SPRING_DATASOURCE_USERNAME` | from Render DB credentials |
| `SPRING_DATASOURCE_PASSWORD` | from Render DB credentials |
| `JWT_SECRET` | min 32-character secret |
| `JWT_EXPIRATION_MS` | `86400000` |
| `UPLOAD_DIR` | `uploads` |

### Frontend environment variables

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://kenia-backend.onrender.com/api/v1` |

Add a rewrite rule on the Static Site: `/* → /index.html` (Rewrite).

---

## 11. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `JWT_SECRET` | Yes | HMAC-SHA256 signing key (min 32 chars) |
| `JWT_EXPIRATION_MS` | No | Token TTL in ms (default: `86400000`) |
| `UPLOAD_DIR` | No | File upload directory (default: `uploads`) |
| `PORT` | No | Server port — Render injects this automatically |

---

## 12. Project Structure

```
kenia/
├── backend/
│   └── kenia/
│       ├── src/main/java/com/auca/zyra/
│       │   ├── config/          # Security, OpenAPI, DataSeeder
│       │   ├── controller/      # REST controllers
│       │   ├── domain/          # JPA entities + enums
│       │   ├── dto/             # Request/response DTOs
│       │   ├── exception/       # GlobalExceptionHandler
│       │   ├── repository/      # Spring Data JPA interfaces
│       │   ├── security/        # JWT filter, JwtUtil
│       │   └── service/         # Business logic
│       ├── src/main/resources/
│       │   └── application.properties
│       ├── Dockerfile
│       └── pom.xml
│
├── frontend/
│   ├── public/assets/           # Images, video
│   ├── src/
│   │   ├── api/                 # Axios client + service functions
│   │   ├── components/          # Reusable UI components
│   │   │   └── auth/            # Auth-specific components
│   │   ├── context/             # React context (Auth, Notification, Sidebar)
│   │   ├── hooks/               # Custom hooks (useReveal)
│   │   ├── pages/               # Route-level page components
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── inquiries/
│   │   │   ├── materials/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── settings/
│   │   │   └── store/
│   │   ├── utils/               # API base URL, asset helpers
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   └── package.json
│
├── docs/
│   └── software-test-plan.md
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 13. Design Patterns

### Layered Architecture (n-tier)

```
┌─────────────────────────────────────────┐
│           Controller Layer              │  HTTP in/out, DTOs, validation
├─────────────────────────────────────────┤
│            Service Layer                │  Business logic, transactions
├─────────────────────────────────────────┤
│          Repository Layer               │  Data access, JPA queries
├─────────────────────────────────────────┤
│            Domain Layer                 │  JPA entities, enums
└─────────────────────────────────────────┘
```

- **Controller** — receives HTTP requests, validates input via `@Valid`, delegates to service. No business logic.
- **Service** — owns all business rules. Annotated with `@Transactional`.
- **Repository** — extends `JpaRepository<T, ID>`. Data access only.
- **Domain** — pure JPA entities with no Spring dependencies.
- **DTO** — separate request/response objects prevent exposing entity internals.

### Repository Pattern
All data access goes through Spring Data JPA interfaces, abstracting the persistence mechanism from the service layer.

### Digital Twin
Every physical bag has exactly one corresponding `Product` record that follows it from the cutting table to the customer's hands.

---

## 14. Coding Standards

### Java (Google Java Style Guide)
- 2-space indentation, 100-column line limit
- `camelCase` methods/variables, `PascalCase` classes, `UPPER_SNAKE_CASE` constants
- No wildcard imports
- `Optional<T>` from repositories; `ResourceNotFoundException` when not found
- `@NotNull`, `@NotBlank`, `@Valid` on all controller inputs

### JavaScript/React (Google JavaScript Style Guide)
- `const` by default; `let` only when reassignment is needed
- Arrow functions for callbacks
- `PascalCase` components, `camelCase` functions and variables
- Single-responsibility components
- `useEffect` cleanup functions to prevent memory leaks

---

## 15. Database Seeding

The application auto-seeds on first startup via `DataSeeder` (implements `ApplicationRunner`). It checks `userRepository.count() > 0` before running — safe to deploy on Render.

### Seeded data

| Type | Count | Details |
|---|---|---|
| Users | 1 | `admin@kenia.com` / `Admin2026!` |
| Materials | 10 | Leathers, hardware, lining, thread |
| Products | 8 | 3 activated + 5 in production |
| Store listings | 3 | One per activated product |

> **Note:** Change the admin password immediately after first login in production.

---

## 16. Git Workflow

This project follows **GitHub Flow**:

```
main ──────────────────────────────────────────► (production)
       │
       ├─ feat/inquiry-modal ──► PR ──► merge
       ├─ fix/security-config  ──► PR ──► merge
       └─ chore/docker-setup   ──► PR ──► merge
```

### Branch prefixes

| Prefix | Purpose |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Config, tooling, dependencies |
| `docs/` | Documentation only |

### Commit convention (Conventional Commits)

```
feat(store): add delete listing endpoint
fix(security): allow GET /store/all without auth
chore(docker): tune HikariCP pool size for Render free tier
docs(readme): add Render deployment section
```

---

## Licence

Private — all rights reserved. © 2026 Kenia Atelier.
