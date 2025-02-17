// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// import custom hook
import { useMounted } from "hooks/useMounted";



const schema = yup.object().shape({
  username: yup.string().required('Username is required').trim(),
  email: yup.string()
  .required('Email is required')
  .email('Email is invalid'),
  
});

const ForgetPassword = () => {
  const hasMounted = useMounted();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
      });
      const onSubmitHandler = (data) => {
        console.log({ data });
        reset();
      };
  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        <Card className="smooth-shadow-md">
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link to="/">
                {/* <Image
                  src="/images/brand/logo/logo-primary.svg"
                  className="mb-2"
                  alt=""
                /> */}

<h4 className="text-dark font-bold text-3xl justify-center text-center ">Talent<span className="text-primary bold ">Box</span> </h4>
              </Link>
              <p className="mb-6">
                Don&apos;t worry, we&apos;ll send you an email to reset your
                password.
              </p>
            </div>
            {hasMounted && (
              <Form onSubmit={handleSubmit(onSubmitHandler)}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                  {...register("email")}
                  className={`${errors.email ? 'is-invalid' : ''}`}
                    name="email"
                    placeholder="Enter Your Email"
                  />
                  <p className="p-1 text-red-500">{errors.email?.message}</p>
                </Form.Group>

                <div className="mb-3 d-grid">
                  <Button variant="primary" type="submit">
                    Reset Password
                  </Button>
                </div>
                <span>
                  Don&apos;t have an account?{" "}
                  <Link to="/auth/sign-in">Sign In</Link>
                </span>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgetPassword;
