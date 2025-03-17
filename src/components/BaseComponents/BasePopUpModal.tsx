
import { Modal, Button } from "react-bootstrap";
import { BasePopUpModalProps } from "interfaces/global.interface"; // Assuming you have this interface defined

const BasePopUpModal = ({
  isOpen,
  onRequestClose,
  title,
  message,
  items = [],
  confirmAction,
  cancelAction,
  confirmText = "Yes",
  cancelText = "No",
  disabled = false,
}: BasePopUpModalProps) => {
  return (
    <Modal show={isOpen} onHide={onRequestClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {message && <p>{message}</p>}
        {items.length > 0 && (
          <ul>
            {items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
        <p>Do you want to proceed?</p>
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            confirmAction();
            onRequestClose();
          }}
          disabled={disabled}
        >
          {confirmText}
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            cancelAction();
            onRequestClose();
          }}
          disabled={disabled}
        >
          {cancelText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BasePopUpModal;
