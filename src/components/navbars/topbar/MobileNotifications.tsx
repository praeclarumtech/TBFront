import { useNavigate } from "react-router-dom";
import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "interfaces/dashboard.interface";
import { getProfile } from "api/usersApi";
import appEnv from "config/appEnv";
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
  const [imagePreview, setImagePreview] = useState<string>(
    "/images/avatar/avatar.png"
  );
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("authUser");
      const response = await getProfile({ token });
      setUser(response.data);
      setImagePreview(
        response?.data?.profilePicture
          ? `${appEnv.API_ENDPOINT}/uploads/profile/${response?.data?.profilePicture}`
          : "/images/avatar/avatar.png"
      );
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
                src={imagePreview}
                className="rounded-circle"
              />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu
            className="dropdown-menu dropdown-menu-end "
            align="end"
            aria-labelledby="dropdownUser"
          >
            <Dropdown.Item as="div" className="px-4 pb-0 pt-2" bsPrefix=" ">
              <div className="lh-1 ">
                <h5 className="mb-1">{user?.userName}</h5>
                <span className="text-[12px] text-muted text-center">
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div className=" dropdown-divider mt-3 mb-2"></div>
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              onClick={() => {
                navigate("/userProfile");
              }}
            >
              <i className="fe fe-user me-2"></i> Edit Profile
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              onClick={() => {
                navigate("/userManagement");
              }}
            >
              <i className="fe fe-user me-2"></i> User Management
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
                navigate("/");
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
