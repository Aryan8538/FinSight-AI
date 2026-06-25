import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("finsight_token")) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem("finsight_token"))
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(credentials) {
        const data = await api("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
        localStorage.setItem("finsight_token", data.token);
        setUser(data.user);
      },
      async register(values) {
        const data = await api("/auth/register", { method: "POST", body: JSON.stringify(values) });
        localStorage.setItem("finsight_token", data.token);
        setUser(data.user);
      },
      logout() {
        localStorage.removeItem("finsight_token");
        setUser(null);
      },
      async updateProfile(profile) {
        const data = await api("/auth/profile", { method: "PATCH", body: JSON.stringify(profile) });
        setUser(data.user);
        return data.user;
      }
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

