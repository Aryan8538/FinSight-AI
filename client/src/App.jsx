import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell.jsx";
import Loading from "./components/Loading.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import AdvisorPage from "./pages/AdvisorPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LearnPage from "./pages/LearnPage.jsx";
import LessonPage from "./pages/LessonPage.jsx";
import MarketPage from "./pages/MarketPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <AppShell /> : <Navigate to="/auth" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<ProtectedLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:slug" element={<LessonPage />} />
        <Route path="/advisor" element={<AdvisorPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
