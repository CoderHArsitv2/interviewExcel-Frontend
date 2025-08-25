import { createContext, useContext, useEffect, useState } from "react";
import { authenticatedGet, authenticatedPost, get, post } from "./api"; // <--- reusing
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
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const isAuthenticated = !!user;

  useEffect(() => {
    const token = getToken();
    if (token) {
      console.log("Found token, fetching user...",token);
      fetchUserFromToken(token);
    }
  }, []);

  const logout = () => {
    removeToken();
    setUser(null);
    router.push(`/${userRole}/Signin`);
    if (refreshTimer) clearTimeout(refreshTimer);
  };

  const setupAutoRefresh = (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      const timeUntilRefresh = (exp - now - 60) * 1000;

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
      const res: RefreshSessionResponse = await get(
        `/${userRole}/auth/refresh-session`
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
      const data: any = await authenticatedPost("/api/me", token);
      setUser(data.user);
      setupAutoRefresh(token);
    } catch (err) {
      console.log("Token invalid, trying to refresh...");
      await refreshSession();
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setUser, logout }}>
      {children}
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
