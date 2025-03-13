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
  cloaseButtonText,
  setShowBaseModal,
}) => {

  const toggle = () => setShowBaseModal(!show);
  return (
    <Modal fade={true} isOpen={show} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <BaseButton
          color="secondary"
          className="btn btn-outline-dark border-1 rounded-5 text-white"
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
