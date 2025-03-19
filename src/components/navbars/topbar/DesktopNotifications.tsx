import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const DesktopNotifications = () => {
  const navigate = useNavigate();
  return (
    <ListGroup
      as="ul"
      bsPrefix="navbar-nav"
      className="navbar-right-wrap ms-auto d-flex nav-top-wrap"
    >
      <Dropdown as="li" className="ms-2">
        <Dropdown.Toggle
          as="a"
          bsPrefix=" "
          className="rounded-circle"
          id="dropdownUser"
        >
          <div className="avatar avatar-md avatar-indicators avatar-online">
            <Image
              alt="avatar"
              src="/images/avatar/avatar-1.jpg"
              className="rounded-circle"
            />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="dropdown-menu dropdown-menu-end "
          align="end"
          aria-labelledby="dropdownUser"
          show
        >
          <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
            <div className="lh-1 ">
              <h5 className="mb-1"> John E. Grainger</h5>
            </div>
            <div className=" dropdown-divider mt-3 mb-2"></div>
          </Dropdown.Item>
          <Dropdown.Item
            eventKey="2"
            onClick={() => {
              // Clear any auth tokens/session data here if needed
              navigate("/src/sub-components/profile/ProfileHeader.tsx");
            }}
          >
            <i className="fe fe-user me-2"></i> Edit Profile
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              // Clear any auth tokens/session data here if needed
              navigate("/src/sub-components/profile/ProfileHeader.tsx");
            }}
          >
            <i className="fe fe-power me-2"></i>Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ListGroup>
  );
};
