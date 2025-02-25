import { Row, Col, Card, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useMounted } from "hooks/useMounted";
import { useNavigate } from "react-router-dom";
import {
  emailRegex,
  InputPlaceHolder,
  projectTitle,
  validationMessages,
} from "components/constants/common";
import { Modules, OK, setItem, SUCCESS } from "components/constants/enum";
import { useFormik } from "formik";
import { useState } from "react";
import { login } from "api/usersApi";
import { toast } from "react-toastify";
import { errorHandle } from "components/helpers/service";
import { jwtDecode } from "jwt-decode";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import appConstants from "constants/constant";
const { ACCESS_TOKEN } = appConstants;

const SignIn = () => {
  document.title = Modules.Login + " | " + projectTitle;

  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required(validationMessages.required("Email"))
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email")),
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
            setItem("authUser", res?.data?.token);

            const decode = jwtDecode<any>(res?.data);
            const role = decode.role;
            const id = decode.id;
            localStorage.setItem(ACCESS_TOKEN, res?.data);
            setItem("role", role);
            setItem("id", id);
            navigate("/dashboard");
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
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <h4 className="text-dark font-bold text-3xl justify-center text-center ">
                Talent<span className="text-primary bold ">Box</span>{" "}
              </h4>
              <p className="mb-6 justify-center text-center ">
                Please enter your user information.
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
                    label="Email"
                    name="email"
                    type="text"
                    placeholder={InputPlaceHolder("Email")}
                    handleChange={validation.handleChange}
                    handleBlur={validation.handleBlur}
                    value={validation.values.email}
                    touched={validation.touched.email}
                    error={validation.errors.email}
                    passwordToggle={false}
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
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <a
                        href="#"
                        className="fs-5"
                        onClick={() => navigate("/sign-up")}
                      >
                        Create An Account{" "}
                      </a>
                    </div>
                    <div>
                      <a
                        href="#"
                        className="text-inherit fs-5"
                        onClick={() => navigate("/forget-password")}
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
  );
};

export default SignIn;
