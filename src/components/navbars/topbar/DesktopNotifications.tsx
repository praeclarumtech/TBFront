import { getProfile } from "api/usersApi";
import { useEffect, useState } from "react";
import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { User } from "interfaces/dashboard.interface";
import ChangePassword from "pages/auth/ChangePassword";
import { logout } from "utils/commonFunctions";

export const DesktopNotifications = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    userName: "",
    role: "",
    profilePicture: " ",
  });
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authUser");
      const response = await getProfile({ token });
      setUser(response.data);
    };
    fetchProfile();
  }, []);

  return (
    <>
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
                crossOrigin="anonymous"
                src={"/images/avatar/avatar.png"}
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
            <Dropdown.Item
              as="div"
              className="px-4 py-2 d-flex flex-column align-items-center justify-content-between"
            >
              <div className="inline-flex items-center space-x-2">
                <h5 className="mb-0">{user?.userName}</h5>
                <span className="text-sm text-muted">
                  {user?.role?.toUpperCase()}
                </span>
              </div>

              <div className="my-0 dropdown-divider"></div>
            </Dropdown.Item>
            {user.role === "admin" ? (
              <>
                <Dropdown.Item
                  eventKey="1"
                  onClick={() => {
                    navigate("/userManagement");
                  }}
                  active={
                    location.pathname === "/userManagement" ||
                    location.pathname === "/userprofileAdd"
                  }
                >
                  <i className="fe fe-user me-2"></i> User Management
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="2"
                  onClick={() => {
                    navigate("/roles");
                  }}
                  active={location.pathname === "/roles"}
                >
                  <i className="fe fe-user me-2"></i> Role
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="3"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <i className="fe fe-arrow-up-left me-2"></i> Website
                </Dropdown.Item>
              </>
            ) : (
              <></>
            )}
            <Dropdown.Item
              eventKey="4"
              onClick={() => {
                navigate("/userProfile");
              }}
            >
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>

            <Dropdown.Item
              onClick={() => {
                setShowModal(true);
              }}
            >
              <i className="fe fe-lock me-2"></i> Change Password
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                logout();
                navigate("/login");
                window.location.reload();
              }}
            >
              <i className="fe fe-power me-2"></i>Sign Out
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup>
      <ChangePassword showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};
