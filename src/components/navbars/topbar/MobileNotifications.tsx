import {  useNavigate } from "react-router-dom";
import { ListGroup, Dropdown, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { User } from "interfaces/dashboard.interface";
import { getProfile } from "api/usersApi";

export const MobileNotifications = () => {
  const navigate = useNavigate();
  
   const [user, setUser] = useState<User>({ userName: "", role: "" });
  
    useEffect(() => {
     
      const fetchProfile = async () => {
        const token = sessionStorage.getItem("authUser");
        const response = await getProfile({ token });
        setUser(response.data);
        
      };
      fetchProfile();
    }, []);
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
            onClick={() => {
              // Clear any auth tokens/session data here if needed
              navigate("/");
            }}
          >
            <i className="fe fe-power me-2"></i>Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </ListGroup>
  );
};
