import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ViewModal from "./ViewApplicant";

/**
 * Standalone applicant details (same content as the modal), opened via "Open in new tab" or direct URL.
 */
const ViewApplicantPage = () => {
  const { applicantId } = useParams<{ applicantId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const source = searchParams.get("source") || "main";

  if (!applicantId) {
    return (
      <div className="p-4">
        <p className="mb-0 text-muted">Applicant not found.</p>
      </div>
    );
  }

  return (
    <ViewModal
      variant="page"
      show
      onHide={() => navigate("/applicants")}
      applicantId={applicantId}
      source={source}
    />
  );
};

export default ViewApplicantPage;
