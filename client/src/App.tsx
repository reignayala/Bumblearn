import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { useAuth } from "./lib/auth";
import { ChatPage } from "./pages/ChatPage";
import { DiscoverPage } from "./pages/DiscoverPage";
import { LoginPage } from "./pages/LoginPage";
import { MatchesPage } from "./pages/MatchesPage";
import { OnboardingPage } from "./pages/OnboardingPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignupPage } from "./pages/SignupPage";
import { WelcomePage } from "./pages/WelcomePage";

function PublicOnly() {
  const { user, loading } = useAuth();
  if (loading) return <BootScreen />;
  if (user?.onboardingComplete) return <Navigate to="/" replace />;
  if (user && !user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function OnboardingOnly() {
  const { user, loading } = useAuth();
  if (loading) return <BootScreen />;
  if (!user) return <Navigate to="/welcome" replace />;
  if (user.onboardingComplete) return <Navigate to="/" replace />;
  return <Outlet />;
}

function ProtectedApp() {
  const { user, loading } = useAuth();
  if (loading) return <BootScreen />;
  if (!user) return <Navigate to="/welcome" replace />;
  if (!user.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}

function BootScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-muted">
      Loading Bumblearn…
    </div>
  );
}

export default function App() {
  const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;

  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route element={<PublicOnly />}>
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route element={<OnboardingOnly />}>
          <Route path="onboarding" element={<OnboardingPage />} />
        </Route>

        <Route element={<ProtectedApp />}>
          <Route element={<AppShell />}>
            <Route index element={<DiscoverPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="matches/:matchId" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
