// src/hooks/useAuth.ts

import { useAuthContext } from "@/providers/authProvider";

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout } = useAuthContext();
  return { user, isAuthenticated, setUser, logout };
};
