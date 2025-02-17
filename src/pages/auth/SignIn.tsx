
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
//import custom hook
import { useMounted } from "hooks/useMounted";



const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).max(32).required(),
});

const SignIn = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmitHandler = (data) => {
    console.log({ data });
    reset();
  };
  const hasMounted = useMounted();
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
              <p className="mb-6 justify-center text-center ">Please enter your user information.</p>
            </div>

            {hasMounted && (
              <Form onSubmit={handleSubmit(onSubmitHandler)}>
                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>Username or email</Form.Label>
                  <Form.Control
                    // type="email"
                    {...register("email")}
                    name="username"
                    placeholder="Enter address here"
                    
                  />
               <p className="m-1 p-1 text-red-800">{errors.email?.message}</p>


                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    // type="password"
                    {...register("password")}
                    name="password"
                    placeholder="**************"
                    
                  />
                    <p className="m-1 p-1 text-red-800 ">{errors.password?.message}</p>
                </Form.Group>

                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>Remember me</Form.Check.Label>
                  </Form.Check>
                </div>
                <div>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Sign In
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link to="/auth/sign-up" className="fs-5">
                        Create An Account{" "}
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/auth/forget-password"
                        className="text-inherit fs-5 "
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
