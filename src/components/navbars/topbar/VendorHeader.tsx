import { Header } from "antd/es/layout/layout";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import SubMenu from "antd/es/menu/SubMenu";
import { useNavigate, useLocation } from "react-router-dom";

const VendorHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Example: check login via token in localStorage
  const token = localStorage.getItem("authUser");
  const isLoggedIn = !!token && token !== "undefined" && token.trim() !== "";

  const path = location.pathname;
  // const pathre = "/Vendor/appliedJobList";
  let selectedKey = "home";
  if (path.includes("/appliedJobList")) selectedKey = "view-applications";
  else if (path.includes("/applyNow")) selectedKey = "search-jobs";
  else if (path.includes("/detailed-job/")) selectedKey = "search-jobs";
  else if (path.includes("/job-search")) selectedKey = "search-jobs";
  else if (path.includes("/jobs")) selectedKey = "jobs";
  else if (path.includes("/")) selectedKey = "home";
  else if (path.includes("/login")) selectedKey = "login";

  const handleNavigate = (key: string) => {
    switch (key) {
      case "search-jobs":
        navigate("/Vendor/job-search");
        break;

      case "view-applications":
        if (!isLoggedIn) {
          var path = "/Vendor/appliedJobList";
          navigate("/login", {
            state: {
              from: path || "/dashboard",
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
        localStorage.removeItem("authUser"); // Clear login token
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
        <Menu.Item key="home">Home</Menu.Item>
        <SubMenu key="jobs-menu" title="Jobs">
          <Menu.Item key="search-jobs">Search Jobs</Menu.Item>
          <Menu.Item key="view-applications">View Applications</Menu.Item>
        </SubMenu>

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
