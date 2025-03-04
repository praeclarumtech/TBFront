// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
// import { Label, Input, FormFeedback } from "reactstrap";
// import BaseButton from "./BaseButton";

// const BaseTextarea = ({
//   label,
//   name,
//   className,
//   placeholder,
//   handleChange,
//   handleBlur,
//   value,
//   touched,
//   error,
//   maxLength,
//   disabled,
//   rows = 4,
//   cols = 50,
// }: any) => {
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
//       {false ? (
//         <div className="position-relative auth-pass-inputgroup mb-3">
//           <Input
//             name={name}
//             value={value || ""}
//             type={passwordShow ? "text" : "password"}
//             className="form-control pe-5"
//             placeholder={placeholder}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             invalid={!!(touched && error)}
//             disabled={disabled}
//           />
//           <BaseButton
//             color="link"
//             onClick={togglePasswordVisibility}
//             className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
//             type="button"
//             id="password-addon"
//           >
//             <i
//               className={
//                 passwordShow
//                   ? "ri-eye-off-fill align-middle p-3"
//                   : "ri-eye-fill align-middle p-3"
//               }
//             ></i>
//           </BaseButton>
//         </div>
//       ) : (
//         <Input
//           name={name}
//           type="textarea" // Explicitly setting the type to textarea
//           className={className || "form-control"}
//           placeholder={placeholder}
//           onChange={handleChange}
//           onBlur={handleBlur}
//           value={value || ""}
//           invalid={!!(touched && error)}
//           maxLength={maxLength}
//           rows={rows}
//           cols={cols}
//           disabled={disabled}
//         />
//       )}

//       {touched && error && <FormFeedback type="invalid">{error}</FormFeedback>}
//     </>
//   );
// };

// export default BaseTextarea;

/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from "react";
import { Label, Input, FormFeedback } from "reactstrap";
// import BaseButton from "./BaseButton";

const BaseTextarea = ({
  label,
  name,
  className,
  placeholder,
  handleChange,
  handleBlur,
  value,
  touched,
  error,
  maxLength,
  disabled,
  rows = 4,
  cols = 50,
}: any) => {
  return (
    <>
      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
        </Label>
      )}

      <Input
        name={name}
        type="textarea" // Explicitly setting the type to textarea
        className={className || "form-control"}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={value || ""}
        invalid={!!(touched && error)}
        maxLength={maxLength}
        rows={rows}
        cols={cols}
        disabled={disabled}
      />

      {touched && error && <FormFeedback type="invalid">{error}</FormFeedback>}
    </>
  );
};

export default BaseTextarea;
