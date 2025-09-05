import { BreadCrumbProps } from "interfaces/global.interface";

const BreadCrumb = ({ title }: BreadCrumbProps) => {
  return <h4 className="absolute">{title}</h4>;
};

export default BreadCrumb;
