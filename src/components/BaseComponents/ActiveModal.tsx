import { ActiveModalProps } from "interfaces/global.interface";
import React from "react";
import { Button, Modal, ModalBody, Spinner } from "reactstrap";
 
const ActiveModal: React.FC<ActiveModalProps> = ({
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
            {" "}
            Are you sure you want to {flag ? "deactivate" : "active"} this
            record?{" "}
          </h5>
        </p>
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button color="primary" onClick={onYesClick} disabled={loader}>
            {loader ? (
              <>
                <Spinner size="sm" className="me-2" />{" "}
                {flag ? "Deactivating..." : "Activating..."}
              </>
            ) : (
              <>{flag ? "Deactivate" : "Active"}</>
            )}
          </Button>
           <Button color="secondary" onClick={onCloseClick}>
            Cancel
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};
 
export default ActiveModal;