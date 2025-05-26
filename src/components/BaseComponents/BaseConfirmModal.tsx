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
        <p className="text-muted mb-3">
          <h5>
            Are you sure you want to{" "}
            {!flag ? "export records?" : "move the records application records to the Applications page?"}
          </h5>
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button color="secondary" onClick={onCloseClick}>
            No
          </Button>
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
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ConfirmModal;
