import { Layout } from "antd";
import AppHeader from "./header/AppHeader";
import { useCallback, useState } from "react";
import { Content } from "antd/es/layout/layout";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = useCallback(
    (e?: React.MouseEvent<HTMLElement>) => {
      if (e) e.stopPropagation();

      setCollapsed(!collapsed);
      localStorage.setItem("isCollapsed", (!collapsed).toString());
    },
    [collapsed]
  );
  return (
    <Layout className="appLayout">
      <Layout>
        <AppHeader toggleSidebar={toggleSidebar} />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default ProtectedLayout;
