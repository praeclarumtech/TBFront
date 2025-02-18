

 
import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { FormProvider, useForm } from "react-hook-form";
import PersonalDetailsForm from "../../components/StepperForm/PersonalDetailsForm";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setPersonalDetails } from "../../store/slices/personalDetailsSlice";
import { Applicant } from "../../types";
 
interface UpdateModalProps {
  show: boolean;
  onHide: () => void;
  editingApplicant: Applicant | null;
  fetchApplicants: object | null | undefined | any;
}
 
const UpdateModal: React.FC<UpdateModalProps> = ({
  show,
  onHide,
  fetchApplicants,
}) => {
  const methods = useForm({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      phoneNumber: "",
      whatsappNumber: "",
      gender: "",
      email: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
      fullAddress: "",
    },
  });
 
  const { setValue } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  // const personalDetails = useSelector((state: any) => state.personalDetails);
 
 
  useEffect(() => {
    if (fetchApplicants && Object.keys(fetchApplicants).length > 0) {
      const initialData = {
        firstName: fetchApplicants?.name?.firstName || "",
        middleName: fetchApplicants.name?.middleName || "",
        lastName: fetchApplicants.name?.lastName || "",
        dateOfBirth: fetchApplicants?.dateOfBirth || "",
        phoneNumber: fetchApplicants?.phone?.phoneNumber || "",
        whatsappNumber: fetchApplicants?.phone?.whatsappNumber || "",
        gender: fetchApplicants?.gender || "",
        email: fetchApplicants?.email || "",
        country: fetchApplicants?.country || "",
        state: fetchApplicants?.state || "",
        city: fetchApplicants?.city || "",
        pincode: fetchApplicants?.pincode || "",
        fullAddress: fetchApplicants?.fullAddress || "",
      };
 
      // Object.entries(initialData).forEach(([key, value]) => {
      //   setValue(key as keyof typeof initialData, value);
      // });
 
      console.log("====================================");
      console.log("initialData", initialData);
      console.log("====================================");
 
      dispatch(setPersonalDetails(initialData)); // Update Redux store
    }
  }, [fetchApplicants, setValue, dispatch]);
 
 
const handleSave = async () => {
  try {
    setIsLoading(true);
    // const transformedData = {
    //   name: {
    //     firstName: data.firstName,
    //     middleName: data.middleName,
    //     lastName: data.lastName,
    //   },
    //   dateOfBirth: data.dateOfBirth,
    //   phone: {
    //     phoneNumber: data.phoneNumber,
    //     whatsappNumber: data.whatsappNumber,
    //   },
    //   gender: data.gender,
    //   email: data.email,
    //   country: data.country,
    //   state: data.state,
    //   city: data.city,
    //   pincode: data.pincode,
    //   fullAddress: data.fullAddress,
    // };
 
    // const response = await axios.put(
    //   `http://localhost:3000/api/applicants/updateApplicant/${editingApplicant?._id}`,
    //   transformedData
    // );
 
    // fetchApplicants();
    onHide();
    toast.success("Applicant updated successfully!");
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update applicant.");
  } finally {
    setIsLoading(false);
  }
};
 
  return (
    <Modal show={show} onHide={onHide} size="xl">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSave)}>
         
          <PersonalDetailsForm
            onNext={() => {}}
            onCancel={onHide}
            initialValues={fetchApplicants}
          />
          <div className="flex justify-end gap-4 p-4">
            <Button variant="outlined" onClick={onHide} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
 
export default UpdateModal;
 
 