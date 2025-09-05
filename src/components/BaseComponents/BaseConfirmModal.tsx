/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Button, Modal, ModalBody, Spinner } from "reactstrap";

const ConfirmModal: React.FC<any> = ({
  show,
  onYesClick,
  onCloseClick,
  loader,
  flag,
}) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="px-4 py-4 text-center">
        <h5>
          <p className="text-muted mb-3">
            {!flag
              ? " Are you sure you want to export records?"
              : "Are you sure you want to move the records to the Applicants page?"}
          </p>
        </h5>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button color="primary" onClick={onYesClick} disabled={loader}>
            {loader ? (
              <>
                <Spinner size="sm" className="me-2" />
                {!flag ? "Exporting..." : "Moving..."}
              </>
            ) : (
              "Yes"
            )}
          </Button>
          <Button color="secondary" onClick={onCloseClick}>
            No
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;
