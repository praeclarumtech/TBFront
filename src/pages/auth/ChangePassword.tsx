
import { Row, Col, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Container } from "react-bootstrap";
import { useMounted } from "hooks/useMounted";
import { changePassword } from "api/usersApi";
import { toast } from "react-toastify";
import BaseInput from "components/BaseComponents/BaseInput";
import BaseButton from "components/BaseComponents/BaseButton";
import { useFormik } from "formik";
import { useState } from "react";

import appConstants from "constants/constant";
import { errorHandle, InputPlaceHolder } from "utils/commonFunctions";

const {
  projectTitle,
  Modules,
  SUCCESS,
  passwordRegex,
  validationMessages,
} = appConstants;

const UpdatePassword = () => {
  document.title = Modules.UpdatePassword + " | " + projectTitle;
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const id = sessionStorage.getItem("id");

  const [passwordShow, setPasswordShow] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      id: id,
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required(
        validationMessages.required("Old Password")
      ),
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
          "Password and confirm password should be the same."
        ),
    }),

    onSubmit: (values) => {
      const payload = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      };
     if (id === null) {
       toast.error("Invalid user ID");
       return;
     }
      setLoader(true);
    
      changePassword(id, payload)
        .then((res) => {
          if (res?.statusCode === 200 && res?.success === SUCCESS) {
            navigate("/change-password");
            toast.success(res?.message);
          }
          else {
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
  
    <Container fluid className="p-4">
      <Row className="my-8 align-items-center justify-content-center">
        <Col xl={6} lg={6} md={6} xs={6}>
          <Card>
            <Card.Body className="p-6 m-5">
              <div className="mb-4 ">
                <Link to="/dashboard">
                  {/* <Image
                  src="/images/brand/logo/logo-primary.svg"
                  className="mb-2"
                  alt=""
                /> */}

                  <h4 className="justify-center text-3xl font-bold text-center text-dark ">
                    Talent<span className="text-primary bold ">Box</span>{" "}
                  </h4>
                </Link>
                <p className="mb-6 text-center justify-center items-center">
                  Update Your Password using the old Password
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
                      label={"Old Password"}
                      name="oldPassword"
                      type="password"
                      placeholder={InputPlaceHolder("Old password")}
                      handleChange={validation.handleChange}
                      handleBlur={validation.handleBlur}
                      value={validation.values.oldPassword}
                      touched={validation.touched.oldPassword}
                      error={validation.errors.oldPassword}
                      passwordToggle={true}
                      onclick={() => setPasswordShow(!passwordShow)}
                    />
                  </Form.Group>
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
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <BaseInput
                      label={"Confirm Passeord"}
                      name="confirmPassword"
                      type="password"
                      // type={confirmPassword ? "text" : "password"}
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
                    />
                  </Form.Group>

                  <div className="mb-3 d-grid">
                    <BaseButton
                      color="primary"
                      disabled={loader}
                      className="w-100 mb-3"
                      type="submit"
                      loader={loader}
                    >
                      Update Password{" "}
                    </BaseButton>

                    {/* <span> */}
                    <BaseButton
                      color="danger"
                      onClick={() => navigate("/dashboard")}
                      className=" w-100 cursor-pointer  text-center justify-center   text-white "
                    >
                      Back
                    </BaseButton>
                  </div>
                  {/* </span> */}
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePassword;
