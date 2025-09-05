export interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  error: any;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  error: any;
}

export interface RegisterPayload {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  error: any;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  designation: string;
} 

export interface ViewProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  error: any;
}

export interface ViewProfilePayload {
  userId: string;
} 

export interface GetProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;
  error: any;
}

export interface GetProfilePayload {
  userId: string;
}