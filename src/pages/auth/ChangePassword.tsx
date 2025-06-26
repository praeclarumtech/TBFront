import { Row, Col, Form } from "react-bootstrap";
import * as Yup from "yup";
import { useMounted } from "hooks/useMounted";
import { changePassword } from "api/usersApi";
import { toast } from "react-toastify";
import BaseInput from "components/BaseComponents/BaseInput";
import { useFormik } from "formik";
import { SetStateAction, Dispatch, useState, useEffect } from "react";
import appConstants from "constants/constant";
import {
  errorHandle,
  getCurrentUser,
  InputPlaceHolder,
} from "utils/commonFunctions";
import BaseModal from "components/BaseComponents/BaseModal";
import Loader from "components/BaseComponents/Loader";

const {
  projectTitle,
  SUCCESS,
  passwordRegex,
  validationMessages,
  OK,
  Modules,
} = appConstants;

interface ChangePasswordProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

const ChangePassword = ({ showModal, setShowModal }: ChangePasswordProps) => {
  useEffect(() => {
    if (showModal) {
      document.title = Modules.ChangePassword + " | " + projectTitle;
    }
    return () => {
      if (showModal) {
        document.title = projectTitle;
      }
    };
  }, [showModal]);
  const hasMounted = useMounted();
  const [loader, setLoader] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const user = getCurrentUser();
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required(
        validationMessages.required("Old Password")
      ),
      newPassword: Yup.string()
        .required(validationMessages.required("New Password"))
        .min(8, validationMessages.passwordLength("New Password", 8))
        .matches(
          passwordRegex,
          validationMessages.passwordComplexity("New Password")
        ),
      confirmPassword: Yup.string()
        .required(validationMessages.required("Confirm Password"))
        .oneOf(
          [Yup.ref("newPassword")],
          "Password and confirm password should be same."
        ),
    }),
    onSubmit: (values) => {
      setLoader(true);
      if (!user || typeof user !== "object" || !("id" in user)) {
        toast.error("Invalid user data");
        setLoader(false);
        return;
      }

      if (!user || typeof user !== "object" || !("id" in user)) {
        toast.error("Invalid user data");
        setLoader(false);
        return;
      }

      if (typeof user.id !== "string") {
        toast.error("Invalid user ID format");
        setLoader(false);
        return;
      }

      changePassword(user.id, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      })
        .then((res) => {
          if (res?.statusCode === OK && res?.success === SUCCESS) {
            toast.success(res?.message);
            setShowModal(false);
            validation.resetForm();
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
  if (loader) {
    return <Loader />;
  }

  return (
    <BaseModal
      show={showModal}
      onCloseClick={() => setShowModal(false)}
      setShowBaseModal={setShowModal}
      onSubmitClick={validation.handleSubmit}
      submitButtonText="Change Password"
      closeButtonText="Close"
      modalTitle="Change Password"
      loader={loader}
    >
      <Row className="align-items-center justify-content-center g-0">
        <Col lg={12} md={8} xs={12} className="py-8 py-xl-0">
          {hasMounted && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
            >
              <Form.Group className="mb-3" controlId="oldPassword">
                <BaseInput
                  label="Current Password"
                  name="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  placeholder={InputPlaceHolder("current password")}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.oldPassword}
                  touched={validation.touched.oldPassword}
                  error={validation.errors.oldPassword}
                  passwordToggle={true}
                  onclick={() => setShowOldPassword(!showOldPassword)}
                  isRequired={true}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="newPassword">
                <BaseInput
                  label="New Password"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder={InputPlaceHolder("new password")}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.newPassword}
                  touched={validation.touched.newPassword}
                  error={validation.errors.newPassword}
                  passwordToggle={true}
                  onclick={() => setShowNewPassword(!showNewPassword)}
                  isRequired={true}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="confirmPassword">
                <BaseInput
                  label="Confirm New Password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={InputPlaceHolder("confirm new password")}
                  handleChange={validation.handleChange}
                  handleBlur={validation.handleBlur}
                  value={validation.values.confirmPassword}
                  touched={validation.touched.confirmPassword}
                  error={validation.errors.confirmPassword}
                  passwordToggle={true}
                  onclick={() => setShowConfirmPassword(!showConfirmPassword)}
                  isRequired={true}
                />
              </Form.Group>
            </Form>
          )}
        </Col>
      </Row>
    </BaseModal>
  );
};

export default ChangePassword;
