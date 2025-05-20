import { MenuOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { Button, Row } from "antd";

const AppHeader = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <Header className="appHeader">
      <Row align="middle" style={{ height: "100%" }}>
        <Button
          type="text"
          className="!bg-white"
          icon={<MenuOutlined />}
          onClick={toggleSidebar}
        />
      </Row>
    </Header>
  );
};

export default AppHeader;
