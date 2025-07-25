export interface ProfileFormData {
  profilePicture: string | File | null;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  designation: string;
  [key: string]: any;
}
