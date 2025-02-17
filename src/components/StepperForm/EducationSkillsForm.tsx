// import { useForm } from "react-hook-form";
// import { Button } from "@mui/material";
// import { educationalDetailsSchema } from "../../validation/validationSchema";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { Col, Row, Form } from "react-bootstrap";
// import {
//   Select,
//   MenuItem,
//   FormControl,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { useEffect, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../store/redux/hooks";
// import { setEducationalDetails } from "../../store/slices/educationalDetailsSlice";
// interface EducationalDetailsFormProps {
//   onNext: (data: any) => void;
//   onBack: () => void;
//   initialValues: any;
//   showNext: boolean;
// }

// const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({
//   onNext,
//   onBack,
//   initialValues,
//   showNext,
// }) => {
//   const dispatch = useAppDispatch();
//   const educationalDetails = useAppSelector(
//     (state) => state.educationalDetails
//   );

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//     setValue,
//   } = useForm({
//     resolver: yupResolver(educationalDetailsSchema),
//     defaultValues: educationalDetails,
//   });

//   const formData = watch();

//   useEffect(() => {
//     dispatch(setEducationalDetails(formData));
//   }, [formData, dispatch]);

//   const qualificationOptions = ["Bachelors", "Masters", "PhD", "Diploma"];
//   const passingYearOptions = ["2021", "2022", "2023", "2024"];
//   const appliedSkillsOptions = [
//     "JavaScript",
//     "Python",
//     "Java",
//     "C++",
//     "React",
//     "Node.js",
//   ];

//   const onSubmit = (data: any) => {
//     console.log("Educational Details Submitted:", data);

//     onNext(data);
//   };

//   const qualificationValue = watch("qualification");
//   const passingYearValue = watch("passingYear");
//   const appliedSkillsValue = watch("appliedSkills") || [];

//   const handleAppliedSkillsChange = (event: SelectChangeEvent<string[]>) => {
//     setValue("appliedSkills", event.target.value as string[]);
//   };
//   // if (!data) {
//   //   return <div>Loading...</div>;
//   // }

//   useEffect(() => {
//     reset(initialValues);
//     // if (initialValues) {
//     //   setValue("qualification", initialValues.qualification || '');
//     //   setValue("passingYear", initialValues.passingYear || '');
//     //   setValue("appliedSkills", initialValues.appliedSkills || []);
//     // }
//   }, [initialValues, reset]);

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6} className="">
//           <FormControl fullWidth className=" ">
//             <Form.Label className="font-bold">Qualification</Form.Label>
//             <Select
//               className="h-10 my-1"
//               value={qualificationValue || ""}
//               onChange={(e) => setValue("qualification", e.target.value)}
//             >
//               {qualificationOptions.map((option) => (
//                 <MenuItem key={option} value={option}>
//                   {option}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Col>
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <Form.Group controlId="degree">
//             <Form.Label className="font-bold">Degree Name</Form.Label>
//             <Form.Control
//               type="text"
//               {...register("degree")}
//               isInvalid={!!errors.degree}
//               placeholder="Degree Name"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.degree?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth variant="outlined">
//             <Form.Label className="font-bold">Passing Year</Form.Label>
//             <Select
//               className="h-10 my-1"
//               value={passingYearValue || ""}
//               onChange={(e) => setValue("passingYear", e.target.value)}
//             >
//               <MenuItem value="" disabled>
//                 Select your passing year
//               </MenuItem>
//               {passingYearOptions.map((year) => (
//                 <MenuItem key={year} value={year}>
//                   {year}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Col>
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Applied Skills</Form.Label>
//             <Select
//               className="h-10 my-1"
//               multiple
//               value={appliedSkillsValue}
//               onChange={handleAppliedSkillsChange}
//               renderValue={(selected) => selected.join(", ")}
//             >
//               {appliedSkillsOptions.map((skill) => (
//                 <MenuItem key={skill} value={skill}>
//                   <Checkbox checked={appliedSkillsValue.includes(skill)} />
//                   <ListItemText primary={skill} />
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Col>
//       </Row>
//       <Row className="md:mb-3 ">
//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="totalExperience">
//             <Form.Label className="font-bold">Total Experience</Form.Label>
//             <Form.Control
//               type="number"
//               {...register("totalExperience")}
//               isInvalid={!!errors.totalExperience}
//               placeholder="Total Experience in Years"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.totalExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="relevantSkillExperience">
//             <Form.Label className="font-bold">
//               Relevant Skill Experience
//             </Form.Label>
//             <Form.Control
//               type="number"
//               {...register("relevantSkillExperience")}
//               isInvalid={!!errors.relevantSkillExperience}
//               placeholder="Relevant Skill Experience in Years"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.relevantSkillExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={12} md={6} className="sm:mb-3">
//           <Form.Group controlId="otherSkills">
//             <Form.Label className="font-bold">Other Skills</Form.Label>
//             <Form.Control
//               type="text"
//               {...register("otherSkills")}
//               isInvalid={!!errors.otherSkills}
//               placeholder="Enter other skills Name"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.otherSkills?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={5} className="sm:mb-3">
//           <Form.Group controlId="resume">
//             <Form.Label className="font-bold">Referral</Form.Label>
//             <Form.Control
//               type="text"
//               {...register("referral")}
//               isInvalid={!!errors.url}
//               placeholder="Reference"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.referral?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={6} md={4} className="sm:mb-3">
//           <Form.Group controlId="resume">
//             <Form.Label className="font-bold">Resume Url</Form.Label>
//             <Form.Control
//               type="url"
//               {...register("url")}
//               isInvalid={!!errors.url}
//               placeholder="Upload Resume Url"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.url?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={12} md={3} className="sm:mb-3">
//           <Form.Group controlId="rating">
//             <Form.Label className="font-bold">
//               Rating Javascript Skills (1-10)
//             </Form.Label>
//             <Form.Control
//               type="number"
//               {...register("rating")}
//               isInvalid={!!errors.rating}
//               placeholder="Rate Your Javascript Skill out of 10"
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.rating?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>
//       {!showNext && (
//         <div className="d-flex justify-content-end gap-3">
//           <Button
//             type="button"
//             onClick={onBack}
//             className="bg-danger text-white"
//           >
//             Previous
//           </Button>
//           <Button type="submit" className="bg-primary text-white">
//             Next
//           </Button>
//         </div>
//       )}
//     </Form>
//   );
// };

// export default EducationalDetailsForm;

// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@mui/material";
// import { educationalDetailsSchema } from "../../validation/validationSchema";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { Col, Row, Form } from "react-bootstrap";
// import {
//   Select,
//   MenuItem,
//   FormControl,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setEducationalDetails } from "../../store/slices/educationalDetailsSlice";
// import { RootState } from "../../store/store";

// interface EducationalDetailsFormProps {
//   onNext: (data: any) => void;
//   onBack: () => void;
//   initialValues: any;
//   showNext: boolean;
// }

// const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({
//   onNext,
//   onBack,
//   initialValues,
//   showNext,
// }) => {
//   const dispatch = useDispatch();
//   const educationalDetails = useSelector(
//     (state: RootState) => state.educationalDetails
//   );

//   const {
//     control,
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     reset,
//     watch,
//   } = useForm({
//     resolver: yupResolver(educationalDetailsSchema),
//     defaultValues: educationalDetails || initialValues,
//   });

//   const qualificationValue = watch("qualification");
//   const passingYearValue = watch("passingYear");
//   const appliedSkillsValue = watch("appliedSkills");

//   // Initialize form with Redux state or initialValues
//   useEffect(() => {
//     reset(educationalDetails || initialValues);
//   }, []);

//   const qualificationOptions = ["Bachelors", "Masters", "PhD", "Diploma"];
//   const passingYearOptions = ["2021", "2022", "2023", "2024"];
//   const appliedSkillsOptions = [
//     "JavaScript",
//     "Python",
//     "Java",
//     "C++",
//     "React",
//     "Node.js",
//   ];

//   const handleQualificationChange = (event: any) => {
//     const qualification = event.target.value;
//     setValue("qualification", qualification);
//     dispatch(setEducationalDetails({ qualification }));
//   };

//   const handlePassingYearChange = (event: any) => {
//     const passingYear = event.target.value;
//     setValue("passingYear", passingYear);
//     dispatch(setEducationalDetails({ passingYear }));
//   };

//   const handleAppliedSkillsChange = (event: any) => {
//     const appliedSkills = event.target.value;
//     setValue("appliedSkills", appliedSkills);
//     dispatch(setEducationalDetails({ appliedSkills }));
//   };

//   const onSubmit = (data: any) => {
//     console.log("Educational Details Submitted:", data);
//     onNext(data);
//   };

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6}>
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Qualification</Form.Label>
//             <Controller
//               name="qualification"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   className="h-10 my-1"
//                   value={qualificationValue || ""}
//                   onChange={handleQualificationChange}
//                 >
//                   {qualificationOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>

//         <Col xs={12} sm={6} md={6}>
//           <Controller
//             name="appliedSkills"
//             control={control}
//             render={({ field }) => (
//               <Select
//                 multiple
//                 value={appliedSkillsValue || []}
//                 onChange={handleAppliedSkillsChange}
//                 renderValue={(selected) => selected.join(", ")}
//               >
//                 {appliedSkillsOptions.map((skill) => (
//                   <MenuItem key={skill} value={skill}>
//                     <Checkbox
//                       checked={(appliedSkillsValue || []).includes(skill)}
//                     />
//                     <ListItemText primary={skill} />
//                   </MenuItem>
//                 ))}
//               </Select>
//             )}
//           />
//         </Col>
//         <Col xs={12} sm={6} md={6}>
//           <Form.Group controlId="degree">
//             <Form.Label className="font-bold">Degree Name</Form.Label>
//             <Form.Control
//               type="text"
//               {...register("degree")}
//               isInvalid={!!errors.degree}
//               placeholder="Degree Name"
//               value={educationalDetails.degree || ""}
//               onChange={(e) => {
//                 setValue("degree", e.target.value);
//                 dispatch(setEducationalDetails({ degree: e.target.value }));
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.degree?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth variant="outlined">
//             <Form.Label className="font-bold">Passing Year</Form.Label>
//             <Select
//               className="h-10 my-1"
//               value={passingYearValue || ""}
//               onChange={(e) => setValue("passingYear", e.target.value)}
//             >
//               <MenuItem value="" disabled>
//                 Select your passing year
//               </MenuItem>
//               {passingYearOptions.map((year) => (
//                 <MenuItem key={year} value={year}>
//                   {year}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Col>
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Applied Skills</Form.Label>
//             <Controller
//               name="appliedSkills"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   multiple
//                   value={appliedSkillsValue || []}
//                   onChange={handleAppliedSkillsChange}
//                   renderValue={(selected) => selected.join(", ")}
//                 >
//                   {appliedSkillsOptions.map((skill) => (
//                     <MenuItem key={skill} value={skill}>
//                       <Checkbox
//                         checked={(appliedSkillsValue || []).includes(skill)}
//                       />
//                       <ListItemText primary={skill} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>
//       </Row>

//       <Row className="md:mb-3 ">
//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="totalExperience">
//             <Form.Label className="font-bold">Total Experience</Form.Label>
//             <Form.Control
//               type="number"
//               {...register("totalExperience")}
//               isInvalid={!!errors.totalExperience}
//               placeholder="Total Experience in Years"
//               value={educationalDetails.totalExperience || ""}
//               onChange={(e) => {
//                 setValue("totalExperience", e.target.value);
//                 dispatch(
//                   setEducationalDetails({ totalExperience: e.target.value })
//                 );
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.totalExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="relevantSkillExperience">
//             <Form.Label className="font-bold">
//               Relevant Skill Experience
//             </Form.Label>
//             <Form.Control
//               type="number"
//               {...register("relevantSkillExperience")}
//               isInvalid={!!errors.relevantSkillExperience}
//               placeholder="Relevant Skill Experience in Years"
//               value={educationalDetails.relevantSkillExperience || ""}
//               onChange={(e) => {
//                 setValue("relevantSkillExperience", e.target.value);
//                 dispatch(
//                   setEducationalDetails({
//                     relevantSkillExperience: e.target.value,
//                   })
//                 );
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.relevantSkillExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={12} md={6} className="sm:mb-3">
//           <Form.Group controlId="otherSkills">
//             <Form.Label className="font-bold">Other Skills</Form.Label>
//             <Form.Control
//               type="text"
//               {...register("otherSkills")}
//               isInvalid={!!errors.otherSkills}
//               placeholder="Enter other skills Name"
//               value={educationalDetails.otherSkills || ""}
//               onChange={(e) => {
//                 setValue("isInvalid={!!errors.otherSkills}", e.target.value);
//                 dispatch(
//                   setEducationalDetails({ otherSkills: e.target.value })
//                 );
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.otherSkills?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={5} className="sm:mb-3">
//           <Form.Group controlId="resume">
//             <Form.Label className="font-bold">Referral</Form.Label>
//             <Form.Control
//               type="text"
//               {...register("referral")}
//               isInvalid={!!errors.referral}
//               placeholder="Reference"
//               value={educationalDetails.referral || ""}
//               onChange={(e) => {
//                 setValue("isInvalid={!!errors.referral}", e.target.value);
//                 dispatch(setEducationalDetails({ referral: e.target.value }));
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.referral?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={6} md={4} className="sm:mb-3">
//           <Form.Group controlId="resume">
//             <Form.Label className="font-bold">Resume Url</Form.Label>{" "}
//             <Form.Control
//               type="url"
//               {...register("url")}
//               isInvalid={!!errors.url}
//               placeholder="Upload Resume Url"
//               value={educationalDetails.url || ""}
//               onChange={(e) => {
//                 setValue("isInvalid={!!errors.url}", e.target.value);
//                 dispatch(setEducationalDetails({ url: e.target.value }));
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.url?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//         <Col xs={12} sm={12} md={3} className="sm:mb-3">
//           <Form.Group controlId="rating">
//             <Form.Label className="font-bold">
//               Rating Javascript Skills (1-10)
//             </Form.Label>
//             <Form.Control
//               type="number"
//               {...register("rating")}
//               isInvalid={!!errors.rating}
//               placeholder="Rate Your Javascript Skill out of 10"
//               value={educationalDetails.rating || ""}
//               onChange={(e) => {
//                 setValue("isInvalid={!!errors.rating}", e.target.value);
//                 dispatch(setEducationalDetails({ rating: e.target.value }));
//               }}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.rating?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>
//       {/* Similar pattern for other fields */}

//       <div className="d-flex justify-content-end gap-3">
//         <Button type="button" onClick={onBack} className="bg-danger text-white">
//           Previous
//         </Button>
//         <Button type="submit" className="bg-primary text-white">
//           Next
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default EducationalDetailsForm;

// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@mui/material";
// import { educationalDetailsSchema } from "../../validation/validationSchema";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { Col, Row, Form } from "react-bootstrap";
// import {
//   Select,
//   MenuItem,
//   FormControl,
//   Checkbox,
//   ListItemText,
// } from "@mui/material";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setEducationalDetails } from "../../store/slices/educationalDetailsSlice";
// import { RootState } from "../../store/store";

// interface EducationalDetailsFormProps {
//   onNext: (data: any) => void;
//   onBack: () => void;
//   initialValues: any;
//   showNext: boolean;
// }

// const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({
//   onNext,
//   onBack,
//   initialValues,
//   showNext,
// }) => {
//   const dispatch = useDispatch();
//   const educationalDetails = useSelector(
//     (state: RootState) => state.educationalDetails
//   );

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     reset,
//     watch,
//   } = useForm({
//     resolver: yupResolver(educationalDetailsSchema),
//     defaultValues: educationalDetails || initialValues,
//   });

//   const formValues = watch();

//   useEffect(() => {
//     reset(educationalDetails || initialValues);
//   }, []);

//   const qualificationOptions = ["Bachelors", "Masters", "PhD", "Diploma"];
//   const passingYearOptions = ["2021", "2022", "2023", "2024"];
//   const appliedSkillsOptions = [
//     "JavaScript",
//     "Python",
//     "Java",
//     "C++",
//     "React",
//     "Node.js",
//   ];

//   const handleFieldChange = (fieldName: string, value: any) => {
//     setValue(fieldName, value);
//     dispatch(setEducationalDetails({ [fieldName]: value }));
//   };

//   const onSubmit = (data: any) => {
//     console.log("Educational Details Submitted:", data);
//     onNext(data);
//   };

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6}>
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Qualification</Form.Label>
//             <Controller
//               name="qualification"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   className="h-10 my-1"
//                   value={field.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange("qualification", e.target.value)
//                   }
//                 >
//                   {qualificationOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>

//         <Col xs={12} sm={6} md={6}>
//           <Form.Group controlId="degree">
//             <Form.Label className="font-bold">Degree Name</Form.Label>
//             <Controller
//               name="degree"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="text"
//                   isInvalid={!!errors.degree}
//                   placeholder="Degree Name"
//                   value={field.value || ""}
//                   onChange={(e) => handleFieldChange("degree", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.degree?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Passing Year</Form.Label>
//             <Controller
//               name="passingYear"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   className="h-10 my-1"
//                   value={field.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange("passingYear", e.target.value)
//                   }
//                 >
//                   <MenuItem value="" disabled>
//                     Select your passing year
//                   </MenuItem>
//                   {passingYearOptions.map((year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>

//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Applied Skills</Form.Label>
//             <Controller
//               name="appliedSkills"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   multiple
//                   value={field.value || []}
//                   onChange={(e) =>
//                     handleFieldChange("appliedSkills", e.target.value)
//                   }
//                   renderValue={(selected) => (selected as string[]).join(", ")}
//                 >
//                   {appliedSkillsOptions.map((skill) => (
//                     <MenuItem key={skill} value={skill}>
//                       <Checkbox checked={(field.value || []).includes(skill)} />
//                       <ListItemText primary={skill} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>
//       </Row>

//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="totalExperience">
//             <Form.Label className="font-bold">Total Experience</Form.Label>
//             <Controller
//               name="totalExperience"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="number"
//                   isInvalid={!!errors.totalExperience}
//                   placeholder="Total Experience in Years"
//                   value={field.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange("totalExperience", e.target.value)
//                   }
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.totalExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="relevantSkillExperience">
//             <Form.Label className="font-bold">
//               Relevant Skill Experience
//             </Form.Label>
//             <Controller
//               name="relevantSkillExperience"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="number"
//                   isInvalid={!!errors.relevantSkillExperience}
//                   placeholder="Relevant Skill Experience in Years"
//                   value={field.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange("relevantSkillExperience", e.target.value)
//                   }
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.relevantSkillExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={12} md={6} className="sm:mb-3">
//           <Form.Group controlId="otherSkills">
//             <Form.Label className="font-bold">Other Skills</Form.Label>
//             <Controller
//               name="otherSkills"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="text"
//                   isInvalid={!!errors.otherSkills}
//                   placeholder="Enter other skills Name"
//                   value={field.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange("otherSkills", e.target.value)
//                   }
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.otherSkills?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={5} className="sm:mb-3">
//           <Form.Group controlId="referral">
//             <Form.Label className="font-bold">Referral</Form.Label>
//             <Controller
//               name="referral"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="text"
//                   isInvalid={!!errors.referral}
//                   placeholder="Reference"
//                   value={field.value || ""}
//                   onChange={(e) =>
//                     handleFieldChange("referral", e.target.value)
//                   }
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.referral?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={6} md={4} className="sm:mb-3">
//           <Form.Group controlId="url">
//             <Form.Label className="font-bold">Resume Url</Form.Label>
//             <Controller
//               name="url"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="url"
//                   isInvalid={!!errors.url}
//                   placeholder="Upload Resume Url"
//                   value={field.value || ""}
//                   onChange={(e) => handleFieldChange("url", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.url?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={12} md={3} className="sm:mb-3">
//           <Form.Group controlId="rating">
//             <Form.Label className="font-bold">
//               Rating Javascript Skills (1-10)
//             </Form.Label>
//             <Controller
//               name="rating"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="number"
//                   isInvalid={!!errors.rating}
//                   placeholder="Rate Your Javascript Skill out of 10"
//                   value={field.value || ""}
//                   onChange={(e) => handleFieldChange("rating", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.rating?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <div className="d-flex justify-content-end gap-3">
//         <Button type="button" onClick={onBack} className="bg-danger text-white">
//           Previous
//         </Button>
//         <Button type="submit" className="bg-primary text-white">
//           Next
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default EducationalDetailsForm;

// import { useForm, Controller } from "react-hook-form";
// import { Button } from "@mui/material";
// import { educationalDetailsSchema } from "../../validation/validationSchema";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { Col, Row, Form } from "react-bootstrap";
// import { Select, MenuItem, FormControl, Checkbox, ListItemText } from "@mui/material";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setEducationalDetails } from "../../store/slices/educationalDetailsSlice";
// import { RootState } from "../../store/store";

// interface EducationalDetailsFormProps {
//   onNext: (data: any) => void;
//   onBack: () => void;
//   initialValues: any;
//   showNext: boolean;
// }

// const qualificationOptions = ["Bachelors", "Masters", "PhD", "Diploma"];
// const passingYearOptions = ["2021", "2022", "2023", "2024"];
// const appliedSkillsOptions = ["JavaScript", "Python", "Java", "C++", "React", "Node.js"];

// const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({
//   onNext,
//   onBack,
//   initialValues,
//   showNext,
// }) => {
//   const dispatch = useDispatch();
//   const educationalDetails = useSelector((state: RootState) => state.educationalDetails);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     reset,
//     watch,
//   } = useForm({
//     resolver: yupResolver(educationalDetailsSchema),
//     defaultValues: educationalDetails || initialValues,
//   });

//   useEffect(() => {
//     reset(educationalDetails || initialValues);
//   }, [educationalDetails, initialValues, reset]);

//   const handleFieldChange = (field: keyof typeof educationalDetails, value: any) => {
//     setValue(field, value);
//     dispatch(setEducationalDetails({ [field]: value }));
//   };

//   const onSubmit = (data: typeof educationalDetails) => {
//     dispatch(setEducationalDetails(data));
//     onNext(data);
//   };

//   return (
//     <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6}>
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Qualification</Form.Label>
//             <Controller
//               name="qualification"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   className="h-10 my-1"
//                   value={field.value || ""}
//                   onChange={(e) => handleFieldChange("qualification", e.target.value)}
//                 >
//                   {qualificationOptions.map((option) => (
//                     <MenuItem key={option} value={option}>
//                       {option}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>

//         <Col xs={12} sm={6} md={6}>
//           <Form.Group controlId="degree">
//             <Form.Label className="font-bold">Degree Name</Form.Label>
//             <Controller
//               name="degree"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="text"
//                   isInvalid={!!errors.degree}
//                   placeholder="Degree Name"
//                   {...field}
//                   onChange={(e) => handleFieldChange("degree", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.degree?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Passing Year</Form.Label>
//             <Controller
//               name="passingYear"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   className="h-10 my-1"
//                   value={field.value || ""}
//                   onChange={(e) => handleFieldChange("passingYear", e.target.value)}
//                 >
//                   <MenuItem value="" disabled>
//                     Select your passing year
//                   </MenuItem>
//                   {passingYearOptions.map((year) => (
//                     <MenuItem key={year} value={year}>
//                       {year}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>

//         <Col xs={12} sm={6} md={6} className="sm:mb-3">
//           <FormControl fullWidth>
//             <Form.Label className="font-bold">Applied Skills</Form.Label>
//             <Controller
//               name="appliedSkills"
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   multiple
//                   value={field.value || []}
//                   onChange={(e) => handleFieldChange("appliedSkills", e.target.value)}
//                   renderValue={(selected) => (selected as string[]).join(", ")}
//                 >
//                   {appliedSkillsOptions.map((skill) => (
//                     <MenuItem key={skill} value={skill}>
//                       <Checkbox checked={(field.value || []).includes(skill)} />
//                       <ListItemText primary={skill} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </Col>
//       </Row>

//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="totalExperience">
//             <Form.Label className="font-bold">Total Experience</Form.Label>
//             <Controller
//               name="totalExperience"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="number"
//                   isInvalid={!!errors.totalExperience}
//                   placeholder="Total Experience in Years"
//                   {...field}
//                   onChange={(e) => handleFieldChange("totalExperience", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.totalExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={6} md={3} className="sm:mb-3">
//           <Form.Group controlId="relevantSkillExperience">
//             <Form.Label className="font-bold">Relevant Skill Experience</Form.Label>
//             <Controller
//               name="relevantSkillExperience"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="number"
//                   isInvalid={!!errors.relevantSkillExperience}
//                   placeholder="Relevant Skill Experience in Years"
//                   {...field}
//                   onChange={(e) =>
//                     handleFieldChange("relevantSkillExperience", e.target.value)
//                   }
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.relevantSkillExperience?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={12} md={6} className="sm:mb-3">
//           <Form.Group controlId="otherSkills">
//             <Form.Label className="font-bold">Other Skills</Form.Label>
//             <Controller
//               name="otherSkills"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="text"
//                   isInvalid={!!errors.otherSkills}
//                   placeholder="Enter other skills Name"
//                   {...field}
//                   onChange={(e) => handleFieldChange("otherSkills", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.otherSkills?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <Row className="md:mb-3">
//         <Col xs={12} sm={6} md={5} className="sm:mb-3">
//           <Form.Group controlId="referral">
//             <Form.Label className="font-bold">Referral</Form.Label>
//             <Controller
//               name="referral"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="text"
//                   isInvalid={!!errors.referral}
//                   placeholder="Reference"
//                   {...field}
//                   onChange={(e) => handleFieldChange("referral", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.referral?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={6} md={4} className="sm:mb-3">
//           <Form.Group controlId="url">
//             <Form.Label className="font-bold">Resume Url</Form.Label>
//             <Controller
//               name="url"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="url"
//                   isInvalid={!!errors.url}
//                   placeholder="Upload Resume Url"
//                   {...field}
//                   onChange={(e) => handleFieldChange("url", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.url?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>

//         <Col xs={12} sm={12} md={3} className="sm:mb-3">
//           <Form.Group controlId="rating">
//             <Form.Label className="font-bold">Rating (1-10)</Form.Label>
//             <Controller
//               name="rating"
//               control={control}
//               render={({ field }) => (
//                 <Form.Control
//                   type="number"
//                   isInvalid={!!errors.rating}
//                   placeholder="Rate Your Skills"
//                   {...field}
//                   onChange={(e) => handleFieldChange("rating", e.target.value)}
//                 />
//               )}
//             />
//             <Form.Control.Feedback type="invalid">
//               {errors.rating?.message}
//             </Form.Control.Feedback>
//           </Form.Group>
//         </Col>
//       </Row>

//       <div className="flex justify-end space-x-4 mt-4">
//         <Button variant="contained" color="error" onClick={onBack}>
//           Previous
//         </Button>
//         <Button type="submit" variant="contained" color="primary">
//           {showNext ? 'Next' : 'Update'}
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default EducationalDetailsForm;

import { useForm, Controller } from "react-hook-form";
import { Button } from "@mui/material";
import { educationalDetailsSchema } from "../../validation/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Col, Row, Form } from "react-bootstrap";
import {
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEducationalDetails } from "../../store/slices/educationalDetailsSlice";
import { RootState } from "../../store/store";

interface EducationalDetailsFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialValues: any;
  showNext: boolean;
}

const qualificationOptions = ["Bachelors", "Masters", "PhD", "Diploma"];
const passingYearOptions = ["2021", "2022", "2023", "2024"];
const appliedSkillsOptions = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
];

const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({
  onNext,
  onBack,
  initialValues,
  showNext,
}) => {
  const dispatch = useDispatch();
  const educationalDetails = useSelector(
    (state: RootState) => state.educationalDetails
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(educationalDetailsSchema),
    defaultValues: educationalDetails || initialValues,
  });

  useEffect(() => {
    reset(educationalDetails || initialValues);
  }, [educationalDetails, initialValues, reset]);

  const handleFieldChange = (
    field: keyof typeof educationalDetails,
    value: any
  ) => {
    setValue(field, value);
    dispatch(setEducationalDetails({ [field]: value }));
  };

  const onSubmit = (data: typeof educationalDetails) => {
    dispatch(setEducationalDetails(data));
    onNext(data);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="g-3 mb-4">
        {/* Qualification & Degree */}
        <Col xs={12} md={6}>
          <FormControl fullWidth className="mb-3">
            <Form.Label className="fw-medium">Qualification</Form.Label>
            <Controller
              name="qualification"
              control={control}
              render={({ field }) => (
                <Select
                  className="h-10"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleFieldChange("qualification", e.target.value)
                  }
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Qualification
                  </MenuItem>
                  {qualificationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Col>

        <Col xs={12} md={6}>
          <Form.Group controlId="degree" className="mb-3">
            <Form.Label className="fw-medium">Degree Name</Form.Label>
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  isInvalid={!!errors.degree}
                  placeholder="Enter degree name"
                  {...field}
                  onChange={(e) => handleFieldChange("degree", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.degree?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        {/* Passing Year & Skills */}
        <Col xs={12} md={6}>
          <FormControl fullWidth className="mb-3">
            <Form.Label className="fw-medium">Passing Year</Form.Label>
            <Controller
              name="passingYear"
              control={control}
              render={({ field }) => (
                <Select
                  className="h-10"
                  value={field.value || ""}
                  onChange={(e) =>
                    handleFieldChange("passingYear", e.target.value)
                  }
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Select Passing Year
                  </MenuItem>
                  {passingYearOptions.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Col>

        <Col xs={12} md={6}>
          <FormControl fullWidth className="mb-3">
            <Form.Label className="fw-medium">Applied Skills</Form.Label>
            <Controller
              name="appliedSkills"
              control={control}
              render={({ field }) => (
                <Select
                  multiple
                  className="h-10 "
                  value={field.value || []}
                  onChange={(e) =>
                    handleFieldChange("appliedSkills", e.target.value)
                  }
                  displayEmpty
                  renderValue={(selected) =>
                    (selected as string[]).length > 0
                      ? (selected as string[]).join(", ")
                      : "Select Relevant Skills"
                  }
                >
                  {appliedSkillsOptions.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      <Checkbox checked={(field.value || []).includes(skill)} />
                      <ListItemText primary={skill} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        {/* Experience Fields */}
        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="totalExperience" className="mb-3">
            <Form.Label className="fw-medium">Total Experience</Form.Label>
            <Controller
              name="totalExperience"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  isInvalid={!!errors.totalExperience}
                  placeholder="Years of total experience"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("totalExperience", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.totalExperience?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={3}>
          <Form.Group controlId="relevantSkillExperience" className="mb-3">
            <Form.Label className="fw-medium">Relevant Experience</Form.Label>
            <Controller
              name="relevantSkillExperience"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  isInvalid={!!errors.relevantSkillExperience}
                  placeholder="Years of relevant experience"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("relevantSkillExperience", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.relevantSkillExperience?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={6}>
          <Form.Group controlId="otherSkills" className="mb-3">
            <Form.Label className="fw-medium">Other Skills</Form.Label>
            <Controller
              name="otherSkills"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  isInvalid={!!errors.otherSkills}
                  placeholder="Enter other skills (comma separated)"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("otherSkills", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.otherSkills?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        {/* Referral & Resume */}
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="referral" className="mb-3">
            <Form.Label className="fw-medium">Referral</Form.Label>
            <Controller
              name="referral"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  isInvalid={!!errors.referral}
                  placeholder="Enter referral name"
                  {...field}
                  onChange={(e) =>
                    handleFieldChange("referral", e.target.value)
                  }
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.referral?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="url" className="mb-3">
            <Form.Label className="fw-medium">Resume URL</Form.Label>
            <Controller
              name="url"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="url"
                  isInvalid={!!errors.url}
                  placeholder="Enter resume URL"
                  {...field}
                  onChange={(e) => handleFieldChange("url", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.url?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="rating" className="mb-3">
            <Form.Label className="fw-medium">Skill Rating</Form.Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  min="1"
                  max="10"
                  isInvalid={!!errors.rating}
                  placeholder="Rate your skills (1-10)"
                  {...field}
                  onChange={(e) => handleFieldChange("rating", e.target.value)}
                />
              )}
            />
            <Form.Control.Feedback type="invalid">
              {errors.rating?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {!showNext && (
        <div className="d-flex flex-column flex-md-row justify-content-end gap-3 mt-4">
          <Button
            variant="contained"
            color="error"
            onClick={onBack}
            className="order-1 order-md-0"
          >
            Previous
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="order-0 order-md-1"
          >
            {showNext ? "Next" : "Next"}
          </Button>
        </div>
      )}
    </Form>
  );
};

export default EducationalDetailsForm;
