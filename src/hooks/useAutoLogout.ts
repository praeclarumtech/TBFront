// components/AutoLogout.tsx
import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { EXPIRES_AT, logout } from "../utils/commonFunctions";
import routes from "../routes/routes";

interface AutoLogoutProps {
  warningThreshold?: number; // ms before expiry to show warning
  onWarning?: () => void; // callback when warning should be shown
  onLogout?: () => void; // callback before logout
}

const AutoLogout = ({
  warningThreshold = 5 * 60 * 60 * 1000, // 5 minutes default
  onWarning,
  onLogout,
}: AutoLogoutProps) => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningShownRef = useRef(false);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(() => {
    try {
      // Call optional callback before logout
      onLogout?.();

      logout();

      // Clear session data
      localStorage.clear();
      sessionStorage.clear();

      // Clear timers
      clearTimers();

      // Redirect to login
      navigate(routes.ROOT.path, { replace: true });
    } catch (error) {
      console.error("Error during auto-logout:", error);
      // Still proceed with navigation even if logout fails
      navigate(routes.ROOT.path, { replace: true });
    }
  }, [navigate, onLogout, clearTimers]);

  const handleWarning = useCallback(() => {
    if (!warningShownRef.current) {
      warningShownRef.current = true;
      onWarning?.();
    }
  }, [onWarning]);

  const checkSession = useCallback(() => {
    const expiresAt = localStorage.getItem(EXPIRES_AT);

    // Clear existing timers
    clearTimers();
    warningShownRef.current = false;

    // If no expiration time, logout immediately
    if (!expiresAt) {
      handleLogout();
      return;
    }

    const expirationTime = parseInt(expiresAt, 10);

    // Validate the timestamp
    if (isNaN(expirationTime)) {
      console.warn("Invalid expiration timestamp found");
      handleLogout();
      return;
    }

    const currentTime = Date.now();
    const timeout = expirationTime - currentTime;

    // If already expired, logout immediately
    if (timeout <= 0) {
      handleLogout();
      return;
    }

    // Set warning timer if there's enough time
    const warningTime = timeout - warningThreshold;
    if (warningTime > 0 && onWarning) {
      warningTimeoutRef.current = setTimeout(handleWarning, warningTime);
    }

    // Set logout timer
    timeoutRef.current = setTimeout(handleLogout, timeout);
  }, [handleLogout, handleWarning, warningThreshold, onWarning, clearTimers]);

  useEffect(() => {
    // Initial session check
    checkSession();

    // Check session when window gains focus
    const handleFocus = () => {
      checkSession();
    };

    // Handle storage changes (logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === EXPIRES_AT) {
        if (!e.newValue) {
          // Session cleared in another tab
          handleLogout();
        } else {
          // Session updated in another tab
          checkSession();
        }
      }
    };

    // Handle page visibility changes (more reliable than focus)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkSession();
      }
    };

    // Add event listeners
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      clearTimers();
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [checkSession, handleLogout, clearTimers]);

  return null;
};

export default AutoLogout;
