const ACCESS_KEY = 'accessToken';
const REFRESH_KEY = 'refreshToken';

/**
 * Single source of truth for token storage, shared by the axios client and the
 * React auth store so the two cannot drift apart.
 *
 * localStorage is readable by any script on the origin — acceptable for this
 * dev scaffold, but the production shape is an httpOnly refresh cookie with the
 * access token held in memory only.
 */
export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),

  set({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
