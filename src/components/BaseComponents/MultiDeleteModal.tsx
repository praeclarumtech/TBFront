// import { DeleteModalProps } from "interfaces/global.interface";
import React from "react";
import { Button, Modal, ModalBody, Spinner } from "reactstrap";

interface DeleteModalProps {
  show: boolean;
  onDeleteClick: () => void;
  onCloseClick: () => void;
  loader: boolean;
  deleteItems: string[] | null; 
}

const MultiDeleteModal: React.FC<DeleteModalProps> = ({
  show,
  onDeleteClick,
  onCloseClick,
  loader,
  deleteItems,
}) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure?</h4>
            <p className="text-muted mx-4 mb-0">
              {deleteItems && deleteItems.length === 1
                ? `Are you sure you want to delete this email: ${deleteItems[0]}?`
                : `Are you sure you want to delete ${deleteItems?.length} emails?`}
            </p>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <Button color="light" size="btn w-sm" onClick={onCloseClick}>
            Close
          </Button>
          <Button color="danger" size="btn w-sm" onClick={onDeleteClick}>
            Yes, Delete It!
            {loader && <Spinner size="sm" className="me-2" />}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  ) as unknown as JSX.Element;
};

export default MultiDeleteModal;
