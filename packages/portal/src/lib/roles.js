/**
 * Role constants and the capability checks the admin panel needs.
 *
 * These mirror the API's guards in packages/api/src/modules/admin/routes.js:
 * `onlyInternal` there is INTERNAL_ROLES here, and every route that calls
 * requireRole('SUPER_ADMIN') is one canManagePlatform() gates. Keep the two in
 * step — a UI that offers an action the API refuses is worse than one that
 * hides it, because the user only finds out after filling in the form.
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  CONSULTANT: 'CONSULTANT',
};

// Who may open the admin panel at all.
export const INTERNAL_ROLES = [ROLES.SUPER_ADMIN, ROLES.CONSULTANT];

export function isInternal(user) {
  return INTERNAL_ROLES.includes(user?.role);
}

/**
 * Who may write platform-wide records (tenants, the template catalogue) and
 * read cross-tenant analytics. Consultants are read-only at that level.
 */
export function canManagePlatform(user) {
  return user?.role === ROLES.SUPER_ADMIN;
}
