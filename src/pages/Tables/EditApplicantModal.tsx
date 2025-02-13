// import React, { useState, useEffect } from "react";
// import { Modal, Row, Form, FormControl, Col } from "react-bootstrap";
// import axios from "axios";
// import FormField from "../../components/FormField";
// import Dropdown from "../../components/Dropdown";
// import FormButton from "../../components/FormButton";
// import { FormProvider, useForm } from "react-hook-form";
// import { Checkbox, ListItemText, MenuItem, Select } from "@mui/material";

// interface Applicant {

//   id: number;
//   application_No: number;
//   applicantsName: string;

//   priority: string;
//   priorityBadgeBg: string;
//   experience: number;
//   dateApplied: string;
//   operation: {
//     edit: string;
//     view: string;
//     delete: string;
//   };
//   status: string;
//   interview_Stage: string;



//   feedback: string;
//   current_Location: string;

//   created_At: string;
//   referal: string;


//   _id: string;
//   name: {
//     firstName: string;
//     middleName: string;
//     lastName: string;
//   };
//   phone: {
//     phoneNumber: string;
//     whatsappNumber: string;
//   };
//   technology: string;
//   dateOfBirth: string;
//   gender: string;
//   email: string;
//   country: string;
//   state: string;
//   city: string;
//   pincode: string;
//   fullAddress: string;
//   qualification: string;
//   degree: string;
//   passingYear: string;
//   appliedSkills: string;
//   otherskills: string;
//   totalExperience: number;
//   relevantSkillExperience: number;
//   resume: string;
//   url: string;
//   rating: string;
//   currentpkg: string;
//   expectedpkg: string;
//   noticePeriod: string;
//   negotiation: string;
//   readyForWork: string;
//   workPreference: string;
//   aboutus: string;
// }

// interface UpdateModalProps {
//   show: boolean;
//   onHide: () => void;
//   editingApplicant: Applicant | null;
//   fetchApplicants: () => void;
// }

// const UpdateModal: React.FC<UpdateModalProps> = ({
//   show,
//   onHide,
//   editingApplicant,
//   fetchApplicants,
// }) => {
//   const [formData, setFormData] = useState<Applicant | null>(null);
//   const methods = useForm();
//   console.log(show);

//   useEffect(() => {
//     if (editingApplicant) {
//       console.log("Setting formData:", editingApplicant); // Debugging line
//       setFormData(editingApplicant);
//     }
//   }, [editingApplicant]);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => {
//       if (!prev) return null;
//       const keys = name.split('.');
//       const newData: Applicant = { ...prev };
//       let current: any = newData;
//       for (let i = 0; i < keys.length - 1; i++) {
//         const key = keys[i];
//         if (current[key] === undefined) current[key] = {};
//         current = current[key];
//       }
//       current[keys[keys.length - 1]] = value;
//       return newData;
//     });
//   };

//   const handleDropdownChange = (name: string, value: string) => {
//     setFormData(prev => {
//       if (!prev) return null;
//       const keys = name.split('.');
//       const newData: Applicant = { ...prev };
//       let current: any = newData;
//       for (let i = 0; i < keys.length - 1; i++) {
//         const key = keys[i];
//         if (current[key] === undefined) current[key] = {};
//         current = current[key];
//       }
//       current[keys[keys.length - 1]] = value;
//       return newData;
//     });
//   };


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFormData(prev => prev ? { ...prev, resume: file.name } : null);
//     }
//   };
//   const workStatusOptions = [
//     { value: 'yes', label: 'Yes' },
//     { value: 'no', label: 'No' },
//   ];

//   const workPreferenceOptions = [
//     { value: 'remote', label: 'Remote' },
//     { value: 'onsite', label: 'Onsite' },
//     { value: 'hybrid', label: 'Hybrid' },
//   ];

//   const qualificationOptions = [
//     { value: 'Bachelors', label: 'Bachelors' },
//     { value: 'Masters', label: 'Masters' },
//     { value: 'PhD', label: 'PhD' },
//     { value: 'Diploma', label: 'Diploma' },
//   ];

//   const passingYearOptions = ['2021', '2022', '2023', '2024'].map(year => ({
//     value: year,
//     label: year,
//   }));

//   const appliedSkillsOptions = [
//     'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js'
//   ];

//   const statesByCountry = {
//     usa: [
//       { label: 'California', value: 'california' },
//       { label: 'New York', value: 'new-york' },
//     ],
//     india: [
//       { label: 'Delhi', value: 'delhi' },
//       { label: 'Mumbai', value: 'mumbai' },
//     ],
//     canada: [
//       { label: 'Ontario', value: 'ontario' },
//       { label: 'Quebec', value: 'quebec' },
//     ],
//   };


//   const handleSaveEdit = async () => {
//     if (!formData) return;

//     try {
//       console.log('Updating Applicant:', formData); // Debugging line
//       const response = await axios.put(
//         `http://localhost:5000/api/applicant/update/${formData._id}`,
//         formData
//       );
//       console.log("Response:", response.data); // Debugging line
//       fetchApplicants();
//       onHide();
//     } catch (error) {
//       console.error("Error updating applicant:", error.response ? error.response.data : error.message);
//     }
//   };

//   if (!formData) return null;

//   return (
//     <Modal show={show} onHide={onHide} size="lg" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>Edit Applicant</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <FormProvider {...methods}>
//           <Form>
//             {/* Personal Details */}
//             <Row className="mb-3">
//               <FormField
//                 name="name.firstName"
//                 label="First Name"
//                 value={formData.name.firstName}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//               <FormField
//                 name="name.middleName"
//                 label="Middle Name"
//                 value={formData.name.middleName}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//               <FormField
//                 name="name.lastName"
//                 label="Last Name"
//                 value={formData.name.lastName}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <Col xs={12} sm={4} md={4} lg={4}>
//                 <FormField
//                   name="dateOfBirth"
//                   label="Date of Birth"
//                   type="date"
//                   value={formData.dateOfBirth}
//                   onChange={handleChange}
//                   colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//                 />
//               </Col>
//               <Col xs={12} sm={4} md={4} lg={4}>
//                 <Dropdown
//                   name="gender"
//                   label="Gender"
//                   options={[
//                     { value: "male", label: "Male" },
//                     { value: "female", label: "Female" },
//                     { value: "other", label: "Other" },
//                   ]}
//                   value={formData.gender}
//                   onChange={(e) => handleDropdownChange("gender", e.target.value)}
//                   colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }} children={undefined} />
//               </Col>
//               <Col xs={12} sm={4} md={4} lg={4}>
//                 <FormField
//                   name="email"
//                   label="Email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//                 />
//               </Col>
//             </Row>
//             <Row className="mb-3">

//               <FormField
//                 name="phone.phoneNumber"
//                 label="Phone Number"
//                 value={formData.phone.phoneNumber}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="phone.whatsappNumber"
//                 label="WhatsApp Number"
//                 value={formData.phone.whatsappNumber}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//               <FormField
//                 name="fullAddress"
//                 label="Full Address"
//                 value={formData.fullAddress}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="city"
//                 label="City"
//                 value={formData.city}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//               <FormField
//                 name="pincode"
//                 label="Pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//               <Dropdown
//                 name="country"
//                 label="Country"
//                 options={[
//                   { value: 'usa', label: 'USA' },
//                   { value: 'india', label: 'India' },
//                   { value: 'canada', label: 'Canada' },
//                 ]}
//                 value={formData.country}
//                 onChange={(e) => handleDropdownChange("country", e.target.value)}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//             </Row>
//             {/* <Row className="mb-3">
//               <Dropdown
//                 name="state"
//                 label="State"
//                 options={
//                   formData.country ?
//                     statesByCountry[formData.country].map(s => ({ value: s.value, label: s.label }))
//                     : []
//                 }
//                 value={formData.state}
//                 onChange={(e) => handleDropdownChange("state", e.target.value)}
//                 colProps={{ xs: 12, sm: 6 }}
//                 disabled={!formData.country}
//               />
//             </Row> */}

//             {/* Job Details */}
//             <Row className="mb-3">
//               <FormField
//                 name="currentpkg"
//                 label="Current Package (LPA)"
//                 value={formData.currentpkg}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//               <FormField
//                 name="expectedpkg"
//                 label="Expected Package (LPA)"
//                 value={formData.expectedpkg}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 4, md: 4, lg: 4 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="negotiation"
//                 label="Negotiation (₹)"
//                 value={formData.negotiation}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//               <FormField
//                 name="noticePeriod"
//                 label="Notice Period (Days)"
//                 value={formData.noticePeriod}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <Dropdown
//                 name="readyForWork"
//                 label="Ready for Work"
//                 options={workStatusOptions}
//                 value={formData.readyForWork}
//                 onChange={(e) => handleDropdownChange("readyForWork", e.target.value)}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//               <Dropdown
//                 name="workPreference"
//                 label="Work Preference"
//                 options={workPreferenceOptions}
//                 value={formData.workPreference}
//                 onChange={(e) => handleDropdownChange("workPreference", e.target.value)}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="aboutus"
//                 label="About Us"
//                 value={formData.aboutus}
//                 onChange={handleChange}
//                 as="textarea"
//                 colProps={{ xs: 12 }}
//               />
//             </Row>

//             {/* Educational Details */}
//             <Row className="mb-3">
//               <Dropdown
//                 name="qualification"
//                 label="Qualification"
//                 options={qualificationOptions}
//                 value={formData.qualification}
//                 onChange={(e) => handleDropdownChange("qualification", e.target.value)}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//               <FormField
//                 name="degree"
//                 label="Degree"
//                 value={formData.degree}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <Dropdown
//                 name="passingYear"
//                 label="Passing Year"
//                 options={passingYearOptions.map(year => ({ value: year, label: year }))}
//                 value={formData.passingYear}
//                 onChange={(e) => handleDropdownChange("passingYear", e.target.value)}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//               {/* <FormControl fullWidth>
//                 <Form.Label>Applied Skills</Form.Label>
//                 <Select
//                   multiple
//                   value={formData.appliedSkills.split(',')}
//                   onChange={(e) => handleDropdownChange("appliedSkills", e.target.value.join(','))}
//                   renderValue={(selected) => selected.join(', ')}
//                 >
//                   {appliedSkillsOptions.map(skill => (
//                     <MenuItem key={skill} value={skill}>
//                       <Checkbox checked={formData.appliedSkills.includes(skill)} />
//                       <ListItemText primary={skill} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               </FormControl> */}

//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="totalExperience"
//                 label="Total Experience (Years)"
//                 type="number"
//                 value={formData.totalExperience}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//               <FormField
//                 name="relevantSkillExperience"
//                 label="Relevant Experience (Years)"
//                 type="number"
//                 value={formData.relevantSkillExperience}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="otherskills"
//                 label="Other Skills"
//                 value={formData.otherskills}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//               <FormField
//                 name="url"
//                 label="Resume URL"
//                 value={formData.url}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6 }}
//               />
//             </Row>
//             <Row className="mb-3">
//               <FormField
//                 name="rating"
//                 label="JS Skill Rating (1-10)"
//                 type="number"
//                 value={formData.rating}
//                 onChange={handleChange}
//                 colProps={{ xs: 12, sm: 6, lg: 6 }}
//               />
//               <FormField
//                 name="resume"
//                 label="Resume (PDF)"
//                 type="file"
//                 onChange={handleFileChange}
//                 colProps={{ xs: 12, sm: 6, md: 4 }}
//               />
//             </Row>
//           </Form>

//         </FormProvider>
//       </Modal.Body>
//       <Modal.Footer>
//         <FormButton
//           type="button"
//           onClick={onHide}
//           className="!bg-red-500 hover:bg-red-600"
//         >
//           Cancel
//         </FormButton>
//         <FormButton
//           type="button"
//           onClick={handleSaveEdit}
//           className="!bg-purple-600 hover:bg-purple-700"
//         >
//           Save Changes
//         </FormButton>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default UpdateModal;

import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
// import FormField from "../../components/FormField";
// import Dropdown from "../../components/Dropdown";
import FormButton from "../../components/FormButton";
import { FormProvider, useForm } from "react-hook-form";
// import { Checkbox, ListItemText, MenuItem, Select } from "@mui/material";
import PersonalDetailsForm from "components/StepperForm/PersonalDetailsForm";
import EducationalDetailsForm from "components/StepperForm/EducationSkillsForm";
import JobDetailsForm from "components/StepperForm/JobDetailsForm";

interface Applicant {

  id: number;
  application_No: number;
  applicantsName: string;

  priority: string;
  priorityBadgeBg: string;
  experience: number;
  dateApplied: string;
  operation: {
    edit: string;
    view: string;
    delete: string;
  };
  status: string;
  interview_Stage: string;



  feedback: string;
  current_Location: string;

  created_At: string;
  referal: string;


  _id: string;
  name: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  phone: {
    phoneNumber: string;
    whatsappNumber: string;
  };
  technology: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  fullAddress: string;
  qualification: string;
  degree: string;
  passingYear: string;
  appliedSkills: string;
  otherskills: string;
  totalExperience: number;
  relevantSkillExperience: number;
  resume: string;
  url: string;
  rating: string;
  currentpkg: string;
  expectedpkg: string;
  noticePeriod: string;
  negotiation: string;
  readyForWork: string;
  workPreference: string;
  aboutus: string;
}

interface UpdateModalProps {
  show: boolean;
  onHide: () => void;
  editingApplicant: Applicant | null;
  fetchApplicants: () => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  show,
  onHide,
  editingApplicant,
  fetchApplicants,

}) => {
  const [formData, setFormData] = useState<Applicant | null>(null);
  const methods = useForm();
  console.log(show);

  const shouldShowNext = true;

  useEffect(() => {
    if (editingApplicant) {
      console.log("Setting formData:", editingApplicant); // Debugging line
      setFormData(editingApplicant);
    }
  }, [editingApplicant]);

  const handleSaveEdit = async () => {
    if (!formData) return;

    try {
      console.log('Updating Applicant:', formData); // Debugging line
      const response = await axios.put(
        `http://localhost:5000/api/applicant/update/${formData._id}`,
        formData
      );
      console.log("Response:", response.data); // Debugging line
      fetchApplicants();
      onHide();
    } catch (error) {
      console.error("Error updating applicant:", error.response ? error.response.data : error.message);
    }
  };

  if (!formData) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Applicant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormProvider {...methods}>

          <PersonalDetailsForm showNext={shouldShowNext} onNext={function (data: any): void {
            throw new Error("Function not implemented.");
          }} onCancel={function (): void {
            throw new Error("Function not implemented.");
          }} initialValues={undefined} />
          <EducationalDetailsForm showNext={shouldShowNext} onNext={function (data: any): void {
            throw new Error("Function not implemented.");
          }} onBack={function (): void {
            throw new Error("Function not implemented.");
          }} initialValues={undefined} />
          <JobDetailsForm showNext={shouldShowNext} onNext={function (data: any): void {
            throw new Error("Function not implemented.");
          }} onBack={function (): void {
            throw new Error("Function not implemented.");
          }} initialValues={undefined} />

        </FormProvider>
      </Modal.Body>
      <Modal.Footer className="space-x-4">
        <FormButton
          type="button"
          onClick={onHide}
          className="!bg-red-500 hover:bg-red-600"
        >
          Cancel
        </FormButton>
        <FormButton
          type="button"
          onClick={handleSaveEdit}
          className="!bg-purple-600 hover:bg-purple-700"
        >
          Save Changes
        </FormButton>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateModal;