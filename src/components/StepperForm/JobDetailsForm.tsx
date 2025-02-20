// src/components/StepperForm/JobDetailsForm.tsx
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { jobDetailsSchema } from '../../validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, Form } from 'react-bootstrap';
import { Select, MenuItem, FormControl } from '@mui/material';
import { TextField, FormHelperText } from '@mui/material';



interface JobDetailsFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialValues: any;
}

const workStatusOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const workPreferenceOptions = [
  { value: 'remote', label: 'Remote' },
  { value: 'onsite', label: 'Onsite' },
  { value: 'hybrid', label: 'Hybrid' },
];

const JobDetailsForm: React.FC<JobDetailsFormProps> = ({ onNext, onBack, initialValues }) => {
  const { register, handleSubmit, control, setValue ,formState: { errors }, trigger } = useForm({
    resolver: yupResolver(jobDetailsSchema),
    defaultValues: initialValues,
  });
  

  const onSubmit = (data: any) => {
    console.log("Job Details Submitted:", data);
    onNext(data);
  };

  const [readyForWork, setReadyForWork] = useState<string>('no');
  const [workPreference, setWorkPreference] = useState<string>('remote');


  const handleWorkStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const readyForWork = event.target.value as string;
    setReadyForWork(readyForWork);
    setValue("readyForWork",readyForWork);
  };


  const handleWorkPreferenceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const workPreference = event.target.value as string;
    setWorkPreference(workPreference);
    setValue("workPreference",workPreference);
  };

  useEffect(() => {
    if (initialValues) {
      setValue("readyForWork", initialValues.readyForWork || '');
      setValue("workPreference", initialValues.workPreference || '');
      setValue("aboutus", initialValues.aboutus || '');
      // Set other fields like qualification, passingYear, etc., in a similar way
    }
  }, [initialValues, setValue]);



  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="mb-3">
        <Col sm={6} className="mb-3">
          <Form.Group controlId="expectedpkg">
            <Form.Label>Expected Package(LPA)</Form.Label>
            <Form.Control
              type="text"
              {...register("expectedpkg")}
              isInvalid={!!errors.expectedpkg}
              placeholder='Expected Package (LPA)'
            />
            <Form.Control.Feedback type="invalid">
              {errors.expectedpkg?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6} className="">
          <Form.Group controlId="currentpkg">
            <Form.Label>Current Package(LPA)</Form.Label>
            <Form.Control
              type="text"
              {...register("currentpkg")}
              isInvalid={!!errors.currentpkg}
              placeholder="Current Package (LPA)"
            />
            <Form.Control.Feedback type="invalid">
              {errors.currentpkg?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={6} className="mb-3">
          <Form.Group controlId="negotiation">
            <Form.Label>Negotiation</Form.Label>
            <Form.Control
              type="number"
              {...register("negotiation")}
              isInvalid={!!errors.negotiation}
              placeholder="Negotiation Rupees"
            />
            <Form.Control.Feedback type="invalid">
              {errors.negotiation?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6} className="">
          <Form.Group controlId="noticePeriod">
            <Form.Label>Notice Period</Form.Label>
            <Form.Control
              type="number"
              {...register("noticePeriod")}
              isInvalid={!!errors.noticePeriod}
              placeholder="Notice Period in Days"
            />
            <Form.Control.Feedback type="invalid">
              {errors.noticePeriod?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={3} className="mb-3">
          <FormControl fullWidth variant="outlined" error={!!errors.readyForWork}>
            <Form.Label>Ready for work</Form.Label>
            <Select
              {...register("readyForWork", { required: "This field is required" })} // Ensure this is registered with validation
              value={readyForWork}
              onChange={handleWorkStatusChange}
              className='h-10'
            >
              {workStatusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.readyForWork && <FormHelperText>{errors.readyForWork.message}</FormHelperText>}
          </FormControl>
        </Col>

        <Col sm={3} className="mb-3">
          <FormControl fullWidth variant="outlined" error={!!errors.workPreference}>
            <Form.Label>Work preference</Form.Label>
            <Select
              {...register("workPreference", { required: "This field is required" })} // Ensure this is registered with validation
              value={workPreference}
              onChange={handleWorkPreferenceChange}
              className='h-10'
            >
              {workPreferenceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.workPreference && <FormHelperText>{errors.workPreference.message}</FormHelperText>}
          </FormControl>
        </Col>

        <Col sm={6}>

          <FormControl fullWidth error={!!errors.aboutus}>
            <Form.Label>About Us</Form.Label>
            <TextField

              multiline
              minRows={2}
              variant="outlined"
              color="primary"
              {...register("aboutus", { required: "About us is required" })}
              placeholder="About Us"
              size="medium"
              fullWidth
            />
            {errors.aboutus && (
              <FormHelperText>{errors.aboutus.message}</FormHelperText>
            )}
          </FormControl>
        </Col>

      </Row>
      <div className="flex justify-end space-x-4">
        <Button type="button" className="!bg-red-500  text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 px-4 py-2 rounded" onClick={onBack}>Previous</Button>
        <Button type="submit" className="!bg-purple-600 font-bold text-white hover:bg-purple-700  focus:ring-2 focus:ring-purple-500 px-4 py-2 rounded" >Next</Button>
      </div>
    </Form>
  );
};

export default JobDetailsForm;