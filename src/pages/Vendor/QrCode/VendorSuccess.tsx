import { Result } from "antd";
import { Container } from "react-bootstrap";

const VendorSuccess = () => {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div style={{ maxWidth: "600px", width: "100%" }}>
        <Result
          status="success"
          title="Thank You for Your Submission!"
          subTitle={
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                lineHeight: "1.8",
                textAlign: "left",
              }}
            >
              <p style={{ fontSize: "16px", marginBottom: "16px" }}>
                Your vendor profile has been submitted successfully. We
                appreciate your interest in partnering with us!
              </p>
              <p style={{ fontSize: "16px", marginBottom: "16px" }}>
                Our team will review your information and get back to you
                shortly. We look forward to working with you.
              </p>
              <p style={{ fontSize: "16px", marginBottom: "16px" }}>
                If you have any questions, need to update your information, or
                require further assistance, please don't hesitate to{" "}
                <a
                  href="mailto:hr.praeclarum@gmail.com"
                  style={{ color: "#1890ff", textDecoration: "underline" }}
                >
                  contact our admin team
                </a>
                .
              </p>
              <p
                style={{
                  fontSize: "16px",
                  marginTop: "24px",
                  fontWeight: "500",
                }}
              >
                We appreciate your partnership and look forward to connecting
                with you soon!
              </p>
            </div>
          }
        />
      </div>
    </Container>
  );
};

export default VendorSuccess;
