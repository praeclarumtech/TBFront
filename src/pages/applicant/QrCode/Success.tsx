import { Result } from "antd";
import { useLocation } from "react-router";

const SuccessPage = () => {
  const location = useLocation();
  const email = location?.state?.email;
  console.log("Chnage of password mail :-", email);
  return (
    <>
      {email ? (
        <Result
          status="success"
          title="Password Change Request Sent!"
          subTitle={
            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
              <p>
                Your request to change your password has been submitted
                successfully.
              </p>
              <p>
                Please check your email for further instructions to complete the
                password reset process.
              </p>
              <p>
                If you didn’t make this request or need any help, please{" "}
                <a href="mailto:hr.praeclarum@gmail.com">contact us</a>.
              </p>
            </div>
          }
        />
      ) : (
        <Result
          status="success"
          title="Application Submitted Successfully!"
          subTitle={
            <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
              <p>
                Thank you for using our system! Your submission has been
                received successfully.
              </p>
              <p>
                Our team will review it and get back to you shortly. If you have
                any questions or need further assistance, feel free to{" "}
                <a href="mailto:hr.praeclarum@gmail.com">contact us</a>.
              </p>
              <p>We appreciate your interest!</p>
            </div>
          }
        />
      )}
    </>
  );
};

export default SuccessPage;
