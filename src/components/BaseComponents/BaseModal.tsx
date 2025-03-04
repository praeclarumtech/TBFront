import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BaseButton from "./BaseButton";

interface BaseModalProps {
  show?: boolean;
  onSubmitClick?: () => void;
  onCloseClick?: () => void;
  loader?: boolean;
  children?: React.ReactNode;
  modalTitle?: string;
  cloaseButtonText?: string;
  submitButtonText?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onSubmitClick,
  onCloseClick,
  loader,
  children,
  modalTitle,
  submitButtonText,
  cloaseButtonText,
}) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick}>
      <ModalHeader>{modalTitle}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <BaseButton
          color=" "
          className="btn btn-outline-dark border-1 rounded-5"
          type="button"
          onClick={onCloseClick}
        >
          {cloaseButtonText}
        </BaseButton>
        <BaseButton
          color="success"
          disabled={loader}
          type="submit"
          loader={loader}
          className="ms-3 px-5 border rounded-5"
          onClick={onSubmitClick}
        >
          {submitButtonText}
        </BaseButton>
      </ModalFooter>
    </Modal>
  );
};

export default BaseModal;
