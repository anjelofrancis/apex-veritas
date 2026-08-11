import axios from 'axios';
import { tokenStore } from './tokenStore';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
export const api = axios.create({ baseURL: API_BASE });

// The auth provider registers a callback here so a failed refresh can drop the
// React tree back to the login screen. Without a listener we still clear the
// tokens — the next guarded render will bounce to /login on its own.
let onAuthFailure = null;
export function setAuthFailureHandler(handler) {
  onAuthFailure = handler;
}

api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// One shared refresh promise, so a page firing six queries at once that all
// return 401 triggers a single /auth/refresh rather than six competing ones.
let refreshInFlight = null;

function refreshTokens() {
  if (!refreshInFlight) {
    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) return Promise.reject(new Error('No refresh token'));

    // A bare axios call, not `api` — going through the instance would attach
    // the dead access token and recurse through this interceptor.
    refreshInFlight = axios
      .post('/api/auth/refresh', { refreshToken })
      .then(({ data }) => {
        tokenStore.set(data);
        return data.accessToken;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;

    // `_retried` stops a 401 on the retry itself from looping forever.
    if (response?.status !== 401 || !config || config._retried) {
      return Promise.reject(error);
    }
    // A 401 from the refresh route means the refresh token is gone too.
    if (config.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    config._retried = true;
    try {
      const accessToken = await refreshTokens();
      config.headers.Authorization = `Bearer ${accessToken}`;
      return api(config);
    } catch {
      tokenStore.clear();
      if (onAuthFailure) onAuthFailure();
      return Promise.reject(error);
    }
  },
);
