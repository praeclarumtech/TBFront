import { useNavigate } from "react-router-dom";
import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "interfaces/dashboard.interface";
import { getProfile } from "api/usersApi";
import ChangePassword from "pages/auth/ChangePassword";
import { logout } from "utils/commonFunctions";

export const MobileNotifications = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [user, setUser] = useState<User>({
    userName: "",
    role: "",
    profilePicture: " ",
  });
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authUser");
      const response = await getProfile({ token });
      // localStorage.setItem("accessModules", response.data.accessModules);
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
          >
            <Dropdown.Item as="div" className="px-4 pt-2 pb-0" bsPrefix=" ">
              <div className="lh-1 ">
                <h5 className="mb-1">{user?.userName}</h5>
                <span className="text-[12px] text-muted text-center">
                  {user?.role?.toUpperCase()||role}
                </span>
              </div>
              <div className="mt-3 mb-2 dropdown-divider"></div>
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              onClick={() => {
                navigate("/userProfile");
              }}
            >
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>
            {user.role === "admin" ? (
              <>
                <Dropdown.Item
                  eventKey="4"
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
                  eventKey="3"
                  onClick={() => {
                    navigate("/roles");
                  }}
                  active={location.pathname === "/roles"}
                >
                  <i className="fe fe-user me-2"></i> Role
                </Dropdown.Item>
                <Dropdown.Item
                  eventKey="5"
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
