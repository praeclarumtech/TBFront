import { ArrowLeftOutlined } from "@ant-design/icons";
import { updateRole } from "api/roleApi";
import BaseButton from "components/BaseComponents/BaseButton";
import CheckBoxDropdown, {
  Module,
} from "components/BaseComponents/CheckBoxDropdown";
import appConstants from "constants/constant";
import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { capitalizeWords } from "utils/commonFunctions";

const modules: Module[] = [
  {
    id: "Applicants",
    label: "Applicants",
    permissions: [],
  },
  {
    id: "import Applicants",
    label: "import Applicants",
    permissions: [],
  },
  {
    id: "Vendor",
    label: "Vendor",
    permissions: [],
  },
  {
    id: "Client",
    label: "Client",
    permissions: [],
  },
  {
    id: "Email",
    label: "Email",
    permissions: [],
  },
  {
    id: "Reports",
    label: "Reports",
    permissions: [],
  },
  {
    id: "master",
    label: "Master",
    permissions: [
      { id: "Add Skill", label: "Add Skill" },
      { id: "Add City", label: "Add City" },
      { id: "Add State", label: "Add State" },
      { id: "Add Country", label: "Add Country" },
      { id: "Add Qualification", label: "Add Qualification" },
      { id: "Add Role and Skill", label: "Add Role and Skill" },
      { id: "Find and Replace", label: "Find and Replace" },
      { id: "Add Email Template", label: "Add Email Template" },
      { id: "Add Designation", label: "Add Designation" },
    ],
  },
];

const { projectTitle, Modules } = appConstants;
const Permission: React.FC = () => {
  document.title = Modules.Permission + " | " + projectTitle;

  const location = useLocation();
  const { _id, roleName, accessModules } = location.state || {};
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(accessModules || []);

  const resetSelection = () => {
    setSelected([]);
  };

  const saveInformation = () => {
    updateRoles();
  };

  const updateRoles = async () => {
    try {
      const response = await updateRole(
        { accessModules: selected }, // payload
        _id // role id
      );
      if (response?.success) {
        toast.success("Permission Given Successfully");
        localStorage.setItem("accessModules", JSON.stringify(selected));
        resetSelection();
        navigate(-1);
        setTimeout(() => {
          window.location.reload();
        }, 50);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      <div className="px-4 py-4">
        <button
          className="font-bold text-black hover:underline"
          onClick={() => navigate(-1)}
        >
          <ArrowLeftOutlined size={18} className="font-bold" /> Back
        </button>
      </div>
      <Card className="mb-4 mx-4 overflow-hidden">
        <div className="p-4 ">
          <h2 className="text-lg font-bold mb-4">
            Assign permission to {capitalizeWords(roleName)}
          </h2>
          <div className="justify-center d-flex max-h-[350px] overflow-y-auto rounded p-2">
            <CheckBoxDropdown
              modules={modules}
              value={selected}
              onChange={setSelected}
            />
          </div>
          <div className="justify-end gap-2 d-flex">
            <BaseButton color="secondary" onClick={resetSelection}>
              Cancel
            </BaseButton>
            <BaseButton color="primary" onClick={saveInformation}>
              Assign
            </BaseButton>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Permission;
