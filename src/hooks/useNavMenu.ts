// import React, { useMemo } from "react";
// import { MenuProps } from "antd";
// import { NavLink } from "react-router-dom";
// import routes from "../routes/routes";
// import rolePermissions from "config/RolePermission";

// const { DASHBOARD } = routes;

// type MenuItem = Required<MenuProps>["items"][number];

// const getItem = ({
//   label,
//   path,
//   icon,
//   children,
// }: {
//   label: React.ReactNode;
//   path: string;
//   icon?: React.ReactNode;
//   children?: MenuItem[];
// }): MenuItem => {
//   return {
//     key: path || label,
//     icon,
//     label:
//       typeof label === "string" && path ? (
//         <NavLink to={path}>{label}</NavLink>
//       ) : (
//         label
//       ),
//     children: children?.map((item: any) => getItem(item)),
//   } as MenuItem;
// };

// const useNavMenuItems = () => {
//   const { loggedInUserRole } = useGetLoggedInUser();

//   return useMemo(() => {
//     const menuItems: any[] = [];

//     menuItems.push({
//       path: DASHBOARD.path,
//       label: DASHBOARD.navMenu.label,
//       icon: DASHBOARD.navMenu.icon,
//     });

//     rolePermissions?.[loggedInUserRole]?.forEach(
//       (routeObj: MainRouteObject) => {
//         if (routeObj.navMenu) {
//           const { label, icon, children } = routeObj.navMenu;
//           let mLabel = label;

//           menuItems.push({
//             path: routeObj.path,
//             label: mLabel,
//             icon,
//             children,
//           });
//         }
//       }
//     );

//     return menuItems.map((item) => getItem(item));
//   }, [loggedInUserRole]);
// };

// export default useNavMenuItems;

const useNavMenuItems = () => {
  
}

export default useNavMenuItems;
