import React from "react";
import { Modal, Button, Typography } from "@mui/material";

interface ConfirmationModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
  alert: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  message,
  onClose,
  alert,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="rounded bg-white max-w-sm p-2 mt-5 mx-auto border-none justify-center text-center "
        
      >
       
        <Typography
          style={{ }}
          className="text-left !font-bold !text-lg !px-2 !text-red-600 "
        >
          <i
            className="fa fa-regular fa fa-triangle-exclamation"
            style={{ }}
          ></i>
          {alert}
        </Typography>

        <hr />
        <Typography className="text-sm">{message}</Typography>
        <div style={{ marginTop: "20px" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
