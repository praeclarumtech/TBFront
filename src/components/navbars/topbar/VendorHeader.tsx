import { useState, useEffect } from "react";
import { Header } from "antd/es/layout/layout";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "utils/commonFunctions";
import { toast } from "react-toastify";

const VendorHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use React state for authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Track if initial auth check is complete

  // Centralized function to clear all auth data
  const clearAuthData = () => {
    const keysToRemove = [
      "authUser",
      "role",
      "expiresAt",
      "id",
      "accessModules",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    toast.error("🔒 Session expired - please log in again");

    // toast.error("Session Expired!");
    setIsLoggedIn(false);
    setUserRole(null);
  };

  // Enhanced function to check authentication status
  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("authUser");
      const roleFromStorage = localStorage.getItem("role");
      const role = roleFromStorage ? roleFromStorage.trim() : null;
      const tokenExpiry = localStorage.getItem("expiresAt");

      // Check if token exists and is not empty
      if (!token || token === "undefined" || token.trim() === "") {
        console.log("❌ No valid token found, clearing auth data");
        clearAuthData();
        setIsAuthChecked(true);
        return false;
      }

      // Check if token is expired FIRST - this is critical
      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        console.log("⏰ Token expired, clearing auth data");
        clearAuthData();
        setIsAuthChecked(true);
        return false;
      }

      setIsLoggedIn(true);
      setUserRole(role);
      setIsAuthChecked(true);
      return true;
    } catch (error) {
      console.error("❌ Error checking auth status:", error);
      clearAuthData();
      setIsAuthChecked(true);
      return false;
    }
  };

  // INITIAL AUTH CHECK ON COMPONENT MOUNT
  useEffect(() => {
    // Perform initial authentication check
    const isAuthenticated = checkAuthStatus();

    // If token is expired and user is on a protected route, redirect immediately
    if (
      !isAuthenticated &&
      (location.pathname.includes("/dashboard") ||
        location.pathname.includes("/appliedJobList"))
    ) {
      navigate("/login", {
        state: { from: location.pathname },
      });
    }

    // Listen for storage changes (useful for multi-tab scenarios)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authUser" || e.key === "role" || e.key === "expiresAt") {
        const isAuth = checkAuthStatus();
        // If auth status changed to false while on protected route
        if (
          !isAuth &&
          (location.pathname.includes("/dashboard") ||
            location.pathname.includes("/appliedJobList"))
        ) {
          navigate("/login");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location, navigate]);

  // RE-CHECK AUTH STATUS WHEN LOCATION CHANGES
  useEffect(() => {
    if (isAuthChecked) {
      checkAuthStatus();
    }
  }, [location.pathname]);

  // Additional useEffect to periodically check token expiry
  useEffect(() => {
    const intervalId = setInterval(() => {
      const tokenExpiry = localStorage.getItem("expiresAt");
      if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
        console.log("⏰ Token expired during session, logging out");
        clearAuthData();
        // Redirect to login if on protected route
        if (
          location.pathname.includes("/dashboard") ||
          location.pathname.includes("/appliedJobList")
        ) {
          navigate("/login");
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [location.pathname, navigate]);

  const path = location.pathname;

  // Determine selected menu key based on current path
  let selectedKey = "home";
  if (path.includes("/appliedJobList")) selectedKey = "view-applications";
  else if (path.includes("/applyNow")) selectedKey = "search-jobs";
  else if (path.includes("/detailed-job/")) selectedKey = "search-jobs";
  else if (path.includes("/job-search")) selectedKey = "search-jobs";
  else if (path.includes("/jobs")) selectedKey = "jobs";
  else if (path.includes("/dashboard")) selectedKey = "dashboard";
  else if (path.includes("/login")) selectedKey = "login";
  else if (path === "/") selectedKey = "home";

  const handleNavigate = (key: string) => {
    // Always check auth status before navigation to protected routes
    const isCurrentlyAuthenticated = checkAuthStatus();

    switch (key) {
      case "search-jobs":
        navigate("/Vendor/job-search");
        break;

      case "dashboard":
        const tokenExpiry = localStorage.getItem("expiresAt");
        if (
          !isCurrentlyAuthenticated ||
          (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry))
        ) {
          toast.error("🔒 Session expired - please log in again");
          logout();
          clearAuthData();
          navigate("/login", { state: { from: "/dashboard" } });
        } else {
          console.log("✅ Dashboard access granted");
          navigate("/dashboard");
        }
        break;

      case "view-applications":
        if (!isCurrentlyAuthenticated) {
          navigate("/login", {
            state: {
              from: "/Vendor/appliedJobList",
            },
          });
        } else {
          navigate("/Vendor/appliedJobList");
        }
        break;

      case "login":
        navigate("/login");
        break;

      case "logout":
        // Clear all auth-related data
        logout();
        clearAuthData(); // Additional cleanup to ensure everything is cleared
        navigate("/login");
        break;

      case "home":
        navigate("/");
        break;

      default:
        break;
    }
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    handleNavigate(e.key);
  };

  // Show loading state until auth check is complete (optional)
  if (!isAuthChecked) {
    return (
      <Header
        className="fixed top-0 z-50 w-full"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading...</div>
      </Header>
    );
  }

  return (
    <Header
      className="fixed top-0 z-50 w-full"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey]}
        onClick={handleMenuClick}
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          flexGrow: 1,
        }}
      >
        {/* Show Dashboard only for admin users when logged in AND token is valid */}
        {userRole === "admin" && isLoggedIn && (
          <Menu.Item key="dashboard">
            Dashboard <i className="fe fe-arrow-up-right me-2"></i>
          </Menu.Item>
        )}

        <Menu.Item key="home">Home</Menu.Item>

        <SubMenu key="jobs-menu" title="Jobs">
          <Menu.Item key="search-jobs">Search Jobs</Menu.Item>
          <Menu.Item key="view-applications">View Applications</Menu.Item>
        </SubMenu>

        {/* Conditional Login/Logout based on authentication status */}
        {!isLoggedIn ? (
          <Menu.Item key="login">Login</Menu.Item>
        ) : (
          <Menu.Item key="logout">Logout</Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default VendorHeader;
