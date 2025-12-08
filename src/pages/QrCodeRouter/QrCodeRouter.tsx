/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { checkEmailType } from "api/qrCodeApi";

const QrCodeRouter = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  useEffect(() => {
    const routeToForm = async () => {
      try {
        if (!email) {
          // If no email, default to applicant form
          navigate(`/applicants/applicant-add-qr-code${id ? `/${id}` : ""}`);
          return;
        }

        // Check email type from backend
        const response = await checkEmailType(email);

        if (response?.success && response?.data?.type) {
          const userType = response.data.type.toLowerCase();

          if (userType === "vendor") {
            navigate(`/vendor/vendor-add-qr-code${id ? `/${id}` : ""}`);
          } else if (userType === "client") {
            navigate(`/client/client-add-qr-code${id ? `/${id}` : ""}`);
          } else {
            // Default to applicant
            navigate(`/applicants/applicant-add-qr-code${id ? `/${id}` : ""}`);
          }
        } else {
          // Fallback: Check email domain patterns
          const emailDomain = email.split("@")[1]?.toLowerCase() || "";

          // Common vendor/client domain patterns (you can customize these)
          const vendorDomains = [
            "vendor",
            "vendors",
            "recruitment",
            "staffing",
          ];
          const clientDomains = ["client", "clients", "company", "corp"];

          if (vendorDomains.some((domain) => emailDomain.includes(domain))) {
            navigate(`/vendor/vendor-add-qr-code${id ? `/${id}` : ""}`);
          } else if (
            clientDomains.some((domain) => emailDomain.includes(domain))
          ) {
            navigate(`/client/client-add-qr-code${id ? `/${id}` : ""}`);
          } else {
            // Default to applicant
            navigate(`/applicants/applicant-add-qr-code${id ? `/${id}` : ""}`);
          }
        }
      } catch (error) {
        console.error("Error routing QR code form:", error);
        // On error, default to applicant form
        navigate(`/applicants/applicant-add-qr-code${id ? `/${id}` : ""}`);
      } finally {
        setLoading(false);
      }
    };

    routeToForm();
  }, [email, id, navigate]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return null;
};

export default QrCodeRouter;
