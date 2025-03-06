import {
  Col,
  Row,
  Form,
  Card,
  Button,
  Image,
  Container,
} from "react-bootstrap";

import { useMounted } from "hooks/useMounted";
import BaseInput from "components/BaseComponents/BaseInput";
import { InputPlaceHolder } from "utils/commonFunctions";
import { useFormik } from "formik";
import { useCallback, useState } from "react";

const GeneralSetting = () => {
  const hasMounted = useMounted();
  // const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    "/images/avatar/avatar-5.jpg"
  );
  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        // setSelectedImage(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    },
    []
  );

  // const uploadImage = async () => {
  //   if (!selectedImage) return;

  //   const formData = new FormData();
  //   formData.append("image", selectedImage);

  //   try {
  //     const response = await uploadImageAPI(formData); // Call API function
  //     if (response.success) {
  //       toast.success("Image uploaded successfully!");
  //       setPreviewImage(response.data.imageUrl); // Set uploaded image URL
  //     } else {
  //       toast.error("Failed to upload image");
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong!");
  //     console.error(error);
  //   }
  // };

  const validation: any = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "",
      addressLine: "",
      zipcode: "",
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <Container fluid>
      <Row className="mb-3 my-3">
        <Col xl={12} lg={12} md={12} xs={12}>
          <Card>
            <Card.Body>
              <div className=" mb-6">
                <h4 className="mb-1">Profile</h4>
              </div>
              <Row className="align-items-center mb-8">
                <Col>
                  <div className="d-flex justify-center items-center">
                    {/* Image Preview */}
                    <div className="me-3">
                      <Image
                        src={previewImage}
                        className="rounded-md avatar avatar-xl"
                        alt="User Avatar"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-center items-center mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: "none" }}
                      id="upload-image"
                    />
                    <label htmlFor="upload-image">
                      <Button
                        variant="outline-white"
                        className="me-2"
                        onClick={() => {
                          document.getElementById("upload-image")?.click();
                        }}
                      >
                        Change
                      </Button>
                    </label>

                    <Button
                      variant="outline-white"
                      type="button"
                      onClick={() => {
                        setPreviewImage("/images/avatar/avatar-5.jpg"); // Reset to default
                        // setSelectedImage(null);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </Col>
              </Row>
              {/* col */}
              <div>
                <div className="mb-6">
                  <h4 className="mb-1">Basic information</h4>
                </div>
                {hasMounted && (
                  <Form>
                    <Row className="mb-3">
                      <Col sm={4} className="mb-4 mb-lg-2">
                        <BaseInput
                          label="First Name"
                          name="firstName"
                          type="text"
                          placeholder={InputPlaceHolder("First Name")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.firstName}
                          touched={validation.touched.firstName}
                          error={validation.errors.firstName}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <BaseInput
                          label="Last Name"
                          name="lastName"
                          type="text"
                          placeholder={InputPlaceHolder("Last Name")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.lastName}
                          touched={validation.touched.lastName}
                          error={validation.errors.lastName}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <BaseInput
                          label="Email"
                          name="email"
                          type="text"
                          placeholder={InputPlaceHolder("Email")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.email}
                          touched={validation.touched.email}
                          error={validation.errors.email}
                          passwordToggle={false}
                        />
                      </Col>
                      <Col sm={4} className="mb-3 mb-lg-0">
                        <BaseInput
                          label="Phone Number"
                          name="phoneNumber"
                          type="text"
                          placeholder={InputPlaceHolder("Phone Number")}
                          handleChange={validation.handleChange}
                          handleBlur={validation.handleBlur}
                          value={validation.values.phoneNumber}
                          touched={validation.touched.phoneNumber}
                          error={validation.errors.phoneNumber}
                          passwordToggle={false}
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={12} className="mt-4 d-flex justify-content-end">
                        <Button variant="primary" type="submit">
                          Save Changes
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GeneralSetting;
