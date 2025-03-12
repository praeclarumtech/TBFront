/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { getEmailDetails } from "api/emailApi";
import { errorHandle } from "utils/commonFunctions";
import { Typography, Box } from "@mui/material";
import {
  FaEnvelope,
  FaListAlt,
  FaUserAlt,
  FaCode,
  FaRegFileAlt,
} from "react-icons/fa"; 

const ViewModal = ({ show, onHide, applicantId }: any) => {
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!applicantId) return;

    setLoading(true);

    getEmailDetails(applicantId)
      .then((res) => {
        if (res.success) {
          setFormData(res.data);
        }
      })
      .catch((error) => {
        errorHandle(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [applicantId]);

  const capitalizeWords = (str: string) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!show) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Box className=" flex items-center">
            <FaEnvelope className="mr-2 text-primary" />
            <Typography variant="body1" className="text-gray-600">
              <span className=" !text-black">Email</span>
            </Typography>
          </Box>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : (
          formData && (
            <div className="mx-2 p-3">
              <Box className="mb-4 flex items-center">
                <FaUserAlt className="mr-2 text-primary" />
                <Typography variant="body1" className="text-gray-600">
                  <span className="  !text-black">Name:</span>
                  <span>
                    {" " +
                      capitalizeWords(
                        formData?.email?.applicantDetails?.name?.firstName || ""
                      )}{" "}
                    {capitalizeWords(
                      formData?.email?.applicantDetails?.name?.middleName || ""
                    )}{" "}
                    {capitalizeWords(
                      formData?.email?.applicantDetails?.name?.lastName || ""
                    )}
                  </span>
                </Typography>
              </Box>

              <Box className="mb-4 flex items-center">
                <FaListAlt className="mr-2 text-primary" />
                <Typography variant="body1" className="text-gray-600">
                  <span className=" !text-black">Applied Skills:</span>
                  <span>
                    {formData?.email?.applicantDetails?.appliedSkills?.length >
                    0
                      ? capitalizeWords(
                          " " +
                            formData?.email?.applicantDetails?.appliedSkills.join(
                              ", "
                            )
                        )
                      : "No skills listed"}
                  </span>
                </Typography>
              </Box>

              <Box className="mb-4 flex items-center">
                <FaEnvelope className="mr-2 text-primary" />
                <Typography variant="body1" className="text-gray-600">
                  <span className=" !text-black">To Email:</span>
                  <span>{" " + formData?.email?.email_to || "N/A"}</span>
                </Typography>
              </Box>

              <Box className="mb-4 flex items-center">
                <FaRegFileAlt className="mr-2 text-primary" />
                <Typography variant="body1" className="text-gray-600">
                  <span className=" !text-black">Bcc Email:</span>
                  <span>{" " + formData?.email?.email_bcc || "N/A"}</span>
                </Typography>
              </Box>

              <Box className="mb-4 flex items-center">
                <FaEnvelope className="mr-2 text-primary" />
                <Typography variant="body1" className="text-gray-600">
                  <span className="  !text-black">Subject:</span>
                  <span>{" " + formData?.email?.subject || "N/A"}</span>
                </Typography>
              </Box>

              <Box className="mb-4 flex items-center">
                <FaCode className="mr-2 text-primary" />
                <Typography variant="body1" className="text-gray-600">
                  <span className=" !text-black">Description:</span>
                  <span>
                    {" " + formData?.email?.description ||
                      "No description provided"}
                  </span>
                </Typography>
              </Box>
            </div>
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ViewModal;
