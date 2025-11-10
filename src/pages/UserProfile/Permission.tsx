import {
  ArrowLeftOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { assignRole } from "api/roleApi";
import BaseButton from "components/BaseComponents/BaseButton";
import appConstants from "constants/constant";
import { navItems } from "constants/navigationConstants";
import React, { useCallback, useState } from "react";
import { Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { capitalizeWords, getCurrentUserRole } from "utils/commonFunctions";

const { projectTitle, Modules } = appConstants;
const Permission: React.FC = () => {
  document.title = Modules.Permission + " | " + projectTitle;
  const currentRole = getCurrentUserRole();
  const location = useLocation();
  const { _id, roleName, accessModules } = location.state || {};
  console.log("accessModules", accessModules);
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>(accessModules || []);
  const [expandedModule, setExpandedModule] = useState<string>("");
  const [loader, setLoader] = useState(false);

  // Check if a permission should be disabled based on role
  const isPermissionDisabled = useCallback(
    (permissionKey: string) => {
      const normalizedRole = roleName?.toLowerCase();

      if (normalizedRole === "vendor" && permissionKey === "vendor_list") {
        return true;
      }

      if (normalizedRole === "client" && permissionKey === "client_list") {
        return true;
      }

      return false;
    },
    [roleName]
  );

  const isModuleHidden = useCallback(
    (moduleAccessorKey: string) => {
      const normalizedRole = roleName?.toLowerCase();

      if (normalizedRole === "vendor" && moduleAccessorKey === "client") {
        return true;
      }

      if (normalizedRole === "client" && moduleAccessorKey === "vendors") {
        return true;
      }

      return false;
    },
    [roleName]
  );

  const resetSelection = () => {
    setSelected([]);
  };

  const saveInformation = () => {
    assignRoles();
  };

  const handleCheck = useCallback(
    (isChecked: boolean, moduleName: string) => {
      const module = navItems.find((item) => item.accessorKey === moduleName);
      if (!module?.subItems) return;

      const enabledModules = module.subItems
        .filter((subItem) => !isPermissionDisabled(subItem.accessorKey))
        .map((subItem) => subItem.accessorKey);

      setSelected((prev) => {
        if (isChecked) {
          return Array.from(new Set([...prev, ...enabledModules]));
        } else {
          return prev.filter((item) => !enabledModules.includes(item));
        }
      });
    },
    [isPermissionDisabled]
  );

  const handleSubMenuCheck = useCallback((moduleName: string) => {
    setSelected((prev) => {
      if (prev.includes(moduleName)) {
        return prev.filter((module) => module !== moduleName);
      } else {
        return [...prev, moduleName];
      }
    });
  }, []);

  const handleExpand = useCallback(
    (moduleName: string) => {
      if (expandedModule === moduleName) {
        setExpandedModule("");
      } else {
        setExpandedModule(moduleName);
      }
    },
    [expandedModule]
  );

  const isParentModuleChecked = useCallback(
    (moduleName: string) => {
      const module = navItems.find((item) => item.accessorKey === moduleName);
      if (!module?.subItems) return false;

      // Only check enabled sub-items (not disabled and not from hidden modules)
      const enabledSubItems = module.subItems.filter(
        (subItem) => !isPermissionDisabled(subItem.accessorKey)
      );

      return (
        enabledSubItems.length > 0 &&
        enabledSubItems.every((subItem) =>
          selected.includes(subItem.accessorKey)
        )
      );
    },
    [selected, isPermissionDisabled]
  );

  const getPermissionCount = useCallback(
    (moduleName: string) => {
      const module = navItems.find((item) => item.accessorKey === moduleName);
      if (!module?.subItems) return 0;

      // Only count enabled sub-items (not disabled and not from hidden modules)
      const enabledSubItems = module.subItems.filter(
        (subItem) => !isPermissionDisabled(subItem.accessorKey)
      );

      return enabledSubItems.filter((subItem) =>
        selected.includes(subItem.accessorKey)
      ).length;
    },
    [selected, isPermissionDisabled]
  );

  const assignRoles = async () => {
    try {
      setLoader(true);
      const response = await assignRole({ _id, accessModules: selected });
      if (response?.success) {
        toast.success("Permission Given Successfully");
        if (currentRole === roleName) {
          localStorage.setItem("accessModules", JSON.stringify(selected));
        }
        resetSelection();
        navigate(-1);
        setTimeout(() => {
          window.location.reload();
        }, 50);
      }
    } catch (error: any) {
      console.log("error", error);
      toast.error(error.response.data.error || error.response.statusText);
    } finally {
      setLoader(false);
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
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4">
            Assign permission to {capitalizeWords(roleName)}
          </h2>

          <div className="grid grid-cols-1 gap-4 mt-8">
            {navItems
              .filter(
                (item) =>
                  item.accessorKey !== "dashboard" &&
                  !isModuleHidden(item.accessorKey)
              )
              .map((moduleName) => (
                <div key={moduleName.name}>
                  <div
                    className={`flex items-center gap-3 p-4 rounded shadow-sm cursor-pointer transition-all duration-200 ${
                      expandedModule === moduleName.accessorKey
                        ? "bg-[#624bff] rounded-b-none"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      if (moduleName.subItems) {
                        handleExpand(moduleName.accessorKey);
                      }
                    }}
                  >
                    <div className="w-full flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          isParentModuleChecked(moduleName.accessorKey) ||
                          selected.includes(moduleName.accessorKey)
                        }
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (moduleName.subItems) {
                            handleCheck(
                              e.target.checked,
                              moduleName.accessorKey
                            );
                          } else {
                            if (selected.includes(moduleName.accessorKey)) {
                              setSelected((prev) =>
                                prev.filter(
                                  (item) => item !== moduleName.accessorKey
                                )
                              );
                            } else {
                              setSelected((prev) =>
                                Array.from(
                                  new Set([...prev, moduleName.accessorKey])
                                )
                              );
                            }
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <span
                        className={
                          expandedModule === moduleName.accessorKey
                            ? "text-white"
                            : "text-gray-800"
                        }
                      >
                        {moduleName.name}
                      </span>
                      <div className="ml-auto flex gap-2">
                        {getPermissionCount(moduleName.accessorKey) !== 0 &&
                          getPermissionCount(moduleName.accessorKey) !==
                            moduleName.subItems?.length && (
                            <span
                              className={`text-sm ${
                                expandedModule === moduleName.accessorKey
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {getPermissionCount(moduleName.accessorKey)}{" "}
                              Permissions
                            </span>
                          )}
                        {moduleName.subItems && (
                          <span>
                            {expandedModule !== moduleName.accessorKey ? (
                              <RightOutlined className="text-gray-500" />
                            ) : (
                              <DownOutlined className="text-white" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {expandedModule === moduleName.accessorKey && (
                    <div className="grid grid-cols-2 gap-4 p-4 border rounded-b-sm border-t-0 border-gray-200">
                      {moduleName.subItems?.map((subItem) => {
                        const isDisabled = isPermissionDisabled(
                          subItem.accessorKey
                        );
                        return (
                          <div
                            key={subItem.accessorKey}
                            className={`rounded-md p-3 border border-gray-200 ${
                              isDisabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : selected.includes(subItem.accessorKey)
                                ? "bg-[#624bff] text-white cursor-pointer"
                                : "cursor-pointer hover:bg-gray-50"
                            }`}
                            onClick={() => {
                              if (!isDisabled) {
                                handleSubMenuCheck(subItem.accessorKey);
                              }
                            }}
                            title={
                              isDisabled
                                ? `Not available for ${roleName} role`
                                : ""
                            }
                          >
                            <div className="flex items-center justify-between">
                              <span>{subItem.name}</span>
                              {isDisabled && (
                                <span className="text-xs text-gray-400 ml-2">
                                  (Restricted)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="justify-end gap-2 d-flex mt-8">
            <BaseButton color="secondary" onClick={resetSelection}>
              Cancel
            </BaseButton>
            <BaseButton
              color="primary"
              onClick={saveInformation}
              loader={loader}
            >
              Assign
            </BaseButton>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Permission;
