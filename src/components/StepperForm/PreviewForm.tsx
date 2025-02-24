import React from 'react';
import { Button, Typography } from '@mui/material';
import { Col, Row } from 'react-bootstrap';
interface PreviewFormProps {
  data: {
    personal: any;
    education: any;
    job: any;
  };
  onEdit: (step: number) => void;
  onSubmit: () => void;
}



const PreviewForm: React.FC<PreviewFormProps> = ({ data, onEdit, onSubmit }) => {
  const formattedDate = new Date(data.personal.dateOfBirth).toLocaleDateString("en-IN");


  return (
    <div>
      <Typography variant="h6" className='justify-center text-center font-extrabold '>Preview Your Details</Typography>

      <Typography variant="h6" className='mx-5 font-bold text-2xl !text-blue-600'>Personal Details:</Typography>

      <hr className='text-blue-900 font-extrabold ' />
      <div className='mx-2 p-3'>
        <Row>
          <Col xs={12} md={6} className="mb-3">
            <Typography variant="body1" className='text-gray-600'><span className='font-extrabold text-base !text-black pt-3'>Name: </span><span className=''>{data.personal.name.firstName} {data.personal.name.middleName} {data.personal.name.lastName}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Phone Number:</span> <span>{data.personal.phone.phoneNumber}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Date of Birth:</span> <span>{formattedDate}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Country:</span> <span>{data.personal.country}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Pincode:</span> <span>{data.personal.pincode}</span></Typography>

          </Col>
          <div className="col-md-6">
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Email:</span> <span>{data.personal.email}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>WhatsApp Number:</span> <span>{data.personal.phone.whatsappNumber}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Gender :</span> <span>{data.personal.gender}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>State :</span> <span>{data.personal.state}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Full Address:</span> <span>{data.personal.fullAddress}</span></Typography>
          </div>
        </Row>
      </div>


      <Typography variant="h6" className='mx-5 font-bold text-2xl !text-blue-600'>Educational Details:</Typography>
      <hr className='text-blue-900 font-extrabold ' />
      <div className='mx-2 p-2'>
        <Row>
          <Col xs={12} md={6} className="mb-3">
            <Typography variant="body1" className='text-gray-600'><span className='font-extrabold text-base !text-black pt-3'>Degree: </span><span className=''>{data.education.degree}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Total Experience: </span> <span>{data.education.totalExperience}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Qualification :</span> <span>{data.education.qualification}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Other Skills:</span> <span>{data.education.otherSkills}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Url:</span> <span>{data.education.url}</span></Typography>
          </Col>
          <Col xs={12} md={6}>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Passing Year:</span> <span>{data.education.passingYear}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Relevant Skill Experience: </span> <span>{data.education.relevantSkillExperience}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Applied Skills :</span> <span>{data.education.appliedSkills}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Referral :</span> <span>{data.education.referral}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Rating:</span> <span>{data.education.rating}</span></Typography>
          </Col>
        </Row>
      </div>

      <Typography variant="h6" className='mx-5 font-bold text-2xl !text-blue-600'>Job Details:</Typography>
      <hr className='text-blue-900 font-extrabold ' />
      <div className='mx-2 p-3'>
        <Row>
          <Col xs={12} md={6} className="mb-3">
            <Typography variant="body1" className='text-gray-600'><span className='font-extrabold text-base !text-black pt-3'>Expected Package:: </span><span className=''>{data.job.expectedPkg}</span></Typography>

            <Typography><span className='font-extrabold text-base !text-black pt-3'>Negotiation :</span> <span>{data.job.negotiation}</span></Typography>

            <Typography><span className='font-extrabold text-base !text-black pt-3'>About Us:</span> <span>{data.job.aboutUs}</span></Typography>
          </Col>
          <Col xs={12} md={6}>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Current Package: </span> <span>{data.job.currentPkg}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Notice Period: </span> <span>{data.job.noticePeriod}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Work Preference:</span> <span>{data.job.readyForWork}</span></Typography>
            <Typography><span className='font-extrabold text-base !text-black pt-3'>Ready for Work from office :</span> <span>{data.job.workPreference}</span></Typography>
          </Col>
        </Row>
      </div>

      <div className="mb-3 ">
        <div className="mb-3 flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={() => onEdit(2)}
            className="!bg-red-500 text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 px-4 rounded"
          >
            Edit Job Details
          </Button>
          <Button
            onClick={onSubmit}
            className="!bg-purple-600 font-bold text-white hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 px-4 rounded"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewForm;