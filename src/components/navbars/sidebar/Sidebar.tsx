/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  MailOutlined,
  PieChartOutlined,
  PlusOutlined,
  InboxOutlined,
  TeamOutlined
} from "@ant-design/icons";
import Logosvg from "components/BaseComponents/Logosvg";
import { navigationGroups, masterRoutes } from "constants/navigationConstants";

const { Sider } = Layout;

interface SidebarProps {
  showMenu: boolean;
  toggleMenu: () => void;
  isMobile?: boolean;
}

// Custom scrollbar styles for dark sidebar
const scrollbarStyles = `
.sidebar-light .custom-scrollbar {
  overflow-x: hidden !important;
  overflow-y: auto !important;
  min-width: 0;
  min-height: 0;
  -webkit-overflow-scrolling: touch;
}

.sidebar-light .sidebar-menu {
  min-width: max-content;
  overflow: visible !important;
}

.sidebar-light .sidebar-menu .ant-menu-item,
.sidebar-light .sidebar-menu .ant-menu-submenu-title {
  white-space: nowrap;
  height: auto !important;
  min-height: auto !important;
  line-height: 1.5;
  padding-top: 10px;
  padding-bottom: 10px;
}

.sidebar-light .custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.sidebar-light .custom-scrollbar::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 10px;
}

.sidebar-light .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #404040;
  border-radius: 10px;
}

.sidebar-light .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.sidebar-light .custom-scrollbar::-webkit-scrollbar-corner {
  background: #1a1a1a;
  border-radius: 10px;
}

.sidebar-light .sidebar-menu .ant-menu-item,
.sidebar-light .sidebar-menu .ant-menu-submenu-title {
  color: rgba(255, 255, 255, 0.85) !important;
}

.sidebar-light .sidebar-menu .ant-menu-item a {
  color: rgba(255, 255, 255, 0.85) !important;
}

.sidebar-light .sidebar-menu .ant-menu-item-selected {
  background-color: #624bff !important;
  color: #fff !important;
}

.sidebar-light .sidebar-menu .ant-menu-item-selected a {
  color: #fff !important;
}

.sidebar-light .sidebar-menu .ant-menu-item-selected .anticon {
  color: #fff !important;
}

.sidebar-light .sidebar-menu .ant-menu-item:hover,
.sidebar-light .sidebar-menu .ant-menu-submenu-title:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.sidebar-light .sidebar-menu .ant-menu-submenu .ant-menu {
  background-color: #0d0d0d !important;
}

.sidebar-light .sidebar-menu .ant-menu-submenu-arrow {
  color: rgba(255, 255, 255, 0.7) !important;
}

.sidebar-light .sidebar-menu .ant-menu-item .anticon,
.sidebar-light .sidebar-menu .ant-menu-submenu-title .anticon {
  color: rgba(255, 255, 255, 0.7) !important;
}

.sidebar-light .sidebar-menu .ant-menu-item-selected .anticon {
  color: #fff !important;
}
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = scrollbarStyles;
document.head.appendChild(styleElement);

// custom heading - darker for visibility on light gray background
// const MenuGroupHeading = ({ title }: { title: string }) => (
//   <div
//     style={{
//       padding: "16px 24px 8px",
//       color: "#495057",
//       fontSize: "12px",
//       fontWeight: "600",
//       textTransform: "uppercase",
//       letterSpacing: "1px",
//     }}
//   >
//     {title}
//   </div>
// );

const Sidebar: React.FC<SidebarProps> = ({ toggleMenu }) => {
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("accessModules");
    if (stored && stored !== "undefined" && stored !== "null") {
      try {
        setModules(JSON.parse(stored));
      } catch (err) {
        console.error("Invalid accessModules in localStorage", err);
        setModules([]); // fallback
      }
    } else {
      setModules([]); // fallback if nothing valid
    }
  }, []);

  // Keep submenu open based on current route
  useEffect(() => {
    const path = location.pathname;
    const vendorPaths = ["/vendorList", "/job-listing", "/appliedJobApplicants", "/vendor/applications"];
    const clientPaths = ["/client", "/job-listingClient", "/appliedJobApplicantsClient", "/client/applications"];
    const masterPaths = ["/master/skills", "/master/role-skills", "/master/designation", "/master/qualification", "/master/passing-year", "/master/city", "/master/state", "/master/email-template"];

    const newOpenKeys: string[] = [];
    
    if (vendorPaths.some(p => path.startsWith(p))) {
      newOpenKeys.push("vendor-parent");
    }
    if (clientPaths.some(p => path.startsWith(p))) {
      newOpenKeys.push("client-parent");
    }
    if (masterPaths.some(p => path.startsWith(p))) {
      newOpenKeys.push("masters-parent");
    }

    if (newOpenKeys.length > 0) {
      setOpenKeys(prev => {
        const combined = [...new Set([...prev, ...newOpenKeys])];
        return combined;
      });
    }
  }, [location.pathname]);

  const handleCloseMenu = () => {
    const currentWidth = window.innerWidth;
    const isMobileNow = currentWidth < 768; // or your mobile breakpoint

    if (isMobileNow) {
      toggleMenu();
    }
  };

  return (
    <Sider
      collapsible
      onCollapse={toggleMenu}
      trigger={null}
      className="sidebar-light"
      width={250}
      style={{
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      {/* Logo + Close button (mobile) */}
        <div
          className="sidebar-header"
          style={{
            height: 64,
          minHeight: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderBottom: "1px solid #2d2d2d",
          flexShrink: 0,
        }}
      >
        <Link to="/dashboard" className="sidebar-logo-link">
          <Logosvg className="sidebar-logo-svg" />
        </Link>
      </div>

      {/* Sidebar menu */}
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          overflow: "auto",
          paddingBottom: "20px",
        }}
      >
        <Menu
          mode="inline"
          theme="light"
          className="font-semibold sidebar-menu"
          selectedKeys={[location.pathname]}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          style={{ borderRight: 0 }}
        >
          {/* Always show Dashboard */}
          <Menu.Item
            key="/dashboard"
            icon={<HomeOutlined style={{ fontSize: 18 }} />}
          >
            <Link to="/dashboard" onClick={handleCloseMenu}>
              Dashboard
            </Link>
          </Menu.Item>

          {/* Check for main modules based on sub-item permissions */}
          {(() => {
            // Check if any applicant sub-items have permissions
            const hasApplicantPermissions =
              navigationGroups.APPLICANTS.items.some((item) =>
                modules.includes(item.permission)
              );

            // Check if any vendor sub-items have permissions
            const hasVendorPermissions = navigationGroups.VENDORS.items.some(
              (item) => modules.includes(item.permission)
            );

            // Check if any client sub-items have permissions
            const hasClientPermissions = navigationGroups.CLIENT.items.some(
              (item) => modules.includes(item.permission)
            );

            // Check if any email/reports have permissions
            const hasEmailPermissions = navigationGroups.EMAIL.items.some(
              (item) => modules.includes(item.permission)
            );
            const hasReportPermissions = navigationGroups.REPORTS.items.some(
              (item) => modules.includes(item.permission)
            );

            // Check if any master sub-items have permissions
            const hasMasterPermissions = masterRoutes.some((route) =>
              modules.includes(route.permission)
            );

            return (
              <>
                {/* Applicants Section */}
                {hasApplicantPermissions && (
                  <Menu.ItemGroup
                    key="applicants-group"
                  >
                    {navigationGroups.APPLICANTS.items
                      .filter((item) => modules.includes(item.permission))
                      .map((item) => (
                        <Menu.Item
                          key={item.key}
                          icon={<UserOutlined style={{ fontSize: 18 }} />}
                        >
                          <Link to={item.key} onClick={handleCloseMenu}>
                            {item.label}
                          </Link>
                        </Menu.Item>
                      ))}
                  </Menu.ItemGroup>
                )}

                {/* Vendors Section */}
                {hasVendorPermissions && (
                  <Menu.ItemGroup
                    key="vendors-group"
                  >
                    <Menu.SubMenu
                      key="vendor-parent"
                      icon={<InboxOutlined style={{ fontSize: 18 }} />}
                      title="Vendor"
                    >
                      {navigationGroups.VENDORS.items
                        .filter((item) => modules.includes(item.permission))
                        .map((item) => (
                          <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={handleCloseMenu}>
                              {item.label}
                            </Link>
                          </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                  </Menu.ItemGroup>
                )}

                {/* Client Section */}
                {hasClientPermissions && (
                  <Menu.ItemGroup
                    key="client-group"
                  >
                    <Menu.SubMenu
                      key="client-parent"
                      icon={<TeamOutlined style={{ fontSize: 18 }} />}
                      title="Client"
                    >
                      {navigationGroups.CLIENT.items
                        .filter((item) => modules.includes(item.permission))
                        .map((item) => (
                          <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={handleCloseMenu}>
                              {item.label}
                            </Link>
                          </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                  </Menu.ItemGroup>
                )}

                {/* Email Section */}
                {hasEmailPermissions && (
                  <Menu.ItemGroup
                    key="email-group"
                  >
                    {navigationGroups.EMAIL.items
                      .filter((item) => modules.includes(item.permission))
                      .map((item) => (
                        <Menu.Item
                          key={item.key}
                          icon={<MailOutlined style={{ fontSize: 18 }} />}
                        >
                          <Link to={item.key} onClick={handleCloseMenu}>
                            {item.label}
                          </Link>
                        </Menu.Item>
                      ))}
                  </Menu.ItemGroup>
                )}

                {/* Reports Section */}
                {hasReportPermissions && (
                  <Menu.ItemGroup
                    key="reports-group"
                  >
                    {navigationGroups.REPORTS.items
                      .filter((item) => modules.includes(item.permission))
                      .map((item) => (
                        <Menu.Item
                          key={item.key}
                          icon={<PieChartOutlined style={{ fontSize: 18 }} />}
                        >
                          <Link to={item.key} onClick={handleCloseMenu}>
                            {item.label}
                          </Link>
                        </Menu.Item>
                      ))}
                  </Menu.ItemGroup>
                )}

                {/* Masters Section */}
                {hasMasterPermissions && (
                  <Menu.ItemGroup
                    key="masters-group"
                  >
                    <Menu.SubMenu
                      key="masters-parent"
                      icon={<PlusOutlined style={{ fontSize: 18 }} />}
                      title="Masters"
                    >
                      {masterRoutes
                        .filter((route) => modules.includes(route.permission))
                        .map((route) => (
                          <Menu.Item key={route.key}>
                            <Link to={route.key} onClick={handleCloseMenu}>
                              {route.label}
                            </Link>
                          </Menu.Item>
                        ))}
                    </Menu.SubMenu>
                  </Menu.ItemGroup>
                )}
              </>
            );
          })()}
        </Menu>
      </div>
    </Sider>
  );
};

export default Sidebar;
