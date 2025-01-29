// src/components/StepperForm/PreviewForm.tsx
import React from 'react';
import { Button, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';


interface PreviewFormProps {
  data: {
    personal: any;
    education: any;
    job: any;
  };
  onEdit: (step: number) => void; // Function to go back to the specific step
  onSubmit: () => void; // Function to handle final submission
}

const PreviewForm: React.FC<PreviewFormProps> = ({ data, onEdit, onSubmit }) => {
  const formattedDate = new Date(data.personal.dateOfBirth).toLocaleDateString("en-IN"); 
  return (
    
    <div>
      <Typography variant="h6" className='justify-center text-center font-extrabold '>Preview Your Details</Typography>
      
      <Typography variant="h7"className='mx-5 font-bold text-2xl !text-blue-600'>Personal Details:</Typography>

      <hr className='text-blue-900 font-extrabold '/>
      <div className='mx-2 p-2'>
<Row>
  <Col xs={12} md={6} className="mb-3">
    <Typography variant="body1" className='text-gray-600'><span className='font-extrabold text-base !text-black p-3'>Name: </span><span className=''>{data.personal.firstName} {data.personal.middleName} {data.personal.lastName}</span></Typography>
    <Typography><span className='font-extrabold text-base !text-black p-3'>Phone Number:</span> <span>{data.personal.phoneNumber}</span></Typography>
    <Typography><span className='font-extrabold text-base !text-black p-3'>Date of Birth:</span> <span>{data.personal.formattedDate}</span></Typography>
    <Typography><span className='font-extrabold text-base !text-black p-3'>Country:</span> <span>{data.personal.country}</span></Typography>
    <Typography><span className='font-extrabold text-base !text-black p-3'>Pincode:</span> <span>{data.personal.pincode}</span></Typography>
   
  </Col>
  <div className="col-md-6">
  <Typography><span className='font-extrabold text-base !text-black p-3'>Email:</span> <span>{data.personal.email}</span></Typography>
  <Typography><span className='font-extrabold text-base !text-black p-3'>WhatsApp Number:</span> <span>{data.personal.whatsappNumber}</span></Typography>
  <Typography><span className='font-extrabold text-base !text-black p-3'>Gender :</span> <span>{data.personal.gender}</span></Typography>
  <Typography><span className='font-extrabold text-base !text-black p-3'>State :</span> <span>{data.personal.selectedState}</span></Typography>
  <Typography><span className='font-extrabold text-base !text-black p-3'>Full Address:</span> <span>{data.personal.fullAddress}</span></Typography>
  </div>
</Row>
      </div>

      <Typography variant="h7"className='mx-5 font-bold text-2xl !text-blue-600'>Educational Details:</Typography>

<hr className='text-blue-900 font-extrabold '/>
<div className='mx-2 p-2'>
 <Row>
<Col xs={12} md={6} className="mb-3">
<Typography variant="body1" className='text-gray-600'><span className='font-extrabold text-base !text-black p-3'>Degree: </span><span className=''>{data.education.degree}</span></Typography>
<Typography><span className='font-extrabold text-base !text-black p-3'>Total Experience: </span> <span>{data.education.totalExperience}</span></Typography>
<Typography><span className='font-extrabold text-base !text-black p-3'>Qualification :</span> <span></span></Typography>
<Typography><span className='font-extrabold text-base !text-black p-3'>Other Skills:</span> <span>{data.education.otherSkills}</span></Typography>
<Typography><span className='font-extrabold text-base !text-black p-3'>Url:</span> <span>{data.education.url}</span></Typography>

</Col>

<Col xs={12} md={6}>
<Typography><span className='font-extrabold text-base !text-black p-3'>Passing Year:</span> <span>{data.education.relevantSkillExperience}</span></Typography>
<Typography><span className='font-extrabold text-base !text-black p-3'>Relevant Skill Experience: </span> <span>{data.education.relevantSkillExperience}</span></Typography>
<Typography><span className='font-extrabold text-base !text-black p-3'>Applied Skills :</span> <span>{data.education.relevantSkillExperience}</span></Typography>
{/* <Typography><span className='font-extrabold text-base !text-black p-3'>Resume :</span> <span>{data.education.resume}</span></Typography> */}
<Typography><span className='font-extrabold text-base !text-black p-3'>Rating:</span> <span>{data.education.rating}</span></Typography>
</Col>
</Row> 
</div>

      {/* <Typography variant="h7">Educational Details:</Typography>
      <Typography>Degree: {data.education.degree}</Typography>
      <Typography>Passing Year: {data.education.passingYear}</Typography>
      <Typography>Total Experience: {data.education.totalExperience}</Typography>
      <Typography>Relevant Skill Experience: {data.education.relevantSkillExperience}</Typography>
      <Typography>Rating: {data.education.rating}</Typography> */}

      <Typography variant="h7">Job Details:</Typography>
      <Typography>Expected Package: {data.job.expectedpkg}</Typography>
      <Typography>Current Package: {data.job.currentpkg}</Typography>
      <Typography>Negotiation Email: {data.job.negotiation}</Typography>
      <Typography>Notice Period: {data.job.noticePeriod}</Typography>
      <Typography>Work Preference: {data.job.workpreference}</Typography>
      <Typography>About Us: {data.job.aboutus}</Typography>

      <Button onClick={() => onEdit(0)}>Edit Personal Details</Button>
      <Button onClick={() => onEdit(1)}>Edit Educational Details</Button>
      <Button onClick={() => onEdit(2)}>Edit Job Details</Button>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default PreviewForm;

// // src/components/StepperForm/PreviewForm.tsx
// import React from 'react';
// import { Button, Typography } from '@mui/material';

// interface PreviewFormProps {
//   data: {
//     personal: any;
//     education: any;
//     job: any;
//   };
//   onEdit: (step: number) => void; // Function to go back to the specific step
//   onSubmit: () => void; // Function to handle final submission
// }

// const PreviewForm: React.FC<PreviewFormProps> = ({ data, onEdit, onSubmit }) => {
//   return (
//     <div>
//       <Typography variant="h6">Preview Your Details</Typography>
      
//       <Typography variant="h7">Personal Details:</Typography>
//       <Typography>First Name: {data.personal.firstName}</Typography>
//       <Typography>Last Name: {data.personal.lastName}</Typography>
//       <Typography>Email: {data.personal.email}</Typography>
//       <Typography>Phone Number: {data.personal.phoneNumber}</Typography>
//       <Typography>Date of Birth: {new Date(data.personal.dateOfBirth).toLocaleDateString()}</Typography> {/* Format Date */}
//       <Typography>Pincode: {data.personal.pincode}</Typography>
//       <Typography>Full Address: {data.personal.fullAddress}</Typography>

//       <Typography variant="h7">Educational Details:</Typography>
//       <Typography>Degree: {data.education.degree}</Typography>
//       <Typography>Passing Year: {data.education.passingYear}</Typography>
//       <Typography>Total Experience: {data.education.totalExperience}</Typography>
//       <Typography>Relevant Skill Experience: {data.education.relevantSkillExperience}</Typography>
//       <Typography>Rating: {data.education.rating}</Typography>

//       <Typography variant="h7">Job Details:</Typography>
//       <Typography>Expected Package: {data.job.expectedpkg}</Typography>
//       <Typography>Current Package: {data.job.currentpkg}</Typography>
//       <Typography>Negotiation Email: {data.job.negotiation}</Typography>
//       <Typography>Notice Period: {data.job.noticePeriod}</Typography>
//       <Typography>Work Preference: {data.job.workpreference}</Typography>
//       <Typography>About Us: {data.job.aboutus}</Typography>

//       <Button onClick={() => onEdit(0)}>Edit Personal Details</Button>
//       <Button onClick={() => onEdit(1)}>Edit Educational Details</Button>
//       <Button onClick={() => onEdit(2)}>Edit Job Details</Button>
//       <Button onClick={onSubmit}>Submit</Button>
//     </div>
//   );
// };

// export default PreviewForm;