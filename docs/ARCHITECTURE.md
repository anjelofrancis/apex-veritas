# Architecture Notes

## Multi-tenancy

Every business record (documents, audits, incidents, tasks, etc.) carries a
`clientId` — one row per tenant organization. Isolation is enforced in two
places:

1. **`crudFactory.scopeWhere`** — automatically filters queries to
   `req.user.clientId` for client-side roles. Internal staff (`SUPER_ADMIN`,
   `CONSULTANT`) can pass `?clientId=` to cross tenants for support purposes.
2. **`enforceTenantIsolation` middleware** — a second check for routes that
   load a resource before deciding access, to stop IDOR-style access (e.g.
   guessing another tenant's document ID).

This mirrors the tenant-isolation approach already used in the LEDGR project,
kept consistent across both codebases.

## RBAC model

Four roles (`SUPER_ADMIN`, `CONSULTANT`, `CLIENT_ADMIN`, `CLIENT_USER`) cover
the brief's three groups (client users w/ sub-users, consultants, super
admin). `CLIENT_ADMIN` and internal staff get full access within their scope;
`CLIENT_USER` sub-users are additionally checked against `UserPermission`
(per-module canView/canCreate/canEdit/canDelete) so a client can restrict a
field user to, say, incident reporting only.

## Why CAPA is a shared model

The brief lists CAPA tracking under both Audit Management (non-conformities)
and Incident Management. Rather than duplicating the concept, `CapaAction` has
optional FKs to both `AuditFinding` and `Incident` — one action can originate
from either flow, which matches how the two modules described in the brief
actually interlock in practice.

## Deliberately deferred (not in v1 schema/routes)

- **CMS content model** (blog posts, regulatory alerts) — the brief describes
  this loosely enough ("Blog / Articles", "Regulatory news & alerts") that
  it's worth confirming whether it's a simple flat post model or needs
  categories/authors/scheduling before committing to a schema.
- **Document collaboration / real-time co-editing** — listed as a must-have
  feature but needs a decision on approach (OT/CRDT library vs. simple
  lock-based editing) before it affects the schema.
- **Mobile app API surface** — brief says "API ready for future mobile app";
  the current REST API under `/api` should serve this without changes, but no
  mobile-specific endpoints (push tokens, etc.) are scaffolded yet.
