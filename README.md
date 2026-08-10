# Apex Veritas — Monorepo

Scaffold generated from the Apex Veritas dev brief. Three deployable apps sharing one database:

```
apex-veritas/
├── packages/
│   ├── api/       Express + Prisma + PostgreSQL — single backend serving
│   │               the public site's dynamic bits, the client portal, and
│   │               the admin panel, all under /api/*
│   ├── portal/    React SPA (Vite) — Client Portal + Admin Panel, login-protected
│   └── web/       React SPA (Vite) — public marketing site
├── docs/
│   └── ARCHITECTURE.md
└── package.json   npm workspaces root
```

## Why one API for portal + admin

The brief treats the portal (`/portal`) and admin (`/admin`) as two views over the
same data (clients, subscriptions, documents, audits…) with different RBAC roles —
not two separate systems. `packages/api` exposes both under role-guarded routes
(`src/modules/admin` vs the rest), and `packages/portal` will grow an `/admin/*`
route tree once the admin UI is built out, reusing the same auth/session.

## Stack

- **DB**: PostgreSQL via Prisma (`packages/api/prisma/schema.prisma` — see that
  file for the full ER model: clients, users/RBAC, compliance, documents, audits,
  incidents, training, tasks, subscriptions/Stripe, template store).
- **Auth**: JWT access + refresh tokens, MFA field ready on `User`, RBAC via
  `role` enum + a `UserPermission` override table for scoped sub-users.
- **Storage**: S3-compatible (bucket config in `.env`, no upload wiring yet —
  see TODO in `modules/documents`).
- **Billing**: Stripe Checkout + webhook (`modules/subscriptions`).
- **Frontend**: React + Vite for both portal and public site, kept as separate
  apps since they have very different concerns (SEO/static content vs.
  authenticated dashboard).

## Getting started

```bash
npm install                                   # installs all three workspaces
cp packages/api/.env.example packages/api/.env
# fill in JWT secrets at minimum; DATABASE_URL below already matches docker-compose.yml

docker compose up -d                          # local Postgres on :5432 (optional — use your own instead)
npm run prisma:migrate                        # creates tables from schema.prisma
npm run dev:api                                # http://localhost:4000
npm run dev:portal                             # http://localhost:5173
npm run dev:web                                # http://localhost:5174
```

There's no single root `npm run dev` — run the three `dev:*` scripts in separate
terminals (or wrap them with `concurrently` if you'd rather have one command).

## Styling

Both `portal` and `web` use Tailwind, configured with a shared design system
(`tailwind.config.cjs` in each) built around the subject matter: a
"technical drawing / blueprint" direction — Space Grotesk for headings, IBM
Plex Sans for body copy, IBM Plex Mono for data/IDs, a blueprint-navy +
safety-amber + compliance-teal + oxide-red palette, and a recurring
"title block" component (`.title-block` in `index.css`) borrowed from
engineering-drawing corner stamps, used to carry real status/metadata
instead of decorative badges. Both apps build clean with `npx vite build`.

## What's scaffolded vs. what's a stub

**Working end-to-end**: auth (register/login/refresh/me), RBAC + tenant-isolation
middleware, CRUD for compliance/documents/audits/incidents/training/tasks (via a
shared `crudFactory`), the compliance-summary report, Stripe checkout session +
webhook shell, admin routes for managing clients/team/templates, automated cron 
job alert engine, Amazon S3 document integration, Twilio WhatsApp integration.

## API Documentation

We use **Swagger UI** for API documentation.
1. Run the API: `npm run dev:api`
2. Open `http://localhost:4000/api-docs` in your browser.
3. You can explore and test endpoints directly from the UI. (Authenticate via the "Authorize" button using a JWT Bearer token).

## Deployment Guide (Heroku / AWS)

### Option A: Heroku
1. Provision a Heroku Postgres add-on.
2. Add environment variables (`DATABASE_URL`, `JWT_SECRET`, `STRIPE_SECRET_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`) in the Heroku dashboard.
3. Deploy the monorepo via Heroku Git or GitHub integration. Heroku will automatically detect the Node.js environment and build the applications.
4. Ensure your `Procfile` is set to run the `api`, or let Heroku use the `start` script in the API workspace.

### Option B: AWS (EC2 + RDS)
1. Provision an RDS instance for PostgreSQL.
2. Launch an EC2 instance (Ubuntu or Amazon Linux).
3. Clone this repository to the instance.
4. Install Node.js v18+.
5. Run `npm install` and `npm run prisma:migrate -w packages/api`.
6. Set up a reverse proxy using Nginx to route traffic to your Node.js application running on port 4000 (managed via `pm2`).
7. For the frontend applications (`web` and `portal`), use `npm run build` and host the generated static files out of an S3 bucket or via Nginx.

See `docs/ARCHITECTURE.md` for the reasoning behind the module boundaries and
`packages/api/prisma/schema.prisma` for the data model.
