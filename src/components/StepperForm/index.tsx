
import StepperForm from "./StepperForm.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from "react-bootstrap";


function Applicant() {
  return (
   
    <Container fluid className="p-6 ">
      
      <StepperForm />
      <ToastContainer />console.log("Applicant component rendered");
      </Container>
  
  );
}

export default Applicant;
