# MarketHub — Multi-Vendor Zayyy

A multi-vendor online Zayyy MVP (Shopee/Lazada-style) built with Next.js (App Router), Prisma, and PostgreSQL.

## Tech Stack

- **Next.js 16** (App Router, React Server Components) — frontend + API routes
- **Prisma 7** + **PostgreSQL** — ORM and database
- **Tailwind CSS v4** — styling
- **jose + bcryptjs** — session tokens (HTTP-only cookie) and password hashing

## Architecture

- Route groups isolate UI areas: `(public)` for browsing/auth/cart, and later `(account)`, `(seller)`, `(admin)`.
- Server Components render pages; Client Components handle mutations (forms) via `fetch` to `/api/*` routes.
- `lib/prisma.ts` exports a singleton Prisma client (driver adapter required by Prisma 7).
- `lib/auth.ts` issues and verifies a signed JWT stored in an HTTP-only cookie.
- Reusable UI in `components/ui/`, layout pieces in `components/`, forms in `components/forms/`.

## File Layout

```
app/
  (public)/        Public + customer-facing pages (home, login, register, ...)
  api/             Backend API routes (auth, later: products, cart, orders, ...)
components/
  ui/              Button, Input, Card, Badge, LoadingSpinner, EmptyState
  forms/           AuthShell, LoginForm, RegisterForm
  Header.tsx, Footer.tsx, LogoutButton.tsx, ComingSoon.tsx
lib/
  generated/       Generated Prisma client (do not edit)
  auth.ts          Session token create/verify + cookie helpers
  guards.ts        requireAuth helpers for protected pages
  prisma.ts        Prisma singleton
  utils.ts, validation.ts
prisma/
  schema.prisma    All data models
  seed.ts          Seeder (admin + demo customer)
types/             Shared TypeScript types
```

## Data Model

User, Shop, Category, Product, Cart, CartItem, Order, OrderItem — see `prisma/schema.prisma`.

Notable design decisions:

- A user can be **both customer and seller** (single `role` field, one account).
- `OrderItem` stores `shopId` so every order line can be attributed to its seller.
- Shop status flow: `PENDING → ACTIVE` (admin approval), plus `REJECTED` / `SUSPENDED`.
- Order status flow: `PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`, plus `CANCELLED`.

## Setup

Requirements: Node 20+, PostgreSQL running locally.

1. Create a database and DB user, then set `DATABASE_URL` (and `AUTH_SECRET`) in `.env`:

```bash
psql -d postgres -c \
  "CREATE ROLE Zayyy WITH LOGIN PASSWORD 'Zayyy_dev_password' CREATEDB SUPERUSER;"
createdb -O Zayyy Zayyy
```

> The `SUPERUSER` flag is needed so Prisma can create the `citext` extension
> (used for case-insensitive email lookups) in the main DB and in shadow
> databases during migrations. On PostgreSQL 12 `citext` is untrusted, so a
> non-superuser role cannot install it.

2. Install dependencies and run migrations + seed:

```bash
npm install
npx prisma migrate dev
npx prisma db seed
```

3. Start the dev server:

```bash
npm run dev
```

Open http://localhost:3000.

### Demo accounts (seeded)

| Role     | Email                         | Password      |
| -------- | ----------------------------- | ------------- |
| Admin    | admin@Zayyy.test        | admin123      |
| Customer | customer@Zayyy.test     | customer123   |

You can also register a new account from the UI.

## Useful commands

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # lint
npx prisma studio # browse data
```

## Phase 1 (done) — what was implemented

- Project scaffold (Next.js + TS + Tailwind), full Prisma schema, migration + seed.
- Session auth: register, login, logout, current-user (`/api/auth/*`).
- Basic public layout: header (logo, search, nav, account button, cart button), footer.
- Home, login, register pages.
- Placeholder pages for products, shops, cart, search (filled in later phases).

### How to test Phase 1

1. `npm run dev` and open http://localhost:3000.
2. Register at /register (or use a seeded account at /login). The header switches from Login/Register to your name + Logout.
3. Logout clears the session (cookie is HTTP-only; `Max-Age` and `Secure` on production).

## Roadmap

- **Phase 2**: categories, shops, products (listing, details, search).
- **Phase 3**: cart, checkout, orders, order history.
- **Phase 4**: seller onboarding, shop management, product CRUD, seller order flow.
- **Phase 5**: admin dashboard, users, shop approval, category + product/order management.

## Notes / Gotchas

- Prisma 7 requires a **driver adapter** (`@prisma/adapter-pg`) passed to `new PrismaClient({ adapter })`; there is no default connection anymore.
- Prisma CLI configuration lives in `prisma.config.ts` (datasource URL is loaded from `.env` via `dotenv/config`).
- Sessions are stateless JWTs; logout clears the cookie. Use a short token expiry / rotating sessions for stricter security in production.
- `next start` runs in production mode and sets `Secure` cookies — use `npm run dev` locally over HTTP.