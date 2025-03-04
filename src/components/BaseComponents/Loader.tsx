/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "reactstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Loader = (props: any) => {
  return (
    <div className="loader-overlay" style={styleLoader}>
      <Spinner color="primary" />
      {toast.error(props.error, {
        position: "top-right",
        hideProgressBar: false,
        progress: undefined,
        toastId: "",
      })}
    </div>
  );
};

const styleLoader: any = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  // backgroundColor: "rgba(255, 255, 255, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
  flexDirection: "column",
};

export default Loader;
