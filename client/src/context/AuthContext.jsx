import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

const demoUser = {
  id: "demo",
  name: "Demo Student",
  email: "demo@finsight.ai",
  profile: {
    school: "FinSight Demo",
    experience: "beginner",
    riskTolerance: "balanced",
    goals: ["Learn investing", "Build a paper portfolio", "Understand budgeting"]
  },
  watchlist: ["AAPL", "MSFT", "NVDA"],
  badges: []
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(demoUser);

  const value = useMemo(
    () => ({
      user,
      loading: false,
      async login() {
        setUser(demoUser);
      },
      async register() {
        setUser(demoUser);
      },
      logout() {
        setUser(demoUser);
      },
      async updateProfile(profile) {
        const data = await api("/auth/profile", { method: "PATCH", body: JSON.stringify(profile) });
        const updatedUser = data.user || { ...user, profile: { ...user.profile, ...profile } };
        setUser(updatedUser);
        return updatedUser;
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
