/* eslint-disable @typescript-eslint/no-explicit-any */
export const RequiredField = (field: string) => {
  return `${field} is required.`;
};

export const PlaceHolderFormat = (fieldName: string) => {
  return `Enter ${fieldName.toLowerCase()}`;
};

export const IsInvalid = (validation: any, fieldName: string | number) => {
  return validation.touched[fieldName] && validation.errors[fieldName];
};
