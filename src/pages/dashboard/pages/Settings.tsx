// import node module libraries
import { Container } from "react-bootstrap";

// import widget as custom components
import { PageHeading } from "widgets";

// import sub components
import {  Profile } from "sub-components";

const Settings = () => {
  return (
    <Container fluid className="p-6 ">
      <PageHeading heading="General" />
      <Profile />
      {/* <DeleteAccount /> */}
    </Container>
  );
};

export default Settings;
