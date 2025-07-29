/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  DownloadOutlined,
  MailOutlined,
  PieChartOutlined,
  PlusOutlined,
  InboxOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const isMobile = window.innerWidth < 768;

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
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [role]);

  return (
    <Sider
      collapsible
      // collapsed={collapsed}
      onCollapse={toggleMenu}
      trigger={null} // disables default arrow
      // theme="dark"
      className="bg-dark"
      width={250}
      style={{
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
        className="mt-3"
      >
        <Link to="/dashboard" className="navbar-brand">
          <h4 className="text-3xl font-bold text-white">
            Talent<span className="text-primary ">Box</span>
          </h4>{" "}
        </Link>
      </div>

      <div
        className="custom-scrollbar"
        style={{
          height: "calc(100vh - 64px)",
          overflowY: "auto",
          paddingBottom: "20px",
        }}
      >
        <>
          <style>{`
             .ant-menu-item-selected {
                 background-color: #624bff !important;
                 }
          `}</style>

          <Menu
            mode="inline"
            theme="dark"
            className="font-semibold bg-dark"
            selectedKeys={[location.pathname]}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            style={{ borderRight: 0 }}
          >
            {/* Dashboard */}
            <Menu.Item
              key="/dashboard"
              icon={<HomeOutlined style={{ fontSize: "18px" }} />}
            >
              <Link
                to="/dashboard"
                onClick={() => {
                  if (isMobile) toggleMenu();
                }}
              >
                Dashboard
              </Link>
            </Menu.Item>
            {role !== "vendor" && role !== "client" && (
              <>
                <Menu.ItemGroup
                  key="applicants-group"
                  title={<MenuGroupHeading title="APPLICANTS" />}
                />
                <Menu.Item
                  key="/applicants"
                  icon={<UserOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/applicants"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Applicants
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/import-applicants"
                  icon={<DownloadOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/import-applicants"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Import Applicants
                  </Link>
                </Menu.Item>
              </>
            )}
            {(role === "vendor" || role === "hr" || role === "admin") && (
              <>
                {/* VENDORS */}
                <Menu.ItemGroup
                  key="vendors-group"
                  title={<MenuGroupHeading title="VENDORS" />}
                />
                <Menu.SubMenu
                  key="vendor-parent"
                  icon={<InboxOutlined style={{ fontSize: "18px" }} />}
                  title="Vendor"
                >
                  {role !== "vendor" && (
                    <Menu.Item key="/vendorList">
                      <Link
                        to="/vendorList"
                        onClick={() => {
                          if (isMobile) toggleMenu();
                        }}
                      >
                        Vendors
                      </Link>
                    </Menu.Item>
                  )}
                  <Menu.Item key="/job-listing">
                    <Link
                      to="/job-listing"
                      onClick={() => {
                        if (isMobile) toggleMenu();
                      }}
                    >
                      Job Listing
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/appliedJobApplicants">
                    <Link
                      to="/appliedJobApplicants"
                      onClick={() => {
                        if (isMobile) toggleMenu();
                      }}
                    >
                      Jobs Applicants
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            )}

            {role === "admin" || role === "client" || role === "hr" ? (
              <>
                {/* CLIENT */}
                <Menu.ItemGroup
                  key="clint-group"
                  title={<MenuGroupHeading title="CLIENT" />}
                />
                <Menu.SubMenu
                  key="client-parent"
                  icon={<TeamOutlined style={{ fontSize: "18px" }} />}
                  title="Client"
                >
                  {(role === "admin" || role === "hr") && (
                    <Menu.Item key="/client">
                      <Link
                        to="/client"
                        onClick={() => {
                          if (isMobile) toggleMenu();
                        }}
                      >
                        Clients
                      </Link>
                    </Menu.Item>
                  )}

                  <Menu.Item key="/job-listingClient">
                    <Link
                      to="/job-listingClient"
                      onClick={() => {
                        if (isMobile) toggleMenu();
                      }}
                    >
                      Client Job Listing
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="/appliedJobApplicantsClient">
                    <Link
                      to="/appliedJobApplicantsClient"
                      onClick={() => {
                        if (isMobile) toggleMenu();
                      }}
                    > 
                      Jobs Applicants
                    </Link>
                  </Menu.Item>
                </Menu.SubMenu>
              </>
            ) : (
              <></>
            )}
            {/* ANALYSIS */}
            <Menu.ItemGroup
              key="analysis-group"
              title={<MenuGroupHeading title="ANALYSIS" />}
            />
            {role !== "vendor" && role !== "client" && (
              <Menu.Item
                key="/email"
                icon={<MailOutlined style={{ fontSize: "18px" }} />}
              >
                <Link
                  to="/email"
                  onClick={() => {
                    if (isMobile) toggleMenu();
                  }}
                >
                  Email
                </Link>
              </Menu.Item>
            )}

            <Menu.Item
              key="/report"
              icon={<PieChartOutlined style={{ fontSize: "18px" }} />}
            >
              <Link
                to="/report"
                onClick={() => {
                  if (isMobile) toggleMenu();
                }}
              >
                Reports
              </Link>
            </Menu.Item>
            {role === "admin" || role === "hr" ? (
              <>
                {" "}
                {/* MASTERS */}
                <Menu.ItemGroup
                  key="masters-group"
                  title={<MenuGroupHeading title="MASTERS" />}
                />
                <Menu.Item
                  key="/master/skills"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/skills"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add Skills
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/degree"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/degree"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add Qualification
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/add-role-skill"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/add-role-skill"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add Role And Skill
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/Find-Fields"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/Find-Fields"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Find And Replace Fields
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/email-template"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/email-template"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add Email Template
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/designation"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/designation"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add Designation
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/country"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/country"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add Country
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/state"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/state"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add State
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="/master/city"
                  icon={<PlusOutlined style={{ fontSize: "18px" }} />}
                >
                  <Link
                    to="/master/city"
                    onClick={() => {
                      if (isMobile) toggleMenu();
                    }}
                  >
                    Add City
                  </Link>
                </Menu.Item>
              </>
            ) : (
              <></>
            )}
          </Menu>
        </>
      </div>
    </Sider>
  );
};

export default Sidebar;
