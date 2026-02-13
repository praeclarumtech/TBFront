// import node module libraries
import { Menu, X } from "react-feather";
import { Link } from "react-router-dom";
import { Nav, Navbar } from "react-bootstrap";

// import sub components
import Notifications from "./Notifications";

interface HeaderProps {
  toggleMenu: () => void;
  showMenu?: boolean;
  isMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleMenu, showMenu = false, isMobile = false }) => {
  // Mobile + sidebar open: show close. Otherwise: show hamburger.
  const showClose = isMobile && showMenu;
  const showHamburger = !showClose;

  return (
    <Navbar className="navbar-classic navbar navbar-expand-lg header-dark border-bottom shadow-sm header-navbar">
      <div className="d-flex justify-content-between w-100 align-items-center">
        <div className="d-flex align-items-center">
          {showClose && (
            <button
              type="button"
              className="nav-toggle-btn me-3"
              onClick={toggleMenu}
              aria-label="Close menu"
            >
              <X size="20" color="rgba(255,255,255,0.85)" strokeWidth={2} />
            </button>
          )}
          {showHamburger && (
            <Link
              to="#"
              id="nav-toggle"
              className="nav-toggle-btn me-3"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
              }}
              aria-label="Toggle menu"
            >
              <Menu size="20" color="rgba(255,255,255,0.85)" strokeWidth={2} />
            </Link>
          )}
          <div className="ms-lg-3 d-none d-md-none d-lg-block" />
        </div>
        <Nav className="navbar-right-wrap ms-2 d-flex nav-top-wrap align-items-center">
          <Notifications />
        </Nav>
      </div>
    </Navbar>
  );
};

export default Header;
