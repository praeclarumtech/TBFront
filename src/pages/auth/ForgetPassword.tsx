/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useMounted } from "hooks/useMounted";
import { sendOtp } from "api/usersApi";
import { toast } from "react-toastify";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { useFormik } from "formik";
import { useState } from "react";
import appConstants from "constants/constant";
import { errorHandle, InputPlaceHolder } from "utils/commonFunctions";


const {
  projectTitle,
  CREATED,
  Modules,
  SUCCESS,
  emailRegex,
  validationMessages,
} = appConstants;

const ForgetPassword = () => {
  document.title = Modules.Forgot + " | " + projectTitle;
  const hasMounted = useMounted();

  const navigate = useNavigate();
  const [loader, setLoader] = useState<boolean>(false);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email"))
        .required(validationMessages.required("Email")),
    }),
    onSubmit: (values: any) => {
      const email = values?.email;
      setLoader(true);
      sendOtp(values)
        .then((res) => {
          if (res?.statusCode === CREATED && res?.success === SUCCESS) {
            navigate("/email-verify", { state: { email } });
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
          setLoader(false);
        })
        .finally(() => setLoader(false));
    },
  });

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link to="/">
                {/* <Image
                  src="/images/brand/logo/logo-primary.svg"
                  className="mb-2"
                  alt=""
                /> */}

                <h4 className="text-dark font-bold text-3xl justify-center text-center ">
                  Talent<span className="text-primary bold ">Box</span>{" "}
                </h4>
              </Link>
              <p className="mb-6">
                Don&apos;t worry, we&apos;ll send you an email to reset your
                password.
              </p>
            </div>
            {hasMounted && (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Form.Group className="mb-3" controlId="email">
                  <BaseInput
                    label="Email"
                    name="email"
                    type="text"
                    placeholder={InputPlaceHolder("email")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.email}
                    touched={validation.touched.email}
                    error={validation.errors.email}
                    passwordToggle={false}
                    isRequired={true}
                  />
                </Form.Group>

                <div className="mb-3 d-grid">
                  <BaseButton
                    color="primary"
                    disabled={loader}
                    className="w-100"
                    type="submit"
                    loader={loader}
                  >
                    Reset Password{" "}
                  </BaseButton>
                </div>
                <span className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <a
                    onClick={() => navigate("/sign-up")}
                    className="text-primary cursor-pointer"
                  >
                    Sign Up
                  </a>
                </span>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgetPassword;
