# [Project Name] - Implementation Plan

> **Design Reference**: [Link to Figma / wireframes / mockups]
> **Package Manager**: [npm / bun / pnpm / yarn]
> **Branch**: `feat/phase-1-foundation`

---

## Project Overview

<!-- 2-3 sentences describing WHAT this project is and WHO it's for. -->

[Brief description of the project, its purpose, and the problem it solves.]

### Key Deliverables
<!-- List the main things this project will produce -->
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | [Node.js / Bun / Deno] |
| **Framework** | [Next.js / Remix / Nuxt / SvelteKit] (version) |
| **Language** | [TypeScript / JavaScript] |
| **Database** | [PostgreSQL / MySQL / MongoDB / SQLite] ([provider]) |
| **ORM** | [Prisma / Drizzle / TypeORM / none] |
| **UI Components** | [shadcn/ui / Radix / Headless UI / MUI] |
| **Styling** | [Tailwind CSS / CSS Modules / Styled Components] |
| **Forms** | [React Hook Form + Zod / Formik + Yup / native] |
| **State** | [TanStack Query / SWR / Zustand / Redux] |
| **Auth** | [NextAuth / Clerk / Lucia / Supabase Auth / custom] |
| **Payments** | [Stripe / Lemon Squeezy / Paddle / none] |
| **Storage** | [S3 / Supabase Storage / Cloudflare R2 / Vercel Blob] |
| **Deployment** | [Vercel / Netlify / AWS / Fly.io / Railway] |

---

## Phase 1: Foundation & Project Setup
**Duration**: [X-Y days] | **Priority**: Critical

### 1.1 Project Initialization
- [ ] Initialize project with framework CLI
  ```bash
  # Example: replace with your actual init command
  bunx create-next-app . --typescript --tailwind --eslint --app --src-dir
  ```
- [ ] Configure package manager settings
- [ ] Set up path aliases in `tsconfig.json`
- [ ] Configure linting (ESLint) and formatting (Prettier / Biome)
- [ ] Set up `.env.local` with required environment variables

### 1.2 UI Framework Setup
- [ ] Install and configure styling framework
- [ ] Initialize component library (if applicable)
  ```bash
  # Example
  bunx shadcn@latest init
  ```
- [ ] Install core components needed across the app:
  <!-- List the specific components your project requires -->
  - [Component 1], [Component 2], [Component 3]

### 1.3 Design Tokens / Theme
<!-- Define your project's visual language up front. -->
- [ ] Create global CSS variables or theme config:
  ```css
  :root {
    --background: #ffffff;
    --foreground: #000000;
    --primary: [your brand color];
    --secondary: [your secondary color];
    --muted: [muted color];
    --destructive: [error/danger color];
    --border: [border color];
    --radius: 0.5rem;
  }
  ```

### 1.4 Database Setup
- [ ] Set up database provider / instance
- [ ] Install ORM and configure connection
- [ ] Create initial schema with core models:

```prisma
// Replace with your project's core data models.
// These are the tables everything else depends on.

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Add your other core models here...
```

### 1.5 Project Structure
<!-- Define your folder layout. This acts as a contract for where things go. -->
```
src/
├── app/
│   ├── (auth)/                # Auth-related pages
│   │   ├── login/page.tsx
│   │   └── ...
│   ├── (main)/                # Main app pages (behind auth)
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── ...
│   ├── api/                   # API routes
│   │   ├── auth/
│   │   └── ...
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # Base UI components
│   ├── [feature]/             # Feature-specific components
│   └── ...
├── lib/
│   ├── db.ts                  # Database client singleton
│   ├── auth.ts                # Auth configuration
│   ├── utils.ts               # Shared utilities
│   └── validations/           # Zod schemas / validation
├── hooks/                     # Custom React hooks
├── types/                     # TypeScript type definitions
└── styles/
    └── globals.css
```

### Phase 1 Success Criteria
- [ ] Project runs in dev mode without errors
- [ ] UI components render correctly
- [ ] Database connection works
- [ ] Folder structure is in place

---

## Phase 2: Authentication & Authorization
**Duration**: [X-Y days] | **Priority**: Critical

### 2.1 Auth Provider Setup
- [ ] Install and configure auth library
- [ ] Implement chosen auth strategy (credentials / OAuth / magic link)
- [ ] Create auth middleware for protected routes
- [ ] Implement session management (JWT or database sessions)

### 2.2 Auth Pages
- [ ] **Login Page** (`/login`)
  - [Input fields, validation, error states]
- [ ] **Registration Page** (`/register`) *(if applicable)*
  - [Input fields, validation, success flow]
- [ ] **Forgot Password** (`/forgot-password`) *(if applicable)*
  - [Email input, success message]
- [ ] **Reset Password** (`/reset-password`) *(if applicable)*
  - [New password, confirmation, redirect]

### 2.3 Authorization / Roles
<!-- Define WHO can do WHAT. Tailor to your project's needs. -->
- [ ] Implement permission model:

| Feature | [Role 1] | [Role 2] | [Role 3] | [Admin] |
|---------|----------|----------|----------|---------|
| View dashboard | ✓ | ✓ | ✓ | ✓ |
| Edit content | ✓ | ✓ | ✓ | ✓ |
| Manage settings | ✓ | ✓ | - | ✓ |
| Manage users | ✓ | - | - | ✓ |
| Billing | ✓ | - | - | ✓ |

- [ ] Create `usePermissions` hook or middleware
- [ ] Enforce role-based UI rendering

### Phase 2 Success Criteria
- [ ] Users can register and log in
- [ ] Protected routes redirect unauthenticated users
- [ ] Role-based access control works
- [ ] Session persists across page reloads

---

## Phase 3: Core Layout & Navigation
**Duration**: [X-Y days] | **Priority**: High

### 3.1 App Shell / Layout
- [ ] Responsive sidebar or top navigation
- [ ] Mobile menu (hamburger / sheet overlay)
- [ ] User profile dropdown (avatar, logout)
- [ ] Breadcrumbs or page headers *(if applicable)*

### 3.2 Dashboard / Home Page
- [ ] Quick action cards or links to primary features
- [ ] Status widgets / summary cards
- [ ] Recent activity feed *(if applicable)*

### Phase 3 Success Criteria
- [ ] Navigation works on desktop and mobile
- [ ] Dashboard displays placeholder data
- [ ] Layout responds correctly at all breakpoints

---

## Phase 4: [Primary Feature #1]
**Duration**: [X-Y days] | **Priority**: High

<!--
  This is your project's MAIN feature. Replace the heading and content
  with whatever the core functionality is.

  Example: "Content Management", "Product Catalog", "Booking System", etc.
-->

### 4.1 Database Models
- [ ] Create models for this feature:
```prisma
// Replace with your feature's data models
```

### 4.2 API Endpoints
- [ ] `GET /api/[resource]` - List
- [ ] `POST /api/[resource]` - Create
- [ ] `GET /api/[resource]/[id]` - Read
- [ ] `PUT /api/[resource]/[id]` - Update
- [ ] `DELETE /api/[resource]/[id]` - Delete

### 4.3 UI
- [ ] List / index view
- [ ] Create / edit form
- [ ] Detail view *(if applicable)*
- [ ] Delete confirmation
- [ ] Loading, empty, and error states
- [ ] Toast notifications on actions

### Phase 4 Success Criteria
- [ ] Full CRUD operations work end-to-end
- [ ] Data persists to database
- [ ] Validation prevents bad data
- [ ] UI feedback (toasts, loading states) works

---

## Phase 5: [Primary Feature #2]
**Duration**: [X-Y days] | **Priority**: High

<!-- Repeat the Phase 4 pattern for your next major feature -->

### 5.1 Database Models
- [ ] ...

### 5.2 API Endpoints
- [ ] ...

### 5.3 UI
- [ ] ...

### Phase 5 Success Criteria
- [ ] ...

---

## Phase 6: [Secondary Feature(s)]
**Duration**: [X-Y days] | **Priority**: Medium

<!--
  Group smaller or lower-priority features into this phase.
  Examples: Settings pages, profile management, notifications, integrations.
-->

### 6.1 [Feature A]
- [ ] ...

### 6.2 [Feature B]
- [ ] ...

### Phase 6 Success Criteria
- [ ] ...

---

## Phase 7: [Billing / Integrations / Admin]
**Duration**: [X-Y days] | **Priority**: Medium

<!--
  If your project has billing, third-party integrations, or an admin console,
  put them here. Delete this phase if not applicable.
-->

### 7.1 [Billing / Integration]
- [ ] ...

### Phase 7 Success Criteria
- [ ] ...

---

## Phase 8: Testing, Polish & Launch Prep
**Duration**: [X-Y days] | **Priority**: High

### 8.1 Testing
- [ ] Unit tests for utilities and core logic
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical user flows:
  - [Flow 1: e.g., Login → Dashboard → Key Action]
  - [Flow 2: e.g., Create → Edit → Delete resource]
  - [Flow 3: e.g., Checkout / payment flow]

### 8.2 Polish
- [ ] Loading states for all async operations
- [ ] Error boundaries with fallback UI
- [ ] Empty states with helpful CTAs
- [ ] Keyboard navigation and accessibility audit
- [ ] Mobile responsiveness audit

### 8.3 Launch Prep
- [ ] Environment variables documented
- [ ] Database migrations finalized
- [ ] Seed script for demo / initial data
- [ ] Deploy to production environment
- [ ] Domain and DNS configuration
- [ ] Monitoring and error tracking set up

### Phase 8 Success Criteria
- [ ] All critical paths tested
- [ ] No major accessibility issues
- [ ] Production deployment works
- [ ] Monitoring is active

---

## Success Metrics (V1)

<!-- Define measurable targets so you know when V1 is "good enough". -->

| Metric | Target |
|--------|--------|
| [Core action speed] | < [X] seconds |
| Page load time | < 2 seconds |
| API response time | < 200ms |
| Uptime | 99.5% |
| [Business metric] | [target] |

---

## Risk Mitigation

<!-- Identify what could go wrong and how you'll handle it. -->

| Risk | Mitigation |
|------|------------|
| [Third-party integration complexity] | [Strategy: use hosted solutions, limit scope] |
| [Data migration issues] | [Strategy: seed scripts, test with real data early] |
| [Performance at scale] | [Strategy: caching, pagination, lazy loading] |
| [Security vulnerabilities] | [Strategy: enforce tenant isolation, audit queries] |

---

## Commands Reference

```bash
# Development
[pm] dev                     # Start dev server
[pm] db:push                 # Push schema to DB
[pm] db:generate             # Generate ORM client
[pm] db:studio               # Open DB browser
[pm] db:seed                 # Seed demo data

# Testing
[pm] test                    # Run tests
[pm] test:e2e                # Run E2E tests

# Production
[pm] build                   # Build for production
[pm] start                   # Start production server
```

---

## Current Status

<!-- Update these as you complete each phase -->
- [ ] Phase 1: Foundation & Project Setup
- [ ] Phase 2: Authentication & Authorization
- [ ] Phase 3: Core Layout & Navigation
- [ ] Phase 4: [Primary Feature #1]
- [ ] Phase 5: [Primary Feature #2]
- [ ] Phase 6: [Secondary Feature(s)]
- [ ] Phase 7: [Billing / Integrations / Admin]
- [ ] Phase 8: Testing, Polish & Launch Prep
