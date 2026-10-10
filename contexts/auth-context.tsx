"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  api,
  getToken,
  setToken,
  type AuthUser,
} from "@/lib/api";

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial localStorage restore is running */
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  adminLogin: (username: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const USER_KEY = "gtc-user";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount: cached user for instant paint, then
  // revalidate the token against the API.
  useEffect(() => {
    const cached = localStorage.getItem(USER_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached) as AuthUser);
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }

    if (getToken()) {
      api
        .me()
        .then(({ user }) => {
          setUser(user);
          localStorage.setItem(USER_KEY, JSON.stringify(user));
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem(USER_KEY);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const persist = (u: AuthUser, token: string) => {
    setToken(token);
    setUser(u);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  };

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await api.login({ email, password });
    persist(user, token);
    return user;
  }, []);

  const adminLogin = useCallback(
    async (username: string, password: string) => {
      const { user, token } = await api.adminLogin({ username, password });
      persist(user, token);
      return user;
    },
    []
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { user, token } = await api.register({ name, email, password });
      persist(user, token);
      return user;
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await api.logoutRequest();
      }
    } catch {
      // Token may already be invalid - clear locally regardless.
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        adminLogin,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
