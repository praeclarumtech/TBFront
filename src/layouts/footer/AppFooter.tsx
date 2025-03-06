import React from "react";
 
interface AppFooterProps {
  isSidebarOpen: boolean;
}
 
const AppFooter: React.FC<AppFooterProps> = () => {
  return (
    <footer className="navbar-classic navbar navbar-expand-lg bg-white py-2">
      <div className="container-fluid w-100">
        <div className="w-100 d-flex justify-content-center align-items-center">
          <small>
            Copyright © {new Date().getFullYear()} - Praeclarum Tech. All rights reserved.
          </small>
        </div>
      </div>
    </footer>
  );
};
 
export default AppFooter;
 