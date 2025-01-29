// import node module libraries
import { Container } from "react-bootstrap";

// import widget as custom components
// import { PageHeading } from "widgets";

// import sub components
// import { DeleteAccount, GeneralSetting } from "sub-components";
// import {  AddApplicants } from "sub-components";
import AddApplicants from './../../../sub-components/settings/AddApplicants';



const AddForm = () => {
  return (
    <Container fluid className="p-6 ">
      {/* <PageHeading heading="General" /> */}
      <AddApplicants/>
      
    </Container>
  );
};

export default AddForm;
