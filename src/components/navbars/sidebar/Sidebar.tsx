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
  TeamOutlined,
} from "@ant-design/icons";
import Logosvg from "components/BaseComponents/Logosvg";
import { navigationGroups, masterRoutes } from "constants/navigationConstants";

const { Sider } = Layout;

interface SidebarProps {
  showMenu: boolean;
  toggleMenu: () => void;
}

// Custom scrollbar styles
const scrollbarStyles = `
 .custom-scrollbar {
  overflow-y: hidden;
  height: 100%;
}

.custom-scrollbar:hover {
  overflow-y: auto;
}

/* WebKit scrollbar styles */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #141414; /* same as your bg-dark */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #444; /* slightly lighter for visibility */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #666; /* slightly lighter on hover */
}
  .custom-sidebar .ant-menu-item,
.custom-sidebar .ant-menu-submenu-title {
  color: #fff !important;
}

.custom-sidebar .ant-menu-item a {
  color: #fff !important;
}

.custom-sidebar .ant-menu-item .anticon,
.custom-sidebar .ant-menu-submenu-title .anticon {
  color: #fff !important;
}

.custom-sidebar .ant-menu-submenu-arrow {
  color: #fff !important;
}

/* Optional: highlight selected item with a subtle background */
.custom-sidebar .ant-menu-item-selected {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* Optional: hover background for clarity */
.custom-sidebar .ant-menu-item:hover,
.custom-sidebar .ant-menu-submenu-title:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}
  .custom-sidebar .ant-menu-submenu .ant-menu {
  background-color: #141414 !important; /* update to your exact bg-dark hex */
}
`;

const styleElement = document.createElement("style");
styleElement.innerHTML = scrollbarStyles;
document.head.appendChild(styleElement);

// custom heading
const MenuGroupHeading = ({ title }: { title: string }) => (
  <div
    style={{
      padding: "16px 24px 8px",
      color: "#8c8c8c",
      fontSize: "12px",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "1px",
    }}
  >
    {title}
  </div>
);

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
      className="bg-dark"
      width={250}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      {/* Logo */}
      <div
        className="custom-scrollbar mt-3"
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Link to="/dashboard">
          <Logosvg />
        </Link>
      </div>

      {/* Sidebar menu */}
      <div
        className="custom-scrollbar"
        style={{
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          paddingBottom: "20px",
        }}
      >
        <Menu
          mode="inline"
          theme="dark"
          className="font-semibold bg-dark"
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
                    title={
                      <MenuGroupHeading
                        title={navigationGroups.APPLICANTS.title}
                      />
                    }
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
                    title={
                      <MenuGroupHeading
                        title={navigationGroups.VENDORS.title}
                      />
                    }
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
                    title={
                      <MenuGroupHeading title={navigationGroups.CLIENT.title} />
                    }
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
                    title={
                      <MenuGroupHeading title={navigationGroups.EMAIL.title} />
                    }
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
                    title={
                      <MenuGroupHeading
                        title={navigationGroups.REPORTS.title}
                      />
                    }
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
                    title={
                      <MenuGroupHeading
                        title={navigationGroups.MASTERS.title}
                      />
                    }
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
