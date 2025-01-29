// src/validation/validationSchema.ts

import * as yup from 'yup';

export const personalDetailsSchema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  middleName: yup.string(),
  email: yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
    whatsappNumber:yup
    .string()
    .matches(/^[0-9]{10}$/, 'WhatsApp number must be 10 digits')
    .required('WhatsApp Number is required'),
  dateOfBirth: yup.date().required('Date of Birth is required'),
  pincode: yup
    .string()
    .matches(/^[0-9]{6}$/, 'Pincode must be 6 digits')
    .required('Pincode is required'),
  fullAddress: yup.string().required('Full Address is required'),
});

export const educationalDetailsSchema = yup.object().shape({
  degree: yup.string().required('Degree Name is required'),
  // passingYear: yup.number().required('Passing Year is required'),
  appliedSkills: yup.array().min(1, 'At least one skill must be selected'),
  otherskills: yup.string(),
  totalExperience: yup.number().positive('Total Experience must be a positive number').required('Total Experience is required'),
  relevantSkillExperience: yup.number().min(0, 'Relevant Skill Experience cannot be negative').required('Relevant Skill Experience is required'),
  resume: yup.mixed()
    .required('Resume is required')
    .test('fileType', 'Only PDF files are allowed', (value) => {
      const files = value as FileList;  // Cast value to FileList
      return files && files[0]?.type === 'application/pdf';
    }),
    url:yup.string().url('Please enter a valid URL'),
    rating: yup.number().required('Rating is required').min(1, 'Rating must be between 1 and 10').max(10, 'Rating must be between 1 and 10'),
});

export const jobDetailsSchema = yup.object().shape({
  expectedpkg: yup.string().required("Expected package is required."),
  currentpkg: yup.string().required("Current package is required."),
  negotiation: yup.string(),
  noticePeriod: yup.number().required("Notice period is required."),
  // workpreference: yup.string().required("Work preference is required."),
  aboutus: yup.string().required("About us is required.")
});