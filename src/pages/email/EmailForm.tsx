// import { useMounted } from "hooks/useMounted";
// import { useLocation, useNavigate } from "react-router-dom";
// import { sendEmail } from "api/emailApi";
// import { toast } from "react-toastify";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import BaseInput from "components/BaseComponents/BaseInput";
// import { InputPlaceHolder } from "utils/commonFunctions";
// import BaseTextarea from "components/BaseComponents/BaseTextArea";

// const EmailForm = () => {
//   const hasMounted = useMounted();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const initialEmail = location.state?.email_to || "";

//   const validation = useFormik({
//     initialValues: {
//       email_to: initialEmail || "",
//       email_bcc: "",
//       subject: "",
//       description: "",
//     },
//     validationSchema: Yup.object({
//       email_to: Yup.string()
//         .test("valid-emails", "Invalid email address", (value) => {
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           const emails = value?.split(",").map((email) => email.trim());
//           return emails?.every((email) => emailRegex.test(email));
//         })
//         .required("Recipient email is required"),

//       email_bcc: Yup.string().test(
//         "valid-emails",
//         "Invalid email address",
//         (value) => {
//           if (!value) return true;
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           const emails = value.split(",").map((email) => email.trim());
//           return emails.every((email) => emailRegex.test(email));
//         }
//       ),

//       subject: Yup.string().required("Subject is required"),
//       // description: Yup.string().required("Description is required"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         const emailToArray = values.email_to
//           .split(",")
//           .map((email: string) => email.trim());
//         const emailBccArray = values.email_bcc
//           .split(",")
//           .map((email) => email.trim());

//         await sendEmail({
//           ...values,
//           email_to: emailToArray,
//           email_bcc: emailBccArray,
//         });

//         toast.success("Email sent successfully!", {
//           closeOnClick: true,
//           autoClose: 5000,
//         });
//         validation.resetForm();
//         navigate("/email");
//       } catch (err) {
//         toast.error("Failed to send email. Please try again.", {
//           closeOnClick: true,
//           autoClose: 5000,
//         });
//         console.error("Error sending email:", err);
//       }
//     },
//   });

//   return (
//     <>
//       <div className="mt-10 mx-10 mb-8">
//         <div className="w-100">
//           <div className="bg-white rounded-lg shadow">
//             <div className="p-10 relative">
//               <button
//                 className="absolute left-5 top-5 text-gray-600 hover:text-gray-800 flex items-center"
//                 onClick={() => navigate("/email")}
//               >
//                 <i className="fa fa-arrow-left mr-2"></i>
//                 Back
//               </button>

//               <div className="flex justify-center items-center mb-8">
//                 <div>
//                   <i className="fa fa-envelope text-5xl text-primary"></i>
//                 </div>
//               </div>

//               <div>
//                 {hasMounted && (
//                   <form onSubmit={validation.handleSubmit} noValidate>
//                     <div className="grid grid-cols-2 gap-6 mb-3">
//                       <div>
//                         <BaseInput
//                           label=" To"
//                           name="email_to"
//                           className={`w-full p-2 rounded-md ${
//                             validation.touched.email_to &&
//                             validation.errors.email_to
//                               ? "border-red-500 border-2"
//                               : ""
//                           }`}
//                           type="text"
//                           placeholder={InputPlaceHolder("Enter Recipients")}
//                           handleChange={validation.handleChange}
//                           handleBlur={validation.handleBlur}
//                           value={validation.values.email_to}
//                           // touched={validation.touched.email_to}/
//                           // error={validation.errors.email_to}
//                           error={
//                             typeof validation.errors.email_to === "string"
//                               ? validation.errors.email_to
//                               : undefined
//                           }
//                           passwordToggle={false}
//                         />
//                       </div>
//                       <div>
//                         <BaseInput
//                           label="Bcc"
//                           name="email_bcc"
//                           className={`w-full p-2 rounded-md ${
//                             validation.touched.email_bcc &&
//                             validation.errors.email_bcc
//                               ? "border-red-500 border-2"
//                               : ""
//                           }`}
//                           type="text"
//                           placeholder={InputPlaceHolder("Enter BCC Emails")}
//                           handleChange={validation.handleChange}
//                           handleBlur={validation.handleBlur}
//                           value={validation.values.email_bcc}
//                           error={validation.errors.email_bcc}
//                         />
//                         {validation.touched.email_bcc &&
//                           validation.errors.email_bcc && (
//                             <div className="text-red-500 text-sm mt-1">
//                               {validation.errors.email_bcc}
//                             </div>
//                           )}
//                       </div>
//                     </div>

//                     <div className="mb-3">
//                       <BaseInput
//                         label="Subject"
//                         name="subject"
//                         type="text"
//                         className={`w-full p-2 rounded-md ${
//                           validation.touched.subject &&
//                           validation.errors.subject
//                             ? "border-red-500 border-2"
//                             : ""
//                         }`}
//                         placeholder={InputPlaceHolder("Enter Your Subject")}
//                         handleChange={validation.handleChange}
//                         handleBlur={validation.handleBlur}
//                         value={validation.values.subject}
//                         error={validation.errors.subject}
//                       />
//                       {validation.touched.subject &&
//                         validation.errors.subject && (
//                           <div className="text-red-500 text-sm mt-1">
//                             {validation.errors.subject}
//                           </div>
//                         )}
//                     </div>

//                     <div className="mb-3">
//                       <BaseTextarea
//                         label="Description"
//                         name="description"
//                         placeholder={InputPlaceHolder("Description")}
//                         handleChange={validation.handleChange}
//                         handleBlur={validation.handleBlur}
//                         value={validation.values.description}
//                         touched={validation.touched.description}
//                         error={validation.errors.description}
//                         className={`w-full p-2 rounded-md ${
//                           validation.touched.description &&
//                           validation.errors.description
//                             ? "border-red-500 border-2"
//                             : ""
//                         }`}
//                         passwordToggle={false}
//                         multiline
//                         rows={4}
//                         cols={50}
//                       />
//                       {validation.touched.description &&
//                         validation.errors.description && (
//                           <div className="text-red-500 text-sm mt-1">
//                             {validation.errors.description}
//                           </div>
//                         )}
//                     </div>

//                     <div className="flex justify-end items-center gap-4">
//                       <button
//                         type="submit"
//                         disabled={validation.isSubmitting}
//                         className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
//                       >
//                         {validation.isSubmitting ? (
//                           <>
//                             Loading... <i className="fa fa-spinner fa-spin"></i>
//                           </>
//                         ) : (
//                           <>
//                             Send <i className="fa fa-paper-plane"></i>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </form>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         closeOnClick={true}
//         pauseOnHover={true}
//         draggable={true}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeButton={true}
//       />
//     </>
//   );
// };

// export default EmailForm;

import { useEffect } from "react";
import { useMounted } from "hooks/useMounted";
import { useLocation, useNavigate } from "react-router-dom";
import { sendEmail } from "api/emailApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseInput from "components/BaseComponents/BaseInput";
import { errorHandle, InputPlaceHolder } from "utils/commonFunctions";
import BaseTextarea from "components/BaseComponents/BaseTextArea";

const EmailForm = () => {
  const hasMounted = useMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email_to || "";

  const validation = useFormik({
    initialValues: {
      email_to: initialEmail || "",
      email_bcc: "",
      subject: "",
      description: "",
    },
    validationSchema: Yup.object({
      email_to: Yup.string()
        .test("valid-emails", "Invalid email address", (value) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const emails = value?.split(",").map((email) => email.trim());
          return emails?.every((email) => emailRegex.test(email));
        })
        .required("Recipient email is required"),

      email_bcc: Yup.string().test(
        "valid-emails",
        "Invalid email address",
        (value) => {
          if (!value) return true;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const emails = value.split(",").map((email) => email.trim());
          return emails.every((email) => emailRegex.test(email));
        }
      ),

      subject: Yup.string().required("Subject is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    validateOnMount: true,
    onSubmit: async (values) => {
      try {
        const emailToArray = values.email_to
          .split(",")
          .map((email: string) => email.trim());
        const emailBccArray = values.email_bcc
          .split(",")
          .map((email) => email.trim());

        await sendEmail({
          ...values,
          email_to: emailToArray,
          email_bcc: emailBccArray,
        });

        toast.success("Email sent successfully!", {
          closeOnClick: true,
          autoClose: 3000,
        });
        validation.resetForm();
        navigate("/email");
      } catch (err) {
        toast.error("Failed to send email. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
        errorHandle( err);
      }
    },
  });

  useEffect(() => {
    validation.validateForm();
  }, []);

  return (
    <>
      <div className="mt-6 mx-9">
        <div className="w-100">
          <div className="bg-white rounded-lg shadow">
            <div className="p-8 relative">
              <button
                className="absolute left-5 top-5 text-gray-600 hover:text-gray-800 flex items-center"
                onClick={() => navigate("/email")}
              >
                <i className="fa fa-arrow-left mr-2"></i>
                Back
              </button>

              <div className="flex justify-center items-center mb-6">
                <div>
                  <i className="fa fa-envelope text-5xl text-primary"></i>
                </div>
              </div>

              <div>
                {hasMounted && (
                  <form onSubmit={validation.handleSubmit} noValidate>
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div>
                        <BaseInput
                          label="To"
                          name="email_to"
                          className={`w-full p-2 rounded-md ${
                            validation.touched.email_to &&
                            validation.errors.email_to
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                          type="text"
                          placeholder={InputPlaceHolder("Enter Recipients")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email_to}
                          // error={ validation.errors.email_to}
                          // touched={validation.touched.email_to}
                        />
                       
                      </div>
                      <div>
                        <BaseInput
                          label="Bcc"
                          name="email_bcc"
                          className={`w-full p-2 rounded-md ${
                            validation.touched.email_bcc &&
                            validation.errors.email_bcc
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                          type="text"
                          placeholder={InputPlaceHolder("Enter BCC Emails")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email_bcc}
                          error={validation.errors.email_bcc}
                          touched={validation.touched.email_bcc}
                        />
                        {/* {validation.touched.email_bcc &&
                          validation.errors.email_bcc && (
                            <div className="text-red-500 text-sm mt-1">
                              {validation.errors.email_bcc}
                            </div>
                          )} */}
                      </div>
                    </div>

                    <div className="mb-3">
                      <BaseInput
                        label="Subject"
                        name="subject"
                        type="text"
                        className={`w-full p-2 rounded-md ${
                          validation.touched.subject &&
                          validation.errors.subject
                            ? "border-red-500 border-2"
                            : ""
                        }`}
                        placeholder={InputPlaceHolder("Enter Your Subject")}
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.subject}
                        error={validation.errors.subject}
                        touched={validation.touched.subject}
                      />
                      {/* {validation.touched.subject &&
                        validation.errors.subject && (
                          <div className="text-red-500 text-sm mt-1">
                            {validation.errors.subject}
                          </div>
                        )} */}
                    </div>

                    <div className="mb-3">
                      <BaseTextarea
                        label="Description"
                        name="description"
                        placeholder={InputPlaceHolder("Description")}
                        handleChange={validation.handleChange}
                        handleBlur={validation.handleBlur}
                        value={validation.values.description}
                        // touched={validation.touched.description}
                        // error={validation.errors.description}
                        className={`w-full p-2 rounded-md ${
                          validation.touched.description &&
                          validation.errors.description
                            ? "border-red-500 border-2"
                            : ""
                        }`}
                        multiline
                        rows={4}
                        cols={50}
                      />
                   
                    </div>

                    <div className="flex justify-end items-center gap-4">
                      <button
                        type="submit"
                        disabled={validation.isSubmitting}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
                      >
                        {validation.isSubmitting ? (
                          <>
                            Loading... <i className="fa fa-spinner fa-spin"></i>
                          </>
                        ) : (
                          <>
                            Send <i className="fa fa-paper-plane"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </>
  );
};

export default EmailForm;
