import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthFailureHandler } from '../api/client';
import { tokenStore } from '../api/tokenStore';

const AuthContext = createContext(null);

/**
 * Holds the signed-in user for the whole portal.
 *
 * A token in localStorage is only a claim — on boot we verify it against
 * GET /auth/me before treating anyone as authenticated, so a tampered or
 * expired token can't paint a logged-in shell. `status` stays 'loading' until
 * that round-trip settles, which is what keeps RequireAuth from flashing the
 * login page for a user who is in fact signed in.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState(tokenStore.getAccess() ? 'loading' : 'anonymous');

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus('anonymous');
  }, []);

  // A refresh that fails anywhere in the app lands here.
  useEffect(() => {
    setAuthFailureHandler(logout);
    return () => setAuthFailureHandler(null);
  }, [logout]);

  useEffect(() => {
    if (status !== 'loading') return undefined;

    let cancelled = false;
    api
      .get('/auth/me')
      .then(({ data }) => {
        if (cancelled) return;
        setUser(data.user);
        setStatus('authenticated');
      })
      .catch(() => {
        if (cancelled) return;
        tokenStore.clear();
        setUser(null);
        setStatus('anonymous');
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  // Called by the login form once /auth/login has returned tokens.
  const login = useCallback(async (tokens) => {
    tokenStore.set(tokens);
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    setStatus('authenticated');
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, status, login, logout, isAuthenticated: status === 'authenticated' }),
    [user, status, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
