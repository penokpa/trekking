# Trekking - Product Specification

> **Version**: 1.0 (MVP)
> **Status**: Active
> **Last Updated**: 2026-02-25
> **Related Docs**: [ARCHITECTURE.md](./ARCHITECTURE.md) | [PLAN.md](./PLAN.md)

Trekking is a multi-tenant SaaS platform that enables trekking agencies in Nepal to launch and manage professional, white-labeled websites without technical expertise. Each agency gets a fully customizable site with CMS, inquiry management, and analytics — all managed through an intuitive admin dashboard. The platform follows a subscription-based business model focused on lead generation (inquiry capture) rather than direct online booking.

---

## Problem Statement

**Agency-side:**
- Most Nepal-based trekking agencies lack technical resources to build and maintain a professional website
- Hiring a developer for a custom site costs USD 1,000–5,000+ and takes weeks to months
- Generic website builders (Wix, Squarespace, WordPress) lack trekking-specific features — itineraries, difficulty levels, altitude profiles, inquiry flows
- Tour-operator SaaS (TrekkSoft, Rezdy) bundles booking features agencies don't need — most Nepal agencies handle bookings via email/WhatsApp

**Traveler-side:**
- Many agency websites are outdated, slow, or not mobile-friendly, eroding trust
- Travelers struggle to compare treks, read structured itineraries, or submit inquiries easily

---

## Product Vision

**Vision**: Become the default platform that every trekking agency in Nepal uses to establish their online presence — the "Shopify for trekking agencies."

> **V1 Scope**: Lead generation only. No online booking, no payment processing, no traveler accounts. These are post-MVP features.

---

## Target Users & Personas

| Persona | Role | Description | Goals | Pain Points |
|---------|------|-------------|-------|-------------|
| **Ramesh** (Agency Owner) | Agency Admin | Runs a 10-person trekking agency in Thamel, Kathmandu. Non-technical. Currently uses a WordPress site built 5 years ago. | Professional website he can update himself; capture more inquiries from international travelers | Cannot update his site without calling a developer; site is slow and not mobile-friendly |
| **Sarah** (Platform Owner) | Super Admin | Operates the Trekking platform. Manages agency onboarding, subscriptions, and platform health. | Grow the platform to 50+ agencies; maintain quality and uptime | Manual onboarding; no visibility into which agencies are active vs. churning |
| **Emma** (Traveler) | Public User | Planning a 2-week trip to Nepal. Researching agencies and treks online. Based in the UK. | Find a trustworthy agency, compare treks, submit an inquiry easily | Hard to find structured trek info; many agency sites look unprofessional |

---

## Business Model

### Revenue Model

Subscription-based, tiered pricing, billed monthly or annually.

### Subscription Tiers

| Feature | Free / Trial | Starter | Professional | Enterprise |
|---------|-------------|---------|--------------|------------|
| **Price (monthly)** | $0 (14 days) | $19/mo | $49/mo | $99/mo |
| **Custom domain** | Subdomain only | Custom domain | Custom domain | Custom domain |
| **Treks listed** | Up to 5 | Up to 20 | Unlimited | Unlimited |
| **Blog posts** | Up to 3 | Up to 20 | Unlimited | Unlimited |
| **Gallery images** | Up to 20 | Up to 100 | Unlimited | Unlimited |
| **Custom pages** | 0 | 2 | 10 | Unlimited |
| **Team members (admin accounts)** | 1 | 2 | 5 | Unlimited |
| **Inquiry management** | View only | View + respond | View + respond + export | Full CRM features |
| **Analytics** | Basic (page views) | Standard (views + sources) | Advanced (conversion, popular treks) | Advanced + API access |
| **White-label branding** | Trekking watermark | Partial (logo, colors) | Full (logo, colors, fonts, favicon) | Full + custom CSS |
| **SEO tools** | Basic meta tags | Full meta + sitemap | Full + structured data | Full + priority indexing |
| **Support** | Community | Email | Priority email | Dedicated account manager |
| **Trekking badge** | Shown | Shown | Removable | Removed |

> **V1 Note**: Subscription plans are assigned manually by the Super Admin. Self-service billing (Stripe integration) is a V2 feature.

---

## Core Features by User Role

### Super Admin (Platform Owner)

| Feature | Description | MVP | Future |
|---------|-------------|:---:|:------:|
| Agency management | Approve, suspend, reactivate, delete agency accounts | Yes | Bulk actions |
| Subscription management | Create/edit plans, assign plans to agencies, track billing status | Yes | Stripe integration, auto-billing |
| Platform analytics | Total agencies, total inquiries, aggregate traffic, churn rate | Yes | Revenue dashboard |
| Platform settings | Default theme, terms of service, onboarding flow | Yes | Email templates |
| User management | View all users across agencies, reset passwords, impersonate | Yes | Audit logs |
| Content moderation | Flag/review agency content for policy compliance | No | Yes |

**Routes:**
```
/admin/dashboard
/admin/agencies
/admin/agencies/[id]
/admin/plans
/admin/analytics
/admin/settings
```

### Agency Admin (Tenant Admin)

#### Content Management (CMS)

| Content Type | Key Fields | MVP | Future |
|-------------|-----------|:---:|:------:|
| **Treks** | Title, slug, summary, description (rich text), duration, difficulty (Easy/Moderate/Challenging/Strenuous), max altitude, group size, price (from), itinerary (day-by-day structured JSON), included/excluded items, gallery, SEO meta, status (draft/published) | Yes | Seasonal pricing, departure dates |
| **Blog / Articles** | Title, slug, excerpt, body (rich text), featured image, category, tags, author, SEO meta, status | Yes | Scheduled publishing |
| **Gallery** | Image upload, caption, category/album, display order | Yes | Video support |
| **Team Members** | Name, role/title, bio, photo, display order | Yes | Social links |
| **FAQs** | Question, answer (rich text), category, display order | Yes | Search within FAQs |
| **Testimonials** | Client name, country, trek (relation), rating (1-5), review text, photo, date, featured flag | Yes | Import from Google/TripAdvisor |
| **Custom Pages** | Title, slug, body (rich text), SEO meta, status | Yes | Page builder (drag-and-drop) |
| **Banners** | Title, subtitle, CTA text, CTA link, background image, active date range, display location, status | Yes | A/B testing |
| **Site Settings** | Agency name, logo, favicon, brand colors (primary, secondary, accent), fonts, contact info, social links, about text, footer text | Yes | Custom CSS injection |

#### Inquiry Management

| Feature | Description | Tier |
|---------|-------------|------|
| Inquiry inbox | List all inquiries with status (New, Read, Replied, Archived), filterable by trek, date, status | All |
| Inquiry detail | View full inquiry: traveler name, email, phone, country, travel dates, group size, message, associated trek | All |
| Reply to inquiry | Send email reply from dashboard or mark as replied externally | Starter+ |
| Export inquiries | Download inquiries as CSV | Professional+ |
| Inquiry notifications | Email notification to agency admin on new inquiry | All |

#### Analytics Dashboard

| Metric | Description | Tier |
|--------|-------------|------|
| Page views | Total and per-page views over time | All |
| Traffic sources | Referrer breakdown (direct, search, social, referral) | Starter+ |
| Popular treks | Most-viewed treks ranked | Starter+ |
| Inquiry conversion rate | Views-to-inquiry ratio per trek | Professional+ |
| Geographic breakdown | Visitor countries | Professional+ |
| Trend comparison | Week-over-week, month-over-month | Professional+ |

**Routes:**
```
/dashboard
/dashboard/treks                    (list)
/dashboard/treks/new                (create)
/dashboard/treks/[id]/edit          (edit)
/dashboard/blog                     (list)
/dashboard/blog/new                 (create)
/dashboard/blog/[id]/edit           (edit)
/dashboard/gallery
/dashboard/team
/dashboard/faqs
/dashboard/testimonials
/dashboard/pages
/dashboard/pages/new
/dashboard/pages/[id]/edit
/dashboard/banners
/dashboard/inquiries                (inbox)
/dashboard/inquiries/[id]           (detail)
/dashboard/analytics
/dashboard/settings
/dashboard/settings/branding
/dashboard/settings/contact
/dashboard/settings/seo
```

### Traveler (Public User)

| Feature | Description |
|---------|-------------|
| Browse treks | Filter by difficulty, duration, region, price range; search by keyword |
| View trek detail | Full itinerary, gallery, pricing, difficulty badge, inquiry CTA |
| Submit inquiry | Form: name, email, phone (optional), country, preferred dates, group size, message, associated trek |
| Read blog | Browse articles, filter by category/tag |
| View gallery | Photo grid with lightbox, filterable by album/category |
| Contact agency | Contact form + address/map display |
| View FAQs | Collapsible FAQ sections |

---

## Public Website Pages

### Home Page (`/`)

| Section | Content | Data Source |
|---------|---------|-------------|
| Hero banner | Full-width image, headline, subheadline, CTA button | `banners` (featured/home) |
| Featured treks | 3–6 trek cards (image, title, duration, difficulty, price) | `treks` where `featured = true` |
| About snippet | Short agency description + "Read More" link | `site_settings.about_text` |
| Testimonials | Carousel of 3–5 featured reviews | `testimonials` where `featured = true` |
| Why choose us | 3–4 value proposition cards with icons | `site_settings` |
| Blog preview | 2–3 latest blog posts | `articles` ordered by `created_at DESC` |
| CTA section | "Plan Your Trek" with link to inquiry form | Static + link to `/contact` |
| Stats bar | Years of experience, treks completed, happy clients | `site_settings.stats` |

### Trek Listings (`/treks`)

| Section | Content | Data Source |
|---------|---------|-------------|
| Filter bar | Difficulty (checkboxes), duration range, region (dropdown), price range | Derived from `treks` data |
| Search bar | Keyword search across title and description | Full-text search |
| Trek grid | Cards: image, title, duration, difficulty badge, max altitude, price, summary | `treks` where `status = published` |
| Sort options | Popular, price (low/high), duration, newest | Query parameter |
| Pagination | Load more or page numbers | Cursor or offset |

### Trek Detail (`/treks/[slug]`)

| Section | Content | Data Source |
|---------|---------|-------------|
| Hero image | Full-width trek cover image | `trek.cover_image` |
| Quick facts bar | Duration, difficulty, max altitude, best season, group size (with icons) | `trek` fields |
| Overview tab | Rich text description | `trek.description` |
| Itinerary tab | Day-by-day accordion: day number, title, description, altitude, distance | `trek.itinerary` (structured JSON) |
| Includes/Excludes | Two-column list | `trek.includes`, `trek.excludes` (JSON arrays) |
| Gallery | Photo grid/carousel | `trek.gallery` |
| Inquiry sidebar | Sticky sidebar or bottom CTA: "Inquire About This Trek" | Form → `inquiries` |
| Related treks | 2–3 similar treks | Query by same region/difficulty |

### About Us (`/about`)

| Section | Content |
|---------|---------|
| Company story | Rich text about the agency |
| Mission / values | Optional section |
| Team grid | Photo, name, role for each team member |
| Certifications | Government license numbers, association memberships |

### Blog (`/blog` and `/blog/[slug]`)

| Section | Content |
|---------|---------|
| Blog listing | Cards with featured image, title, excerpt, date, category badge |
| Category filter | Filter by category |
| Blog detail | Title, featured image, author, date, body (rich text), tags, related articles |
| Share buttons | Facebook, Twitter, WhatsApp, copy link |

### Gallery (`/gallery`)

| Section | Content |
|---------|---------|
| Album filter | Tabs or dropdown to filter by album |
| Photo grid | Masonry or uniform grid layout |
| Lightbox | Click to enlarge with navigation |

### Contact (`/contact`)

| Section | Content |
|---------|---------|
| Contact info | Phone, email, address, operating hours |
| Map embed | Google Maps or OpenStreetMap showing office location |
| Inquiry form | Name, email, phone, country, travel dates, group size, trek interest (dropdown), message |

### FAQs (`/faqs`)

| Section | Content |
|---------|---------|
| Category tabs | Tab-based navigation if categories exist |
| FAQ accordion | Collapsible question/answer pairs |

---

## Multi-Tenancy & White-Labeling

### Tenant Isolation

- **Database**: Shared database, row-level isolation. Every content table has an `agency_id` foreign key.
- **Query scoping**: All queries scoped by `agency_id`, enforced at ORM/middleware level. No cross-tenant data leakage.
- **File storage**: Uploads namespaced by `agency_id` in the storage bucket (`/uploads/{agency_id}/...`).

### Domain Resolution

| Access Method | URL Pattern | Resolution |
|---------------|-------------|------------|
| Custom domain | `www.himalayatreks.com` | DNS CNAME → platform; middleware reads `Host` header, looks up `agency` by `custom_domain` |
| Platform subdomain | `himalaya.trekking.app` | Middleware reads subdomain, looks up `agency` by `slug` |
| Admin dashboard | `app.trekking.app/dashboard` | Authenticated route; `agency_id` from session/JWT |

### White-Label Customization

| Customization | Where Applied | Storage |
|---------------|---------------|---------|
| Logo + favicon | Header, browser tab, emails | `agency.logo_url`, `agency.favicon_url` |
| Brand colors | Buttons, links, accents, header/footer | `agency.brand_colors` JSON: `{primary, secondary, accent}` |
| Fonts | Headings, body text | `agency.fonts` JSON: `{heading, body}` (Google Fonts names) |
| Footer text | Site footer | `agency.footer_text` |
| Social links | Footer, about page | `agency.social_links` JSON: `{facebook, instagram, ...}` |

**Implementation**: Brand customization applied via CSS custom properties (`--brand-primary`, `--brand-secondary`, etc.) injected at the layout level based on the resolved tenant. No per-tenant CSS bundles.

---

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Content-first** | Agency content (treks, photos, stories) is the hero, not the platform UI. Minimal chrome, maximum content. |
| **Monochrome default** | Default theme: black, white, gray — creating a premium, modern feel that differentiates from colorful competitor sites. Agency brand colors used as accents. |
| **Mobile-first** | All pages designed mobile-first. Trek browsing and inquiry submission must work flawlessly on mobile. |
| **Fast by default** | Target < 2s LCP. Static generation where possible, lazy-load images, minimal JS on public pages. |
| **Scannable** | Cards, badges, icons, and visual hierarchy make trek info easy to scan. Travelers compare multiple treks — make it effortless. |
| **Trust signals** | Testimonials, team photos, license numbers, years of experience — prominently displayed. Trust is critical for international travelers booking Nepal treks. |
| **Accessible** | WCAG 2.1 AA compliance. Proper contrast ratios (especially with monochrome palette), alt text, keyboard navigation. |
| **Convention over configuration** | Reasonable defaults for everything. An agency should launch a good-looking site by only uploading a logo and adding treks. |

---

## Information Architecture

### Public Website
```
/ (Home)
├── /treks
│   └── /treks/[slug]
├── /about
├── /blog
│   └── /blog/[slug]
├── /gallery
├── /contact
├── /faqs
└── /[custom-page-slug]
```

### Agency Admin Dashboard
```
/dashboard
├── /dashboard/treks
│   ├── /dashboard/treks/new
│   └── /dashboard/treks/[id]/edit
├── /dashboard/blog
│   ├── /dashboard/blog/new
│   └── /dashboard/blog/[id]/edit
├── /dashboard/gallery
├── /dashboard/team
├── /dashboard/faqs
├── /dashboard/testimonials
├── /dashboard/pages
│   ├── /dashboard/pages/new
│   └── /dashboard/pages/[id]/edit
├── /dashboard/banners
├── /dashboard/inquiries
│   └── /dashboard/inquiries/[id]
├── /dashboard/analytics
└── /dashboard/settings
    ├── /dashboard/settings/branding
    ├── /dashboard/settings/contact
    └── /dashboard/settings/seo
```

### Super Admin Dashboard
```
/admin
├── /admin/dashboard
├── /admin/agencies
│   └── /admin/agencies/[id]
├── /admin/plans
├── /admin/analytics
└── /admin/settings
```

### Auth
```
/login
/register
/forgot-password
/reset-password
```

---

## Scope: MVP vs Future

### V1 — Must Ship

| Category | Features |
|----------|----------|
| **Multi-tenancy** | Agency registration, subdomain resolution, row-level isolation, basic white-label (logo, colors) |
| **Auth** | Email/password login, role-based access (Super Admin, Agency Admin) |
| **CMS** | CRUD for: treks (with structured itinerary), blog, gallery, team, FAQs, testimonials, banners, custom pages |
| **Public site** | All 8 page types with responsive design and default monochrome theme |
| **Inquiry system** | Inquiry form, dashboard inbox, email notifications, reply/status tracking |
| **Analytics** | Basic page views, popular treks, inquiry counts |
| **Subscription** | Manual plan assignment by Super Admin |
| **Super Admin** | Agency CRUD, plan management, platform overview dashboard |
| **SEO** | Meta tags, OpenGraph, sitemap.xml, structured data (TourProduct schema) |

### V2 — Near-Term Roadmap

| Feature | Description |
|---------|-------------|
| Custom domains | Full custom domain support with automated SSL |
| Self-service billing | Stripe integration for subscription management and invoicing |
| Advanced analytics | Traffic sources, geographic breakdown, conversion funnels |
| Email marketing | Basic newsletter/email blast to past inquirers |
| Trek departure dates | Scheduled departures with availability tracking |
| Multi-language | Agency sites in multiple languages (EN, DE, FR, JP) |
| Reviews integration | Import reviews from Google, TripAdvisor |
| Image optimization | Automatic resizing, WebP conversion, CDN delivery |

### V3 — Long-Term Vision

| Feature | Description |
|---------|-------------|
| Online booking & payment | Accept deposits/full payments via Stripe/PayPal |
| Traveler accounts | Travelers create accounts, track bookings, save favorites |
| Marketplace / directory | Central directory of all agencies on the platform |
| Mobile app | Companion app for agency admins |
| AI features | AI-generated trek descriptions, chatbot for traveler inquiries |
| API for distribution | Syndicate treks to OTAs (TourRadar, Viator) |
| Seasonal pricing engine | Dynamic pricing based on season, group size, demand |

---

## Success Metrics

### Platform Metrics (Super Admin)

| Metric | V1 Target (6 months) |
|--------|-----------------------|
| Active agencies | 20+ (with >= 1 published trek) |
| Monthly inquiry volume | 500+ across all agencies |
| Agency retention (monthly) | > 85% |
| Platform uptime | 99.5% |
| Avg page load time (LCP) | < 2 seconds |

### Agency Metrics (Agency Admin)

| Metric | Description |
|--------|-------------|
| Monthly page views | Total views on agency's public site |
| Inquiry conversion rate | (Inquiries / Trek page views) x 100 |
| Popular treks | Top 5 treks by view count |
| Inquiry response time | Avg time from inquiry to first reply |
| Content freshness | Last content update date |

### Traveler Experience Metrics

| Metric | Target |
|--------|--------|
| Time to first inquiry | < 3 minutes from landing |
| Mobile usability score | > 90 (Lighthouse) |
| Bounce rate (trek pages) | < 50% |
| Pages per session | > 3 |

---

## Glossary

| Term | Definition |
|------|------------|
| **Agency** | A trekking company that is a tenant on the platform |
| **Tenant** | An isolated agency account with its own data, branding, and domain |
| **Trek** | A trekking package offered by an agency (e.g., "Everest Base Camp Trek") |
| **Inquiry** | A lead/contact form submission from a traveler about a trek or general interest |
| **Public site** | The customer-facing website for a specific agency, accessible via their domain/subdomain |
| **Dashboard** | The admin interface where agency admins manage content, inquiries, and settings |
| **White-label** | Customization of the public site to reflect the agency's brand with no visible platform branding (on higher tiers) |
| **Super Admin** | The platform operator who manages all agencies, subscriptions, and platform settings |
| **Itinerary** | A structured day-by-day plan for a trek (day number, title, description, altitude, distance) |
