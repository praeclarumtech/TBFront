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
        <div
          className="nav-scroller"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 999,
            backgroundColor: "#212B36",
            // padding: "1rem",
          }}
        >
          <Link to="/dashboard" className="navbar-brand">
            <h4 className="text-3xl font-bold text-white">
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
