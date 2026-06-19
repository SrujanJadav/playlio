import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import LandingPage     from "./pages/LandingPage";
import LobbyPage       from "./pages/LobbyPage";
import GamePage        from "./pages/GamePage";
import ProfilePage     from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LobbyLayout     from "./layouts/LobbyLayout";
import LoadingScreen   from "./components/LoadingScreen";

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
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </AuthProvider>
  );
}
