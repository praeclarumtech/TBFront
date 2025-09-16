import { Col, Modal, Row } from "antd";
import { addRole, getRole, updateRole } from "api/roleApi";
import BaseButton from "components/BaseComponents/BaseButton";
import BaseInput from "components/BaseComponents/BaseInput";
import { BaseSelect } from "components/BaseComponents/BaseSelect";
import appConstants from "constants/constant";
import {
  SelectedOption,
  SelectedOptionRole1,
} from "interfaces/applicant.interface";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { capitalizeWords, InputPlaceHolder } from "utils/commonFunctions";

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
  const [rolesOptions, setrolesOptions] = useState<SelectedOptionRole1[]>([]);

  console.log("first", _id);

  const fetchRoles = async () => {
    setLoader(true);
    try {
      const res = await getRole();
      const options = res?.data.map((item: any) => ({
        label: capitalizeWords(item.name),
        value: item.name,
        id: item._id,
      }));
      setrolesOptions(options);
    } catch (error) {
      console.error("Error fetching roles", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Suppose you have the roleName or value you want to find:
  useEffect(() => {
    if (_id) {
      // Editing existing role: fetch its details
      const existingRole = rolesOptions.find((item) => item.id === _id);
      if (existingRole) {
        setRoleName(existingRole.value);
        setFilterActiveStatus({
          value: "true",
          label: "Active",
        });
      }
    } else {
      setRoleName("");
      setFilterActiveStatus({
        value: "true",
        label: "Active",
      });
    }
  }, [_id, rolesOptions]);

  const validateRoleName = (value: string): string => {
    if (!value.trim()) {
      return "Role name is required";
    }
    if (value.trim().length < 2) {
      return "Role name must be at least 2 characters";
    }
    if (value.trim().length > 35) {
      return "Role name must be less than 35 characters";
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
      const res = _id
        ? await updateRole(_id, {
            name: roleName,
            status: filterActiveStatus.value.toLocaleLowerCase(),
          })
        : await addRole(roleName, filterActiveStatus.value.toLocaleLowerCase());
      if (res.success === true) {
        toast.success(
          _id ? "Role updated successfully" : "Role added successfully"
        );
        handleCancel(); // Close modal and reset form
        window.location.reload();
      } else {
        toast.error(res.message);
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.response.data.error || error.response.statusText);
      handleCancel();
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
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      title={<span className="text-lg font-bold">{modalTitle}</span>}
    >
      <Row gutter={[16, 16]} className="mt-2">
        <Col xs={24} md={12}>
          <BaseInput
            label="Role Name"
            name="addRoles"
            className=" w-full bg-gray-100"
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
        <Col xs={24} md={12}>
          <BaseSelect
            label="Status"
            name="Status"
            className="mb-1 select-border w-full bg-gray-100"
            options={activeStatusOptions}
            placeholder="Status"
            handleChange={(selectedOption: SelectedOption) =>
              setFilterActiveStatus(selectedOption)
            }
            value={filterActiveStatus}
          />
        </Col>
      </Row>

      <Row>
        <div className="d-flex justify-content-end mt-4 gap-2 w-100">
          <BaseButton onClick={handleCancel} color="secondary">
            Cancel
          </BaseButton>
          <BaseButton
            onClick={handleSubmit}
            disabled={loader}
            loader={loader}
            color="primary"
          >
            {modalTitle}
          </BaseButton>
        </div>
      </Row>
    </Modal>
  );
}

export default AddRole;
