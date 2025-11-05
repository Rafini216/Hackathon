import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authAPI } from "@/services/api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== "undefined" ? localStorage.getItem("auth:user") : null;
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        if (parsedUser.id === "1" || 
            parsedUser.email === "user@example.com" || 
            parsedUser.name === "Brooklyn Simmons" ||
            (!parsedUser.id && !parsedUser._id)) {
          localStorage.removeItem("auth:user");
          setUser(null);
        } else {
          setUser(parsedUser);
        }
      } catch {
        localStorage.removeItem("auth:user");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (user) {
      localStorage.setItem("auth:user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth:user");
    }
  }, [user, mounted]);

  const login = async ({ email, password }) => {
    try {
      const response = await authAPI.login(email, password);
      if (response.user) {
        setUser(response.user);
        return { ok: true, user: response.user };
      }
      return { ok: false, error: response.message || "Erro ao fazer login" };
    } catch (error) {
      return { ok: false, error: error.message || "Erro ao fazer login" };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const response = await authAPI.register(name, email, password);
      if (response.user) {
        setUser(response.user);
        return { ok: true, user: response.user, message: response.message || "Conta criada com sucesso!" };
      }
      return { ok: false, error: response.message || "Erro ao registrar" };
    } catch (error) {
      console.error("Erro no AuthContext register:", error);
      return { ok: false, error: error.message || "Erro ao registrar" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth:user");
  };

  const value = useMemo(() => ({ user, login, register, logout, mounted, loading }), [user, mounted, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}


