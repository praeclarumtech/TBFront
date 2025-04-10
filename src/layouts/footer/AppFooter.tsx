// import React from "react";
// import { Col, Row } from "reactstrap";

// interface AppFooterProps {
//   isSidebarOpen: boolean;
// }

// const AppFooter: React.FC<AppFooterProps> = () => {
//   return (
//     <footer className="py-2 bg-white navbar-classic navbar navbar-expand-lg">
//       <div className="container-fluid w-100">
//         <div className="w-100 d-flex justify-content-center align-items-center">
//           <small className="fw-bold">
//             Copyright © {new Date().getFullYear()} - Praeclarum Tech. All rights reserved.
//           </small>
//         </div>
//       </div>
    
//     </footer>
//   );
// };

// export default AppFooter;


import React from "react";
import { Container, Row, Col } from "reactstrap";

interface AppFooterProps {
  isSidebarOpen: boolean;
}

const AppFooter: React.FC<AppFooterProps> = () => {
  return (
    <footer className="py-2 bg-white navbar-classic navbar navbar-expand-lg w-100">
      <Container fluid>
        <Row className="m-0 w-100">
          <Col
            xs="12"
            className="text-center d-flex justify-content-center align-items-center"
          >
            <small className="fw-bold d-block fs-6 fs-sm-7">
              Copyright © {new Date().getFullYear()} - Praeclarum Tech. All rights reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default AppFooter;
