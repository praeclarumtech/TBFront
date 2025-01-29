// import node module libraries
import { Row, Col, Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//import custom hook
import { useMounted } from "hooks/useMounted";

const schema = yup.object().shape({
 
  password: yup.string()
  .required('Password is required')
  .min(6, 'Password must be at least 6 characters'),
confirmPassword: yup.string()
  .required('Confirm Password is required')
  .oneOf([yup.ref('password')], 'Passwords must match')
});

const SignUp = () => {
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
              <p className="mb-6 justify-center text-center">Please enter your new password.</p>
            </div>

            {hasMounted && (
              <Form onSubmit={handleSubmit(onSubmitHandler)}>
                

           

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
              type="password"
                   {...register("password")}
                   className={`${errors.password ? 'is-invalid' : ''}`}
                    name="password"
                    placeholder="**************"
                    
                  />
                   <p className=" p-1 text-red-500 ">{errors.password?.message}</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirm-password">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                  type="password"
                    {...register('confirmPassword')}
                    name="confirm-password"
                    placeholder="**************"
                    
                  />
                   <p className=" p-1 text-red-500 ">{errors.confirmPassword ?.message}</p>
                </Form.Group>

                <div className="mb-3">
                  <Form.Check type="checkbox" id="check-api-checkbox">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>
                      I agree to the <Link to="#"> Terms of Service </Link> and{" "}
                      <Link to="#"> Privacy Policy.</Link>
                    </Form.Check.Label>
                  </Form.Check>
                </div>

                <div>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                     Change Password
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link to="/auth/sign-in" className="fs-5">
                        Already member? Login{" "}
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

export default SignUp;
