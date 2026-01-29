import { Result, Alert } from "antd";
import { Container } from "react-bootstrap";
import { SafetyCertificateOutlined } from "@ant-design/icons";

const VendorSuccess = () => {
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
    >
      <div style={{ maxWidth: "650px", width: "100%" }}>
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
            </div>
          }
        />

        {/* Account Verification Note */}
        <div style={{ padding: "0 24px", marginTop: "8px" }}>
          <Alert
            message={
              <span style={{ fontWeight: 600 }}>
                <SafetyCertificateOutlined style={{ marginRight: "8px" }} />
                Account Verification Note
              </span>
            }
            description={
              <p style={{ margin: "8px 0 0 0" }}>
                Your account is in the process of verification. After
                verification is complete, you will be able to add jobs directly
                and manage applicants through the platform.
              </p>
            }
            type="warning"
            showIcon={false}
            style={{ marginBottom: "24px" }}
          />
        </div>

        <div style={{ textAlign: "center", paddingBottom: "24px" }}>
          <p
            style={{
              fontSize: "16px",
              fontWeight: "500",
              color: "#52c41a",
            }}
          >
            We appreciate your partnership and look forward to connecting with
            you soon!
          </p>
        </div>
      </div>
    </Container>
  );
};

export default VendorSuccess;
