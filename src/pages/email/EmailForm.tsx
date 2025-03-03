import { useMounted } from "hooks/useMounted";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendEmail } from "api/emailApi";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmailForm = () => {
  const hasMounted = useMounted();
  const navigate = useNavigate();
  // Add loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Add state for form fields
  const [formData, setFormData] = useState({
    email_to: "",
    email_bcc: "",
    subject: "",
    description: "",
    // date:''
  });

  // Update handleSubmit to use the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await sendEmail(formData);
      console.log("response===>>>", response);
      toast.success("Email sent successfully!", {
        closeOnClick: true,
        autoClose: 5000,
      });
      navigate("/email"); // Redirect back to email list on success
    } catch (err) {
      toast.error("Failed to send email. Please try again.", {
        closeOnClick: true,
        autoClose: 5000,
      });
      console.error("Error sending email:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <>
      <div className="mt-10 mx-10 mb-8">
        <div className="w-100">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-10 relative">
              <button
                className="absolute left-5 top-5 text-gray-600 hover:text-gray-800 flex items-center"
                onClick={() => navigate("/email")}
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
                {error && (
                  <div className="mb-4 text-red-600 text-center">{error}</div>
                )}
                {hasMounted && (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6 mb-3">
                      <div>
                        <label
                          className="block font-bold mb-2"
                          htmlFor="toEmail"
                        >
                          To
                        </label>
                        <input
                          type="email"
                          placeholder="Enter Recipients"
                          id="email_to"
                          required
                          value={formData.email_to}
                          onChange={handleChange}
                          className="w-full p-2 bg-gray-100 rounded-md"
                        />
                      </div>
                      <div>
                        <label
                          className="block font-bold mb-2"
                          htmlFor="bccEmail"
                        >
                          Bcc
                        </label>
                        <input
                          type="email"
                          placeholder="Enter Your email"
                          id="email_bcc"
                          value={formData.email_bcc}
                          onChange={handleChange}
                          className="w-full p-2 bg-gray-100 rounded-md"
                        />
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
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-100 rounded-md"
                      />
                    </div>

                    <div className="mb-3">
                      <textarea
                        rows={4}
                        placeholder="Description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-100 rounded-md"
                      />
                    </div>

                    <div className="flex justify-end items-center gap-4">
                      <button 
                        type="button"
                        disabled
                        className="p-2 hover:bg-gray-100 rounded-full opacity-50 cursor-not-allowed"
                      >
                        <i className="fa fa-paperclip"></i>
                      </button>
                      <button 
                        type="button"
                        disabled
                        className="p-2 hover:bg-gray-100 rounded-full opacity-50 cursor-not-allowed"
                      >
                        <i className="fa fa-file-image"></i>
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
                      >
                        {isLoading ? (
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
