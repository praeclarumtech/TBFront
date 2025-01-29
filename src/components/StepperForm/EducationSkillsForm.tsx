// src/components/StepperForm/EducationalDetailsForm.tsx

import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import { educationalDetailsSchema } from '../../validation/validationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row, Form } from 'react-bootstrap';
import { Select, MenuItem, FormControl, Checkbox, ListItemText } from '@mui/material';
import { SetStateAction, useState } from 'react';

interface EducationalDetailsFormProps {
  onNext: (data: any) => void;
  onBack: () => void;
  initialValues: any;
}

const EducationalDetailsForm: React.FC<EducationalDetailsFormProps> = ({ onNext, onBack, initialValues }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(educationalDetailsSchema),
    defaultValues: initialValues,
  });

  const onSubmit = (data: any) => {
    console.log("Educational Details Submitted:", data);
    onNext(data);
  };



  const [qualification, setQualification] = useState('');
  const [passingYear, setPassingYear] = useState('');
  const [appliedSkills, setAppliedSkills] = useState([]);

  const handleQualificationChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setQualification(event.target.value);
  };

  const handlePassingYearChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setPassingYear(event.target.value);
  };

  const handleAppliedSkillsChange = (event: { target: { value: SetStateAction<never[]>; }; }) => {
    setAppliedSkills(event.target.value);
  };

  const qualificationOptions = ['Bachelors', 'Masters', 'PhD', 'Diploma'];
  const passingYearOptions = ['2021', '2022', '2023', '2024'];

  const appliedSkillsOptions = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js'];

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-3">
      <Row className="mb-3">
        <Col sm={6}>
          <FormControl fullWidth variant="outlined">
            <Form.Label>Qualification</Form.Label>
            <Select
              value={qualification} className='h-10'
              onChange={handleQualificationChange}
              // label="Qualification"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select your qualification
              </MenuItem>
              {qualificationOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

        </Col>
        <Col sm={6}>
          <Form.Group controlId="degree">
            <Form.Label>Degree Name</Form.Label>
            <Form.Control
              type="text"
              {...register("degree")}
              isInvalid={!!errors.degree}
              placeholder='Degree Name'
            />
            <Form.Control.Feedback type="invalid">
              {errors.degree?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

      </Row>
      <Row className="mb-3">
        <Col sm={6}>
          <FormControl fullWidth variant="outlined">
            <Form.Label>Passing Year</Form.Label>
            <Select
              value={passingYear}
              className='h-10'
              onChange={handlePassingYearChange}
              // label="Passing Year"
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select your passing year
              </MenuItem>
              {passingYearOptions.map((year, index) => (
                <MenuItem key={index} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>
        <Col sm={6} >
          <FormControl fullWidth variant="outlined">
            <Form.Label>Applied Skills</Form.Label>
            <Select
              multiple
              value={appliedSkills}
              className='h-10'
              onChange={handleAppliedSkillsChange}
             
              renderValue={(selected) => selected.join(', ')}
            >
              <MenuItem value="" disabled>
                Select Relevant Skills
              </MenuItem>
              {appliedSkillsOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  <Checkbox checked={appliedSkills.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Col>

      </Row>

      <Row className="mb-3">
        <Col sm={3}>
          <Form.Group controlId="totalExperience">
            <Form.Label>Total Experience</Form.Label>
            <Form.Control
              type="number"
              {...register("totalExperience")}
              isInvalid={!!errors.totalExperience}
              placeholder='Total Experience in Years'
            />
            <Form.Control.Feedback type="invalid">
              {errors.totalExperience?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={3}>
          <Form.Group controlId="relevantSkillExperience">
            <Form.Label>Relevant Skill Experience</Form.Label>
            <Form.Control
              type="number"
              {...register("relevantSkillExperience")}
              isInvalid={!!errors.relevantSkillExperience}
              placeholder='Relevant Skill Experience in Years'
            />
            <Form.Control.Feedback type="invalid">
              {errors.relevantSkillExperience?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group controlId="otherSkills">
            <Form.Label>Other Skills</Form.Label>
            <Form.Control
              type="text"
              {...register("otherSkills")}
              isInvalid={!!errors.otherskills}
              placeholder="Enter other skills Name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.otherSkills?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={6}>
          <Form.Group controlId="resume">
            <Form.Label>Resume (PDF)</Form.Label>
            <Form.Control
              type="file"
              {...register("resume")}
              isInvalid={!!errors.resume}
            />
            <Form.Control.Feedback type="invalid">
              {errors.resume?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={4}>
          <Form.Group controlId="resume">
            <Form.Label>Url</Form.Label>
            <Form.Control
              type="url"
              {...register("url")}
              isInvalid={!!errors.url}
              placeholder='Upload Resume Url'
            />
            <Form.Control.Feedback type="invalid">
              {errors.url?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col sm={2}>
          <Form.Group controlId="rating">
            <Form.Label>Rating (1-10)</Form.Label>
            <Form.Control
              type="number"
              {...register("rating")}
              isInvalid={!!errors.rating}
              placeholder="Rate Your Javascript Skill out of 10"
            />
            <Form.Control.Feedback type="invalid">
              {errors.rating?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

      </Row>
      <Row className="mb-3">

      </Row>
      <div className="flex justify-end space-x-4">
        <Button type="button" onClick={onBack} className="!bg-red-500  text-white hover:bg-red-600 focus:ring-2 focus:ring-red-500 px-4 py-2 rounded" >Previous</Button>
        <Button type="submit" className="!bg-purple-600 font-bold text-white hover:bg-purple-700  focus:ring-2 focus:ring-purple-500 px-4 py-2 rounded" >Next</Button>
      </div>
    </Form>
  );
};

export default EducationalDetailsForm;

