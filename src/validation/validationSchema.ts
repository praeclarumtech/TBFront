

// import * as yup from 'yup';

// export const personalDetailsSchema = yup.object().shape({
//   firstName: yup.string().required('First Name is required'),
//   lastName: yup.string().required('Last Name is required'),
//   middleName: yup.string(),
//   email: yup.string().email('Invalid email address').required('Email is required'),
//   phoneNumber: yup
//     .string()
//     .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
//     .required('Phone number is required'),
//   whatsappNumber: yup
//     .string()
//     .matches(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits')
//     .required('WhatsApp Number is required'),
//   // dateOfBirth: yup.date().required('Date of Birth is required'),
//   dateOfBirth: yup.date().required('Date of birth is required'),
//   city: yup.string().required("city is required"),
//   pincode: yup
//     .string()
//     .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
//     .required('Pincode is required'),
//   fullAddress: yup.string().required('Full Address is required'),
// });

// export const educationalDetailsSchema = yup.object().shape({
//   qualification: yup.string().required("Qualification is required"),
//   degree: yup.string().required('Degree Name is required'),
//   passingYear: yup.string().required("Passing Year required"),
//   appliedSkills: yup.array().min(1, 'At least one skill must be selected'),
//   otherSkills: yup.string(),
//   totalExperience: yup.number()
//     .positive('Total Experience must be a positive number')
//     .required('Total Experience is required'),
//   relevantSkillExperience: yup.number()
//     .min(0, 'Relevant Skill Experience cannot be negative')
//     .required('Relevant Skill Experience is required')
//     .test('is-less-than-or-equal-total', 'Relevant Skill Experience must be less than or equal to Total Experience', function (value) {
//       const totalExperience = this.parent.totalExperience;
//       return value <= totalExperience;
//     }),
//   // resume: yup.mixed()
//   //   .required('Resume is required')
//   //   .test('fileType', 'Only PDF files are allowed', (value) => {
//   //     const files = value as FileList;  // Cast value to FileList
//   //     return files && files[0]?.type === 'application/pdf';
//   //   }),
//   // resume: yup.mixed()

//   // .test('fileType', 'Only PDF files are allowed', (value) => {
//   //   const files = value as FileList;
//   //   return files && files[0]?.type === 'application/pdf';
//   // }),
//   referral: yup.string(),
//   url: yup.string().url('Please enter a valid URL'),
//   rating: yup.number()
//     .required('Rating is required')
//     .min(1, 'Rating must be between 1 and 10')
//     .max(10, 'Rating must be between 1 and 10'),
// });

// export const jobDetailsSchema = yup.object().shape({
//   expectedPkg: yup.string(),
//   currentPkg: yup.string(),
//   negotiation: yup.string(),
//   noticePeriod: yup.string()
//     .required("Notice period is required.")
//     .min(0, 'Notice period cannot be negative'),
//   aboutUs: yup.string(),
//   // work_Preference: yup.string().required(""),
//   // ready_Wfo: yup.string().required(""),
// });



// // import * as yup from 'yup';

// // export const personalDetailsSchema = yup.object().shape({
// //   firstName: yup.string().required('First name is required'),
// //   lastName: yup.string().required('Last name is required'),
// //   dateOfBirth: yup.date().required('Date of birth is required'),
// //   email: yup.string().email('Invalid email').required('Email is required'),
// //   phoneNumber: yup.string().required('Phone number is required'),
// //   country: yup.string().required('Country is required'),
// //   state: yup.string().required('State is required'),
// //   city: yup.string().required('City is required'),
// //   pincode: yup.string().required('Pincode is required'),
// //   gender: yup.string().required('Gender is required'),
// // });

// // export const jobDetailsSchema = yup.object().shape({
// //   currentpkg: yup.number().required('Current package is required'),
// //   expectedpkg: yup.number().required('Expected package is required'),
// //   noticePeriod: yup.number().required('Notice period is required'),
// //   readyForWork: yup.string().required('This field is required'),
// //   workPreference: yup.string().required('Work preference is required'),
// //   aboutus: yup.string().required('About us is required'),
// // });

// // export const educationalDetailsSchema = yup.object().shape({
// //   qualification: yup.string().required('Qualification is required'),
// //   degree: yup.string().required('Degree is required'),
// //   passingYear: yup.string().required('Passing year is required'),
// //   totalExperience: yup.number().required('Total experience is required'),
// //   relevantSkillExperience: yup.number().required('Relevant experience is required'),
// // });

// export const combinedSchema = yup.object().shape({
//   ...personalDetailsSchema.fields,
//   ...jobDetailsSchema.fields,
//   ...educationalDetailsSchema.fields,
// });




import * as yup from 'yup';

export const personalDetailsSchema = yup.object().shape({
  firstName: yup.string(),
  lastName: yup.string(),
  middleName: yup.string(),
  email: yup.string().email('Invalid email address'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    ,
  whatsappNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits')
    ,
  // dateOfBirth: yup.date().('Date of Birth is '),
  dateOfBirth: yup.date(),
  city: yup.string(),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
    ,
  fullAddress: yup.string(),
});

export const educationalDetailsSchema = yup.object().shape({
  qualification: yup.string(),
  degree: yup.string(),
  passingYear: yup.string(),
  appliedSkills: yup.array().min(1, 'At least one skill must be selected'),
  otherSkills: yup.string(),
  totalExperience: yup.number()
    .positive('Total Experience must be a positive number')
    ,
  relevantSkillExperience: yup.number()
    .min(0, 'Relevant Skill Experience cannot be negative')
    
    .test('is-less-than-or-equal-total', 'Relevant Skill Experience must be less than or equal to Total Experience', function (value) {
      const totalExperience = this.parent.totalExperience;
      return (value ?? 0) <= totalExperience;
    }),
 

  referral: yup.string(),
  url: yup.string().url('Please enter a valid URL'),
  rating: yup.number()
   
    .min(1, 'Rating must be between 1 and 10')
    .max(10, 'Rating must be between 1 and 10'),
});

export const jobDetailsSchema = yup.object().shape({
  expectedPkg: yup.string(),
  currentPkg: yup.string(),
  negotiation: yup.string(),
  noticePeriod: yup.string()
   
    .min(0, 'Notice period cannot be negative'),
  aboutUs: yup.string(),
  
});





export const combinedSchema = yup.object().shape({
  ...personalDetailsSchema.fields,
  ...jobDetailsSchema.fields,
  ...educationalDetailsSchema.fields,
});