import { Col, Modal, Row } from "antd";
import { addRole } from "api/roleApi";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import appConstants from "constants/constant";
import { SelectedOption } from "interfaces/applicant.interface";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InputPlaceHolder } from "utils/commonFunctions";

const { activeStatusOptions } = appConstants;
function AddRole({ show, onHide, _id }: any) {
  const modalTitle = _id ? "Update Role" : "Add Role";
  const [loader, setLoader] = useState(false);
  const [roleName, setRoleName] = useState<string>("");
  const [roleNameTouched, setRoleNameTouched] = useState<boolean>(false);
  const [roleNameError, setRoleNameError] = useState<string>("");
  const [filterActiveStatus, setFilterActiveStatus] =
    useState<SelectedOption | null>({
      value: "true",
      label: "Active", // or whatever label you want to display
    });

  const validateRoleName = (value: string): string => {
    if (!value.trim()) {
      return "Role name is required";
    }
    if (value.trim().length < 2) {
      return "Role name must be at least 2 characters";
    }
    if (value.trim().length > 50) {
      return "Role name must be less than 50 characters";
    }
    return "";
  };

  const handleCancel = () => {
    setRoleName("");
    setRoleNameTouched(false);
    setRoleNameError("");
    setFilterActiveStatus({
      value: "true",
      label: "Active",
    });
    setLoader(false);
    onHide();
  };

  useEffect(() => {
    if (!show) {
      handleCancel();
    }
  }, [show]);
  const handleSubmit = async () => {
    // Validate role name before submission
    const nameError = validateRoleName(roleName);
    setRoleNameError(nameError);
    setRoleNameTouched(true);

    // Check for validation errors
    if (nameError) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!filterActiveStatus) {
      toast.error("Please select a status");
      return;
    }

    setLoader(true);

    try {
      const res = await addRole(
        roleName,
        filterActiveStatus.label.toLocaleLowerCase()
      );
      if (res) {
        toast.success(
          _id ? "Role updated successfully" : "Role added successfully"
        );
        handleCancel(); // Close modal and reset form
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const handleRoleNameChange = (e: any) => {
    const value = e.target.value;
    setRoleName(value);

    // Clear error when user starts typing
    if (roleNameTouched && roleNameError) {
      const error = validateRoleName(value);
      setRoleNameError(error);
    }
  };
  const handleRoleNameBlur = () => {
    setRoleNameTouched(true);
    const error = validateRoleName(roleName);
    setRoleNameError(error);
  };

  return (
    <Modal
      open={show}
      onCancel={onHide}
      footer={null}
      width={600}
      centered
      title={<span className="text-lg font-bold">{modalTitle}</span>}
    >
      <Row>
        <Col xs={9} md={5} lg={9}>
          <BaseInput
            label="Role Name"
            name="addRoles"
            className="bg-gray-100"
            type="text"
            placeholder={InputPlaceHolder("Role to be Added")}
            handleChange={handleRoleNameChange}
            handleBlur={handleRoleNameBlur}
            value={roleName}
            touched={roleNameTouched}
            error={roleNameError}
            passwordToggle={false}
          />
        </Col>
        <Col xs={9} md={5} lg={9}>
          <BaseSelect
            label="Status"
            name="Status"
            className="mb-1 select-border"
            options={activeStatusOptions}
            placeholder="Status"
            handleChange={(selectedOption: SelectedOption) =>
              setFilterActiveStatus(selectedOption)
            }
            value={filterActiveStatus}
          />
        </Col>
        <BaseButton onClick={handleCancel}>Cancel</BaseButton>
        <BaseButton onClick={handleSubmit}>{modalTitle}</BaseButton>
      </Row>
    </Modal>
  );
}

export default AddRole;
