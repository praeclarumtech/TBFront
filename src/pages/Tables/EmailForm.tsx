import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface EmailFormProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (emailContent: string) => void;
}

const EmailForm: React.FC<EmailFormProps> = ({ show, onClose, onSubmit }) => {
  const [emailContent, setEmailContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(emailContent);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Send Email</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Email Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              required
            />
          </Form.Group>
          <Button type="submit" className="mt-2">
            Send
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EmailForm;