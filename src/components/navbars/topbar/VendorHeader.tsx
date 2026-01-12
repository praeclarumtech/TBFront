import { useState, useEffect } from "react";
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
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);

  // Centralized function to clear all auth data
  // showToast parameter controls whether to show the session expired toast
  // - true: when session actually expired (user was logged in but token expired)
  // - false: when user was never logged in (no token exists)
  const clearAuthData = (showToast: boolean = false) => {
    const keysToRemove = [
      "authUser",
      "role",
      "expiresAt",
      "id",
      "accessModules",
    ];
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Only show toast when session actually expired, not when user was never logged in
    // Use toastId to prevent duplicate toasts
    if (showToast) {
      toast.error("🔒 Session expired - please log in again", {
        toastId: "session-expired",
      });
    }

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

      // Check if token is expired FIRST - this is critical
      // Show toast - session actually expired (only if token and expiry exist)
      if (
        token &&
        tokenExpiry &&
        new Date().getTime() > parseInt(tokenExpiry)
      ) {
        clearAuthData(true);
        setIsAuthChecked(true);
        return false;
      }

      // Check if token exists and is not empty
      // Don't show toast - user was never logged in
      if (!token || token === "undefined" || token.trim() === "") {
        clearAuthData(false);
        setIsAuthChecked(true);
        return false;
      }

      setIsLoggedIn(true);
      setUserRole(role);
      setIsAuthChecked(true);
      return true;
    } catch (error) {
      clearAuthData(false);
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
        clearAuthData(true); // Show toast - session actually expired during use
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
          logout();
          clearAuthData(true); // Show toast - session expired when accessing dashboard
          navigate("/login", { state: { from: "/dashboard" } });
        } else {
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
        logout();
        clearAuthData(false); // Don't show toast - user intentionally logged out
        navigate("/login");
        break;

      case "home":
        navigate("/", { replace: true });
        break;

      default:
        break;
    }
  };

  // Show loading state until auth check is complete (optional)
  if (!isAuthChecked) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="text-white">Loading...</div>
          </div>
        </div>
      </header>
    );
  }

  const isActive = (key: string) => selectedKey === key;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          {/* Navigation Links - Right */}
          <nav className="flex items-center justify-center gap-1">
            {/* Dashboard - Only for admin */}
            {userRole === "admin" && isLoggedIn && (
              <button
                onClick={() => handleNavigate("dashboard")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("dashboard")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                Dashboard
              </button>
            )}

            {/* Home */}
            <button
              onClick={() => handleNavigate("home")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive("home")
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Home
            </button>

            {/* Jobs Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsJobsDropdownOpen(true)}
              onMouseLeave={() => setIsJobsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsJobsDropdownOpen(!isJobsDropdownOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isActive("search-jobs") || isActive("view-applications")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                Jobs
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isJobsDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {/* Dropdown Menu */}
              {isJobsDropdownOpen && (
                <div className="absolute right-0 top-full w-48 z-50">
                  {/* Invisible bridge to prevent gap issues */}
                  <div className="h-2"></div>
                  <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleNavigate("search-jobs");
                          setIsJobsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          isActive("search-jobs")
                            ? "bg-primary/20 text-primary"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        Search Jobs
                      </button>
                      <button
                        onClick={() => {
                          handleNavigate("view-applications");
                          setIsJobsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          isActive("view-applications")
                            ? "bg-primary/20 text-primary"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                        }`}
                      >
                        View Applications
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Login/Logout */}
            {!isLoggedIn ? (
              <button
                onClick={() => handleNavigate("login")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("login")
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                Login
              </button>
            ) : (
              <button
                onClick={() => handleNavigate("logout")}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default VendorHeader;
