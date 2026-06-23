import { BookOpen, Bot, BriefcaseBusiness, LayoutDashboard, Menu, Settings, TrendingUp, X } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

const navigation = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/market", label: "Market", icon: TrendingUp },
  { to: "/portfolio", label: "Portfolio", icon: BriefcaseBusiness },
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/advisor", label: "AI Advisor", icon: Bot }
];

export default function AppShell() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-head">
          <Logo />
          <button className="icon-button mobile-only" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>
        <nav className="nav-list">
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === "/"} onClick={() => setMobileOpen(false)}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/profile" className="profile-chip">
            <span className="avatar">{user?.name?.slice(0, 1).toUpperCase()}</span>
            <span><strong>{user?.name}</strong><small>{user?.profile?.experience || "beginner"} investor</small></span>
            <Settings size={16} />
          </NavLink>
          <p className="disclaimer-mini">Demo mode is enabled. No sign-in required.</p>
          <p className="disclaimer-mini">Educational tools only. Not financial advice.</p>
        </div>
      </aside>
      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
      <main className="main-area">
        <header className="mobile-header">
          <button className="icon-button" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <Logo />
          <span className="avatar small">{user?.name?.slice(0, 1).toUpperCase()}</span>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
