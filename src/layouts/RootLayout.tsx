// //import node module libraries
// import { Outlet } from "react-router";
// import Sidebar from "components/navbars/sidebar/Sidebar";
// import Header from "components/navbars/topbar/Header";
// import AppFooter from "layouts/footer/AppFooter";
// import { ReactNode, useState } from "react";

// interface RootLayoutProps {
//   children: ReactNode;
// }

// const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
//   const [showMenu, setShowMenu] = useState(true);
//   const ToggleMenu = () => {
//     return setShowMenu(!showMenu);
//   };

//   return (
//     <section className="bg-light min-vh-100 position-fixed w-100 top-0 left-0">
//       <div id="db-wrapper" className={`${showMenu ? "" : "toggled"} h-100`}>
//         <div
//           className="navbar-vertical navbar position-fixed top-0 bottom-0 border-end-dark"
//           style={{
//             width: showMenu ? "256px" : "64px",
//             transition: "width .3s ease-in-out",
//             zIndex: 1030,
//           //  overflowY: showMenu ? "auto" : "hidden"
//           }}
//         >
//           <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
//         </div>
//         <div
//           id="page-content"
//           style={{
//             marginLeft: showMenu ? "250px" : "0px",
//             transition: "margin-left .3s ease-in-out",
//           }}
//         >
//           <div
//             className="header fixed-top bg-dark border-bottom-dark"
//             style={{
//               left: showMenu ? "250px" : "0px",
//               right: 0,
//               transition: "left .3s ease-in-out",
//               zIndex: 1020,
//             }}
//           >
//             <Header toggleMenu={ToggleMenu} />
//           </div>
//           <div
//             className="content"
//             style={{
//               marginTop: "66px",
//               marginBottom: "50px",
//               paddingBottom: "20px",
//               paddingLeft: "0px",
//               paddingRight: "0px",
//               overflowY: "auto",
//               height: "calc(100vh - 104px)",
//             }}
//           >
//             <Outlet />
//             {children}
//           </div>
//           <div
//             className="footer fixed-bottom bg-white border-top"
//             style={{
//               left: showMenu ? "250px" : "0px",
//               right: 0,
//               transition: "left .3s ease-in-out",
//             }}
//           >
//             <AppFooter isSidebarOpen={showMenu} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RootLayout;
// Import node module libraries
import { Outlet } from "react-router";
import Sidebar from "components/navbars/sidebar/Sidebar";
import Header from "components/navbars/topbar/Header";
import AppFooter from "layouts/footer/AppFooter";
import { ReactNode, useState } from "react";
import { useMediaQuery } from "react-responsive";

interface RootLayoutProps {
  children: ReactNode;
}

// const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
//   const [showMenu, setShowMenu] = useState(true);
//   const isMobile = useMediaQuery({ maxWidth: 767 });

//   const ToggleMenu = () => {
//     setShowMenu(!showMenu);
//   };

//   return (
//     <section className="bg-light min-vh-100 position-fixed w-100 top-0 left-0">
//       <div id="db-wrapper" className={`${showMenu ? "" : "toggled"} h-100`}>
//         {/* Sidebar */}
//         <div
//           className={`navbar-vertical navbar position-fixed top-0 bottom-0 border-end-dark ${
//             isMobile && !showMenu ? "d-none" : ""
//           }`}
//           style={{
//             width: showMenu ? "256px" : isMobile ? "0px" : "64px",
//             transition: "width 0.3s ease-in-out",
//             zIndex: 1030,
//           }}
//         >
//           <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
//         </div>

//         {/* Main Page Content */}
//         <div
//           id="page-content"
//           style={{
//             marginLeft: showMenu ? "256px" : isMobile ? "0px" : "64px",
//             transition: "margin-left 0.3s ease-in-out",
//           }}
//         >
//           {/* Header */}
//           <div
//             className="header fixed-top bg-dark border-bottom-dark"
//             style={{
//               left: showMenu ? "256px" : isMobile ? "0px" : "64px",
//               right: 0,
//               transition: "left 0.3s ease-in-out",
//               zIndex: 1020,
//             }}
//           >
//             <Header toggleMenu={ToggleMenu} />
//           </div>

//           {/* Page Content */}
//           <div
//             className="content"
//             style={{
//               marginTop: "66px",
//               marginBottom: "50px",
//               paddingBottom: "20px",
//               overflowY: "auto",
//               height: "calc(100vh - 104px)",
//             }}
//           >
//             <Outlet />
//             {children}
//           </div>

//           {/* Footer */}
//           <div
//             className="footer fixed-bottom bg-white border-top"
//             style={{
//               left: showMenu ? "256px" : isMobile ? "0px" : "64px",
//               right: 0,
//               transition: "left 0.3s ease-in-out",
//             }}
//           >
//             <AppFooter isSidebarOpen={showMenu} />
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const [showMenu, setShowMenu] = useState(true);
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const ToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <section className="bg-light min-vh-100 position-fixed w-100 top-0 left-0">
      <div id="db-wrapper" className={`${showMenu ? "" : "toggled"} h-100`}>
        {/* Sidebar */}
        <div
          className={`navbar-vertical navbar position-fixed top-0 bottom-0 border-end-dark ${
            isMobile && !showMenu ? "d-none" : "d-block"
          }`}
          style={{
            width: isMobile
              ? showMenu
                ? "256px"
                : "0px"
              : showMenu
              ? "256px"
              : "64px",
            transition: "width 0.3s ease-in-out",
            zIndex: 1030,
            overflow: "hidden",
          }}
        >
          <Sidebar showMenu={showMenu} toggleMenu={ToggleMenu} />
        </div>

        {/* Main Page Content */}
        <div
          id="page-content"
          style={{
            marginLeft: isMobile ? "0px" : showMenu ? "250px" : "0px",
            transition: "margin-left 0.3s ease-in-out",
          }}
        >
          {/* Header */}
          <div
            className="header fixed-top bg-dark border-bottom-dark"
            style={{
              left: isMobile ? "0px" : showMenu ? "250px" : "0px",
              right: 0,
              transition: "left 0.3s ease-in-out",
              zIndex: 1030,
            }}
          >
            <Header toggleMenu={ToggleMenu} />
          </div>

          {/* Page Content */}
          <div
            className="content"
            style={{
              marginTop: "66px",
              marginBottom: "50px",
              paddingBottom: "20px",
              overflowY: "auto",
              height: "calc(100vh - 104px)",
            }}
          >
            <Outlet />
            {children}
          </div>

          {/* Footer */}
          <div
            className="footer fixed-bottom bg-white border-top"
            style={{
              left: isMobile ? "0px" : showMenu ? "250px" : "0px",
              right: 0,
              transition: "left 0.3s ease-in-out",
              // zIndex: 1030,
            }}
          >
            <AppFooter isSidebarOpen={showMenu} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RootLayout;
