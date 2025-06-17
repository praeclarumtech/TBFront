import { Row, Col, Card, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useMounted } from "hooks/useMounted";
import { useState } from "react";
import { register } from "api/usersApi";
import { toast } from "react-toastify";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import { SelectedOption } from "interfaces/applicant.interface";
import appConstants from "constants/constant";
import {
  dynamicFind,
  InputPlaceHolder,
  RequiredField,
} from "utils/commonFunctions";

const {
  projectTitle,
  Modules,
  ButtonEnums,
  CREATED,
  SUCCESS,
  emailRegex,
  passwordRegex,
  validationMessages,
} = appConstants;

const SignUp = () => {
  document.title = Modules.Register + " | " + projectTitle;
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);

  const roleType = [
    { label: "HR", value: "hr" },
    { label: "Admin", value: "admin" },
  ];

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: Yup.object({
      userName: Yup.string().required(RequiredField("Username")),
      email: Yup.string()
        .required(validationMessages.required("Email"))
        .email(validationMessages.format("Email"))
        .matches(emailRegex, validationMessages.format("Email")),
      password: Yup.string()
        .required(validationMessages.required("Password"))
        .min(8, validationMessages.passwordLength("Password", 8))
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity("Password")
        ),
      confirmPassword: Yup.string()
        .required(validationMessages.required("Confirm Password"))
        .oneOf(
          [Yup.ref("password")],
          "Password and confirm password should be same."
        ),
      role: Yup.string().required(RequiredField("Role")),
    }),
    onSubmit: (values, { resetForm }) => {
      setLoader(true);
      const payload = {
        userName: values.userName,
        email: values.email,
        role: values.role,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      register(payload)
        .then((res) => {
          if (res?.statusCode === CREATED && res?.success === SUCCESS) {
            toast.success(res?.message);
            resetForm();
            resetData();
            navigate("/");
          } else {
            toast.error(res?.message);
          }
        })
        .catch((error) => {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error(error?.message);
          }
        })
        .finally(() => {
          setLoader(false);
        });
    },
  });

  const resetData = () => {
    validation.initialValues.userName = "";
    validation.initialValues.email = "";
    validation.initialValues.password = "";
    validation.initialValues.confirmPassword = "";
    validation.setFieldValue("role", null);
  };

  return (
    <>
      <Row className="align-items-center justify-content-center g-0 min-vh-100">
        <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
          <Card className="smooth-shadow-md">
            <Card.Body className="p-6">
              <div className="mb-4">
                {/* <Link to="/"> */}
                <h4 className="justify-center text-3xl font-bold text-center text-dark ">
                  Talent<span className="text-primary bold ">Box</span>{" "}
                </h4>
                {/* </Link> */}
                <p className="justify-center mb-6 text-center text-base ">
                  Create an Account
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
                      label="Username"
                      name="userName"
                      type="text"
                      placeholder={InputPlaceHolder("Username")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.userName}
                      touched={validation.touched.userName}
                      error={validation.errors.userName}
                      passwordToggle={false}
                      isRequired={true}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
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
                      isRequired={true}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <BaseSelect
                      label="Role"
                      name="role"
                      className="select-border"
                      options={roleType}
                      placeholder={InputPlaceHolder("Role")}
                      handleChange={(selectedOption: SelectedOption) => {
                        validation.setFieldValue(
                          "role",
                          selectedOption?.value || ""
                        );
                      }}
                      handleBlur={validation.handleBlur}
                      value={
                        dynamicFind(roleType, validation.values.role) || ""
                      }
                      touched={validation.touched.role}
                      error={validation.errors.role}
                      isRequired={true}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <BaseInput
                      label="Password"
                      name="password"
                      type="password"
                      placeholder={InputPlaceHolder("Password")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.password}
                      touched={validation.touched.password}
                      error={validation.errors.password}
                      passwordToggle={true}
                      onclick={() => setPasswordShow(!passwordShow)}
                      disabled={false}
                      isRequired={true}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="confirm-password">
                    <BaseInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type={confirmPassword ? "text" : "password"}
                      placeholder={InputPlaceHolder("Confirm password")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.confirmPassword}
                      touched={validation.touched.confirmPassword}
                      error={validation.errors.confirmPassword}
                      passwordToggle={true}
                      onclick={() => {
                        setConfirmPassword(!confirmPassword);
                      }}
                      disabled={false}
                      isRequired={true}
                    />
                  </Form.Group>

                  {/* <div className="mb-3">
                    <Form.Check type="checkbox" id="check-api-checkbox">
                      <Form.Check.Input type="checkbox" />
                      <Form.Check.Label>
                        I agree to the <Link to="#"> Terms of Service </Link>{" "}
                        and <Link to="#"> Privacy Policy.</Link>
                      </Form.Check.Label>
                    </Form.Check>
                  </div> */}

                  <div>
                    <div className="d-grid">
                      <BaseButton
                        color="primary"
                        disabled={loader}
                        className="w-100"
                        type="submit"
                        loader={loader}
                      >
                        {ButtonEnums.Submit}
                      </BaseButton>
                    </div>
                    <div className="mt-4 d-md-flex justify-content-between">
                      <div className="mb-2 mb-md-0">
                        <div onClick={() => navigate("/")} className="fs-5">
                          {/* Already member? <a className="cursor-pointer text-primary">Login</a>{" "} */}
                          Already have an account?{" "}
                          <a className="cursor-pointer text-primary">Login</a>{" "}
                        </div>
                      </div>
                      <div>
                        <div
                          onClick={() => navigate("/forgot-password")}
                          className=" fs-5"
                        >
                          <a className="cursor-pointer text-primary">
                            Forgot your password?
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SignUp;
