// components/AutoLogout.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EXPIRES_AT, logout } from "utils/commonFunctions";

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const expiresAt = localStorage.getItem(EXPIRES_AT);
    if (!expiresAt) return;

    const timeout = parseInt(expiresAt) - Date.now();
    if (timeout <= 0) {
      logout();
      navigate("/", { replace: true });
    } else {
      const timer = setTimeout(() => {
        logout();
        navigate("/", { replace: true });
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return null;
};

export default AutoLogout;
