import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import BaseButton from "./BaseButton";
import { BaseModalProps } from "interfaces/global.interface";

const BaseModal: React.FC<BaseModalProps> = ({
  show,
  onSubmitClick,
  onCloseClick,
  loader,
  children,
  modalTitle,
  submitButtonText,
  closeButtonText,
  setShowBaseModal,
  size,
}) => {
  const toggle = () => setShowBaseModal(!show);
  return (
    <Modal fade={true} isOpen={show} toggle={toggle} centered size={size} >
      <ModalHeader toggle={toggle} className="fw-bold">{modalTitle}</ModalHeader>
      <ModalBody>{children}</ModalBody>

      <ModalFooter>
        <BaseButton
          color="outline-danger" // Changed "denger" to "danger"
          // className="text-white "
          type="button"
          onClick={onCloseClick}
        >
          {closeButtonText}
          {/* Fixed the typo from 'cloaseButtonText' to 'closeButtonText' */}
        </BaseButton>
        <BaseButton
          color="primary"
          disabled={loader}
          type="submit"
          loader={loader}
          className="px-5 ms-3 "
          onClick={onSubmitClick}
        >
          {submitButtonText}
        </BaseButton>
      </ModalFooter>
    </Modal>
  );
};

export default BaseModal;
