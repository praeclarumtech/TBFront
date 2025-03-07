import { useMounted } from "hooks/useMounted";
import { useLocation, useNavigate } from "react-router-dom";
import { sendEmail } from "api/emailApi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";

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
          autoClose: 5000,
        });
        navigate("/applicants");
      } catch (err) {
        toast.error("Failed to send email. Please try again.", {
          closeOnClick: true,
          autoClose: 5000,
        });
        console.error("Error sending email:", err);
      }
    },
  });

  return (
    <>
      <div className="mt-10 mx-10 mb-8">
        <div className="w-100">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-10 relative">
              <button
                className="absolute left-5 top-5 text-gray-600 hover:text-gray-800 flex items-center"
                onClick={() => navigate("/applicants")}
              >
                <i className="fa fa-arrow-left mr-2"></i>
                Back
              </button>

              <div className="flex justify-center items-center mb-8">
                <div>
                  <i className="fa fa-envelope text-5xl text-primary"></i>
                </div>
              </div>

              <div>
                {hasMounted && (
                  <form onSubmit={validation.handleSubmit} noValidate>
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div>
                        <label
                          className="block font-bold mb-2"
                          htmlFor="email_to"
                        >
                          To
                        </label>
                        <input
                          type="text" 
                          placeholder="Enter Recipients"
                          id="email_to"
                          value={validation.values.email_to}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          className={`w-full p-2 bg-gray-100 rounded-md ${
                            validation.touched.email_to &&
                            validation.errors.email_to
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                        />
                       
                      </div>
                      <div>
                        <label
                          className="block font-bold mb-2"
                          htmlFor="email_bcc"
                        >
                          Bcc
                        </label>
                        <input
                          type="text" 
                          placeholder="Enter Your BCC emails"
                          id="email_bcc"
                          value={validation.values.email_bcc}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          className={`w-full p-2 bg-gray-100 rounded-md ${
                            validation.touched.email_bcc &&
                            validation.errors.email_bcc
                              ? "border-red-500 border-2"
                              : ""
                          }`}
                        />
                        {validation.touched.email_bcc &&
                          validation.errors.email_bcc && (
                            <div className="text-red-500 text-sm mt-1">
                              {validation.errors.email_bcc}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="block font-bold mb-2" htmlFor="subject">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Your Subject"
                        id="subject"
                        value={validation.values.subject}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        className={`w-full p-2 bg-gray-100 rounded-md ${
                          validation.touched.subject &&
                          validation.errors.subject
                            ? "border-red-500 border-2"
                            : ""
                        }`}
                      />
                      {validation.touched.subject &&
                        validation.errors.subject && (
                          <div className="text-red-500 text-sm mt-1">
                            {validation.errors.subject}
                          </div>
                        )}
                    </div>

                    <div className="mb-3">
                      <textarea
                        rows={4}
                        placeholder="Description"
                        id="description"
                        value={validation.values.description}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        className={`w-full p-2 bg-gray-100 rounded-md ${
                          validation.touched.description &&
                          validation.errors.description
                            ? "border-red-500 border-2"
                            : ""
                        }`}
                      />
                      {validation.touched.description &&
                        validation.errors.description && (
                          <div className="text-red-500 text-sm mt-1">
                            {validation.errors.description}
                          </div>
                        )}
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        hideProgressBar={false}
        newestOnTop={false}
        closeButton={true}
      />
    </>
  );
};

export default EmailForm;
