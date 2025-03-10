import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store authentication state in React state instead of calling localStorage directly
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };

    window.addEventListener("storage", checkAuth); // Sync across tabs
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login", { 
        replace: true, 
        state: { from: location.pathname }
      });
    }
  }, [isAuthenticated]); // Only run when authentication status changes

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
