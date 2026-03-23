"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { authenticatedGet, authenticatedPost } from "./api"; // <--- reusing
import { RefreshSessionResponse } from "./type";
import { useRouter } from "next/navigation";

export const setToken = (token: string) => {
  localStorage.setItem("access_token", token);
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const removeToken = () => {
  localStorage.removeItem("access_token");
};

interface User {
  id: number;
  name: string;
  uuid: string;
  email: string;
  role: "student" | "expert";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
  userRole,
}: {
  children: React.ReactNode;
  userRole: "student" | "expert";
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = getToken();
    console.log("token", token);
    if (token) {
      fetchUserFromToken(token);
    } else {
      setLoading(false);
      router.push(`/${userRole}/auth`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    router.push(`/${userRole}/auth`);
    if (refreshTimer) clearTimeout(refreshTimer);
  };

  const setupAutoRefresh = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilRefresh = (exp - now - 10) * 1000;
      console.log("timeUntilRefresh", timeUntilRefresh);

      if (refreshTimer) clearTimeout(refreshTimer);

      const timer = setTimeout(() => {
        refreshSession();
      }, timeUntilRefresh);

      setRefreshTimer(timer);
    } catch (err) {
      console.error("Token decode failed", err);
    }
  };

  const refreshSession = async () => {
    try {
      const res: RefreshSessionResponse = await authenticatedGet(
        `/auth/refresh`
      );
      const newToken = res.access_token;

      setToken(newToken);
      setupAutoRefresh(newToken);
      fetchUserFromToken(newToken);
    } catch (err) {
      console.error("Session refresh failed:", err);
      logout();
    }
  };

  const fetchUserFromToken = async (token: string) => {
    try {
      const data = await authenticatedPost<{ user: User }>("/auth/user", token);
      setUser(data.user);
      setupAutoRefresh(token);
    } catch (err: unknown) {
      console.log("Token invalid, trying to refresh...", err);
      await refreshSession();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};
