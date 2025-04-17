
import { Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
// import custom hook
import { useMounted } from "hooks/useMounted";
import { forgotPassword } from "api/usersApi";
import { toast } from "react-toastify";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { useFormik } from "formik";
import { useState } from "react";
import { useLocation } from "react-router";
import appConstants from "constants/constant";
import { errorHandle, InputPlaceHolder } from "utils/commonFunctions";

const {
  projectTitle,
  Modules,
  SUCCESS,
  passwordRegex,
  validationMessages,
  ACCEPTED,
} = appConstants;

const UpdatePassword = () => {
  document.title = Modules.UpdatePassword + " | " + projectTitle;
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state;

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required(validationMessages.required("Password"))
        .min(8, validationMessages.passwordLength("Password", 8))
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity("Password")
        ),
      confirmPassword: Yup.string()
        .required(validationMessages.required("Confirm Password"))
        .oneOf(
          [Yup.ref("newPassword")],
          "Password and confirm password should be same."
        ),
    }),
    onSubmit: (values) => {
      const payload = {
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        email,
      };
      forgotPassword(payload)
        .then((res) => {
          if (res?.statusCode === ACCEPTED && res?.success === SUCCESS) {
            navigate("/");
            toast.success(res?.message);
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          errorHandle(error);
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

                <h4 className="justify-center text-3xl font-bold text-center text-dark ">
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
                    label={"New Password"}
                    name="newPassword"
                    type="password"
                    placeholder={InputPlaceHolder("new password")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.newPassword}
                    touched={validation.touched.newPassword}
                    error={validation.errors.newPassword}
                    passwordToggle={true}
                    onclick={() => setPasswordShow(!passwordShow)}
                    isRequired={true}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="email">
                  <BaseInput
                    label={"Confirm Passeord"}
                    name="confirmPassword"
                    type={confirmPassword ? "text" : "password"}
                    placeholder={InputPlaceHolder("confirm passeord")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.confirmPassword}
                    touched={validation.touched.confirmPassword}
                    error={validation.errors.confirmPassword}
                    passwordToggle={true}
                    onclick={() => {
                      setConfirmPassword(!confirmPassword);
                    }}
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
                <span>
                  Don&apos;t have an account?{" "}
                  <a
                    onClick={() => navigate("/")}
                    className="cursor-pointer text-primary"
                  >
                    Sign In
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

export default UpdatePassword;
