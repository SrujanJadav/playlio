import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { AudioProvider } from "./context/AudioContext";
import PixelSpeaker from "./components/PixelSpeaker";

import LandingPage     from "./pages/LandingPage";
import LobbyLayout     from "./layouts/LobbyLayout";
import LoadingScreen   from "./components/LoadingScreen";

// Lazy load pages to split heavy chunks (GSAP, Fiber, Face-API, etc.)
const LobbyPage       = lazy(() => import("./pages/LobbyPage"));
const GamePage        = lazy(() => import("./pages/GamePage"));
const ProfilePage     = lazy(() => import("./pages/ProfilePage"));
const LeaderboardPage = lazy(() => import("./pages/LeaderboardPage"));

// Guard: redirects to / if not logged in
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user)   return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/"            element={<LandingPage />} />
        {/* Lobby/Leaderboard/Profile share a persistent background layout */}
        <Route element={<ProtectedRoute><LobbyLayout /></ProtectedRoute>}>
          <Route path="/lobby"       element={<LobbyPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile"     element={<ProfilePage />} />
        </Route>
        <Route path="/game/:code"  element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="*"            element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <AuthProvider>
        <SocketProvider>
          <PixelSpeaker />
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </AudioProvider>
  );
}
