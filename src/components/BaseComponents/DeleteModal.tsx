import { DeleteModalProps } from "interfaces/global.interface";
import React from "react";
import { Button, Modal, ModalBody, Spinner } from "reactstrap";

const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  onDeleteClick,
  onCloseClick,
  recordId,
  loader,
}) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="px-5 py-3">
        <div className="mt-2 text-center">
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <div className="pt-2 mx-4 mt-4 fs-15 mx-sm-5">
              {/* <h4>Are you sure ?</h4> */}
            <p className="mx-4 mb-0 text-dark">
              <strong>Are you sure you want to remove this record</strong>{" "}
              {recordId ? recordId : ""} ?
            </p>
          </div>
        </div>
        <div className="gap-2 mt-4 mb-2 d-flex justify-content-center">
          <Button color="danger" size="btn w-sm" onClick={onDeleteClick}>
            Yes, Delete It!
            {loader}
            {loader && <Spinner size="sm" className="me-2" />}{" "}
          </Button>
          <Button
            color="light"
            size="btn w-sm"
            onClick={onCloseClick}
            className="px-8"
          >
            No
          </Button>
        </div>
      </ModalBody>
    </Modal>
  ) as unknown as JSX.Element;
};

export default DeleteModal;
