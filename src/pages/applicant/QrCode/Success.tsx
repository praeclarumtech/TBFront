import { useLocation, useNavigate } from "react-router-dom";
import appEnv from "config/appEnv";
import appConstants from "constants/constant";

const { projectTitle } = appConstants;

const supportMail = `${appEnv.CAREER_EMAIL}`;

function SuccessCheckIcon() {
  return (
    <svg
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="14" cy="14" r="13" stroke="#624bff" strokeWidth="1.5" />
      <path
        d="M8.5 14.5l4 4 7-8"
        stroke="#624bff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location?.state?.email as string | undefined;

  const isPasswordFlow = Boolean(email);

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "#f7f6f4" }}
    >
      <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
        <div className="w-100" style={{ maxWidth: 480 }}>
          <div>
            {isPasswordFlow ? (
              <div
                style={{
                  background: "#ffffff",
                  border: "0.5px solid rgba(23, 43, 77, 0.12)",
                  borderRadius: "12px",
                  padding: "2.5rem 2rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: '#E6F1FB',
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <SuccessCheckIcon />
                </div>

                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#161c24",
                    margin: "0 0 0.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Password reset email sent
                </h1>

                <p
                  style={{
                    fontSize: 14,
                    color: "#637381",
                    margin: "0 0 2rem",
                    lineHeight: 1.6,
                    maxWidth: 360,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  We&apos;ve sent a secure link to your registered email
                  address. Follow the instructions in the email to complete your
                  password reset.
                </p>

                <div
                  style={{
                    borderTop: "0.5px solid rgba(23, 43, 77, 0.12)",
                    margin: "0 0 1.5rem",
                  }}
                />

                <div
                  style={{
                    textAlign: "left",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    marginBottom: "2rem",
                  }}
                >
                  <DesignStepRow
                    n={1}
                    text="Check your inbox — the email usually arrives within 2 minutes."
                  />
                  <DesignStepRow
                    n={2}
                    text="Click the secure link in the email to set your new password."
                  />
                  <DesignStepRow
                    n={3}
                    text="The link expires in 24 hours. Check your spam folder if it doesn't appear."
                  />
                </div>

                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  style={{
                    display: "block",
                    width: "100%",
                    background: "#624bff",
                    color: "white",
                    textAlign: "center",
                    padding: "11px 0",
                    borderRadius: "8px",
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: "none",
                    letterSpacing: "0.01em",
                    marginBottom: "1rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Return to sign in
                </button>

                <p
                  style={{
                    fontSize: 13,
                    color: "#637381",
                    margin: 0,
                  }}
                >
                  Didn&apos;t request this?{" "}
                  <a
                    href={`mailto:${supportMail}`}
                    style={{
                      color: '#624bff',
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    Contact support
                  </a>
                </p>
              </div>
            ) : (
              <div
                style={{
                  background: "#ffffff",
                  border: "0.5px solid rgba(23, 43, 77, 0.12)",
                  borderRadius: "12px",
                  padding: "2.5rem 2rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: '#E6F1FB',
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                  }}
                >
                  <SuccessCheckIcon />
                </div>

                <h1
                  style={{
                    fontSize: 20,
                    fontWeight: 500,
                    color: "#161c24",
                    margin: "0 0 0.5rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Application submitted successfully
                </h1>

                <p
                  style={{
                    fontSize: 14,
                    color: "#637381",
                    margin: "0 0 1rem",
                    lineHeight: 1.6,
                    maxWidth: 360,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Thank you for using our system! Your submission has been
                  received successfully.
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "#637381",
                    margin: "0 0 1.5rem",
                    lineHeight: 1.6,
                    maxWidth: 360,
                    marginLeft: "auto",
                    marginRight: "auto",
                  }}
                >
                  Our team will review it and get back to you shortly. If you
                  have any questions, feel free to{" "}
                  <a
                    href={`mailto:${appEnv.CAREER_EMAIL}`}
                    style={{
                      color: '#624bff',
                      textDecoration: "none",
                      fontWeight: 500,
                    }}
                  >
                    contact us
                  </a>
                  .
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: "#637381",
                    margin: "0 0 2rem",
                    lineHeight: 1.6,
                  }}
                >
                  We appreciate your interest!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center text-muted small py-3 px-3">
        © {new Date().getFullYear()} {projectTitle}. All rights reserved.
      </footer>
    </div>
  );
}

function DesignStepRow({ n, text }: { n: number; text: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          minWidth: 24,
          height: 24,
          background: '#E6F1FB',
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 500,
          color: '#624bff',
          marginTop: 1,
        }}
      >
        {n}
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#637381",
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>
    </div>
  );
}

export default SuccessPage;
