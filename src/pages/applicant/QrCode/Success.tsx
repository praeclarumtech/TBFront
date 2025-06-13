import { Result } from "antd";

const SuccessPage = () => {
  return (
    <Result
      status="success"
      title="Application Submitted Successfully!"
      subTitle={
        <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
          <p>
            Thank you for using our system! Your submission has been received
            successfully.
          </p>
          <p>
            Our team will review it and get back to you shortly. If you have any
            questions or need further assistance, feel free to{" "}
            <a href="mailto:hr.praeclarum@gmail.com">contact us</a>.
          </p>
          <p>We appreciate your interest!</p>
        </div>
      }
    />
  );
};

export default SuccessPage;
