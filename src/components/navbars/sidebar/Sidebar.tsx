// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Fragment } from "react";
// import { Link } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import { useMediaQuery } from "react-responsive";
// import { ListGroup, Card, Badge } from "react-bootstrap";
// import { Accordion } from "react-bootstrap";
// import { CustomToggle } from "./CustomToggle";
// import { CustomToggleLevelTwo } from "./CustomToggleLevelTwo";

// // import simple bar scrolling used for notification item scrolling
// import SimpleBar from "simplebar-react";

// // import routes file
// import { DashboardMenu } from "routes/DashboardRoutes";
// import { DashboardMenuProps } from "types";

// interface SidebarProps {
//   showMenu: boolean;
//   toggleMenu: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ showMenu, toggleMenu }) => {
//   const location = useLocation();
//   const isMobile = useMediaQuery({ maxWidth: 767 });

//   // const generateLink = (item: any) => {
//   //   return (
//   //     <Link
//   //       to={item.link || "#"}
//   //       className={`nav-link ${
//   //         location.pathname === item.link ? "active" : ""
//   //       }`}
//   //       onClick={() => (isMobile ? toggleMenu() : showMenu)}
//   //     >
//   //       {item.name || item.title}
//   //       {item.badge && (
//   //         <Badge className="ms-1" bg={item.badgecolor || "primary"}>
//   //           {item.badge}
//   //         </Badge>
//   //       )}
//   //     </Link>
//   //   );
//   // };

//   const generateLink = (item: any) => {
//     const currentPath = location.pathname;
//     const itemLink = item.link;

//     // Check if current path contains the menu link or matches it exactly
//     const isActive =
//       itemLink &&
//       (currentPath === itemLink || currentPath.startsWith(itemLink + "/"));

//     return (
//       <Link
//         to={itemLink || "#"}
//         className={`nav-link ${isActive ? "active" : ""}`}
//         onClick={() => (isMobile ? toggleMenu() : showMenu)}
//       >
//         {item.name || item.title}
//         {item.badge && (
//           <Badge className="ms-1" bg={item.badgecolor || "primary"}>
//             {item.badge}
//           </Badge>
//         )}
//       </Link>
//     );
//   };

//   return (
//     <Fragment>
//       <SimpleBar style={{ maxHeight: "100vh" }}>
//         <div className="nav-scroller">
//           <Link to="/dashboard" className="navbar-brand">
//             {/* <Image src="/images/brand/logo/logo.svg" alt="" /> */}
//             <h4 className="text-3xl font-bold text-white ">
//               Talent<span className="text-primary ">Box</span>
//             </h4>
//           </Link>
//         </div>
//         {/* Dashboard Menu */}
//         <Accordion
//           defaultActiveKey="0"
//           as="ul"
//           className="navbar-nav flex-column"
//         >
//           {DashboardMenu.map(function (menu: any, index: number) {
//             if (menu?.grouptitle) {
//               return (
//                 <Card bsPrefix="nav-item" key={menu?.id}>
//                   {/* group title item */}
//                   <div className="navbar-heading">{menu?.title}</div>
//                   {/* end of group title item */}
//                 </Card>
//               );
//             } else {
//               if (menu?.children) {
//                 return (
//                   <Fragment key={menu?.id}>
//                     {/* main menu? / root menu? level / root items */}
//                     <CustomToggle eventKey={menu?.id} icon={menu?.icon}>
//                       {menu?.title}
//                       {menu?.badge ? (
//                         <Badge
//                           className="ms-1"
//                           bg={menu?.badgecolor ? menu?.badgecolor : "primary"}
//                         >
//                           {menu?.badge}
//                         </Badge>
//                       ) : (
//                         ""
//                       )}
//                     </CustomToggle>
//                     <Accordion.Collapse
//                       eventKey={menu?.id}
//                       as="li"
//                       bsPrefix="nav-item"
//                     >
//                       <ListGroup
//                         as="ul"
//                         bsPrefix=""
//                         className="nav flex-column"
//                       >
//                         {menu?.children?.map(function (
//                           menuLevel1Item: DashboardMenuProps,
//                           menuLevel1Index: number
//                         ) {
//                           const childKey = `${menu?.id}-${menuLevel1Index}`;
//                           if (menuLevel1Item.children) {
//                             return (
//                               <ListGroup.Item
//                                 as="li"
//                                 bsPrefix="nav-item"
//                                 key={menuLevel1Item.id}
//                               >
//                                 {/* first level menu? started  */}
//                                 <Accordion
//                                   // defaultActiveKey="0"
//                                   className="navbar-nav flex-column"
//                                 >
//                                   <CustomToggleLevelTwo eventKey={childKey}>
//                                     {menuLevel1Item.title}
//                                     {menuLevel1Item.badge ? (
//                                       <Badge
//                                         className="ms-1"
//                                         bg={
//                                           menuLevel1Item.badgecolor
//                                             ? menuLevel1Item.badgecolor
//                                             : "primary"
//                                         }
//                                       >
//                                         {menuLevel1Item.badge}
//                                       </Badge>
//                                     ) : (
//                                       ""
//                                     )}
//                                   </CustomToggleLevelTwo>
//                                   <Accordion.Collapse
//                                     eventKey={childKey}
//                                     bsPrefix="nav-item"
//                                   >
//                                     <ListGroup
//                                       as="ul"
//                                       bsPrefix=""
//                                       className="nav flex-column"
//                                     >
//                                       {/* second level menu? started  */}
//                                       {menuLevel1Item.children.map(function (
//                                         menuLevel2Item: any,
//                                         menuLevel2Index: number
//                                       ) {
//                                         const childKey = `${menuLevel1Index}-${menuLevel2Index}`;
//                                         if (menuLevel2Item.children) {
//                                           return (
//                                             <ListGroup.Item
//                                               as="li"
//                                               bsPrefix="nav-item"
//                                               key={menuLevel2Index}
//                                             >
//                                               {/* second level accordion menu? started  */}
//                                               <Accordion
//                                                 // defaultActiveKey="0"
//                                                 className="navbar-nav flex-column"
//                                               >
//                                                 <CustomToggleLevelTwo
//                                                   eventKey={childKey}
//                                                 >
//                                                   {menuLevel2Item.title}
//                                                   {menuLevel2Item.badge ? (
//                                                     <Badge
//                                                       className="ms-1"
//                                                       bg={
//                                                         menuLevel2Item.badgecolor
//                                                           ? menuLevel2Item.badgecolor
//                                                           : "primary"
//                                                       }
//                                                     >
//                                                       {menuLevel2Item.badge}
//                                                     </Badge>
//                                                   ) : (
//                                                     ""
//                                                   )}
//                                                 </CustomToggleLevelTwo>
//                                                 <Accordion.Collapse
//                                                   eventKey={childKey}
//                                                   bsPrefix="nav-item"
//                                                 >
//                                                   <ListGroup
//                                                     as="ul"
//                                                     bsPrefix=""
//                                                     className="nav flex-column"
//                                                   >
//                                                     {/* third level menu? started  */}
//                                                     {menuLevel2Item.children.map(
//                                                       function (
//                                                         menuLevel3Item: any,
//                                                         menuLevel3Index: number
//                                                       ) {
//                                                         return (
//                                                           <ListGroup.Item
//                                                             key={
//                                                               menuLevel3Index
//                                                             }
//                                                             as="li"
//                                                             bsPrefix="nav-item"
//                                                           >
//                                                             {generateLink(
//                                                               menuLevel3Item
//                                                             )}
//                                                           </ListGroup.Item>
//                                                         );
//                                                       }
//                                                     )}
//                                                     {/* end of third level menu?  */}
//                                                   </ListGroup>
//                                                 </Accordion.Collapse>
//                                               </Accordion>
//                                               {/* end of second level accordion */}
//                                             </ListGroup.Item>
//                                           );
//                                         } else {
//                                           return (
//                                             <ListGroup.Item
//                                               key={menuLevel2Index}
//                                               as="li"
//                                               bsPrefix="nav-item"
//                                             >
//                                               {generateLink(menuLevel2Item)}
//                                             </ListGroup.Item>
//                                           );
//                                         }
//                                       })}
//                                       {/* end of second level menu?  */}
//                                     </ListGroup>
//                                   </Accordion.Collapse>
//                                 </Accordion>
//                                 {/* end of first level menu? */}
//                               </ListGroup.Item>
//                             );
//                           } else {
//                             return (
//                               <ListGroup.Item
//                                 as="li"
//                                 bsPrefix="nav-item"
//                                 key={menuLevel1Index}
//                               >
//                                 {/* first level menu? items */}
//                                 {generateLink(menuLevel1Item)}
//                                 {/* end of first level menu? items */}
//                               </ListGroup.Item>
//                             );
//                           }
//                         })}
//                       </ListGroup>
//                     </Accordion.Collapse>
//                     {/* end of main menu? / menu? level 1 / root items */}
//                   </Fragment>
//                 );
//               } else {
//                 return (
//                   <Card bsPrefix="nav-item" key={index}>
//                     {/* menu? item without any childern items like Documentation and Changelog items*/}
//                     <Link
//                       to={menu?.link ?? "#"}
//                       className={`nav-link ${
//                         location.pathname === menu?.link ? "active" : ""
//                       }`}
//                     >
//                       {typeof menu?.icon === "string" ? (
//                         <i className={`nav-icon fe fe-${menu?.icon} me-2`}></i>
//                       ) : (
//                         menu?.icon
//                       )}
//                       {menu?.title}
//                       {menu?.badge ? (
//                         <Badge
//                           className="ms-1"
//                           bg={menu?.badgecolor ? menu?.badgecolor : "primary"}
//                         >
//                           {menu?.badge}
//                         </Badge>
//                       ) : (
//                         ""
//                       )}
//                     </Link>
//                     {/* end of menu? item without any childern items */}
//                   </Card>
//                 );
//               }
//             }
//           })}
//         </Accordion>
//         {/* end of Dashboard Menu */}
//       </SimpleBar>
//     </Fragment>
//   );
// };

// export default Sidebar;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Fragment } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useMediaQuery } from "react-responsive";
// import { ListGroup, Card, Badge } from "react-bootstrap";
// import { Accordion } from "react-bootstrap";
// import { CustomToggle } from "./CustomToggle";
// import { CustomToggleLevelTwo } from "./CustomToggleLevelTwo";

// // import simple bar scrolling used for notification item scrolling
// import SimpleBar from "simplebar-react";

// // import routes file
// import { DashboardMenu } from "routes/DashboardRoutes";
// import { DashboardMenuProps } from "types";

// interface SidebarProps {
//   showMenu: boolean;
//   toggleMenu: () => void;
// }

// const Sidebar: React.FC<SidebarProps> = ({ showMenu, toggleMenu }) => {
//   const location = useLocation();
//   const isMobile = useMediaQuery({ maxWidth: 767 });

//   // Helper function to match active link
//   const isActiveLink = (itemLink: string) => {
//     const currentPath = location.pathname;

//     // Check if the current path is exactly the same or starts with the item's link for nested paths
//     return currentPath === itemLink || currentPath.startsWith(itemLink + "/");
//   };

//   const generateLink = (item: any) => {
//     const itemLink = item.link;

//     return (
//       <Link
//         to={itemLink || "#"}
//         className={`nav-link ${isActiveLink(itemLink) ? "active" : ""}`}
//         onClick={() => (isMobile ? toggleMenu() : showMenu)}
//       >
//         {item.name || item.title}
//         {item.badge && (
//           <Badge className="ms-1" bg={item.badgecolor || "primary"}>
//             {item.badge}
//           </Badge>
//         )}
//       </Link>
//     );
//   };

//   return (
//     <Fragment>
//       <SimpleBar style={{ maxHeight: "100vh" }}>
//         <div className="nav-scroller">
//           <Link to="/dashboard" className="navbar-brand">
//             <h4 className="text-3xl font-bold text-white ">
//               Talent<span className="text-primary ">Box</span>
//             </h4>
//           </Link>
//         </div>

//         {/* Iterate over the menu and check for active links */}
//         <Accordion
//           defaultActiveKey="0"
//           as="ul"
//           className="navbar-nav flex-column"
//         >
//           {DashboardMenu.map((menu: any, index: number) => {
//             if (menu?.grouptitle) {
//               return (
//                 <Card bsPrefix="nav-item" key={menu?.id}>
//                   <div className="navbar-heading">{menu?.title}</div>
//                 </Card>
//               );
//             } else {
//               if (menu?.children) {
//                 return (
//                   <Fragment key={menu?.id}>
//                     <CustomToggle eventKey={menu?.id} icon={menu?.icon}>
//                       {menu?.title}
//                       {menu?.badge && (
//                         <Badge
//                           className="ms-1"
//                           bg={menu?.badgecolor || "primary"}
//                         >
//                           {menu?.badge}
//                         </Badge>
//                       )}
//                     </CustomToggle>
//                     <Accordion.Collapse
//                       eventKey={menu?.id}
//                       as="li"
//                       bsPrefix="nav-item"
//                     >
//                       <ListGroup
//                         as="ul"
//                         bsPrefix=""
//                         className="nav flex-column"
//                       >
//                         {menu?.children?.map(
//                           (
//                             menuLevel1Item: DashboardMenuProps,
//                             menuLevel1Index: number
//                           ) => {
//                             const childKey = `${menu?.id}-${menuLevel1Index}`;
//                             return (
//                               <ListGroup.Item
//                                 as="li"
//                                 bsPrefix="nav-item"
//                                 key={menuLevel1Item.id}
//                               >
//                                 {generateLink(menuLevel1Item)}
//                                 {menuLevel1Item?.children && (
//                                   <Accordion>
//                                     <CustomToggleLevelTwo eventKey={childKey}>
//                                       {menuLevel1Item.title}
//                                     </CustomToggleLevelTwo>
//                                     <Accordion.Collapse
//                                       eventKey={childKey}
//                                       bsPrefix="nav-item"
//                                     >
//                                       <ListGroup
//                                         as="ul"
//                                         bsPrefix=""
//                                         className="nav flex-column"
//                                       >
//                                         {menuLevel1Item.children.map(
//                                           (
//                                             menuLevel2Item: any,
//                                             menuLevel2Index: number
//                                           ) => (
//                                             <ListGroup.Item
//                                               key={menuLevel2Index}
//                                               as="li"
//                                               bsPrefix="nav-item"
//                                             >
//                                               {generateLink(menuLevel2Item)}
//                                             </ListGroup.Item>
//                                           )
//                                         )}
//                                       </ListGroup>
//                                     </Accordion.Collapse>
//                                   </Accordion>
//                                 )}
//                               </ListGroup.Item>
//                             );
//                           }
//                         )}
//                       </ListGroup>
//                     </Accordion.Collapse>
//                   </Fragment>
//                 );
//               } else {
//                 return (
//                   <Card bsPrefix="nav-item" key={index}>
//                     <Link
//                       to={menu?.link ?? "#"}
//                       className={`nav-link ${
//                         isActiveLink(menu?.link) ? "active" : ""
//                       }`}
//                     >
//                       {typeof menu?.icon === "string" ? (
//                         <i className={`nav-icon fe fe-${menu?.icon} me-2`}></i>
//                       ) : (
//                         menu?.icon
//                       )}
//                       {menu?.title}
//                       {menu?.badge && (
//                         <Badge
//                           className="ms-1"
//                           bg={menu?.badgecolor || "primary"}
//                         >
//                           {menu?.badge}
//                         </Badge>
//                       )}
//                     </Link>
//                   </Card>
//                 );
//               }
//             }
//           })}
//         </Accordion>
//       </SimpleBar>
//     </Fragment>
//   );
// };

// export default Sidebar;

/////////////////////////////////////////////////////////////////////////////////////////////////////////

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { ListGroup, Card, Badge } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { CustomToggle } from "./CustomToggle";
import { CustomToggleLevelTwo } from "./CustomToggleLevelTwo";

// import simple bar scrolling used for notification item scrolling
import SimpleBar from "simplebar-react";

// import routes file
import { DashboardMenu } from "routes/DashboardRoutes";
import { DashboardMenuProps } from "types";

interface SidebarProps {
  showMenu: boolean;
  toggleMenu: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ showMenu, toggleMenu }) => {
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 767 });

  // Helper function to match active link based on the start of the path
  const isActiveLink = (itemLink: string) => {
    const currentPath = location.pathname;
    // Check if current path starts with the item link (ignores dynamic parts)
    return currentPath.startsWith(itemLink);
  };

  const generateLink = (item: any) => {
    const itemLink = item.link || "#";

    return (
      <Link
        to={itemLink}
        className={`nav-link ${isActiveLink(itemLink) ? "active" : ""}`}
        onClick={() => (isMobile ? toggleMenu() : showMenu)}
      >
        {item.name || item.title}
        {item.badge && (
          <Badge className="ms-1" bg={item.badgecolor || "primary"}>
            {item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  return (
    <Fragment>
      <SimpleBar style={{ maxHeight: "100vh" }}>
        <div className="nav-scroller">
          <Link to="/dashboard" className="navbar-brand">
            <h4 className="text-3xl font-bold text-white ">
              Talent<span className="text-primary ">Box</span>
            </h4>
          </Link>
        </div>

        {/* Iterate over the menu and check for active links */}
        <Accordion
          defaultActiveKey="0"
          as="ul"
          className="navbar-nav flex-column"
        >
          {DashboardMenu.map((menu: any, index: number) => {
            if (menu?.grouptitle) {
              return (
                <Card bsPrefix="nav-item" key={menu?.id}>
                  <div className="navbar-heading">{menu?.title}</div>
                </Card>
              );
            } else {
              if (menu?.children) {
                return (
                  <Fragment key={menu?.id}>
                    <CustomToggle eventKey={menu?.id} icon={menu?.icon}>
                      {menu?.title}
                      {menu?.badge && (
                        <Badge
                          className="ms-1"
                          bg={menu?.badgecolor || "primary"}
                        >
                          {menu?.badge}
                        </Badge>
                      )}
                    </CustomToggle>
                    <Accordion.Collapse
                      eventKey={menu?.id}
                      as="li"
                      bsPrefix="nav-item"
                    >
                      <ListGroup
                        as="ul"
                        bsPrefix=""
                        className="nav flex-column"
                      >
                        {menu?.children?.map(
                          (
                            menuLevel1Item: DashboardMenuProps,
                            menuLevel1Index: number
                          ) => {
                            const childKey = `${menu?.id}-${menuLevel1Index}`;
                            return (
                              <ListGroup.Item
                                as="li"
                                bsPrefix="nav-item"
                                key={menuLevel1Item.id}
                              >
                                {generateLink(menuLevel1Item)}
                                {menuLevel1Item?.children && (
                                  <Accordion>
                                    <CustomToggleLevelTwo eventKey={childKey}>
                                      {menuLevel1Item.title}
                                    </CustomToggleLevelTwo>
                                    <Accordion.Collapse
                                      eventKey={childKey}
                                      bsPrefix="nav-item"
                                    >
                                      <ListGroup
                                        as="ul"
                                        bsPrefix=""
                                        className="nav flex-column"
                                      >
                                        {menuLevel1Item.children.map(
                                          (
                                            menuLevel2Item: any,
                                            menuLevel2Index: number
                                          ) => (
                                            <ListGroup.Item
                                              key={menuLevel2Index}
                                              as="li"
                                              bsPrefix="nav-item"
                                            >
                                              {generateLink(menuLevel2Item)}
                                            </ListGroup.Item>
                                          )
                                        )}
                                      </ListGroup>
                                    </Accordion.Collapse>
                                  </Accordion>
                                )}
                              </ListGroup.Item>
                            );
                          }
                        )}
                      </ListGroup>
                    </Accordion.Collapse>
                  </Fragment>
                );
              } else {
                return (
                  <Card bsPrefix="nav-item" key={index}>
                    <Link
                      to={menu?.link ?? "#"}
                      className={`nav-link ${
                        isActiveLink(menu?.link) ? "active" : ""
                      }`}
                    >
                      {typeof menu?.icon === "string" ? (
                        <i className={`nav-icon fe fe-${menu?.icon} me-2`}></i>
                      ) : (
                        menu?.icon
                      )}
                      {menu?.title}
                      {menu?.badge && (
                        <Badge
                          className="ms-1"
                          bg={menu?.badgecolor || "primary"}
                        >
                          {menu?.badge}
                        </Badge>
                      )}
                    </Link>
                  </Card>
                );
              }
            }
          })}
        </Accordion>
      </SimpleBar>
    </Fragment>
  );
};

export default Sidebar;
