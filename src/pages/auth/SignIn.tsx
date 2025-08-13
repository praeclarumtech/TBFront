/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col, Card, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useMounted } from "hooks/useMounted";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useState } from "react";
import { login } from "api/usersApi";
import { toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import appConstants from "constants/constant";
import {
  errorHandle,
  InputPlaceHolder,
  setAuthData,
  // setItem
} from "utils/commonFunctions";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";
import Logo from "components/BaseComponents/Logo";

const { projectTitle, Modules, validationMessages, OK, SUCCESS } = appConstants;

const SignIn = () => {
  document.title = Modules.Login + " | " + projectTitle;
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const from = location?.state?.from || "/";

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(validationMessages.required("Email or Username"))
        .test(
          "is-email-or-username",
          "Must be a valid email or username",
          (value) => {
            if (!value) return false;
            const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            const isUsername = /^[a-zA-Z0-9_.-]+$/.test(value);
            return isEmail || isUsername;
          }
        ),

      password: Yup.string().required(validationMessages.required("Password")),
    }),
    onSubmit: (value) => {
      const payload = {
        email: String(value.email),
        password: value.password,
      };

      setLoader(true);
      login(payload)
        .then((res) => {
          if (res?.statusCode === OK && res?.success === SUCCESS) {
            setAuthData(res.data);

            const decoded: any = jwtDecode(res.data);
            const role = decoded.role;

            if (role === "guest") {
              navigate(from, { replace: true });
            } else {
              navigate("/dashboard");
            }
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

  const hasMounted = useMounted();
  return (
    <div>
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          <Card className="smooth-shadow-md">
            <Card.Body className="p-6">
              <div className="flex flex-col items-center">
                <Logo />
                <p className="justify-center mb-6 text-base text-center mt-2">
                  Sign in using your Credentials
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
                  <Form.Group className="mb-3" controlId="username">
                    <BaseInput
                      label="Email or username"
                      name="email"
                      type="text"
                      placeholder={InputPlaceHolder("Email or username")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.email}
                      touched={validation.touched.email}
                      error={validation.errors.email}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <BaseInput
                      label={"Password"}
                      name="password"
                      type="password"
                      placeholder={InputPlaceHolder("Password")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.password}
                      touched={validation.touched.password}
                      error={validation.errors.password}
                      passwordToggle={true}
                      isRequired={true}
                    />
                  </Form.Group>
                  <div>
                    <div className="d-grid">
                      <BaseButton
                        color="primary"
                        disabled={loader}
                        className="w-100"
                        type="submit"
                        loader={loader}
                      >
                        Sign In
                      </BaseButton>
                    </div>
                    <div className="mt-4 d-md-flex justify-content-between">
                      <div className="mb-2 mb-md-0">
                        <a
                          href="#"
                          className="fs-5"
                          onClick={() => navigate("/sign-up")}
                        >
                          Create an Account{" "}
                        </a>
                      </div>
                      <div>
                        <a
                          href="#"
                          className="cursor-pointer text-primary fs-5"
                          onClick={() => navigate("/forgot-password")}
                        >
                          Forgot your password?
                        </a>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SignIn;
