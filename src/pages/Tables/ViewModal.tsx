


import React from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { Typography } from "@mui/material";
import { Applicant } from "../../types";

interface ViewModalProps {
    show: boolean;
    onHide: () => void;
    selectedApplicant: Applicant | null;
}

const ViewModal: React.FC<ViewModalProps> = ({ show, onHide, selectedApplicant }) => {
    console.log("Selected Applicant in ViewModal:", selectedApplicant);

    if (!selectedApplicant || !selectedApplicant.name || !selectedApplicant.phone) {
        return null;
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            // className="fixed inset-0 flex items-center justify-center z-50"
            size="lg"
            centered
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        >
            {/* <div className="bg-white rounded-lg shadow-lg max-w-lg w-full overflow-auto"> */}
            <Modal.Header closeButton>
                <Modal.Title>Applicant Details</Modal.Title>
            </Modal.Header>

            <Modal.Body className="p-4">
                {selectedApplicant && (
                    <>
                        <div className="mx-2 p-3 ">
                            <Typography variant="h6" className="mx-5 font-bold text-2xl text-blue-600"><i className="fa fa-user m-2" />Personal Details:
                            </Typography>
                            <hr className="text-blue-900 font-extrabold mb-4" />
                            <Row>
                                <Col xs={12} md={6} className="mb-3">
                                    <Typography variant="body1" className="text-gray-700">
                                        <span className="font-extrabold text-base text-black">Name:</span>
                                        <span> {selectedApplicant.data.name.firstName} {selectedApplicant.data.name.middleName} {selectedApplicant.data.name.lastName}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Phone Number:</span>
                                        <span> {selectedApplicant.data.phone.phoneNumber}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">WhatsApp Number:</span>
                                        <span> {selectedApplicant.data.phone.whatsappNumber}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Date of Birth:</span>
                                        <span> {new Date(selectedApplicant.data.dateOfBirth).toLocaleDateString()}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Gender:</span>
                                        <span> {selectedApplicant.data.gender}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Full Address:</span>
                                        <span> {selectedApplicant.data.fullAddress}</span>
                                    </Typography>
                                </Col>
                                <Col xs={12} md={6} className="mb-3">
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Email:</span>
                                        <span> {selectedApplicant.data.email}</span>
                                    </Typography>
                                   
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">State:</span>
                                        <span> {selectedApplicant.data.state}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Country:</span>
                                        <span> {selectedApplicant.data.country}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">City:</span>
                                        <span> {selectedApplicant.data.city}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Pincode:</span>
                                        <span> {selectedApplicant.data.pincode}</span>
                                    </Typography>

                                </Col>
                                <Typography variant="h6" className='mx-5 font-bold text-2xl text-blue-600'><i className="fa fa-graduation-cap m-2" />Educational Details:</Typography>
                                <hr className='text-blue-900 font-extrabold ' />

                                <Col xs={12} md={6} className="mb-3">

                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Qualification:</span>
                                        <span> {selectedApplicant.data.qualification}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Degree:</span>
                                        <span> {selectedApplicant.data.degree}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Passing Year:</span>
                                        <span> {selectedApplicant.data.passingYear}</span>
                                    </Typography>
                                    
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Applied Skills:</span>
                                        <span> {selectedApplicant.data.appliedSkills?.length > 0 ? selectedApplicant.data.appliedSkills.join(", ") : "No skills listed"}</span>
                                    </Typography>
                                </Col>
                                <Col xs={12} md={6} className="mb-3">
                                <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Total Experience (in months):</span>
                                        <span> {selectedApplicant.data.totalExperience}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Relevant Skill Experience:</span>
                                        <span> {selectedApplicant.data.relevantSkillExperience}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Other Skills:</span>
                                        <span> {selectedApplicant.data.otherSkills}</span>
                                    </Typography>
                                </Col>
                                <Typography variant="h6" className='mx-5 font-bold text-2xl text-blue-600'><i className="fa fa-briefcase m-2" />Job Details</Typography>
                                <hr className='text-blue-900 font-extrabold ' />
                                <Col xs={12} md={6} className="mb-3">
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Current Package:</span>
                                        <span> {selectedApplicant.data.currentPkg}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Expected Package:</span>
                                        <span> {selectedApplicant.data.expectedPkg}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Notice Period:</span>
                                        <span> {selectedApplicant.data.noticePeriod}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Negotiation:</span>
                                        <span> {selectedApplicant.data.negotiation}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Ready for Work (WFO):</span>
                                        <span> {selectedApplicant.data.readyForWork}</span>
                                    </Typography>
                                </Col>
                                <Col xs={12} md={6} className="mb-3">
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Work Preference:</span>
                                        <span> {selectedApplicant.data.workPreference}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Referral:</span>
                                        <span> {selectedApplicant.data.referral}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Interview Stage:</span>
                                        <span> {selectedApplicant.data.interviewStage}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">Status:</span>
                                        <span> {selectedApplicant.data.status}</span>
                                    </Typography>
                                    <Typography className="mt-2">
                                        <span className="font-extrabold text-base text-black">About Us:</span>
                                        <span> {selectedApplicant.data.aboutUs}</span>
                                    </Typography>
                                </Col>
                                <Typography className="mt-2">
                                    <span className="font-extrabold text-base text-black">Portfolio URL: </span>
                                    <a href={selectedApplicant.data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                        {selectedApplicant.data.url}
                                    </a>
                                </Typography>


                            </Row>
                        </div>
                    </>
                )}
            </Modal.Body>

        </Modal >
    );
};

export default ViewModal;

