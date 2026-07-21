import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";

export default function JoinPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const normalizedCode = (code || "").trim().toUpperCase();
    if (!normalizedCode) {
      navigate("/", { replace: true });
      return;
    }

    if (user) {
      // User logged in -> go straight to game
      navigate(`/game/${normalizedCode}`, { replace: true });
    } else {
      // User not logged in -> store room code and redirect to landing page
      try {
        sessionStorage.setItem("pending_room_code", normalizedCode);
      } catch (err) {
        console.error("Failed to save room code to sessionStorage:", err);
      }
      navigate(`/?room=${normalizedCode}`, { replace: true });
    }
  }, [code, user, loading, navigate]);

  return <LoadingScreen />;
}
