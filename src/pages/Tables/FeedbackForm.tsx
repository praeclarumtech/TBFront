import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface FeedbackFormProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ show, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Feedback</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-2">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default FeedbackForm;