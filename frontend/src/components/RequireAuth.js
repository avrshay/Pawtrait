import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/authService";

// Wrap any page that should be blocked for guests.
// If nobody is logged in, redirect straight to /login instead of rendering the page.
export default function RequireAuth({ children }) {
  const location = useLocation();
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
