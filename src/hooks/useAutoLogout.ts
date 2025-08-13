// components/AutoLogout.tsx
import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { EXPIRES_AT, logout } from "../utils/commonFunctions";
import routes from "../routes/routes"; // Adjust path as needed

const AutoLogout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    // Clear any remaining session data
    localStorage.clear(); // or be more specific about what to clear
    sessionStorage.clear(); // if you use sessionStorage
    
    // Redirect to root/login page using your routes config
    navigate(routes.ROOT.path, { replace: true });
  }, [navigate]);

  useEffect(() => {
    const checkSession = () => {
      const expiresAt = localStorage.getItem(EXPIRES_AT);
      
      // If no expiration time, logout immediately
      if (!expiresAt) {
        handleLogout();
        return;
      }

      const timeout = parseInt(expiresAt) - Date.now();
      
      // If already expired, logout immediately
      if (timeout <= 0) {
        handleLogout();
        return;
      }

      // Set timer for future logout
      const timer = setTimeout(() => {
        handleLogout();
      }, timeout);

      return () => clearTimeout(timer);
    };

    // Initial check
    checkSession();

    // Optional: Check session on window focus (if user switches tabs)
    const handleFocus = () => {
      checkSession();
    };

    window.addEventListener('focus', handleFocus);
    
    // Optional: Check session on storage change (if user logs out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === EXPIRES_AT && !e.newValue) {
        handleLogout();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleLogout]);

  return null;
};

export default AutoLogout;