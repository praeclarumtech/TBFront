// // /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Label, Input, FormFeedback } from "reactstrap";
// import BaseButton from "./BaseButton";
// import { BaseInputProps } from "interfaces/global.interface";

// const BaseInput = ({
//   label,
//   name,
//   type,
//   className,
//   placeholder,
//   handleChange,
//   handleBlur,
//   value,
//   touched,
//   error,
//   maxLength,
//   disabled,
// }: BaseInputProps) => {
//   const [passwordShow, setPasswordShow] = useState(false);

//   const togglePasswordVisibility = () => {
//     setPasswordShow(!passwordShow);
//   };

//   return (
//     <>
//       {label && (
//         <Label htmlFor={name} className="form-label">
//           {label}
//         </Label>
//       )}
//       {type !== "password" ? (
//         <Input
//           name={name}
//           type={type}
//           className={className ? className : "form-control"}
//           placeholder={placeholder}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           disabled={disabled}
//           value={value || ""}
//           invalid={!!(touched && error)}
//           maxLength={maxLength}
//           min={0}
//         />
//       ) : (
//         <div>
//           <div className="inline-flex w-full">
//             <Input
//               name={name}
//               value={value || ""}
//               type={passwordShow ? "text" : "password"}
//               className="form-control pe-5"
//               placeholder={placeholder}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               invalid={!!(touched && error)}
//               disabled={disabled}
//             />
//             <BaseButton
//               color="link"
//               onClick={togglePasswordVisibility}
//               className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
//               type="button"
//               id="password-addon"
//             >
//               {/* <div className="justify-end"> */}
//               <i
//                 className={
//                   passwordShow
//                     ? "ri-eye-fill align-middle p-3"
//                     : "ri-eye-off-fill align-middle p-3"
//                 }
//               ></i>
//               {/* </div> */}
//             </BaseButton>
//           </div>
//           {touched && error ? (
//             <FormFeedback type="invalid">{error}</FormFeedback>
//           ) : // <div className="text-danger error-font">{error}</div>
//           null}
//         </div>
//       )}
//       {touched && error ? (
//         <FormFeedback type="invalid">{error}</FormFeedback>
//       ) : // <div className="text-danger error-font">{error}</div>
//       null}
//     </>
//   );
// };

// export default BaseInput;

import { useState } from "react";
import { Label, Input, FormFeedback } from "reactstrap";
import BaseButton from "./BaseButton";
import { BaseInputProps } from "interfaces/global.interface";

const BaseInput = ({
  label,
  name,
  type,
  className,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  maxLength,
  disabled,
}: BaseInputProps) => {
  const [passwordShow, setPasswordShow] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShow(!passwordShow);
  };

  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}

      <div className="relative">
        {type !== "password" ? (
          <>
            <Input
              name={name}
              type={type}
              className={className ? className : "form-control"}
              placeholder={placeholder}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={disabled}
              value={value || ""}
              invalid={!!(touched && error)}
              maxLength={maxLength}
              min={0}
            />
            {touched && error && <FormFeedback>{error}</FormFeedback>}
          </>
        ) : (
          <div>
            {/* Password Input Field */}
            <div className="inline-flex w-full">
              <Input
                name={name}
                value={value || ""}
                type={passwordShow ? "text" : "password"}
                className={`form-control pe-10 ${
                  touched && error ? "is-invalid" : ""
                }`}
                placeholder={placeholder}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={disabled}
              />

              {/* Eye Icon Button */}
              <BaseButton
                color="link"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 "
                type="button"
                id="password-addon"
              >
                <i
                  className={
                    passwordShow
                      ? "ri-eye-fill align-middle text-xl "
                      : "ri-eye-off-fill align-middle text-xl"
                  }
                ></i>
              </BaseButton>
            </div>

            {/* Error Message - Moved Outside the Wrapper */}
            {touched && error && (
              <FormFeedback className="d-block">{error}</FormFeedback>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default BaseInput;
