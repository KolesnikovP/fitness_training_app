import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ApiError, extractUserIDFromToken, login as apiLogin, register as apiRegister } from "@/shared/api/client";
import { clearTokens, getAccessToken, saveTokens } from "@/shared/auth/storage";

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<{ id: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAccessToken()
      .then((token) => setIsLoggedIn(token !== null))
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    const userID = extractUserIDFromToken(data.access_token);
    if (!userID) throw new ApiError(500, "INTERNAL_ERROR", "Malformed token received.");
    await saveTokens(data.access_token, data.refresh_token, userID);
    setIsLoggedIn(true);
  }, []);

  const register = useCallback(async (email: string, password: string, role: string) => {
    return apiRegister(email, password, role);
  }, []);

  const logout = useCallback(async () => {
    await clearTokens();
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
