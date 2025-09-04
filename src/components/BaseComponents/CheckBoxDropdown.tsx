// import { UpOutlined, DownOutlined } from "@ant-design/icons";
// import React, { useState } from "react";

// export type Permission = {
//   id: string;
//   label: string;
// };

// export type Module = {
//   id: string;
//   label: string;
//   permissions: Permission[];
// };

// interface Props {
//   modules: Module[];
//   value?: string[];
//   onChange?: (selected: string[]) => void;
// }

// const CheckedBoxDropdown: React.FC<Props> = ({
//   modules,
//   value = [],
//   onChange,
// }) => {
//   const [openModule, setOpenModule] = useState<string | null>(null);

//   const togglePermission = (id: string) => {
//     const newSelected = value.includes(id)
//       ? value.filter((p) => p !== id)
//       : [...value, id];
//     onChange?.(newSelected);
//   };

//   const toggleModule = (module: Module) => {
//     if (module.permissions.length === 0) {
//       // no children → select the module itself
//       togglePermission(module.id);
//       return;
//     }

//     const allIds = module.permissions.map((p) => p.id); // ✅ scoped to this module only
//     const hasAll = allIds.every((id) => value.includes(id));

//     const newSelected = hasAll
//       ? value.filter((p) => !allIds.includes(p)) // unselect all of THIS module
//       : [...new Set([...value, ...allIds])]; // select all of THIS module

//     onChange?.(newSelected);
//   };

//   return (
//     <div className="flex flex-wrap gap-4 w-full">
//       {modules.map((module) => {
//         const allIds = module.permissions.map((p) => p.id);
//         const allSelected =
//           module.permissions.length > 0 &&
//           allIds.every((id) => value.includes(id));
//         const partiallySelected =
//           module.permissions.length > 0 &&
//           allIds.some((id) => value.includes(id)) &&
//           !allSelected;

//         const moduleSelected =
//           module.permissions.length === 0 && value.includes(module.id);

//         return (
//           <div
//             key={module.id}
//             className="border rounded-xl shadow-sm w-full md:w-1/2"
//           >
//             {/* Module button */}
//             <div
//               className={`flex items-center justify-between px-4 py-3 cursor-pointer font-medium rounded-xl transition
//                 ${
//                   allSelected || moduleSelected
//                     ? "bg-indigo-600 text-white"
//                     : partiallySelected
//                     ? "bg-indigo-100 text-indigo-700"
//                     : "bg-gray-100 text-gray-800 hover:bg-gray-200"
//                 }`}
//               onClick={() => toggleModule(module)}
//             >
//               <span>{module.label}</span>
//               {module.permissions.length > 0 && (
//                 <button
//                   type="button"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setOpenModule(openModule === module.id ? null : module.id);
//                   }}
//                   className="text-sm text-gray-600 hover:text-gray-900"
//                 >
//                   {openModule === module.id ? (
//                     <UpOutlined
//                       style={{
//                         color: allSelected
//                           ? "#ffffff"
//                           : partiallySelected
//                           ? "#4f46e5"
//                           : "#6b7280",
//                       }}
//                     />
//                   ) : (
//                     <DownOutlined
//                       style={{
//                         color: allSelected
//                           ? "#ffffff"
//                           : partiallySelected
//                           ? "#4f46e5"
//                           : "#6b7280",
//                       }}
//                     />
//                   )}
//                 </button>
//               )}
//             </div>

//             {/* Sub-permission buttons */}
//             {openModule === module.id && module.permissions.length > 0 && (
//               <div className="flex flex-wrap gap-2 px-4 py-3 bg-white rounded-xl">
//                 {module.permissions.map((perm) => (
//                   <button
//                     key={perm.id}
//                     type="button"
//                     onClick={() => togglePermission(perm.id)}
//                     className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition
//                       ${
//                         value.includes(perm.id)
//                           ? "bg-indigo-600 text-white border-indigo-600"
//                           : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
//                       }`}
//                   >
//                     {perm.label}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default CheckedBoxDropdown;

import { UpOutlined, DownOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export type Permission = {
  id: string;
  label: string;
};

export type Module = {
  id: string;
  label: string;
  permissions: Permission[];
};

interface Props {
  modules: Module[];
  value?: string[];
  onChange?: (selected: string[]) => void;
}

const CheckedBoxDropdown: React.FC<Props> = ({
  modules,
  value = [],
  onChange,
}) => {
  const [openModule, setOpenModule] = useState<string | null>(null);

  // ✅ toggle single permission
  const togglePermission = (module: Module, permId: string) => {
    let newSelected = value.includes(permId)
      ? value.filter((p) => p !== permId)
      : [...value, permId];

    // check if at least one permission of this module is selected
    const hasAny = module.permissions.some((p) => newSelected.includes(p.id));

    if (hasAny) {
      // ensure module id is present
      if (!newSelected.includes(module.id)) {
        newSelected.push(module.id);
      }
    } else {
      // no permission left → remove module id
      newSelected = newSelected.filter((p) => p !== module.id);
    }

    onChange?.(newSelected);
  };

  // ✅ toggle whole module
  const toggleModule = (module: Module) => {
    if (module.permissions.length === 0) {
      // no children → just select the module itself
      const newSelected = value.includes(module.id)
        ? value.filter((p) => p !== module.id)
        : [...value, module.id];
      onChange?.(newSelected);
      return;
    }

    const allIds = module.permissions.map((p) => p.id);
    const hasAll = allIds.every((id) => value.includes(id));

    let newSelected = hasAll
      ? value.filter((p) => !allIds.includes(p) && p !== module.id) // unselect all + module
      : [...new Set([...value, ...allIds, module.id])]; // select all + module

    onChange?.(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-4 w-full">
      {modules.map((module) => {
        const allIds = module.permissions.map((p) => p.id);
        const allSelected =
          module.permissions.length > 0 &&
          allIds.every((id) => value.includes(id));
        const partiallySelected =
          module.permissions.length > 0 &&
          allIds.some((id) => value.includes(id)) &&
          !allSelected;

        const moduleSelected = value.includes(module.id);

        return (
          <div
            key={module.id}
            className="border rounded-xl shadow-sm w-full md:w-1/2"
          >
            {/* Module button */}
            <div
              className={`flex items-center justify-between px-4 py-3 cursor-pointer font-medium rounded-xl transition
               ${
                 partiallySelected
                   ? "bg-indigo-100 text-indigo-700"
                   : allSelected || moduleSelected
                   ? "bg-indigo-600 text-white"
                   : "bg-gray-100 text-gray-800 hover:bg-gray-200"
               }`}
              onClick={() => toggleModule(module)}
            >
              <span>{module.label}</span>
              {module.permissions.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenModule(openModule === module.id ? null : module.id);
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {openModule === module.id ? (
                    <UpOutlined
                      style={{
                        color: allSelected
                          ? "#ffffff"
                          : partiallySelected
                          ? "#4f46e5"
                          : "#6b7280",
                      }}
                    />
                  ) : (
                    <DownOutlined
                      style={{
                        color: allSelected
                          ? "#ffffff"
                          : partiallySelected
                          ? "#4f46e5"
                          : "#6b7280",
                      }}
                    />
                  )}
                </button>
              )}
            </div>

            {/* Sub-permission buttons */}
            {openModule === module.id && module.permissions.length > 0 && (
              <div className="flex flex-wrap gap-2 px-4 py-3 bg-white rounded-xl">
                {module.permissions.map((perm) => (
                  <button
                    key={perm.id}
                    type="button"
                    onClick={() => togglePermission(module, perm.id)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition
                      ${
                        value.includes(perm.id)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {perm.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckedBoxDropdown;
