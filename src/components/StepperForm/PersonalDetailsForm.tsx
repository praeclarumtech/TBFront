
// src/components/StepperForm/PersonalDetailsForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { personalDetailsSchema } from '../../validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';


interface Gender {
  label: string;
  value: string;
}

interface Country {
  label: string;
  value: string;
}

interface State {
  label: string;
  value: string;
}

interface DropdownData {
  countries: Country[];
  states: Record<string, State[]>;  // key is the country value
  genders: Gender[];
}


interface PersonalDetailsFormProps {
  onNext: (data: any) => void;
  onCancel: () => void;
  initialValues: any;
}

const PersonalDetailsForm: React.FC<PersonalDetailsFormProps> = ({ onNext, onCancel, initialValues }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(personalDetailsSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (data: any) => {
    console.log("Personal Details Submitted:", data);
    onNext(data);
  };

  const [data, setData] = useState<DropdownData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');


  const mockData: DropdownData = {
    countries: [
      { label: 'USA', value: 'usa' },
      { label: 'India', value: 'india' },
      { label: 'Canada', value: 'canada' }
    ],
    states: {
      usa: [
        { label: 'California', value: 'california' },
        { label: 'New York', value: 'new-york' }
      ],
      india: [
        { label: 'Delhi', value: 'delhi' },
        { label: 'Mumbai', value: 'mumbai' }
      ],
      canada: [
        { label: 'Ontario', value: 'ontario' },
        { label: 'Quebec', value: 'quebec' }
      ]
    },
    genders: [
      { label: 'Male', value: 'male' },
      { label: 'Female', value: 'female' },
      { label: 'Other', value: 'other' }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData(mockData);
    }, 1000);

    // }, []);

    if (initialValues) {
      setSelectedCountry(initialValues.country || null);
      setSelectedState(initialValues.state || '');
      setSelectedGender(initialValues.gender || '');
    }
  }, [initialValues]);

  const handleCountryChange = (event: SelectChangeEvent) => {
    const country = event.target.value;
    setSelectedCountry(country);
    setSelectedState(''); // Reset state when country changes
    setValue("country", country); // Update form value with react-hook-form
  };


  const handleStateChange = (event: SelectChangeEvent) => {
    const state = event.target.value;
    setSelectedState(state);
    setValue("state", state); // Update form value with react-hook-form
  };

  const handleGenderChange = (event: SelectChangeEvent) => {
    const gender = event.target.value;
    setSelectedGender(gender);
    setValue("gender", gender); // Update form value with react-hook-form
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const { countries, states, genders } = data;

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="mb-3">
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <Form.Group  controlId="applicationNo">
            <Form.Label className='font-bold'>Application No.</Form.Label>
            <Form.Control
              type="text"
              value={'ERT2024'}
              disabled
              placeholder=""
            />
          </Form.Group>
        </Col>
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <Form.Group controlId="firstName">
            <Form.Label className='font-bold'>First Name</Form.Label>
            <Form.Control
              type="text"
              {...register("firstName")}
              isInvalid={!!errors.firstName}
              placeholder='FirstName'
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <Form.Group  controlId="middleName">
            <Form.Label className='font-bold'>Middle Name</Form.Label>
            <Form.Control
              type="text"
              {...register("middleName")}
              placeholder="MiddleName"
            />
            <Form.Control.Feedback type="invalid">
              {errors.middleName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col  xs={12} sm={6} md={3} className=" mb-lg-0">
          <Form.Group controlId="lastName">
            <Form.Label className='font-bold'>Last Name</Form.Label>
            <Form.Control
              type="text"
              {...register("lastName")}
              isInvalid={!!errors.lastName}
              placeholder="LastName"
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <Form.Group controlId="dateOfBirth">
            <Form.Label className='font-bold'>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              {...register("dateOfBirth")}
              isInvalid={!!errors.dateOfBirth}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateOfBirth?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <Form.Group controlId="email">
            <Form.Label className='font-bold'>Email</Form.Label>
            <Form.Control
              type="email"
              {...register("email")}
              isInvalid={!!errors.email}
              placeholder='Email'
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <Form.Group controlId="phoneNumber">
            <Form.Label className='font-bold'>Phone Number</Form.Label>
            <Form.Control
              type="text"
              {...register("phoneNumber")}
              isInvalid={!!errors.phoneNumber}
              placeholder='Phone Number'
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col  xs={12} sm={6} md={3} className=" mb-lg-0">
          <Form.Group  controlId="whatsappNumber">
            <Form.Label className='font-bold'>WhatsApp Number</Form.Label>
            <Form.Control
              type="text"
              {...register("whatsappNumber")}
              isInvalid={!!errors.whatsappNumber}
              placeholder="WhatsApp Number"
            />
            <Form.Control.Feedback type="invalid">
              {errors.whatsappNumber?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

      </Row>
      <Row className="mb-3">
        <Col  xs={12} sm={6} md={3} className='mb-3'  >
          <FormControl fullWidth>
            <Form.Label className='font-bold'>Gender</Form.Label>
            <Select
              {...register("gender")}
              value={selectedGender}
              onChange={handleGenderChange}
              className="h-10 my-1"
            >
              {genders.map((gender) => (
                <MenuItem key={gender.value} value={gender.value}>
                  {gender.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <FormControl fullWidth>
            <Form.Label className='font-bold'>Country</Form.Label>
            <Select
              {...register("country")}
              value={selectedCountry || ''}
              onChange={handleCountryChange}
              className="h-10 my-1"
            >
              {countries.map((country) => (
                <MenuItem key={country.value} value={country.value}>
                  {country.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Col>
        <Col  xs={12} sm={6} md={3} className="mb-3 mb-lg-0">
          <FormControl fullWidth>
            <Form.Label className='font-bold'>State</Form.Label>
            <Select
              {...register("state")}
              value={selectedState}
              onChange={handleStateChange}
              className="h-10 my-1"
              disabled={!selectedCountry}
              displayEmpty
            >
              {!selectedCountry && (
                <MenuItem value="" disabled>
                  State
                </MenuItem>
              )}
              {(selectedCountry && states[selectedCountry])?.map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  {state.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>

        <Col  xs={12} sm={6} md={3} >
          <Form.Group controlId="pincode">
            <Form.Label className='font-bold'>Pincode</Form.Label>
            <Form.Control
              type="text"
              {...register("pincode")}
              isInvalid={!!errors.pincode}
              placeholder='Enter Pincode'
            />
            <Form.Control.Feedback type="invalid">
              {errors.pincode?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col  xs={12}>
          <Form.Group controlId="fullAddress">
            <Form.Label className='font-bold'>Full Address</Form.Label>
            <Form.Control
              type="text"
              {...register("fullAddress")}
              isInvalid={!!errors.fullAddress}
              placeholder="Enter Full Address"
            />
            <Form.Control.Feedback type="invalid">
              {errors.fullAddress?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          onClick={onCancel}
          className="!bg-red-500 font-bold  text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 px-4 py-2 rounded"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="!bg-purple-600 font-bold text-white hover:bg-purple-700  focus:ring-2 focus:ring-purple-500 px-4 py-2 rounded"
        >
          Next
        </Button>
      </div>
    </Form>
  );
};

export default PersonalDetailsForm;


