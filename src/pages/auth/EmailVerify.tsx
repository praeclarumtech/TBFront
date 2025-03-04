/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, CardBody } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import BaseButton from "components/BaseComponents/BaseButton";
import { errorHandle } from "components/helpers/service";
import { OK, SUCCESS } from "components/constants/enum";
import { verifyOtp } from "api/usersApi";

const EmailVerification = () => {
  const history = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isDisabledInput, setIsDisabledInput] = useState<boolean>(true);
  const location = useLocation();
  const { email } = location.state;

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode =
        verificationCode.substring(0, index) +
        value +
        verificationCode.substring(index + 1);
      setVerificationCode(newCode);
      if (index !== 3) {
        document.getElementById(`digit${index + 2}-input`)?.focus();
      }
      setIsDisabledInput(newCode.length < 4);
    }
  };

  const verifyCode = () => {
    setLoader(true);
    const payload = { email, otp: String(verificationCode) };
    verifyOtp(payload)
      .then((res: any) => {
        if (res?.statusCode === OK && res?.success === SUCCESS) {
          history("/update-password", { state: { email } });
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      })
      .catch((error: any) => {
        toast.error("Verification failed. Try again.");
        errorHandle(error);
      })
      .finally(() => setLoader(false));
  };

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col md={6} lg={4}>
        <Card className="p-4 smooth-shadow-md">
          <CardBody>
            <h4 className="text-dark font-bold text-3xl justify-center text-center ">
              Talent<span className="text-primary bold ">Box</span>{" "}
            </h4>
            <p className="text-center">
              Please enter the 6-digit code sent to <b>{email}</b>
            </p>
            <Row className="justify-content-center">
              {[...Array(4)].map((_, index) => (
                <Col key={index} xs={2} className="p-1">
                  <input
                    type="text"
                    className="form-control text-center"
                    maxLength={1}
                    id={`digit${index + 1}-input`}
                    value={verificationCode[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                </Col>
              ))}
            </Row>
            <BaseButton
              color="primary"
              disabled={loader || isDisabledInput}
              className="w-100 mt-3"
              onClick={verifyCode}
              loader={loader}
            >
              Verify OTP
            </BaseButton>
            <p className="text-center mt-3">
              Didn’t receive a code? <a href="/forgot-password">Resend</a>
            </p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default EmailVerification;
