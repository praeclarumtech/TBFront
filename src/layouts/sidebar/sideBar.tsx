// import { CloseOutlined } from "@ant-design/icons";
// import { Col, Menu, Row, Tooltip } from "antd";
// import Sider from "antd/es/layout/Sider";
// import rolePermissions from "config/RolePermission";
// import { TooltipWrapper } from "react-tooltip";

// const SideBar = ({ collapsed, toggleSidebar }: { collapsed: boolean; toggleSidebar: () => void }) => {
//   return (
//     <Sider
//       trigger={null}
//       breakpoint="xs"
//       onBreakpoint={(broken) => {
//         let config = {
//           collapsedWidth: 62,
//           width: "220",
//         };
//         if (broken)
//           config = {
//             collapsedWidth: 0,
//             width: "100%",
//           };
//       }}
//       collapsible
//       className="app-sider"
//     >
//       <Col className="flex h-full flex-col">
//         <Row
//           className="pointer mx-5 mb-5 flex justify-between xs:mx-0 xs:justify-center"
//           // onClick={onAppLogoClick}
//         >
//           {/* <img
//             src={collapsed ? fintiLogo : fintiWhiteLogo}
//             alt="Finti_logo"
//             height="38"
//           /> */}
//           {!collapsed && (
//             <CloseOutlined
//               style={{ color: "white", fontSize: 24 }}
//               onClick={toggleSidebar}
//               className="xs:hidden"
//             />
//           )}
//         </Row>
//         <Menu
//           rootClassName="custom-menu-items"
//           theme="dark"
//           mode="inline"
//           selectedKeys={[location?.pathname]}
//           // items={navMenuItems}
//           style={{
//             flexGrow: 1,
//             overflowY: "auto",
//           }}
//         />
    
//       </Col>
//     </Sider>
//   );
// };

// export default SideBar;

export const SideBar = () => {
 
}

export default SideBar;
