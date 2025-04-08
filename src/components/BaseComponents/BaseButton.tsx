// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { BaseButtonProps } from "interfaces/global.interface";
// import { Button, Spinner } from "reactstrap";

// const BaseButton = ({
//   color,
//   disabled,
//   loader,
//   className,
//   type,
//   onClick,
//   id,
//   children,
//   sx,
// }: BaseButtonProps) => {
//   const handleClick = () => {
//     if (onClick) {
//       return onClick();
//     }
//   };

//   return (
//     <Button
//       id={id}
//       color={color}
//       disabled={disabled || loader}
//       className={`btn ${color ? `btn-${color}` : ""} ${className}`}
//       type={type}
//       onClick={handleClick}
//       style={sx}
//     >
//       {loader && <Spinner size="sm" className="me-2" />}
//       {loader ? "Loading..." : children}
//     </Button>
//   );
// };

// export default BaseButton;

// import { useState, useEffect, useRef } from "react";
// import { Button, Spinner } from "reactstrap";
// import { BaseButtonProps } from "interfaces/global.interface"; // ✅ Import Props

// const BaseButton: React.FC<BaseButtonProps> = ({
//   color,
//   disabled,
//   loader,
//   className,
//   type = "button",
//   onClick,
//   id,
//   children,
//   sx,
//   hoverOptions = [],
//   onOptionClick,
// }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (dropdownRef.current) {
//       const rect = dropdownRef.current.getBoundingClientRect();
//       if (rect.right > window.innerWidth) {
//         dropdownRef.current.style.right = "0px";
//         dropdownRef.current.style.left = "auto";
//       } else {
//         dropdownRef.current.style.left = "0px";
//         dropdownRef.current.style.right = "auto";
//       }
//     }
//   }, [isHovered]);

//   return (
//     <div
//       className="relative inline-block"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Main Button */}
//       <Button
//         id={id}
//         color={color}
//         disabled={disabled || loader}
//         className={`btn ${color ? `btn-${color}` : ""} ${className}`}
//         type={type}
//         onClick={onClick}
//         style={sx}
//       >
//         {loader && <Spinner size="sm" className="me-2" />}
//         {loader ? "Loading..." : children}
//       </Button>

//       {/* Dropdown Options (Below the Button) */}
//       {isHovered && hoverOptions.length > 0 && (
//         <div
//           ref={dropdownRef}
//           className="absolute z-50 w-48 mt-2 overflow-hidden bg-white border border-gray-300 shadow-lg top-full rounded-xl animate-fadeIn"
//         >
//           {hoverOptions.map((option) => (
//             <button
//               key={option}
//               onClick={() => onOptionClick && onOptionClick(option)}
//               className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out w-full
//           hover:bg-green-800 hover:!text-white  `}
//             >
//               <i className="mr-2 ri-file-upload-line"></i> {/* Optional Icon */}
//               {option}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BaseButton;

import { useState, useRef, useEffect } from "react";
import { Button, Spinner } from "reactstrap";
import { BaseButtonProps } from "interfaces/global.interface";

const BaseButton: React.FC<BaseButtonProps> = ({
  color,
  disabled,
  loader,
  className,
  type = "button",
  onClick,
  id,
  children,
  sx,
  hoverOptions = [],
  onOptionClick,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<any>(null);

  //Close dropdown when clicking outside
  useEffect(() => {
    if (dropdownRef.current && buttonRef.current) {
      const dropdown = dropdownRef.current;
      const button = buttonRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      if (button.right + dropdown.offsetWidth > windowWidth) {
        dropdown.style.left = "auto";
        dropdown.style.right = "0"; // Align to right if near edge
      } else {
        dropdown.style.left = "0";
        dropdown.style.right = "auto";
      }
    }
  }, [isDropdownOpen]); // Runs when dropdown opens

  return (
    <div className="relative inline-block">
      {/* Main Button */}
      <Button
        ref={buttonRef}
        id={id}
        color={color}
        disabled={disabled || loader}
        className={`btn ${color ? `btn-${color}` : ""} ${className}`}
        type={type}
        onClick={() => {
          if (onClick) onClick(); // Call external onClick without an event
          setIsDropdownOpen((prev) => !prev);
        }}
        style={sx}
      >
        {loader && <Spinner size="sm" className="me-2" />}
        {loader ? "Loading..." : children}
      </Button>

      {/* Dropdown Options - Positioned Directly Below the Button */}
      {isDropdownOpen && hoverOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute bg-white w-48 left-[-20px] top-full mt-2 mr-2 shadow-lg rounded-xl z-[9999] animate-fadeIn"
        >
          {hoverOptions.map((option) => (
            <button
              key={option}
              onClick={() => {
                onOptionClick && onOptionClick(option);
                setIsDropdownOpen(false); // Close dropdown after selection
              }}
              className={`flex items-center px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 ease-in-out w-full rounded-md
                         hover:bg-green-800 hover:!text-white  `}
            >
              <i className="mr-2 ri-file-upload-line"></i> {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BaseButton;
