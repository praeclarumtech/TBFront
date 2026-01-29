import { BreadCrumbProps } from "interfaces/global.interface";

const BreadCrumb = ({ title }: BreadCrumbProps) => {
  return <h3 className="absolute">{title}</h3>;
};

export default BreadCrumb;
