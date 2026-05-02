# Zyra — Luxury Leather Goods Management System

> Handcrafted since 1947. Managed with precision since 2026.

Zyra is a full-stack web application that digitises the entire lifecycle of a luxury leather goods brand — from raw material procurement and artisan production tracking, through quality assurance and public store listing, to customer orders and inquiries. It implements the **Digital Twin** concept: every physical bag has a single corresponding software record that follows it from the cutting table to the customer's hands.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Domain Model](#4-domain-model)
5. [API Reference](#5-api-reference)
6. [Design Pattern — Layered Architecture](#6-design-pattern--layered-architecture)
7. [Software Development Prototype](#7-software-development-prototype)
8. [Prerequisites](#8-prerequisites)
9. [Local Development Setup](#9-local-development-setup)
10. [Dockerizing the Application](#10-dockerizing-the-application)
11. [Version Control with Git](#11-version-control-with-git)
12. [Environment Variables](#12-environment-variables)
13. [Project Structure](#13-project-structure)
14. [Coding Standards](#14-coding-standards)
15. [Security Model](#15-security-model)
16. [Software Test Plan](#16-software-test-plan)
17. [Class Diagram Reference](#17-class-diagram-reference)

---

## 1. Project Overview

### Problem Statement
Luxury leather goods ateliers manage complex, multi-stage production workflows across raw materials, skilled artisans, quality control, and customer-facing sales — all typically tracked on paper or in disconnected spreadsheets. This creates traceability gaps, stock miscounts, and no digital record of a bag's provenance.

### Solution
Zyra provides a unified platform with two distinct surfaces:

| Surface | Audience | Purpose |
|---|---|---|
| **Public Landing Page + Store** | Customers | Browse activated listings, place orders, submit inquiries |
| **Artisan Dashboard** | Staff (Admin / Manager / Artisan) | Manage materials, track production stages, QA, list products |

### Core Features
- **Material Vault** — track leather, hardware, and lining stock with low-stock alerts and automatic bag costing
- **Production Pipeline** — move bags through stages: `CUTTING → STITCHING → FINISHING → QA → COMPLETED`
- **Digital Activation** — QA-approved bags receive an OTP; activation unlocks store listing
- **Store Catalog** — public-facing listings with price, currency, and availability toggle
- **Order Management** — customers place orders; staff update status through `PENDING → CONFIRMED → SHIPPED → DELIVERED`
- **Inquiry System** — customers enquire about any listing without needing an account
- **Role-Based Access** — `ADMIN`, `MANAGER`, `ARTISAN` roles with granular endpoint permissions
- **JWT Authentication** — stateless, token-based auth with BCrypt password hashing

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Docker Network                        │
│                                                             │
│  ┌──────────────┐    HTTP/JSON    ┌──────────────────────┐  │
│  │   Frontend   │ ─────────────► │      Backend         │  │
│  │  React 19    │  /api/v1/*      │  Spring Boot 4.0     │  │
│  │  Vite 8      │                 │  Port 8084           │  │
│  │  Nginx 1.27  │                 │                      │  │
│  │  Port 80     │                 │  ┌────────────────┐  │  │
│  └──────────────┘                 │  │  JPA / Hibernate│  │  │
│                                   │  └───────┬────────┘  │  │
│                                   └──────────┼───────────┘  │
│                                              │               │
│                                   ┌──────────▼───────────┐  │
│                                   │     PostgreSQL 16     │  │
│                                   │     Port 5432         │  │
│                                   └──────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

The Nginx container proxies all `/api/` requests to the backend container, so the browser only ever talks to one origin — eliminating CORS issues in production.

---

## 3. Technology Stack

### Backend
| Technology | Version | Role |
|---|---|---|
| Java | 21 (LTS) | Language |
| Spring Boot | 4.0.6 | Application framework |
| Spring Security | 6.x | Authentication & authorisation |
| Spring Data JPA | 3.x | ORM / database abstraction |
| Hibernate | 6.x | JPA implementation |
| PostgreSQL | 16 | Relational database |
| JJWT | 0.12.6 | JWT creation & validation |
| Lombok | latest | Boilerplate reduction |
| SpringDoc OpenAPI | 2.8.9 | Swagger UI / API docs |
| Maven | 3.9 | Build tool |

### Frontend
| Technology | Version | Role |
|---|---|---|
| React | 19.2 | UI library |
| Vite | 8.0 | Build tool & dev server |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client |
| Recharts | 3.x | Dashboard charts |
| Lucide React | 1.x | Icon library |

### Infrastructure
| Technology | Role |
|---|---|
| Docker | Containerisation |
| Docker Compose | Multi-container orchestration |
| Nginx 1.27 | Frontend static file server + API reverse proxy |
| Git | Version control |

---

## 4. Domain Model

```
User ──────────────────────────────────────────────────────────
  id, email, password (BCrypt), fullName, role, enabled

Material ──────────────────────────────────────────────────────
  id, name, category, stockQuantity, unit, lowStockThreshold,
  unitCost, provenance

Product (Digital Twin) ────────────────────────────────────────
  id, sku (KRN-YYYY-NNN), name, atelierSite, currentStage,
  activated, activationOtp, qaPhotoPath, materialCost
  ├── StageLog[]   (stage, notes, timestamp, changedBy)
  └── OwnershipRecord[]  (ownerName, transferredAt)

StoreListing ──────────────────────────────────────────────────
  id, product (1:1), title, description, price, currency,
  imagePaths, available

Order ─────────────────────────────────────────────────────────
  id, reference (ORD-YYYYNNNN), listing, customerName,
  customerEmail, customerPhone, deliveryMethod, deliveryAddress,
  totalAmount, currency, status (PENDING→DELIVERED)

Inquiry ───────────────────────────────────────────────────────
  id, listing, senderName, senderEmail, senderPhone,
  message, reply, status (OPEN/CLOSED)
```

**Relationships:**
- One `Product` → many `StageLog` (production audit trail)
- One `Product` → many `OwnershipRecord` (provenance chain)
- One `Product` → one `StoreListing` (only activated products)
- One `StoreListing` → many `Order`
- One `StoreListing` → many `Inquiry`

---

## 5. API Reference

Base URL: `http://localhost:8084/api/v1`  
Swagger UI: `http://localhost:8084/api/v1/swagger-ui.html`

### Public Endpoints (no auth required)
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/store` | List all available store listings |
| GET | `/store/{id}` | Get a single listing |
| POST | `/orders` | Place a customer order |
| GET | `/orders/track/{reference}` | Track order by reference |
| POST | `/inquiries` | Submit a product inquiry |

### Protected Endpoints (JWT required)
| Method | Path | Role | Description |
|---|---|---|---|
| GET | `/dashboard/summary` | ADMIN, MANAGER | KPI summary cards |
| GET/POST/PUT | `/products/**` | Authenticated | Manage products |
| GET/POST/PUT/DELETE | `/materials/**` | ADMIN (mutations) | Material vault |
| GET/PUT | `/orders/**` | Authenticated | Order management |
| GET/PUT | `/inquiries/**` | Authenticated | Inquiry management |
| POST/PUT | `/store/**` | ADMIN, MANAGER | Store listing management |

---

## 6. Design Pattern — Layered Architecture

Zyra's backend strictly follows the **Layered Architecture (n-tier)** pattern, which separates concerns into four distinct horizontal layers. This is the pattern recommended by Google's Java Style Guide and Spring's own best practices documentation.

```
┌─────────────────────────────────────────┐
│           Controller Layer              │  ← HTTP in/out, DTOs, validation
│  AuthController, ProductController...   │
├─────────────────────────────────────────┤
│            Service Layer                │  ← Business logic, transactions
│  AuthService, ProductService...         │
├─────────────────────────────────────────┤
│          Repository Layer               │  ← Data access, JPA queries
│  ProductRepository, OrderRepository...  │
├─────────────────────────────────────────┤
│            Domain Layer                 │  ← JPA entities, enums
│  Product, Order, Material, User...      │
└─────────────────────────────────────────┘
```

**How it is applied in Zyra:**

- **Controller** (`/controller`) — receives HTTP requests, validates input via `@Valid`, maps to/from DTOs, delegates to service. Never contains business logic.
- **Service** (`/service`) — owns all business rules (e.g. "a product must be activated before it can be listed", "OTP must match before activation"). Annotated with `@Transactional`.
- **Repository** (`/repository`) — extends `JpaRepository<T, ID>`. Only data access; no logic.
- **Domain** (`/domain`) — pure JPA entities with no Spring dependencies. Entities are annotated with `@Entity`, relationships declared with `@OneToMany`, `@ManyToOne`, etc.
- **DTO** (`/dto`) — separate request/response objects prevent exposing internal entity structure to the API surface.

**Why this pattern:**
1. Each layer can be tested in isolation (unit tests for services, integration tests for repositories).
2. Changing the database (e.g. PostgreSQL → MySQL) only affects the repository layer.
3. Changing the API format (e.g. REST → GraphQL) only affects the controller layer.
4. Enforces the Single Responsibility Principle at the architectural level.

**Secondary pattern — Repository Pattern:**  
All data access goes through Spring Data JPA repository interfaces. This abstracts the persistence mechanism and allows the service layer to work with domain objects without knowing SQL.

---

## 7. Software Development Prototype

### Prototype Scope
The prototype covers the complete vertical slice of the most critical user journey: **an artisan creates a bag → QA activates it → it appears in the public store → a customer enquires about it**.

### Prototype Modules

#### Module 1 — Authentication
- JWT-based login/register
- BCrypt password hashing
- Role assignment at registration (`ADMIN`, `MANAGER`, `ARTISAN`)
- Stateless session (no server-side session storage)

#### Module 2 — Material Vault
- CRUD for raw materials (leather, hardware, lining)
- Stock quantity tracking with unit of measure
- Low-stock threshold alerts surfaced on the dashboard
- Unit cost used for automatic bag material costing

#### Module 3 — Production Pipeline
- Create a product with auto-generated SKU (`KRN-YYYY-NNN`)
- Advance through stages: `CUTTING → STITCHING → FINISHING → QA → COMPLETED`
- Each stage transition logged with timestamp and notes (full audit trail)
- QA stage: upload photo evidence, generate activation OTP

#### Module 4 — Digital Activation
- Artisan enters OTP to activate a completed bag
- Activation unlocks the ability to create a `StoreListing`
- OTP cleared from database after successful use

#### Module 5 — Store & Public Catalog
- Manager creates a `StoreListing` for an activated product
- Public `GET /store` returns all available listings (no auth)
- Listing includes title, description, price, currency, images

#### Module 6 — Orders
- Customer places order via `POST /orders` (no auth required)
- Auto-generated reference number (`ORD-YYYYNNNN`)
- Staff update status: `PENDING → CONFIRMED → SHIPPED → DELIVERED`
- Customer can track order by reference number

#### Module 7 — Inquiries
- Customer submits inquiry on any listing (no auth required)
- Fields: name, email, phone (optional), message
- Staff view, reply, and close inquiries from the dashboard

#### Module 8 — Dashboard
- KPI cards: total products, active listings, pending orders, open inquiries
- Low-stock material alerts
- Recent activity feed

### Prototype UI Screens

| Screen | Route | Access |
|---|---|---|
| Landing Page | `/` | Public |
| Store Catalog | `/store` | Public |
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/dashboard` | Authenticated |
| Atelier (Products) | `/products` | Authenticated |
| Material Vault | `/materials` | Authenticated |
| Orders | `/orders` | Authenticated |
| Inquiries | `/inquiries` | Authenticated |
| Settings | `/settings` | Authenticated |

### Programming Best Practices Applied

**Backend (Google Java Style Guide):**
- 2-space indentation, 100-column line limit
- `camelCase` for methods and variables, `PascalCase` for classes
- `UPPER_SNAKE_CASE` for constants and enum values
- Javadoc on all public classes and non-trivial methods
- No wildcard imports
- `@NotNull`, `@NotBlank`, `@Valid` on all controller inputs
- `Optional<T>` used in repositories; `ResourceNotFoundException` thrown when entity not found
- Lombok `@Getter`, `@Setter`, `@NoArgsConstructor` to eliminate boilerplate

**Frontend (Google JavaScript Style Guide):**
- `const` over `let`; never `var`
- Arrow functions for callbacks
- Destructuring for props and state
- `PascalCase` for React components, `camelCase` for functions and variables
- Single-responsibility components — each component does one thing
- `useEffect` cleanup functions to prevent memory leaks
- `aria-label` and semantic HTML for accessibility
- `loading="lazy"` on all non-critical images; `fetchpriority="high"` on LCP image

---

## 8. Prerequisites

| Tool | Minimum Version | Check |
|---|---|---|
| Docker Desktop | 24.x | `docker --version` |
| Docker Compose | 2.x (bundled) | `docker compose version` |
| Git | 2.x | `git --version` |
| Node.js (dev only) | 20 LTS | `node --version` |
| Java JDK (dev only) | 21 | `java --version` |

---

## 9. Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-org/Zyra.git
cd Zyra
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env and set DB_PASSWORD and JWT_SECRET
```

### 3. Start the database
```bash
docker compose up db -d
```

### 4. Run the backend
```bash
cd backend/Zyra
./mvnw spring-boot:run
# API available at http://localhost:8084/api/v1
# Swagger UI at http://localhost:8084/api/v1/swagger-ui.html
```

### 5. Run the frontend
```bash
cd frontend
npm install
npm run dev
# App available at http://localhost:5173
```

---

## 10. Dockerizing the Application

### What is Docker?
Docker is a containerisation platform that packages an application and all its dependencies (runtime, libraries, OS packages, configuration) into a single portable unit called a **container**. Containers run identically on any machine that has Docker installed — eliminating "works on my machine" problems.

### Dockerization Process

**Step 1 — Write a Dockerfile for each service**

A `Dockerfile` is a text file with instructions for building a Docker image. Zyra uses **multi-stage builds** to keep production images small:

- **Backend Dockerfile** (`backend/Zyra/Dockerfile`):
  - Stage 1 (`builder`): Uses `eclipse-temurin:21-jdk-alpine` to compile the Spring Boot app with Maven into a fat JAR.
  - Stage 2 (`runtime`): Uses `eclipse-temurin:21-jre-alpine` (smaller, no compiler) and copies only the JAR. Runs as a non-root user `Zyra` for security.

- **Frontend Dockerfile** (`frontend/Dockerfile`):
  - Stage 1 (`builder`): Uses `node:20-alpine` to install dependencies and run `npm run build`, producing a static `dist/` folder.
  - Stage 2 (`serve`): Uses `nginx:1.27-alpine` to serve the static files. An `nginx.conf` proxies `/api/` calls to the backend container.

**Step 2 — Write docker-compose.yml**

`docker-compose.yml` at the project root defines three services:

| Service | Image | Port |
|---|---|---|
| `db` | `postgres:16-alpine` | 5432 (internal) |
| `backend` | Built from `backend/Zyra/Dockerfile` | 8084 |
| `frontend` | Built from `frontend/Dockerfile` | 80 |

All three share a private Docker bridge network (`Zyra_net`). The backend waits for the database to pass its health check before starting. Persistent data is stored in named Docker volumes (`postgres_data`, `uploads_data`).

**Step 3 — Build and run**

```bash
# From the project root
cp .env.example .env
# Fill in DB_PASSWORD and JWT_SECRET in .env

docker compose up --build
```

The `--build` flag forces Docker to rebuild all images. On subsequent runs, omit it to use cached layers.

**Step 4 — Verify**

| URL | Expected |
|---|---|
| `http://localhost` | Zyra landing page |
| `http://localhost/api/v1/store` | JSON array of store listings |
| `http://localhost:8084/api/v1/swagger-ui.html` | Swagger UI |

**Step 5 — Stop**
```bash
docker compose down          # stop containers, keep volumes
docker compose down -v       # stop containers AND delete volumes (resets DB)
```

### Useful Docker Commands
```bash
docker compose logs -f backend     # stream backend logs
docker compose logs -f frontend    # stream frontend logs
docker compose ps                  # list running containers
docker exec -it Zyra_db psql -U postgres -d Zyra   # open DB shell
docker compose restart backend     # restart one service
```

---

## 11. Version Control with Git

### What is Git?
Git is a distributed Version Control System (VCS) that tracks every change made to source code. It allows multiple developers to work on the same codebase simultaneously, maintains a complete history of all changes, and enables reverting to any previous state.

### Initial Setup

**Install Git:**
- Windows: Download from https://git-scm.com/download/win
- macOS: `brew install git`
- Linux: `sudo apt install git`

**Configure identity (one-time):**
```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global core.autocrlf input   # normalise line endings
```

### Initialising the Repository
```bash
cd Zyra
git init
git add .
git commit -m "feat: initial project scaffold"
```

### Branching Strategy

Zyra follows **GitHub Flow** — a lightweight branching model suitable for continuous delivery:

```
main ──────────────────────────────────────────────────► (production)
       │                    │
       ├─ feat/inquiry-modal ──► PR ──► merge to main
       ├─ feat/docker-setup  ──► PR ──► merge to main
       └─ fix/cta-routes     ──► PR ──► merge to main
```

| Branch prefix | Purpose |
|---|---|
| `feat/` | New features |
| `fix/` | Bug fixes |
| `chore/` | Config, tooling, dependencies |
| `docs/` | Documentation only |

### Daily Workflow
```bash
# Start a new feature
git checkout -b feat/your-feature-name

# Stage and commit changes
git add .
git commit -m "feat: add inquiry modal with backend integration"

# Push to remote
git push origin feat/your-feature-name

# After PR is merged, update local main
git checkout main
git pull origin main
```

### Commit Message Convention (Conventional Commits)
```
<type>(<scope>): <short description>

feat(store): add pagination to store catalog
fix(auth): handle expired JWT gracefully
chore(docker): add multi-stage backend Dockerfile
docs(readme): add API reference table
```

### What Git Captures in This Project
- All Java source files (`src/main/java/**`)
- All React source files (`src/**`)
- Configuration files (`pom.xml`, `package.json`, `vite.config.js`, `application.properties`)
- Docker files (`Dockerfile`, `docker-compose.yml`, `nginx.conf`)
- Documentation (`README.md`)
- `.gitignore` ensures secrets (`.env`), compiled output (`target/`, `dist/`), and dependencies (`node_modules/`) are never committed

### Connecting to a Remote Repository
```bash
git remote add origin https://github.com/your-org/Zyra.git
git branch -M main
git push -u origin main
```

---

## 12. Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `JWT_SECRET` | Yes | HMAC-SHA256 signing key (min 32 chars) |
| `JWT_EXPIRATION_MS` | No | Token TTL in ms (default: 86400000 = 24h) |

Create a `.env` file at the project root (never commit it):
```bash
cp .env.example .env
```

---

## 13. Project Structure

```
Zyra/
├── backend/
│   └── Zyra/
│       ├── src/main/java/com/auca/Zyra/
│       │   ├── config/          # Security, OpenAPI, AppProperties
│       │   ├── controller/      # REST controllers (HTTP layer)
│       │   ├── domain/          # JPA entities + enums
│       │   ├── dto/             # Request/response DTOs
│       │   ├── exception/       # GlobalExceptionHandler
│       │   ├── repository/      # Spring Data JPA interfaces
│       │   ├── security/        # JWT filter, JwtUtil, UserDetailsService
│       │   └── service/         # Business logic
│       ├── src/main/resources/
│       │   └── application.properties
│       ├── Dockerfile
│       └── pom.xml
│
├── frontend/
│   ├── public/                  # favicon, icons
│   ├── src/
│   │   ├── api/                 # Axios client + service functions
│   │   ├── assets/              # Images, video
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # React context (Auth, Notification, Sidebar)
│   │   ├── pages/               # Route-level page components
│   │   ├── App.jsx              # Router setup
│   │   ├── index.css            # Global CSS variables + resets
│   │   └── main.jsx             # React entry point
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html               # SEO meta tags, OG tags
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml           # Orchestrates db + backend + frontend
├── .env.example                 # Template for environment variables
├── .gitignore
└── README.md
```

---

## 14. Coding Standards

### Java — Google Java Style Guide
- **Indentation**: 2 spaces (no tabs)
- **Line length**: max 100 characters
- **Naming**: `camelCase` methods/variables, `PascalCase` classes, `UPPER_SNAKE_CASE` constants
- **Braces**: Egyptian style — opening brace on same line
- **Imports**: no wildcard imports; static imports only for test assertions
- **Annotations**: one per line, above the declaration
- **Null safety**: `Optional<T>` from repositories; never return `null` from service methods

### JavaScript/React — Google JavaScript Style Guide
- **Quotes**: single quotes for strings
- **Semicolons**: omitted (ASI)
- **Variables**: `const` by default; `let` only when reassignment is needed
- **Components**: one component per file, named with `PascalCase`
- **Props**: destructured in function signature
- **Effects**: always include dependency arrays; always return cleanup functions when subscribing

---

## 15. Security Model

| Concern | Implementation |
|---|---|
| Password storage | BCrypt with default cost factor (10) |
| Authentication | Stateless JWT — no server-side sessions |
| Token signing | HMAC-SHA256 with configurable secret |
| Token expiry | Configurable via `JWT_EXPIRATION_MS` (default 24h) |
| Authorisation | Spring Security method-level `@PreAuthorize` + URL-level rules |
| CORS | Configured in `SecurityConfig` — restrict `allowedOriginPatterns` in production |
| SQL injection | Prevented by JPA/Hibernate parameterised queries |
| Secrets | Never in source code — loaded from `.env` at runtime |
| Container security | Backend runs as non-root user `Zyra` inside container |
| Input validation | `@Valid` + Bean Validation annotations on all DTOs |

## 16. Software Test Plan

Zyra is tested through a mix of automated and manual checks so that both the backend rules and the user-facing workflows are verified.

### Testing approach
- `Unit tests` verify service logic, utility methods, and enum-based business rules.
- `Integration tests` verify controllers, repositories, security rules, and PostgreSQL persistence together.
- `UI tests` verify the main customer and staff journeys in the browser.
- `Regression tests` are re-run after any fix to protect the most important flows: authentication, production tracking, store listings, orders, and inquiries.

### Coverage summary

| Area | What is tested | Priority |
|---|---|---|
| Authentication | Registration, login, password hashing, JWT generation | High |
| Security | Public vs protected endpoints, role restrictions | High |
| Materials | Create/update stock, low-stock logic, persistence | High |
| Products | SKU generation, stage progression, audit logs, activation | High |
| Store | Listing creation, public browsing, availability toggle | High |
| Orders | Order placement, status updates, order tracking | High |
| Inquiries | Public submission, reply, close workflow | Medium |
| Dashboard | KPI totals, recent activity, alert values | Medium |
| Frontend | Form validation, loading states, API response handling | Medium |

### Current baseline
The current automated baseline is the Spring Boot context-load test in `backend/zyra/src/test/java/com/auca/zyra/ZyraApplicationTests.java`. This proves the application boots successfully, and the plan above defines the deeper testing that should be added to fully verify the software.

### Detailed plan
The full test plan is documented in [docs/software-test-plan.md](./docs/software-test-plan.md).

## 17. Class Diagram Reference

The class diagram for Zyra should focus on the backend domain model, because that is where the business rules and relationships live.

### Core classes to include

| Class | Key attributes | Notes |
|---|---|---|
| `User` | `id`, `email`, `password`, `fullName`, `role`, `enabled`, `createdAt` | Implements Spring Security `UserDetails` |
| `Material` | `id`, `name`, `category`, `stockQuantity`, `unit`, `lowStockThreshold`, `unitCost`, `provenance` | Has `isLowStock()` behaviour |
| `Product` | `id`, `sku`, `name`, `atelierSite`, `currentStage`, `activated`, `activationOtp`, `qaPhotoPath`, `materialCost`, `createdAt`, `completedAt` | Main digital-twin entity |
| `StageLog` | `id`, `stage`, `signedAt`, `notes` | Audit trail for product stage changes |
| `OwnershipRecord` | `id`, `holderName`, `holderType`, `transferredAt`, `notes` | Ownership history for a product |
| `StoreListing` | `id`, `title`, `description`, `price`, `currency`, `imagePaths`, `available`, `listedAt` | Public shop listing for an activated product |
| `Order` | `id`, `reference`, `customerName`, `customerEmail`, `customerPhone`, `deliveryMethod`, `deliveryAddress`, `deliveryCity`, `deliveryCountry`, `postalCode`, `notes`, `totalAmount`, `currency`, `status`, `placedAt`, `updatedAt` | Captures the customer order lifecycle |
| `Inquiry` | `id`, `senderName`, `senderEmail`, `senderPhone`, `message`, `reply`, `repliedAt`, `status`, `submittedAt` | Public customer inquiry |

### Enums to include
- `Role` with values `ROLE_ADMIN`, `ROLE_MANAGER`, `ROLE_ARTISAN`, `ROLE_QA`
- `ProductStage` with values `CUTTING`, `STITCHING`, `HARDWARE`, `QA`, `ARCHIVE_READY`
- `OrderStatus` with values `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### Relationships and multiplicity

| Source | Relationship | Target | Multiplicity | Meaning |
|---|---|---|---|---|
| `Product` | has many | `StageLog` | `1 to 0..*` | A product keeps a stage audit trail |
| `Product` | has many | `OwnershipRecord` | `1 to 0..*` | A product keeps ownership history |
| `Product` | has one | `StoreListing` | `1 to 0..1` | Only activated products may be listed |
| `StageLog` | belongs to | `Product` | `1 to 1` | Every stage log points to one product |
| `StageLog` | signed by | `User` | `1 to 1` | Every stage log is created by one staff user |
| `OwnershipRecord` | belongs to | `Product` | `1 to 1` | Each ownership record belongs to one product |
| `StoreListing` | references | `Product` | `1 to 1` | The listing wraps one activated product |
| `StoreListing` | has many | `Order` | `1 to 0..*` | A listing can receive many orders |
| `StoreListing` | has many | `Inquiry` | `1 to 0..*` | A listing can receive many inquiries |

### Diagram notes
- Use `Product` as the central class because it connects production, activation, ownership, and sales.
- Show `StageLog` and `OwnershipRecord` as composition or strong aggregation from `Product`.
- Keep DTOs, controllers, services, and repositories out of the main class diagram unless your lecturer wants architecture as well as domain classes.
- Add stereotypes or notes for `UserDetails`, `@Entity`, and the role-based security behaviour if the diagram tool supports them.
- If you want a fuller academic submission, you can create a second diagram for the layered architecture: Controller -> Service -> Repository -> Domain.

### Suggested drawing order
1. Draw `Product` in the centre.
2. Connect `StageLog`, `OwnershipRecord`, and `StoreListing` to `Product`.
3. Connect `Order` and `Inquiry` to `StoreListing`.
4. Place `User` near `StageLog` because it signs production records.
5. Add the enums beside the classes that use them.

---

