import { useState, useEffect } from "react";
import { Header } from "antd/es/layout/layout";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "utils/commonFunctions";

const VendorHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Use React state for authentication status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Function to check authentication status
  const checkAuthStatus = () => {
    const token = localStorage.getItem("authUser");
    const roleFromStorage = localStorage.getItem("role");
    const role = roleFromStorage ? roleFromStorage.trim() : null;
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    // Check if token exists and is not empty
    if (!token || token === "undefined" || token.trim() === "") {
      setIsLoggedIn(false);
      setUserRole(null);
      return false;
    }

    // Check if token is expired (optional - if you store expiry)
    if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
      localStorage.removeItem("authUser");
      localStorage.removeItem("role");
      localStorage.removeItem("tokenExpiry");
      setIsLoggedIn(false);
      setUserRole(null);
      return false;
    }

    setIsLoggedIn(true);
    setUserRole(role);
    return true;
  };

  // Check auth status on component mount and location change
  useEffect(() => {
    checkAuthStatus();

    // Listen for storage changes (useful for multi-tab scenarios)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "authUser" || e.key === "role") {
        checkAuthStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

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
    switch (key) {
      case "search-jobs":
        navigate("/Vendor/job-search");
        break;

      case "dashboard":
        if (!isLoggedIn) {
          navigate("/login", {
            state: {
              from: "/dashboard",
            },
          });
        } else {
          navigate("/dashboard");
        }
        break;

      case "view-applications":
        if (!isLoggedIn) {
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
        navigate("/login");

        // window.location.reload();
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
        {/* Show Dashboard only for admin users when logged in */}
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
