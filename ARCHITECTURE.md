# [Project Name] Architecture

## Overview

<!-- 1-2 sentences: what this system is and its core architectural style. -->
[Brief description of the system, its tenancy model, and primary purpose.] Built with [Framework], [ORM], and [Database] ([Provider]).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Node.js / Bun / Deno] |
| Framework | [Next.js / Remix / Nuxt / SvelteKit] (version) |
| Language | [TypeScript / JavaScript] (version) |
| Database | [PostgreSQL / MySQL / SQLite] ([provider]) |
| ORM | [Prisma / Drizzle / TypeORM] (version) |
| Auth | [NextAuth / Clerk / Lucia / custom] |
| UI | [React / Vue / Svelte] + [component lib] + [CSS framework] |
| Validation | [Zod / Yup / Valibot] |
| Icons | [Lucide / Heroicons / Phosphor] |

## Directory Structure

<!--
  This is the canonical reference for where code lives.
  Keep descriptions short — the goal is fast orientation for new contributors or AI assistants.
-->
```
src/
├── app/
│   ├── (auth)/              # Auth pages (login, register, password reset)
│   ├── (main)/              # Main app pages (behind auth)
│   │   ├── dashboard/
│   │   ├── [feature-1]/
│   │   ├── [feature-2]/
│   │   ├── settings/
│   │   └── admin/
│   └── api/
│       ├── auth/            # Auth endpoints
│       ├── [resource]/      # Protected API routes
│       └── public/          # Public API routes (no auth)
├── components/
│   ├── ui/                  # Base UI components (shadcn, etc.)
│   ├── [feature]/           # Feature-specific components
│   └── layout/              # Shell, nav, sidebar components
├── lib/
│   ├── db.ts                # Database client singleton
│   ├── auth.config.ts       # Auth configuration
│   ├── utils.ts             # Shared utilities (cn, formatters, etc.)
│   └── validations/         # Zod schemas / shared validation
├── hooks/                   # Custom React hooks
├── types/                   # Shared TypeScript types
└── styles/
    └── globals.css
```

## Database Models

<!--
  Don't repeat the full Prisma schema here — just list models grouped by domain
  with a one-line description of each. The schema itself lives in prisma/schema.prisma.
-->

### Core Models
- **User** — Platform users (email, name, credentials)
- **[Tenant/Org/Workspace]** — Top-level entity that scopes all data
- **[UserRole/Membership]** — Junction table (User ↔ Tenant with role)
- **Subscription** — Billing state per tenant *(if applicable)*

### Content / Domain Models
<!-- Replace with your project's actual domain models -->
- **[Resource A]** / **[Sub-resource]** — [brief description]
- **[Resource B]** — [brief description]
- **[Resource C]** / **[Child resource]** — [brief description]
- **[Config/Settings]** — [brief description]

### Model Relationships
<!--
  A quick reference for how the main models connect.
  Use arrows to show ownership / foreign keys.
-->
```
[Tenant] ──┬── [Resource A] ── [Sub-resource A1]
            ├── [Resource B]
            ├── [Resource C] ── [Child C1]
            ├── [Config]
            └── [Subscription]

[User] ── [UserRole] ── [Tenant]
```

## Role-Based Access Control

<!--
  Define the permission matrix. This is the source of truth for what each role can do.
-->

| Role | [Action 1] | [Action 2] | [Action 3] | [Action 4] |
|------|-----------|-----------|-----------|-----------|
| OWNER | ✓ | ✓ | ✓ | ✓ |
| ADMIN | ✓ | ✓ | - | - |
| EDITOR | ✓ | - | - | - |
| VIEWER | - | - | - | - |

## API Structure

### Protected APIs (Authenticated)
<!--
  Show the full route tree for your authenticated endpoints.
  This helps AI assistants and developers know exactly what exists.
-->
```
/api/[tenantId]/
├── [resource-a]/                GET, POST
│   └── [id]/                    GET, PUT, DELETE
│       └── [sub-resource]/      GET, POST
│           └── [id]/            GET, PUT, DELETE
├── [resource-b]/                GET, PUT
│   └── [sub-resource]/          GET, POST
│       └── [id]/                DELETE
├── [resource-c]/                GET, POST
│   └── [id]/                    GET, PUT, DELETE
└── settings/                    GET, PUT
```

### Public APIs (No Auth)
<!--
  If your app exposes a public-facing API (e.g., for a separate frontend),
  document it here. Delete this section if not applicable.
-->
```
/api/public/[identifier]/
├── [resource-a]/    # Filtered subset (e.g., active/published only)
├── [resource-b]/
└── [resource-c]/
```

### API Conventions
<!--
  Document patterns that all endpoints should follow.
-->
- **Response format**: `{ data, error, meta }` *(or describe your convention)*
- **Error handling**: [how errors are returned — status codes, error shape]
- **Pagination**: [cursor-based / offset-based / none in V1]
- **Validation**: [Zod schemas validated at the API boundary]

## Data Isolation / Multi-Tenancy

<!--
  If your app is multi-tenant, describe how tenant data is kept separate.
  Delete this section for single-tenant apps.
-->

1. **Data Isolation**: Every model has `[tenantId]` foreign key with cascade deletes
2. **Domain/Identifier Resolution**: `[resolver file]` maps [identifier] → tenantId ([cache strategy])
3. **User Access**: `[UserRole/Membership]` defines per-tenant permissions
4. **Query Scoping**: All queries include `WHERE [tenantId] = ?` — enforced at [ORM / middleware / repository] level

## Authentication Flow

<!--
  A text-based diagram showing the auth flow from login to authenticated state.
-->
```
Login → [Auth Provider] → [Token Type] → Session
                                ↓
                          [Client Provider]
                                ↓
                    Fetch /api/user/[context] → [Context Data]
                                ↓
                         Store in [Context + storage strategy]
```

### Session Strategy
- **Type**: [JWT / Database sessions / Cookie-based]
- **Storage**: [httpOnly cookie / localStorage / in-memory]
- **Expiry**: [duration, refresh strategy]

## Caching Strategy

<!--
  Describe how and where you cache data. Delete if not applicable for V1.
-->

| What | Where | TTL | Invalidation |
|------|-------|-----|-------------|
| [Tenant/domain resolution] | [In-memory / Redis] | [X min] | [On update / manual] |
| [Public API responses] | [CDN / edge] | [X min] | [On content change] |
| [Static assets] | [CDN] | [Long / immutable] | [Deploy / hash-based] |

## Deployment

- **Platform**: [Vercel / Netlify / AWS / Fly.io / Railway]
- **Database**: [Provider] ([connection strategy: pooler, direct, etc.])
- **Storage**: [S3 / R2 / Supabase Storage / Vercel Blob] with CDN
- **CI/CD**: [GitHub Actions / Vercel auto-deploy / etc.]
- **Build command**: `[e.g., prisma generate && next build]`

### Environment Variables

<!--
  List ALL required env vars. This is critical for onboarding and deployment.
  Do NOT include actual values — just the variable names and purpose.
-->
```
# Database
DATABASE_URL=                  # PostgreSQL connection string

# Auth
AUTH_SECRET=                   # Secret for signing tokens/sessions
[AUTH_PROVIDER_ID]=            # OAuth provider client ID (if applicable)
[AUTH_PROVIDER_SECRET]=        # OAuth provider client secret (if applicable)

# Storage (if applicable)
[STORAGE_KEY]=                 # Storage access key
[STORAGE_SECRET]=              # Storage secret
[STORAGE_BUCKET]=              # Bucket / container name

# Payments (if applicable)
[STRIPE_SECRET_KEY]=           # Payment provider secret key
[STRIPE_WEBHOOK_SECRET]=       # Webhook signing secret

# App
NEXT_PUBLIC_APP_URL=           # Public-facing URL of the app
```

## Key Design Decisions

<!--
  Document important architectural choices and WHY they were made.
  This helps future contributors (and AI assistants) understand the reasoning
  and avoid accidentally reversing these decisions.
-->

| Decision | Choice | Rationale |
|----------|--------|-----------|
| [e.g., Tenancy model] | [e.g., Shared DB, row-level isolation] | [e.g., Lower cost, simpler ops for < 100 tenants] |
| [e.g., Auth strategy] | [e.g., JWT in httpOnly cookies] | [e.g., Stateless, works with edge/serverless] |
| [e.g., CSS approach] | [e.g., Tailwind + CSS variables] | [e.g., Themeable, utility-first, small bundle] |
| [e.g., State management] | [e.g., Server state via TanStack Query] | [e.g., Minimal client state, automatic cache invalidation] |
