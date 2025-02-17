// src/components/FeedbackModal.tsx
import  { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
// import { Applicant } from '../../types';
import { updateApplicant } from '../../services/applicantService';

const FeedbackModal = ({ show, applicant, onHide, onUpdate }) => {
  const [feedback, setFeedback] = useState(applicant.feedback);
  const [email, setEmail] = useState(applicant.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateApplicant(applicant._id, { feedback, email });
    onUpdate();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Update Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FeedbackModal;